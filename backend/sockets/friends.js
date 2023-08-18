const user = require("../models/usermodel");
const friendinvitation = require("../models/friendinvitationmodel");
const socketstore = require("../socketstore");

const updatefriendspendinginvitations = async (userId) => {
  try {
    const pendinginvitations = await friendinvitation
      .find({
        recieverId: userId,
      })
      .populate("senderId", "_id username mail");
    const recieverlist = socketstore.getactiveconnections(userId);
    const io = socketstore.getsocketserverinstance();
    recieverlist.forEach((recieversocketid) => {
      io.to(recieversocketid).emit("friend-invitations", {
        pendinginvitations: pendinginvitations ? pendinginvitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

modoule.exports={
    updatefriendspendinginvitations
}