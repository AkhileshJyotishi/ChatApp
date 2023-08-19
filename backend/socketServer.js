const { verifytokensocket } = require("./middlewares/authsocket");
const {
  updatefriendspendinginvitations,
  updatefriends,
} = require("./sockets/friends");
const {
  addnewconnecteduser,
  removeconnecteduser,
  setsocketserverinstance,
  getonlineusers,
} = require("./socketstore");

// console.log(authsocket);
// console.log(addnewconnecteduser)
let io;
const newconnectionhandle = async (socket, io) => {
  // console.log("newsockethandle ", socket.user);
  const userhandler = socket.user;
  addnewconnecteduser({
    socketid: socket.id,
    userid: userhandler.data._id,
  });

  updatefriendspendinginvitations(userhandler.data._id);
  updatefriends(userhandler.data._id);
};

const disconnecthandler = (socket) => {
  removeconnecteduser(socket.id);
};
const messagemodel = require("./models/messagemodel");
const conversationmodel = require("./models/conversationmodel");

const directmessagehandler = async (socket, data) => {
  console.log("direct message handler being handled");
  try {
    // yha mistake ho skta h
    const { userId } = socket.user;
    const { recieveuserid, content } = data;

    const message = await messagemodel.create({
      content,
      authorId: userId,
      date: new Date(),
      type: "Direct_Message",
    });
    const conversation = await conversationmodel.findOne({
      participants: { $all: [userId, recieveuserid] },
    });
    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();
    } else {
      const newconversation = await conversation.create({
        messages: [message._id],
        participants: [userId, recieveuserid],
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err,
    });
  }
};

const registersocketserver = (server) => {
  // console.log("server connection ho rha h");
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  // console.log("asli io  ", io);
  setsocketserverinstance(io);
  io.use((socket, next) => verifytokensocket(socket, next));

  io.on("connection", (socket) => {
    console.log("user connected " + socket.id);

    newconnectionhandle(socket, io);
    // console.log(object)
    emitonlineusers();
    socket.on("direct-message", (data) => {
      directmessagehandler(socket, data);
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      disconnecthandler(socket);
    });
  });
};
const emitonlineusers = () => {
  const onlineusers = getonlineusers();
  io.emit("online-users", { onlineusers });
};

setInterval(() => {
  // getonlineusers();
  emitonlineusers();
}, [5000]);
module.exports = {
  registersocketserver,
};
