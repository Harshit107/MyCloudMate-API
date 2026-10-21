const express = require("express");
const router = new express.Router();
const userAuth = require("../login/auth/UserAuth");
const FileController = require("../controllers/file.controller");

// ======================= File Endpoints =======================
router.post("/presigned-url", userAuth, FileController.getPresignedUrl);
router.post("/create", userAuth, FileController.createFile);
router.get("/get", userAuth, FileController.getFiles);
router.post("/delete", userAuth, FileController.deleteFile);

module.exports = router;
