const FileData = require("../modal/FileData");
const ProjectList = require("../modal/ProjectList");
const AppError = require("../utils/appError");

class FileService {
  /**
   * Save metadata for an uploaded file
   * @param {string} userId
   * @param {object} fileData
   */
  static async createFile(userId, fileData) {
    const { name, projectId, type, downloadUrl, size, location } = fileData;

    // Verify target project exists and belongs to user
    const project = await ProjectList.findOne({ _id: projectId, userId, isDeleted: false });
    if (!project) {
      throw AppError.notFound("Target project does not exist or unauthorized", "PROJECT_NOT_FOUND");
    }

    const createdFile = new FileData({
      userId,
      projectId,
      name,
      type: type || "file",
      downloadUrl,
      size: size || "0Kb",
      location: location || "cloud",
      isDeleted: false,
    });

    await createdFile.save();
    return createdFile;
  }

  /**
   * Get all active files for user
   * @param {string} userId
   */
  static async getUserFiles(userId) {
    const files = await FileData.find({ userId, isDeleted: false }).sort({ createdAt: -1 });
    return files;
  }

  /**
   * Soft-delete a file with ownership verification
   * @param {string} userId
   * @param {string} fileId
   */
  static async deleteFile(userId, fileId) {
    if (!fileId) {
      throw AppError.badRequest("File ID is required", "MISSING_FILE_ID");
    }

    const file = await FileData.findOne({ _id: fileId, userId, isDeleted: false });
    if (!file) {
      throw AppError.notFound("File not found or unauthorized", "FILE_NOT_FOUND");
    }

    file.isDeleted = true;
    await file.save();

    return {
      fileId: file._id,
      name: file.name,
      isDeleted: true,
    };
  }
}

module.exports = FileService;
