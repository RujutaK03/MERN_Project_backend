const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    moviePoster: {
        cloudinaryID: { type: String },
        cloudinaryURL: { type: String },
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        hours: { type: Number },
        minutes: { type: Number },
    },
    castImages: [{
        name: { type: String },
        cloudinaryID: { type: String },
        cloudinaryURL: { type: String },
    }],
    directorImages: [{
        name: { type: String },
        cloudinaryID: { type: String },
        cloudinaryURL: { type: String },
    }],
    genre: [{
        type: String,
        required: true,
    }],
    language: [{
        type: String,
        required: true,
    }]
});

module.exports = mongoose.model('movies', movieSchema);