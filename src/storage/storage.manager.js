const { r2Provider } = require("./r2.provider");
const AppError = require("../utils/appError");

/**
 * Storage Manager - Unified storage facade
 */
class StorageManager {
  constructor() {
    this.providers = {
      CLOUDFLARE_R2: r2Provider,
    };
    this.defaultProvider = "CLOUDFLARE_R2";
  }

  /**
   * Register a custom storage provider
   * @param {string} name
   * @param {object} providerInstance
   */
  registerProvider(name, providerInstance) {
    this.providers[name.toUpperCase()] = providerInstance;
  }

  /**
   * Get active provider instance
   * @param {string} providerName
   */
  getProvider(providerName = this.defaultProvider) {
    const provider = this.providers[providerName.toUpperCase()];
    if (!provider) {
      throw AppError.badRequest(`Storage provider '${providerName}' is not registered`, "UNKNOWN_STORAGE_PROVIDER");
    }
    return provider;
  }

  /**
   * Generate presigned URL via the active provider
   */
  async getPresignedUploadUrl(params, providerName = this.defaultProvider) {
    const provider = this.getProvider(providerName);
    return provider.getPresignedUploadUrl(params);
  }
}

const storageManager = new StorageManager();
module.exports = {
  StorageManager,
  storageManager,
};
