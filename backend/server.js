const express = require("express");
const http = require("http");
// const express = require("express");
// const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const db = require("./db");
const authcontrol = require("./routes/authroutes");
const friendinvitationcontrol = require("./routes/friendinvitationroutes");
const socketserver = require("./socketServer");
require("dotenv").config();
const port = process.env.PORT || process.env.API_PORT;
const app = express();
const server=http.createServer(app);
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

db();
// console.log(typedefs);
socketserver.registersocketserver(server);

app.use("/v1/api/auth", authcontrol);
app.use('/v1/api/friend-invitation',friendinvitationcontrol)
server.listen(port, () => {
  console.log("server started on port", port);
});
