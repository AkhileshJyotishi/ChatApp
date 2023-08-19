const mongoose = require("mongoose");

const schema = mongoose.Schema;
const messageschema = new schema({
  authorId: 
    {
      type: schema.Types.ObjectId,
      ref: "user",
    },
    
  content: { type: String },
  date: { type: Date },
  type: { type: String },
});
module.exports = mongoose.model("message", messageschema);
