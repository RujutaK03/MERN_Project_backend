const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

const userRoute = require("./routes/userRoutes");
const movieUploadRouter = require('./routes/movieRoutes');
const theatreUploadRouter = require('./routes/theatreRoutes');
const showUploadRouter = require('./routes/showsRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = new express();

mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://rujutakulkarni:ZFfzKi2FTmhDV3uq@cluster0.w2r6k1d.mongodb.net/");

const db = mongoose.connection;
db.on("open", () => {
    console.log("Connected to database");
});
db.on("error", (err) => {
    console.log("Error in connecting to database", err);
});
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin: 'https://mern-project-1-eight.vercel.app'}));

app.use("/userRoute", userRoute);
app.use(movieUploadRouter)
app.use(theatreUploadRouter)
app.use(showUploadRouter)
app.use(adminRouter)

app.get("", (req, res) => {
    res.send("Hi from Server!!");
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});
