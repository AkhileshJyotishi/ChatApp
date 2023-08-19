const jwt=require('jsonwebtoken')
require("dotenv").config();


const verifytokensocket=(socket,next)=>{
    console.log("verification of socket")
    const token= socket.handshake.auth?.token;

    try{
        const decoded=jwt.verify(token,process.env.JWTSecretKey)
        socket.user=decoded
        console.log("socket.user check ",socket.user);

    }
    catch(err){
        const socketerror=new Error("Not Authorized!")
        return next(socketerror)
    }
    next();
    
}
module.exports={
    verifytokensocket
}
