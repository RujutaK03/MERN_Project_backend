const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        
        "name": {
            type: String,
        },
        "email": {
            type: String,
        },
        "password": {
            type: String,
        },
        "points": {
            type: Number,
        }
    },{
        collection:"users"
    });

module.exports = mongoose.model("userSchema", userSchema);
