const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async(req, res, next) => {
  console.log("verify token chala")
  let decode =req.body.token || req.query.token || req.headers["authorization"];
  // console.log(decode)
  if (!decode) {
    console.log("truthful")
    return res.status(403).send({
      success: false,
      message: "authentication token not found",
    });
    
  }
  console.log("if ke baad")
  try {
    console.log(process.env.JWTSecretKey)
    const decodedtoken = await jwt.verify(decode, process.env.JWTSecretKey);
    // console.log(decodedtoken)
    req.user = decodedtoken;
    console.log("working")
    next();
  } catch (err) {
    res.json({
      success: false,
      message: err,
    });
  }
};

const requireauth = async (req, res, next) => {
  const decode =
    req.headers["authorization"] || req.body.token || req.query.token;
  if (!decode) {
    return res.status(401).json("Authorization requires token");
  }
  // const token = authorization.split(' ')[1];
  try {
    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    //ambiguity
    req.user = await usermodel.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json("request is not authorized");
  }
};
module.exports={
    verifyToken
}