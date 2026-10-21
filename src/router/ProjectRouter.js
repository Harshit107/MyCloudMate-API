const express = require("express");
const router = new express.Router();
const userAuth = require("../login/auth/UserAuth");
const ProjectController = require("../controllers/project.controller");

// ======================= Project Endpoints =======================
router.post("/create", userAuth, ProjectController.createProject);
router.get("/get", userAuth, ProjectController.getProjects);
router.post("/delete", userAuth, ProjectController.deleteProject);

module.exports = router;