const {verifytokensocket} = require("./middlewares/authsocket");
const { addnewconnecteduser, removeconnecteduser } = require("./socketstore");

// console.log(authsocket);
// console.log(addnewconnecteduser)
const newconnectionhandle = async (socket, io) => {
  console.log("newsockethandle ", socket.user);
  const userhandler = socket.user;
  addnewconnecteduser({
    socketid: socket.id,
    userid: userhandler.data._id,
  });
};

const disconnecthandler=(socket)=>{
removeconnecteduser(socket.id);
} 



const registersocketserver = (server) => {
  // console.log("server connection ho rha h");
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => verifytokensocket(socket, next));
  io.on("connection", (socket) => {
    // console.log("user connected " + socket.id);
    newconnectionhandle(socket, io);
    socket.on("disconnect",()=>{
      disconnecthandler(socket);
    })
  });


};
module.exports = {
  registersocketserver,
};
