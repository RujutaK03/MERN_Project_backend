const mongoose = require('mongoose');

const seatSchema = mongoose.Schema({
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
    showTime: {
        type: String,
        required: true,
    },
    date:{
        type:String,
        required:true,
    },
    bookedSeats:[{
        type:Number,
        required:true,
    }]
},{
    collection:"seats"
});

module.exports = mongoose.model("seatSchema", seatSchema);