const friendinvitation = require("../models/friendinvitationmodel");
const {  updatefriendspendinginvitations } = require("../sockets/friends");
const friendinvites = async (req, res) => {
  const { targetmailaddress } = req.body;
  console.log(req.user);
  const { mail } = req.user;
  const userId = req.user.data._id;
  const usermodel = require("../models/usermodel");

  console.log("friend invite hua");

  if (mail == targetmailaddress) {
    return res.status(409).json({
      success: false,
      message: "Sorry!You cant connect to yourself",
    });
  }

  const targetuser = await usermodel.findOne({ mail: targetmailaddress });
  if (!targetuser) {
    return res.status(404).json({
      success: false,
      message: `user with mail targetmailaddress has not been found`,
    });
  }

  //if already invited
  const invitationAlreadyrecieved = await friendinvitation.findOne({
    senderId: req.user.data._id,
    recieverId: targetuser._id,
  });
  if (invitationAlreadyrecieved) {
    return res.json({
      success: false,
      message: "you have sent the invitation already",
    });
  }

  //if invited friend is already in our list i.e. already a friend
  const userAlreadyfriends = targetuser.friends.find((friendId) => {
    friendId.toString() === userId.toString();
  });
  if (userAlreadyfriends) {
    return res.json({
      success: false,
      message: "friend already added",
    });
  }
  const newinvitation = await friendinvitation.create({
    senderId: userId,
    recieverId: targetuser._id,
  });
  updatefriendspendinginvitations(targetuser._id.toString());

  return res.json({
    success: true,
    message: "Invitation sent successfully",
    newinvitation,
  });
};

module.exports = {
  friendinvites,
};
//frontend se userid nikalna padega
