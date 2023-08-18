const friendinvitation = require("../models/friendinvitationmodel");
const usermodel = require("../models/usermodel");
const { updatefriendspendinginvitations } = require("../sockets/friends");

const friendaccept = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;
    const invitationexists = await friendinvitation.exists({
      senderId: id,
      recieverId: userId,
    });
    if (invitationexists) {
     
      const user1 = await usermodel.findByIdAndUpdate(
        id,
        { $push: { friends: userId } },
        { new: true }
      );
      const user2= await usermodel.findByIdAndUpdate(
        userId,
        { $push: { friends: id } },
        { new: true }
      );
      // user1.friends
      await friendinvitation.findOneAndDelete({
        senderId: id,
        recieverId: userId,
      });
      updatefriendspendinginvitations(userId);

      
      //   await friendinvitation
    } else {
      return res.status(400).json({
        success: true,
        message: "invitation does not exists",
      });
    }

    return res.status(200).json({
      success: true,
      message: "invitation deleted successfully",
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: {
        err,
      },
    });
  }
};
module.exports = {
  friendaccept,
};
