const friendinvitation = require("../models/friendinvitationmodel");
const { updatefriendspendinginvitations } = require("../sockets/friends");

const friendreject = async (req, res) => {
  console.log("rejection se pehele");
  try {
    console.log("desired data", req.body);
    const { id } = req.body;
    const invitationexists = await friendinvitation.exists({
      _id: id,
    });
    console.log("invitation exist", invitationexists);
    if (invitationexists) {
      const userId  = req.user.data._id;

      // console.log(req.user)
      const deletedone = await friendinvitation.findByIdAndDelete(id);
      console.log("deletedone", deletedone);
     await updatefriendspendinginvitations(userId);
      const printallremain = await friendinvitation.find({});
      // console.log(printallremain);
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
