const express = require("express");
const router = new express.Router();
const freelyEmailModule = require("freely-email");
const FREELY_EMAIL_BASE_URL =
  process.env.FREELY_EMAIL_BASE_URL ||
  "https://freelyemail-api.harshit107.online/api/v1/emails/";
const fe = freelyEmailModule.FreelyEmailClient
  ? new freelyEmailModule.FreelyEmailClient({ baseURL: FREELY_EMAIL_BASE_URL })
  : freelyEmailModule;

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
