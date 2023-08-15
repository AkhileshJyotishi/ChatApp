const mongoose = require("mongoose");
require("dotenv").config();

// r8pqFkhLFTJ3PNxM
const connect = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to the database");
    })
    .catch((err) => {
      console.error(err);
    });
};
module.exports = connect;
