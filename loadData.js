const mongoose = require('mongoose');
const movieSchema = require('./schema/movieSchema');
const data = require('./data/movieData');

// const usersSchema = require('./schema/usersSchema');
// const data = require('./data/userData');

// usersSchema.insertMany(data)
//     .then((res) => {
//         console.log("Data inserted", res);
//     })
//     .catch((err) => {
//         console.log("Error inserting data", err);
//     })
//     .finally(() => {
//         mongoose.connection.close();
//     });

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://rujutakulkarni:ZFfzKi2FTmhDV3uq@cluster0.w2r6k1d.mongodb.net/");

movieSchema.insertMany(data)
    .then((res) => {
        console.log("Data inserted", res);
    })
    .catch((err) => {
        console.log("Error in inserting data", err);
    })
    .finally(() => {
        mongoose.connection.close();
    });