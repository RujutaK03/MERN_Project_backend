const mongoose = require('mongoose');

const showsSchema = mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true,
    },
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theatres',
        required: true,
    },
    showTimes: [{
        type: String,
        required: true,
    }],
    ticketPrice: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("shows", showsSchema);