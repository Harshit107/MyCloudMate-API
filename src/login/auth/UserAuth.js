const jwt = require("jsonwebtoken");
const User = require("../model/User.js");
const ApiResponse = require("../../utils/apiResponse");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return ApiResponse.error(res, "Authentication required", "UNAUTHORIZED", 401);
    }

    const token = authorization.replace("Bearer ", "").trim();
    if (!token) {
      return ApiResponse.error(res, "Authentication required", "UNAUTHORIZED", 401);
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.JWT || "thisisaauthrequestfromserver");
    } catch (jwtErr) {
      const code = jwtErr.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
      return ApiResponse.error(res, "Device token expired or invalid", code, 401);
    }

    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      return ApiResponse.error(res, "Authentication required or session revoked", "UNAUTHORIZED", 401);
    }

    if (!user.isVerified) {
      return ApiResponse.error(res, "Email is not verified", "FORBIDDEN", 403);
    }

    if (!req.url.includes("logout")) {
      user.updateToken(token, req.ip);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.message && error.message.includes("buffering timed out")) {
      return ApiResponse.error(res, "Database connection timeout", "DATABASE_TIMEOUT", 503);
    }
    return ApiResponse.error(res, error.message || "Authentication failed", "UNAUTHORIZED", 401);
  }
};

module.exports = userAuth;
