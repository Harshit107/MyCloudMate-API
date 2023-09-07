const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
require("dotenv").config();
const checkStringMessage = require("../Helper/StringHelper.js");

const userAuth = async (req, res, next) => {
  try {
    // console.log(req.header("Authorization"));
    const token = req.header("Authorization").replace("Bearer ","");
    if(!token || token == null)
       throw new Error("Authentication required" );

    const decode = jwt.verify(token, process.env.JWT);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user)
      return res.status(401).send({ error: "Authentication Required" });

    if (!user.isVerified)
      return res.status(403).send({ error: "Email is Not Verified"});

    req.user = user;
    req.token = token;

    next();

  } catch (error) {
    return res.status(400).send({ error: checkStringMessage(error.message) });
  }
};
module.exports = userAuth;
