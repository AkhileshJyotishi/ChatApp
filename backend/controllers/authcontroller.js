// const express=require('express')
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { request } = require("express");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const profileUploadfn = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${userId}_profile`,
      width: 500,
      height: 500,
      crop: 'fill'
    })
    const user = await usermodel.findOneAndUpdate(
      { _id: userId },
      { $set: { photourl: result.secure_url } },
      { new: true, upsert: true }
    )
    if (user && result) {
      res.status(200).json(result.secure_url);
    }
  }
  catch (err) {
    res.status(400).json(err.message);
  }
};

const register = async (req, res) => {
  console.log(req.body);
  try {
    // console.log("helo",req.file);
    const { username, password, mail } = req.body;
    console.log(username,password,mail);
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
        // let photourl;
        if (req.file.path) {
          // profileUploadfn(req,res);
          const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `doraemon`,
            width: 500,
            height: 500,
            crop: 'fill'
          })
          console.log("photo path",result);
          const user = new usermodel({
            username,
            password: hashpasswd,
            mail,
            photourl: result.secure_url
          });
          reply = await user.save();
        }
        else {
          photourl = ""
          // console.log(reply)
          console.log(hashpasswd)

          const user = new usermodel({
            username,
            password: hashpasswd,
            mail,
            photourl
          });
          reply = await user.save();
        }

        // how to use graphql here

        return res.send({
          success: true,
          message: {
            data: reply,
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
    } 
    else {
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

const login = (req, res) => {
  return res.send({
    message: true,
  });
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
