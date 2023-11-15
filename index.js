const express=require("express");
const mongoose=require("mongoose");
const userRoute=require("./routes/userRoutes");
const app=express();
const bodyParser=require("body-parser");
const cors=require("cors");
mongoose.set("strictQuery",true);
mongoose.connect("mongodb+srv://rujutakulkarni:ZFfzKi2FTmhDV3uq@cluster0.w2r6k1d.mongodb.net/test");
var db=mongoose.connection;
db.on("open",()=>console.log("Connected to database"));
db.on("error",()=>console.log("Error"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use("/userRoute",userRoute);

app.listen(4000,()=>{
    console.log("Server started at  4000");
})