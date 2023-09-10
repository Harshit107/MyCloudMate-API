const express = require('express');
const userAuth = require('../login/auth/UserAuth');
const User = require('../login/model/User');
const FileData = require('../modal/FileData');
const router = new express.Router();



router.get('/file', userAuth, async function (req, res) {

    const allFileData = await User.findById(req.user._id).populate('files').exec();
    res.status(200).send({message : allFileData})

});


router.post('/file/upload', userAuth, async function (req, res) {

    const createdFile = new FileData(req.body);
    await createdFile.save();
    res.status(200).send({message : createdFile})

});


