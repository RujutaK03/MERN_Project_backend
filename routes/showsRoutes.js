const express = require('express');
const multer = require('multer');
const showsSchema = require('../schema/showsShema');
const router = express.Router();
const { Types } = require("mongoose");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add-shows', upload.none(), async (req, res) => {
    try {
        const newShows = new showsSchema({
            movieId: req.body.movieId,
            theatreId: req.body.theatreId,
            showTimes: req.body.showTimes,
            ticketPrice: parseInt(req.body.ticketPrice),
        })

        await newShows.save();
        res.status(200).json({ message: 'Shows added successfully' });
    } catch (error) {
        console.error('Error : ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/get-shows", async (req, res) => {
    try {
        const { movieId, theatreId, query } = req.query;
        const shows = await showsSchema.find({ movieId: Types.ObjectId(movieId), theatreId: Types.ObjectId(theatreId) });

        if (!shows) {
            res.status(404).send("No Shows Available");
        } else {
            res.status(200).send(shows);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
