const friendinvitation = require("../models/friendinvitationmodel");
const { updatefriendspendinginvitations } = require("../sockets/friends");

const friendreject = async (req, res) => {
  console.log("rejection se pehele")
  try {
    const { id } = req.body;
    const { userId } = req.user;
    const invitationexists = await friendinvitation.exists({
      senderId: id,
      recieverId: userId,
    });
    console.log(invitationexists)
    if (invitationexists) {
      const { userId } = req.user;
      
    
      await friendinvitation.findOneAndDelete({
        senderId: id,
        recieverId: userId,
      });
      updatefriendspendinginvitations(userId);

      return res.status(200).json({
        success: true,
        message: "invitation deleted successfully",
      });
    } else {
      return res.send({
        success: false,
        message: "invitation does not exists",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: {
        err,
      },
    });
  }
};
module.exports = {
  friendreject,
};
