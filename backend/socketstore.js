const {v4:uuidv4}=require('uuid')
const connectedusers = new Map();
let activerooms=[];
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
  connectedusers.forEach((value,key) => {
    onlineUsers.push({ socketid: key, userid: value.userid });
    return onlineUsers;
  });
};

const roomcreationhandle=(socket)=>{
  console.log("room is breing created")
  const socketid=socket.id;
    const userid = socket.user.data._id;

    const roomdetails=addnewactiveroom(userid,socketid)
socket.emit("room-create",{
roomdetails
})

}

const addnewactiveroom=(userid,socketid)=>{
  const newactiveroom={
    roomcreator:{
      userid,
      socketid
    },
    participants:[
      {
        userid,
        socketid
      }
    ],
    roomid:uuidv4()
  }
  activerooms.push(newactiveroom)
  console.log(activerooms)  
  return newactiveroom;

}

module.exports = {
  addnewconnecteduser,
  removeconnecteduser,
  getactiveconnections,
  setsocketserverinstance,
  getsocketserverinstance,
  getonlineusers,
  addnewactiveroom,
  roomcreationhandle
};
