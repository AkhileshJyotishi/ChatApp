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
  disconnecthandler,
  getactiveconnections,
  roomcreationhandle,
  activerooms,
  updaterooms,
  joinactiveroom,
  leaveroomhandle,
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
  setTimeout(() => {
    
    updaterooms(socket.id)
  },500);
};

const messagemodel = require("./models/messagemodel");
const conversationmodel = require("./models/conversationmodel");

const directmessagehandler = async (socket, data) => {
  console.log("direct message handler being handled");
  try {
    const userId = socket.user.data._id;
    const { recieveuserid, content } = data;

    const message = await messagemodel.create({
      content,
      authorId: userId,
      date: new Date(),
      type: "Direct_Message",
    });
    console.log("messaage came", message);
    const conversation = await conversationmodel.findOne({
      participants: { $all: [userId, recieveuserid] },
    });
    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();
      updateChatHistory(conversation._id.toString());
    } else {
      const newconversation = await conversationmodel.create({
        messages: [message._id],
        participants: [userId, recieveuserid],
      });
      updateChatHistory(newconversation._id.toString());
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
    socket.on("direct-chat-history", async (data) => {
      const userId = socket.user.data._id;
      const { recieveuserid } = data;
      const conversation = await conversationmodel.findOne({
        participants: { $all: [userId, recieveuserid] },
      });

      console.log("direct chat histort specifiacally called ", conversation);
      if (conversation) {
        updateChatHistory(conversation._id.toString(), socket.id);
      }
    });

    socket.on("room-create", (data) => {
      roomcreationhandle(socket, data);
    });
    socket.on("room-join", (data) => {
      const { roomid } = data;
      const participationdetails = {
        userid: socket.user.userid,
        socketid: socket.id,
      };
      

      const activeroom = activerooms.find((activeroom) => {
        activeroom.roomid === roomid;
      });
      // const roomdetails=activerooms
      // {...activeroom}
      joinactiveroom(roomid, participationdetails);
activerooms.participants.forEach((participant)=>{
  if(participant.socketid !==participationdetails.socketid){
  socket.to(participant.socketid).emit('conn-prepare',{
    connusersocketid:participationdetails.socketid
  })

}
})
      updaterooms();
    });
    socket.on("leave-room", (data) => {
      leaveroomhandle(socket, data);
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

const updateChatHistory = async (conversationId, toSpcificSocketId = null) => {
  const conversation = await conversationmodel
    .findById(conversationId)
    .populate({
      path: "messages",
      model: "message",
      populate: {
        path: "authorId",
        model: "user",
        select: "username _id",
      },
    });
  if (conversation) {
    console.log("conversation2", conversation);
    if (toSpcificSocketId) {
      console.log("to specific socket id ", toSpcificSocketId);
      return io.to(toSpcificSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }
    conversation.participants.forEach((userId) => {
      const activeConnection = getactiveconnections(userId.toString());
      activeConnection.forEach((socketid) => {
        io.to(socketid).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
  }
};

setInterval(() => {
  // getonlineusers();
  emitonlineusers();
}, [5000]);
module.exports = {
  registersocketserver,
};
