const FileService = require("../services/file.service");
const { storageManager } = require("../storage");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { validateFileInput } = require("../utils/validator");

class FileController {
  /**
   * POST /file/presigned-url
   * Generate a presigned Cloudflare R2 upload URL via StorageManager
   */
  static getPresignedUrl = asyncHandler(async (req, res) => {
    const { fileName, fileType, provider } = req.body;
    const result = await storageManager.getPresignedUploadUrl(
      {
        fileName,
        fileType,
        userId: req.user._id,
      },
      provider
    );

    return ApiResponse.success(res, "Presigned upload URL generated successfully", result, 200);
  });

  /**
   * POST /file/create
   */
  static createFile = asyncHandler(async (req, res) => {
    const validatedData = validateFileInput(req.body);
    const file = await FileService.createFile(req.user._id, validatedData);

    return ApiResponse.success(
      res,
      "File metadata saved successfully",
      file,
      201,
      // Backward compatibility field for legacy clients expecting response.file
      { file }
    );
  });

  /**
   * GET /file/get
   */
  static getFiles = asyncHandler(async (req, res) => {
    const files = await FileService.getUserFiles(req.user._id);

    return ApiResponse.success(
      res,
      "Files retrieved successfully",
      files,
      200,
      // Backward compatibility field for legacy clients expecting response.message
      { message: files }
    );
  });

  /**
   * POST /file/delete
   */
  static deleteFile = asyncHandler(async (req, res) => {
    const { fileId } = req.body;
    const result = await FileService.deleteFile(req.user._id, fileId);

    return ApiResponse.success(res, "File deleted successfully", result, 200);
  });
}

module.exports = FileController;
