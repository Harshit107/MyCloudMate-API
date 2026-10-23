const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const r2Config = require("../config/r2.config");
const AppError = require("../utils/appError");

/**
 * Cloudflare R2 Storage Provider (S3-Compatible)
 */
class R2StorageProvider {
  constructor(config = r2Config) {
    this.config = config;
    this.client = null;
  }

  /**
   * Lazily initialize and return the S3Client
   */
  getClient() {
    if (this.client) return this.client;

    if (!this.config.accessKeyId || !this.config.secretAccessKey) {
      throw AppError.badRequest(
        "Cloudflare R2 credentials (R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) are missing in .env",
        "R2_CREDENTIALS_MISSING"
      );
    }

    this.client = new S3Client({
      region: "auto",
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    });

    return this.client;
  }

  /**
   * Generate a presigned PUT URL for direct client upload
   * @param {object} params
   * @param {string} params.fileName - Original file name
   * @param {string} params.fileType - MIME type
   * @param {string} params.userId - Authenticated user ID
   * @param {number} params.expiresIn - URL lifetime in seconds (default: 3600)
   */
  async getPresignedUploadUrl({ fileName, fileType, userId, expiresIn = 3600 }) {
    if (!fileName) {
      throw AppError.badRequest("File name is required", "MISSING_FILENAME");
    }

    const client = this.getClient();
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `users/${userId}/files/${uuidv4()}/${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      ContentType: fileType || "application/octet-stream",
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn });

    let publicDownloadUrl = "";
    if (this.config.publicUrl) {
      const base = this.config.publicUrl.endsWith("/")
        ? this.config.publicUrl.slice(0, -1)
        : this.config.publicUrl;
      publicDownloadUrl = `${base}/${key}`;
    } else {
      publicDownloadUrl = `${this.config.endpoint}/${this.config.bucketName}/${key}`;
    }

    return {
      uploadUrl,
      key,
      publicDownloadUrl,
      bucket: this.config.bucketName,
      provider: "CLOUDFLARE_R2",
    };
  }

  /**
   * Delete an object from the bucket
   * @param {string} key - S3 object key
   */
  async deleteObject(key) {
    if (!key) return;
    const client = this.getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: key,
      })
    );
  }
}

// Export singleton instance
const r2Provider = new R2StorageProvider();
module.exports = {
  R2StorageProvider,
  r2Provider,
};
