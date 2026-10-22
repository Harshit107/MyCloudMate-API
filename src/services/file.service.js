const FileData = require("../modal/FileData");
const ProjectList = require("../modal/ProjectList");
const AppError = require("../utils/appError");
const freelyEmail = require("../config/freelyEmail");
const { appName, appEmail, appReplyEmail } = require("../login/config");
const { getFileShareEmailTemplate } = require("../utils/emailTemplate");
const { validateEmail } = require("../utils/validator");

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

  /**
   * Share file via email with recipient
   * @param {object} user - Authenticated user object
   * @param {object} params
   * @param {string} params.recipient - Target email
   * @param {string} [params.fileId] - File ID
   * @param {string} [params.fileName] - Fallback name
   * @param {string} [params.fileType] - Fallback type
   * @param {string} [params.fileSize] - Fallback size
   * @param {string} [params.link] - Direct download link
   * @param {string} [params.customMessage] - Optional message
   */
  static async shareFileViaEmail(user, { recipient, fileId, fileName, fileType, fileSize, link, customMessage }) {
    const { email: normalizedRecipient } = validateEmail({ email: recipient });

    let targetName = fileName;
    let targetType = fileType || "file";
    let targetSize = fileSize || "N/A";
    let targetLink = link;

    if (fileId) {
      const file = await FileData.findOne({ _id: fileId, userId: user._id, isDeleted: false });
      if (file) {
        targetName = file.name || targetName;
        targetType = file.type || targetType;
        targetSize = file.size || targetSize;
        targetLink = file.downloadUrl || targetLink;
      }
    }

    if (!targetLink) {
      throw AppError.badRequest("A valid download link or file ID is required", "MISSING_DOWNLOAD_LINK");
    }

    console.log(`[FileShare] User "${user.email}" sharing "${targetName}" (link: ${targetLink}) with "${normalizedRecipient}"`);

    const htmlContent = getFileShareEmailTemplate({
      fileName: targetName || "Shared File",
      fileType: targetType,
      fileSize: targetSize,
      downloadUrl: targetLink,
      senderName: user.name || user.email,
      customMessage,
    });

    const emailResult = await freelyEmail.sendEmail({
      app: appName,
      sender: appEmail,
      replyTo: appReplyEmail,
      recipient: normalizedRecipient,
      subject: `[MyCloudMate] ${user.name || "A user"} shared "${targetName || "a file"}" with you`,
      message: `A file has been shared with you on MyCloudMate:\nFile Name: ${targetName}\nSize: ${targetSize}\nDownload Link: ${targetLink}`,
      HTMLfile: htmlContent,
    });

    if (!emailResult || !emailResult.data) {
      throw AppError.internal("Failed to dispatch share email, please try again", "EMAIL_DISPATCH_FAILED");
    }

    return {
      recipient: normalizedRecipient,
      fileName: targetName,
      messageId: emailResult.data?.messageId,
    };
  }
}

module.exports = FileService;
