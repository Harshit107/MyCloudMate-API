const { r2Provider, R2StorageProvider } = require("../storage");

// Backward-compatibility wrapper for any legacy service references
class R2Service {
  static getClient() {
    return r2Provider.getClient();
  }

  static getPresignedUploadUrl(params) {
    return r2Provider.getPresignedUploadUrl(params);
  }
}

module.exports = R2Service;
