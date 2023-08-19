const mongoose = require("mongoose");

const schema = mongoose.Schema;
const conversationschema = new schema({
  participants: [
    {
      type: schema.Types.ObjectId,
      ref: "user",
    },
  ],
  messages: [
    {
      type: schema.Types.ObjectId,
      ref: "message",
    },
  ],
});
module.exports=mongoose.model("conversation",conversationschema);
