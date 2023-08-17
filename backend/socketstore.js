const connectedusers = new Map();
const addnewconnecteduser = ({ socketid, userid }) => {
  connectedusers.set(socketid, { userid });
  console.log(connectedusers);
};
const removeconnecteduser=(socketid)=>{
  const chk=connectedusers.has(socketid)
  if(chk){
    connectedusers.delete(socketid)
    console.log("new list of users   "+ connectedusers)
  }

}
module.exports = {
  addnewconnecteduser,
  removeconnecteduser
};
