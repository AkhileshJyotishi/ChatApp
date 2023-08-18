const express = require("express");
const Joi = require("joi");
const router = express.Router();
const validator = require("express-joi-validation").createValidator({});
const  {verifyToken}  = require("../middlewares/auth");
const { friendinvites } = require("../controllers/friendinvitationcontroller");
// console.log(verifytoken)
const postfriendinvitationschema=Joi.object({
    targetmailaddress:Joi.string().email().required(),
    token:Joi.string()
})
console.log("schema tak hua")
router.post('/invite',verifyToken,validator.body(postfriendinvitationschema),friendinvites)

module.exports=router;