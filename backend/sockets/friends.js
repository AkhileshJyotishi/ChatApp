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

    // console.log("peding invitations  ", pendinginvitations);

    const recieverlist = socketstore.getactiveconnections(userId);
    // console.log("recieverlist ", recieverlist);
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
    // console.log("ye to chal rha tha");
  } catch (err) {
    console.log(err);
  }
};
const updatefriends = async (userId) => {
  try {
    const recieverlist = socketstore.getactiveconnections(userId);
    // console.log("friends  ",recieverlist)
    if (recieverlist.length > 0) {
      const user2 = await user
        .findById(userId, { _id: 1, friends: 1 })
        .populate("friends", "_id username mail profile");
      // console.log(user2)
      if (user2) {
        const friendslist = user2.friends.map((key, index) => {
          return {
            id: key._id,
            mail: key.mail,
            username: key.username,
            profile: key.profile,
          };
        });
        console.log("this is the friendlist    ", friendslist);

        //find  active connection of specific id
        const io = socketstore.getsocketserverinstance();
        recieverlist.forEach((recieversocketid) => {
          io.to(recieversocketid).emit("friends-list", {
            friends: friendslist ? friendslist : [],
          });
        });
      }
    }
  } catch (err) {}
};
module.exports = {
  updatefriendspendinginvitations,
  updatefriends,
};
