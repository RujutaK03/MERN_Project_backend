const express=require("express");
const paymentRoute=express.Router();
const userSchema=require("../schema/usersSchema");
const mongoose=require("mongoose");

paymentRoute.post("/payment",(req,res)=>{
    const {email,totalAmount}=req.body;
    console.log("Hi from paymentRoute");
    console.log(email);
    userSchema.findOne({email:email})
        .then((emailexists)=>{
            if(emailexists){
                if(emailexists.points>totalAmount){
                    const amount=emailexists.points-totalAmount;
                    userSchema.updateOne({email:email},{$set:{points:amount}})
                        .then((response)=>{
                            if(response){
                                return res.json({data:response,message:"Payment sucessful",status:200});
                            }
                            else{
                                return res.json({data:response,message:"Points not updated",status:500});
                            }
                        }).catch((err)=>console.log(err));
                }
                else{
                    return res.json({data:"Insufficient balance",message:"Insufficient balance",status:500});
                }
            }
        }).catch((err)=>console.log(err));

})

module.exports=paymentRoute;
