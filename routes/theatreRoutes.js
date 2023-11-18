const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;

const theatreSchema = require('../schema/theatreSchema');
const router = express.Router();

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/add-theatre', upload.single('image'), async (req, res) => {
    try {

        const uploadImageToCloud = async (file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: "theatre-images",
                },
                    async (error, result) => {
                        if (error) {
                            console.error("Error uploading to Cloudinary: ", error);
                            reject(error);
                        } else {
                            console.log("Upload success");

                            const dataToStore = {
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

        const theatre = uploadImageToCloud(req.file);
        const [theatreImage] = await Promise.all([
            theatre,
        ]);

        const newTheatre = new theatreSchema({
            name: req.body.name,
            image: theatreImage,
            location: req.body.location,
        });

        await newTheatre.save();

        res.status(200).json({ message: 'New theatre added successfully' });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/display-theatre', async (req, res) => {
    const allTheatres = await theatreSchema.find({});
    res.send(allTheatres);
})

router.get('/theatres', async (req, res) => {
    try {
        const allTheatres = await theatreSchema.find({}, 'name');
        res.send(allTheatres);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.get('/get-cities', async (req, res) => {
    try {
        const allCities = await theatreSchema.find().distinct('location');
        res.send(allCities);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.get("/get-theatre-by-location", async (req, res) => {
    try {
        const { city } = req.query;
        const theatres = await theatreSchema.find({ location: city });
        res.send(theatres);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;