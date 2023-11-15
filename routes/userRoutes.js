const express=require("express");
const userRoute=express.Router();
const userSchema=require("../schema/usersSchema");
const mongoose=require("mongoose");


userRoute.post("/register",(req,res)=>{
        console.log(req.body);
    
        const {name,email,password,cpassword}=req.body;
        if(!name || !email || !password || !cpassword){
            return res.json({data:"All fields",message:"Please fill all the fields",status:200});
        }
        if(!(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))){
            return res.json({data:"invalid email",message:"Invalid Email",status:200});
        }
        if(!(password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/))){
            return res.json({data:"Invalid password",message:"Password should contain 8 to 15 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",status:200});
        }
        if(!(password==cpassword)){
            return res.json({data:"Invalid password",message:"Passwords do not match",status:200}); 
        }
       
        
        
        console.log("validation success");
        userSchema.findOne({email:email})
            .then((response)=>{
                if(response){
                    console.log("email already registered");
                    return res.json({data:response,message:"Email already registered",status:200});
                    
                    
                }
                else{
                    const user=new userSchema({name,email,password});
                    user.save()
                        .then((saved)=>{
                            if(saved){
                                console.log("User registered successfully");
                                return res.json({data:response,message:"User Registered successfully",status:400});
                                
                            }
                        }).catch((err)=>{console.log(err)});
                }
                
        
       
            }).catch((err)=>{console.log(err)});
        
        
        

    
    
    
})

userRoute.post("/login",(req,res)=>{
        const{email,password}=req.body;
        if(!email ||  !password){
            return res.json({data:response,message:"Please fill all the fields",status:200});
        }
        if(!(email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))){
            return res.json({data:"invalid email",message:"Invalid Email",status:200});
        }
        userSchema.findOne({email:email,password:password})
            .then((userExists)=>{
                if(userExists){
                    return res.json({data:userExists,message:"Login successful",status:400});
                }
                else{
                    return res.json({data:"Does not exist",message:"Invalid credentials",status:200});
                }
            }).catch((err)=>console.log(err));
            
})
module.exports=userRoute;