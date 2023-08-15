// const express=require('express')
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const usermodel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
// const graphqlsave = require("../schema/sanityschema");
// const graphqlUrl = "http://localhost:4000";
const axios = require("axios");
// console.log(graphqlsave);
 const register = async (req, res) => {
  try {
    const { username, password, mail } = req.body;
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
        const hashpasswd = await bcrypt.hash(password, 10);

        const user = new usermodel({
          username,
          password: hashpasswd,
          mail,
        });
        const reply = await user.save();

        // how to use graphql here

        return res.send({
          success: true,
          message: {
            data: reply,
          },
        });
      } catch (err) {
        return res.send({
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
