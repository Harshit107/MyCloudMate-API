const express = require('express');
const router = new express.Router();
const userAuth = require('../login/auth/UserAuth');
const ProjectList = require('../modal/ProjectList');



router.post('/create', userAuth, async function (req, res) {

    try {
        const user = req.user;
        const { projectName } = req.body;
        if (!projectName)
            return res.status(400).send({ error: "Enter project name" })

        const newProject = new ProjectList({ userId: user._id, projectName });
        await newProject.save();
        res.status(201).send({ message: "Project created successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }

})

router.get('/get', userAuth, async function (req, res) {

    try {
        const allprojects = await ProjectList.find({ userId: req.user.id });
        res.status(200).send({ message: allprojects });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }
})

router.post('/delete', userAuth, async function (req, res) {

    try {
        const projectId = req.body.projectId
        await ProjectList.findOneAndUpdate({ _id: projectId }, { isDeleted: true });

        // if (!myProject)
        //     return res.status(404).send({ error: 'Project not found' })

        // myProject.isDeleted = true;
        // await myProject.save();
        res.status(200).send({ message: "Project Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error });
    }
})

module.exports = router