const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  let decode =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!decode) {
    return res.status(403).send({
      success: false,
      message: "authentication token not found",
    });
  }
  try {
    const decodedtoken = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decodedtoken;
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