const validator = require("validator");
const AppError = require("./appError");

/**
 * Validate user registration / login input
 * @param {object} data
 */
const validateUserCredentials = (data) => {
  if (!data || typeof data !== "object") {
    throw AppError.badRequest("Invalid request body");
  }

  const { email, password } = data;

  if (!email || typeof email !== "string" || !validator.isEmail(email.trim())) {
    throw AppError.badRequest("Please enter a valid email address", "INVALID_EMAIL");
  }

  if (!password || typeof password !== "string" || password.length < 7) {
    throw AppError.badRequest("Password must be at least 7 characters long", "INVALID_PASSWORD");
  }

  return {
    email: email.trim().toLowerCase(),
    password
  };
};

/**
 * Validate email input
 * @param {object} data
 */
const validateEmail = (data) => {
  if (!data || typeof data !== "object") {
    throw AppError.badRequest("Invalid request body");
  }

  const { email } = data;
  if (!email || typeof email !== "string" || !validator.isEmail(email.trim())) {
    throw AppError.badRequest("Please enter a valid email address", "INVALID_EMAIL");
  }

  return { email: email.trim().toLowerCase() };
};

/**
 * Validate project creation input
 * @param {object} data
 */
const validateProjectInput = (data) => {
  if (!data || typeof data !== "object") {
    throw AppError.badRequest("Invalid request body");
  }

  const { projectName } = data;
  if (!projectName || typeof projectName !== "string" || projectName.trim().length === 0) {
    throw AppError.badRequest("Project name is required and cannot be empty", "INVALID_PROJECT_NAME");
  }

  return { projectName: projectName.trim() };
};

/**
 * Validate file creation input
 * @param {object} data
 */
const validateFileInput = (data) => {
  if (!data || typeof data !== "object") {
    throw AppError.badRequest("Invalid request body");
  }

  const { name, projectId, type, downloadUrl, size } = data;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw AppError.badRequest("File name is required", "INVALID_FILE_NAME");
  }

  if (!projectId || typeof projectId !== "string" || projectId.trim().length === 0) {
    throw AppError.badRequest("Project ID is required", "INVALID_PROJECT_ID");
  }

  if (!downloadUrl || typeof downloadUrl !== "string" || downloadUrl.trim().length === 0) {
    throw AppError.badRequest("Download URL is required", "INVALID_DOWNLOAD_URL");
  }

  return {
    name: name.trim(),
    projectId: projectId.trim(),
    type: type ? String(type).trim().toLowerCase() : "unknown",
    downloadUrl: downloadUrl.trim(),
    size: size ? String(size).trim() : "0Kb",
    location: data.location || "cloud"
  };
};

module.exports = {
  validateUserCredentials,
  validateEmail,
  validateProjectInput,
  validateFileInput
};
