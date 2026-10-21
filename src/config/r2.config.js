require("dotenv").config();

module.exports = {
  accountId: process.env.R2_ACCOUNT_ID || "4f12985898a25040cca115677e5f254e",
  bucketName: process.env.R2_BUCKET_NAME || "cloudmate",
  accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  endpoint: process.env.R2_ENDPOINT || "https://4f12985898a25040cca115677e5f254e.r2.cloudflarestorage.com",
  publicUrl: process.env.R2_PUBLIC_URL || "",
};
