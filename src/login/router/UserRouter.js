const express = require("express");
const router = new express.Router();
const userAuth = require("../auth/UserAuth");
const UserController = require("../../controllers/user.controller");

// ======================= Authentication & Registration =======================
router.post("/create", UserController.register);
router.post("/login", UserController.login);

// ======================= QR Code Authentication =======================
router.post("/login/qr/store", UserController.createQrCode);
router.post("/login/qr/storetoken", userAuth, UserController.storeQrToken);
router.post("/login/qr/validate", UserController.validateQrCode);

// ======================= Session & Device Management =======================
router.post("/logout", userAuth, UserController.logout);
router.post("/logout/all", userAuth, UserController.logoutAll);
router.post("/logout/all/current", userAuth, UserController.logoutAllExceptCurrent);
router.post("/logout/device", userAuth, UserController.logoutDevice);

// ======================= Verification & Password Reset =======================
router.post("/verification/email", UserController.sendVerificationEmail);
router.get("/verification/email/:id", UserController.verifyEmailLink);
router.post("/forget", UserController.forgotPassword);
router.post("/verify/otp", UserController.verifyOtp);

// ======================= Checks & Profile =======================
router.get("/check/login", userAuth, UserController.checkLogin);
router.get("/isVerified", userAuth, UserController.checkVerified);
router.get("/profile", userAuth, UserController.getProfile);
router.get("/profile/token", userAuth, UserController.getUserTokens);
router.post("/users/admin/verify", UserController.adminVerify);

module.exports = router;
