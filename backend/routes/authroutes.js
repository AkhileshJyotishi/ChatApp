const express = require("express");
const Joi = require("joi");
const formidable = require("express-formidable");
const router = express.Router();
// const app = express()
const { login, register } = require("../controllers/authcontroller");

const validator = require("express-joi-validation").createValidator({});
router.use(formidable());
// const registeruserschema = Joi.object({
//   username: Joi.string().min(3).max(15).required(),
//   password: Joi.string().min(6).required(),
//   repeat_password: Joi.ref("password"),
//   mail: Joi.string()
//     .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//     .required(),
//   photourl: Joi.string(),
// });
const loginuserschema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(6).required(),
});

router.post("/register", register);
// validator.body(registeruserschema),
router.post("/login", validator.body(loginuserschema), login);

module.exports = router;
