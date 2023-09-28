const express = require('express');
const userAuth = require('../login/auth/UserAuth');
const User = require('../login/model/User');
const FileData = require('../modal/FileData');
const mongoose = require('mongoose');
const ProjectList = require('../modal/ProjectList');
const router = new express.Router();



router.post('/create', userAuth, async function (req, res) {

    try {
        delete req.body.createdAt;
        delete req.body.updatedAt;
        const createdFile = new FileData({ ...req.body, userId: req.user._id });
        await createdFile.save();
        res.status(200).send({ message: "Success", file: createdFile });
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ error });
    }

});

router.get('/get', userAuth, async function (req, res) {

    const allFileData = await User.findById(req.user._id).populate('FileData').exec();

    res.status(200).send({ message: allFileData.FileData })

});


router.post('/delete', userAuth, async function (req, res) {

    try {
        const fileId = req.body.fileId;
        if (!fileId)
            return res.status(404).send({ error: 'File not found' });

        const allFileData = await FileData.findByIdAndUpdate(fileId, { isDeleted: true })
        res.status(200).send({ message: allFileData })

    } catch (error) {
        console.log(error.message);
        res.status(400).send({ error })
    }

});


module.exports = router;


