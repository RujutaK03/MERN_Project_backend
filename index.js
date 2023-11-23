const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

const adminRouter = require('./routes/adminRoutes');
const userRoute = require("./routes/userRoutes");
const movieUploadRouter = require('./routes/movieRoutes');
const theatreUploadRouter = require('./routes/theatreRoutes');
const showUploadRouter = require('./routes/showsRoutes');
const seatRoute=require("./routes/seatRoutes");
const paymentRoute=require("./routes/paymentRoutes");

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
//app.use(cors());

app.use("/userRoute", userRoute);
app.use("/seatRoute",seatRoute);
app.use("/paymentRoute",paymentRoute);
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

