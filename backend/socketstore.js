const connectedusers = new Map();
let io = null;
const setsocketserverinstance = (ioinstance) => {
  console.log("setsocketserverinstance working " , ioinstance);
  io = ioinstance;
  console.log("checker io  ",io)
};
const getsocketserverinstance = () => {
  return io;
};

const addnewconnecteduser = ({ socketid, userid }) => {
  connectedusers.set(socketid, { userid });
  console.log(connectedusers);
};
const removeconnecteduser = (socketid) => {
  const chk = connectedusers.has(socketid);
  if (chk) {
    connectedusers.delete(socketid);
    console.log("new list of users   " + connectedusers);
  }
};
const getactiveconnections = (userid) => {
  const activeconnections = [];
  connectedusers.forEach((value, key) => {
    if (value.userid == userid) {
      activeconnections.push(key);
      console.log(typeof(key))
    }
  });
  return activeconnections;
};

module.exports = {
  addnewconnecteduser,
  removeconnecteduser,
  getactiveconnections,
  setsocketserverinstance,
  getsocketserverinstance,
};
