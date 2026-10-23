/**
 * Custom Application Error Class
 */
class AppError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} statusCode - HTTP status code
   * @param {string} code - Error code identifier
   * @param {any} details - Additional metadata or validation error details
   */
  constructor(message, statusCode = 400, code = "BAD_REQUEST", details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Invalid input or parameters", code = "BAD_REQUEST", details = null) {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = "Authentication required", code = "UNAUTHORIZED", details = null) {
    return new AppError(message, 401, code, details);
  }

  static forbidden(message = "Access denied or action forbidden", code = "FORBIDDEN", details = null) {
    return new AppError(message, 403, code, details);
  }

  static notFound(message = "Resource not found", code = "RESOURCE_NOT_FOUND", details = null) {
    return new AppError(message, 404, code, details);
  }

  static conflict(message = "Resource conflict", code = "CONFLICT", details = null) {
    return new AppError(message, 409, code, details);
  }

  static internal(message = "Internal server error", code = "INTERNAL_SERVER_ERROR", details = null) {
    return new AppError(message, 500, code, details);
  }
}

module.exports = AppError;
