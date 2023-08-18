const user = require("../models/usermodel");
const friendinvitation = require("../models/friendinvitationmodel");
const socketstore = require("../socketstore");

const updatefriendspendinginvitations = async (userId) => {
  // console.log("friend invitation update hua")
  try {
    const pendinginvitations = await friendinvitation
      .find({
        recieverId: userId,
      })
      .populate("senderId", "_id username profile mail");

    console.log("peding invitations  ", pendinginvitations);

    const recieverlist = socketstore.getactiveconnections(userId);
    // console.log("recieverlist "+ recieverlist)
    const io = socketstore.getsocketserverinstance();
    // io.emit("friend", {
    //   pendinginvitations: pendinginvitations ? pendinginvitations : [],
    // });
    recieverlist.forEach((recieversocketid) => {
      // console.log(recieversocketid);
      io.to(recieversocketid).emit("friend", {
        pendinginvitations: pendinginvitations ? pendinginvitations : [],
      });
      // });
    });
    console.log("ye to chal rha tha");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updatefriendspendinginvitations,
};
