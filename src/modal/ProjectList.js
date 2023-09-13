const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    isDeleted : {
        type: Boolean,
        default : false,
    }

}, {
    timestamps: true
})

ProjectSchema.virtual('ProjectFiles', {
    ref : 'FileData',
    localField : '_id',
    foreignField : 'projectId'
})

const ProjectList = mongoose.model('ProjectList', ProjectSchema);
module.exports = ProjectList;