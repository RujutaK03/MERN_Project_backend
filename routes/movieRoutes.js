const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

const movieSchema = require('../schema/movieSchema');
const router = express.Router();

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-movie', upload.fields([
    { name: 'moviePoster', maxCount: 1 },
    { name: 'castImages', maxCount: 10 },
    { name: 'directorImages', maxCount: 5 },
]), async (req, res) => {
    try {

        const uploadImageToCloud = async (file, folder, name) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: folder,
                },
                    async (error, result) => {
                        if (error) {
                            console.error("Error uploading to Cloudinary: ", error);
                            reject(error);
                        } else {
                            console.log("Upload success");

                            const dataToStore = {
                                name: name,
                                cloudinaryID: result.public_id,
                                cloudinaryURL: result.secure_url,
                            };

                            resolve(dataToStore);
                        }
                    });

                const fileStream = streamifier.createReadStream(file.buffer);
                fileStream.pipe(stream);
            });
        };

        const moviePosterUpload = uploadImageToCloud(req.files['moviePoster'][0], 'movie-posters');

        const castImageUploads = req.files['castImages'].map((file, index) => uploadImageToCloud(file, 'cast-images', req.body.cast[index]));

        const directorImageUploads = req.files['directorImages'].map((file, index) => uploadImageToCloud(file, 'director-images', req.body.director[index]));

        const [moviePoster, castImages, directorImages] = await Promise.all([
            moviePosterUpload,
            Promise.all(castImageUploads),
            Promise.all(directorImageUploads),
        ]);

        const newMovie = new movieSchema({
            title: req.body.title,
            description: req.body.description,
            moviePoster: moviePoster,
            releaseDate: req.body.releaseDate,
            duration: {
                hours: parseInt(req.body.duration.split(":")[0]),
                minutes: parseInt(req.body.duration.split(":")[1])
            },
            genre: req.body.genres,
            castImages: castImages,
            directorImages: directorImages,
            language: req.body.languages,
        });

        await newMovie.save();

        res.status(200).json({ message: 'New Movie added successfully' });
    } catch (error) {
        console.error('Error uploading image: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/display-movie', async (req, res) => {
    const allMovies = await movieSchema.find();
    res.send(allMovies);
});

router.get('/movies', async (req, res) => {
    try {
        const movies = await movieSchema.find({}, 'title');
        res.send(movies);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/get-movie-info/:id', async (req, res) => {
    try {
        const movie = await movieSchema.findById(req.params.id);
        if (!movie) {
            res.status(404).send("Movie not found");
        }
        else {
            res.send(movie);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/upcoming-movies", async (req, res) => {
    try {
        const today = new Date();
        const upcomingMovies = await movieSchema.find({ releaseDate: { $gt: today } }).sort({ releaseDate: 'asc' });
        res.send(upcomingMovies);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;