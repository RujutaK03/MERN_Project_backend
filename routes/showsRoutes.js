const express = require('express');
const multer = require('multer');
const showsSchema = require('../schema/showsShema');
const router = express.Router();

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

module.exports = router;
