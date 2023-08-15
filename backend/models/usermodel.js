const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username: { type: String },
  mail: { type: String },
  password: { type: String },
});
module.exports = mongoose.model("user", loginSchema);
// auth