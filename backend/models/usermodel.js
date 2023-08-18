const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  username: { type: String },
  mail: { type: String },
  password: { type: String },
  profile: { type: String },
  friends: [{ type: mongoose.Schema.Types.Object, ref: "user" }],
});
module.exports = mongoose.model("user", loginSchema);
// auth
