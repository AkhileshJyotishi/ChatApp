const express = require("express");
const Joi = require("joi");
const multer = require('multer');
require("dotenv").config();

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb("Invalid image File!", false);
  }
}
const upload = multer({ storage, fileFilter });

const router = express.Router();
// const app = express()
const { login, register } = require("../controllers/authcontroller");
const usermodel = require("../models/usermodel");

const validator = require("express-joi-validation").createValidator({});



const requireauth = async(req,res,next)=>{
      const {authorization} = req.headers;
      if(!authorization){
         return res.status(401).json("Authorization requires token");
      }
      // const token = authorization.split(' ')[1];
      try{
          const {_id} = jwt.verify(token,process.env.SECRET_KEY);
          //ambiguity
          req.user = await usermodel.findOne({_id}).select('_id');
          next();
      }
      catch(err){
          console.log(err);
          res.status(401).json("request is not authorized");
    }
      }















const registeruserschema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(6).required(),
  // repeat_password: Joi.ref("password"),
  mail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  profile: Joi.object({
    fieldname: Joi.string(),
    originalname: Joi.string(),
    encoding: Joi.string(),
    mimetype: Joi.string(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string(),
    size: Joi.number()
  })
});
const loginuserschema = Joi.object({
  mail:    Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
  password: Joi.string().min(6).required(),
});

router.post("/register", upload.single('profile'), validator.body(registeruserschema), register);
// router.post("/register", validator.body(registeruserschema), register);
router.post("/login", validator.body(loginuserschema), login);

module.exports = router;
