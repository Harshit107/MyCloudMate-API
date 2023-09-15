const express = require('express');
const router = new express.Router();
const userAuth = require('../login/auth/UserAuth');
const ProjectList = require('../modal/ProjectList');
const User = require('../login/model/User');



router.post('/create', userAuth, async function (req, res) {

    try {
        const user = req.user;
        const { projectName } = req.body;
        if (!projectName)
            return res.status(400).send({ error: "Enter project name" })

        const newProject = new ProjectList({ userId: user._id, projectName });
        await newProject.save();
        res.status(201).send({ message: "Project created successfully", _id : newProject._id });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }

})


router.get('/get', userAuth, async function (req, res) {

    try {
        const allprojects = await ProjectList.find({ userId: req.user.id });
        const activeProjects = allprojects.filter(project => !project.isDeleted);
        const { FileData } = await User.findById(req.user._id).populate('FileData').exec();
        const allFileData = FileData.filter(file => !file.isDeleted);
        
        res.status(200).send({
            message: {
                files : allFileData,
                projects : activeProjects
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }
})

router.post('/delete', userAuth, async function (req, res) {

    try {
        const projectId = req.body.projectId
        await ProjectList.findOneAndUpdate({ _id: projectId }, { isDeleted: true });
        res.status(200).send({ message: "Project Deleted Successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }
})

module.exports = router