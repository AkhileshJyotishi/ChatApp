const mongoose=require('mongoose')
const usermodel = require("../models/usermodel");

const schema=mongoose.Schema
const friendinvitationschema=new schema({
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        recieverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        }

})
module.exports=mongoose.model('friendinvitation',friendinvitationschema)