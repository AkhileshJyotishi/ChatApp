// const express=require('express')
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { request } = require("express");
// const cookies=require('cookoe')
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const profileUploadfn = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${userId}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    const user = await usermodel.findOneAndUpdate(
      { _id: userId },
      { $set: { profile: result.secure_url } },
      { new: true, upsert: true }
    );
    if (user && result) {
      res.status(200).json(result.secure_url);
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const register = async (req, res) => {
  console.log(req.body);
  try {
    console.log("helo", req.file);
    const { username, password, mail } = req.body;
    console.log(username, password, mail);
    if (username && password && mail) {
      const userexists = await usermodel.exists({ mail });
      if (userexists) {
        return res.status(400).send({
          success: true,
          message: {
            data: "email already in use",
          },
        });
      }
      try {
        // console.log(req.file)
        const hashpasswd = await bcrypt.hash(password, 10);
        var reply;
        let profile;
        if (req.file.path) {
          // profileUploadfn(req,res);
          const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `doraemon`,
            width: 500,
            height: 500,
            crop: "fill",
          });
          // console.log("photo path",result);
          const user = new usermodel({
            username,
            password: hashpasswd,
            mail,
            profile: result.secure_url,
          });
          reply = await user.save();
          console.log("working");
          var token = jwt.sign(
            {
              data: user,
            },
            process.env.JWTSecretKey,
            { expiresIn: "1h" }
          );
        } else {
          profile = "";
          // console.log(reply)
          // console.log(hashpasswd)

          const user = new usermodel({
            username,
            password: hashpasswd,
            mail,
            profile,
          });
          reply = await user.save();
          const token = jwt.sign(
            {
              data: user,
            },
            process.env.JWTSecretKey,
            { expiresIn: "1h" }
          );
          return res.send({
            success: true,
            message: {
              data: reply,
              token,
            },
          });

          // res.json({
          //   success:true,
          //   token
          // })
        }
        console.log("working ke baad");
        // how to use graphql here

        return res.send({
          success: true,
          message: {
            data: reply,
            token,
          },
        });
      } catch (err) {
        return res.status(400).send({
          success: false,
          message: {
            data: err,
          },
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: {
          data: "something not sent",
        },
      });
    }
  } catch (err) {
    return res.send(err);
  }
};

//login logic
//login logic

const login = async (req, res) => {
  console.log("login khul gya")
  try {
    const { mail, password } = req.body;
    // decryptpasswd=
    const userexists = await usermodel.findOne({ mail });
    console.log(userexists);
    if (userexists) {
      const passmatch =await bcrypt.compare(password, userexists.password)
      if(passmatch){
        console.log("passmatch",passmatch)
        const userData = {
          username:userexists.username,
          email:userexists.mail,
          profile:userexists.profile
        }

        const token = jwt.sign(
          {
            data: userexists,
          },
          process.env.JWTSecretKey,
          { expiresIn: "1h" }
        );
        // const reply2=await usermodel.
        console.log("response bhejna h ")
        return res.send({
          success: true,
          message: {
            data: userData,
            token,
          },
        });
      }else {
        return res.json({
          success: false,
          message: "password not matched",
        });
      }

      // jwt.sign()
    } else {
      return res.json({
        success: false,
        message: "user does not exist try signup instead",
      });
    }
  } catch (err) {
  return res.send({
    message: err,
  });
}
};

module.exports = {
  login,
  register,
};
// mongoose.mongo
// d3.js ||  chartjs
// framermotion + svg animation
// typescript
//
// raozorpay/stripe --discordpay
// skeleton loader
// docker deploy
//
// threejs
// otp + mail auth
// next
// js
// tailwindcss
// jwt
// socketio
// webrtc
// pwa
// graphql
//
// const jwt = require("jsonwebtoken");
// const userModle = require("../Modles/userModle");

// const RequireAuth = async(req,res,next)=>{
//     const {authorization} = req.headers;
//     if(!authorization){
//        return res.status(401).json("Authorization requires token");
//     }
//     const token = authorization.split(' ')[1];
//     try{
//         const {_id} = jwt.verify(token,process.env.SECRET_KEY);
//         req.user = await userModle.findOne({_id}).select('_id');
//         next();
//     }
//     catch(err){
//         console.log(err);
//         res.status(401).json("request is not authorized");
//     }
// }
// module.exports = RequireAuth;
