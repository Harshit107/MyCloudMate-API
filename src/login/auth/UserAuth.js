const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
require("dotenv").config();
const checkStringMessage = require("../Helper/StringHelper.js");

async function makeDelay(res) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await delay(3000);
  // return res.status(400).send({message : "success"});
  return res.status(200).send({ error: "success" });
}

const userAuth = async (req, res, next) => {
  try {

    // return await makeDelay(res);
    
    const authorization = req.header("Authorization");
    if (!authorization || !authorization.startsWith("Bearer "))
      return res.status(401).send({ error: "Authentication required" });

    const token = req.header("Authorization").replace("Bearer ", "");

    const decode = jwt.verify(token, process.env.JWT);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });


    if (!user)
      return res.status(401).send({ error: "Authentication Required" });

    if (!user.isVerified)
      return res.status(403).send({ error: "Email is Not Verified" });

    if (!req.url.includes('logout')) {
      user.updateToken(token, req.ip)
    }
    req.user = user;
    req.token = token;

    next();

  } catch (error) {
    if(error.message.includes('buffering timed out'))
      return res.status(503).send({ error: "Internal Server Error" });
    return res.status(400).send({ error: checkStringMessage(error.message) });
  }
};
module.exports = userAuth;
