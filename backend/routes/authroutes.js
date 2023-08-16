const express = require("express");
const Joi = require("joi");
const multer = require('multer');

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

const validator = require("express-joi-validation").createValidator({});

const registeruserschema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(6).required(),
  // repeat_password: Joi.ref("password"),
  mail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    photourl: Joi.object({
      fieldname: Joi.string(),
      originalname: Joi.string(),
      encoding: Joi.string(),
      mimetype: Joi.string(),
      destination: Joi.string(),
      filename: Joi.string(),
      path: Joi.string(),
      size: Joi.number()
    }).required()
});
const loginuserschema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(6).required(),
});

router.post("/register", upload.single('profile'),validator.body(registeruserschema), register);
// router.post("/register", validator.body(registeruserschema), register);
router.post("/login", validator.body(loginuserschema), login);

module.exports = router;
