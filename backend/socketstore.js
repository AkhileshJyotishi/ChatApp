const { v4: uuidv4 } = require("uuid");
const connectedusers = new Map();
let activerooms = [];
let io = null;
const setsocketserverinstance = (ioinstance) => {
  // console.log("setsocketserverinstance working " , ioinstance);
  io = ioinstance;
  // console.log("checker io  ",io)
};
const getsocketserverinstance = () => {
  return io;
};

const addnewconnecteduser = ({ socketid, userid }) => {
  connectedusers.set(socketid, { userid });
  // console.log(connectedusers);
};
const removeconnecteduser = (socketid) => {
  const chk = connectedusers.has(socketid);
  if (chk) {
    connectedusers.delete(socketid);
    // console.log("new list of users   " + connectedusers);
  }
};
const getactiveconnections = (userid) => {
  console.log("connected users are ", connectedusers);

  const activeconnections = [];
  connectedusers.forEach((value, key) => {
    if (value.userid == userid) {
      console.log(key);
      activeconnections.push(key);
      // console.log(typeof(key))
    }
  });
  return activeconnections;
};

const getonlineusers = () => {
  const onlineUsers = [];
  connectedusers.forEach((value, key) => {
    onlineUsers.push({ socketid: key, userid: value.userid });
    return onlineUsers;
  });
};

const roomcreationhandle = (socket, data) => {
  console.log("room is breing created");
  const socketid = socket.id;
  const userid = socket.user.data._id;

  const roomdetails = addnewactiveroom(userid, socketid);
  socket.emit("room-create", {
    roomdetails,
  });
  updaterooms();
};

const addnewactiveroom = (userid, socketid) => {
  const newactiveroom = {
    roomcreator: {
      userid,
      socketid,
    },
    participants: [
      {
        userid,
        socketid,
      },
    ],
    roomid: uuidv4(),
  };
  activerooms.push(newactiveroom);
  console.log(activerooms);
  return newactiveroom;
};

const updaterooms = (tospecificid = null) => {
  const io = getsocketserverinstance();
  // const activeRooms=activerooms;
  if (tospecificid && activerooms.length>0) {
    console.log("isike karan eroor a a rhaa h ", activerooms);
    io.to(tospecificid).emit("active-rooms"),
      {
        activerooms,
      };
  } else {
    console.log("active rooms emitted");
    io.emit("active-rooms", {
      activerooms,
    });
  }
};
const joinactiveroom = (roomid, newparticipant) => {
  const rooms = activerooms.find((room) => room.roomid === roomid);
  activerooms = activerooms.filter((room) => room.roomid !== roomid);
  const updatedroom = {
    ...rooms,
    participants: [...rooms.participants, newparticipant],
  };
  activerooms.push(updatedroom);
  console.log(activerooms);
};
const leaveroomhandle = (socket, data) => {
  const activeroom = activerooms.find((room) => room.roomid === data.roomid);
  if (activeroom) {
    // data.roomid,socket.id,
    let copyofactiverooms = { ...activeroom };
    copyofactiverooms.participants = copyofactiverooms.participants.filter(
      (participant) => participant.socketid !== socket.id
    );

    activerooms = activerooms.filter((room) => room.roomid !== data.roomid);
    if (copyofactiverooms.participants.length > 0) {
      activerooms.push(copyofactiverooms);
    }
    updaterooms();
  }
};
const disconnecthandler = (socket) => {
  activerooms.forEach((activeroom) => {
    const userinroom = activeroom.participants.some(
      (participant) => participant.socketid == socket.id
    );
    if (userinroom) {
      leaveroomhandle(socket, { roomid: activeroom.roomid });
    }
  });

  removeconnecteduser(socket.id);
};
module.exports = {
  addnewconnecteduser,
  removeconnecteduser,
  getactiveconnections,
  setsocketserverinstance,
  getsocketserverinstance,
  getonlineusers,
  addnewactiveroom,
  roomcreationhandle,
  activerooms,
  updaterooms,
  joinactiveroom,
  leaveroomhandle,
  disconnecthandler,
};
