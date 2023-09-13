const mongoose = require('mongoose');


const FileSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },

}, {
    timestamps: true
})

const FileData = mongoose.model('FileData', FileSchema);
module.exports = FileData;