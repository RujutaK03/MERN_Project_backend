const express=require("express");
const seatRoute=express.Router();
const seatSchema=require("../schema/seatSchema");
const mongoose=require("mongoose");

seatRoute.get("/seats-view",(req,res)=>{
    console.log(req.query);
    const {movieId,theatreId,showTime,date}=req.query;
    seatSchema.findOne({movieId:movieId,theatreId:theatreId,showTime:showTime,date:date})
        .then((seatsBooked)=>{
            if(seatsBooked){
                console.log(seatsBooked.bookedSeats);
                return res.json({Booked:seatsBooked.bookedSeats,message:"Some seats available",status:200});
            }
            else{
                return res.json({Booked:[],message:"All seats available",status:200});
            }
        }).catch((err)=>console.log(err));

})

seatRoute.post("/seats-book",(req,res)=>{
    console.log("Hi from Seat Routes");
    console.log(req.body);
    const {movieId,theatreId,showTime,date,bookedSeats}=req.body;
    seatSchema.findOne({movieId:movieId,theatreId:theatreId,showTime:showTime,date:date})
        .then((seatsBooked)=>{
            if(seatsBooked){
                seatSchema.updateOne({movieId:movieId,theatreId:theatreId,showTime:showTime,date:date},{$push:{bookedSeats:{$each:bookedSeats}}})
                    .then((seatsAdded)=>{
                        if(seatsAdded){
                            return res.json({data:seatsAdded,message:"Seats Booked",status:200});
                        }
                        
                    }).catch((err)=>console.log(err));
            }
            else{
                const documentToAdd=new seatSchema({movieId,theatreId,showTime,date,bookedSeats})
                documentToAdd.save()
                    .then((added)=>{
                        if(added){
                            return res.json({data:added,message:"Seats added",status:200});
                        }
                    }).catch((err)=>console.log(err));
            }
        }).catch((err)=>console.log(err));
    
})

module.exports=seatRoute;