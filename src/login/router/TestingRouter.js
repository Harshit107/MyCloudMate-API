const express = require("express");
const router = new express.Router();
const fe = require("freely-email");

router.get("/testing", async (req, res) => {
  const msgBody = {
    recipient: "harshit107.in.2022@gmail.com",
    app: "Reminder",
    subject: "Applying for SDE Role",
    sender: "Uthsav",
    replyTo: "harshit107.in.2022@gmail.com",
    otp: "123456",
    message:
      "Welcome to the Auto Email Sender app! This app is designed to make it easy for developers to send automated emails to multiple recipients.",
    HTMLfile: "",
  };
  const result = await fe.sendOTP(msgBody);
  res.send(result);
  
});

module.exports = router;
