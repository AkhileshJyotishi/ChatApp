const express = require("express");
const Joi = require("joi");
const router = express.Router();
const validator = require("express-joi-validation").createValidator({});
const { verifyToken } = require("../middlewares/auth");
const { friendinvites } = require("../controllers/friendinvitationcontroller");
const { acceptinvites } = require("../controllers/acceptinvitationcontroller");
const { rejectinvites } = require("../controllers/rejectinvitationcontroller");
// console.log(verifytoken)
const postfriendinvitationschema = Joi.object({
  targetmailaddress: Joi.string().email().required(),
  token: Joi.string(),
});
const accpetinvitationschema = Joi.object({
  id: Joi.string().required(),
});
console.log("schema tak hua");
router.post(
  "/invite",
  verifyToken,
  validator.body(postfriendinvitationschema),
  friendinvites
);
router.post(
  "/accept",
  verifyToken,
  validator.body(accpetinvitationschema),
  acceptinvites
);
router.post(
  "/reject",
  verifyToken,
  validator.body(accpetinvitationschema),
  rejectinvites
);

module.exports = router;
