/**
 * Standardized API Response Helper
 */
class ApiResponse {
  /**
   * Send a standardized success response
   * @param {import('express').Response} res
   * @param {string} message - Human-readable success message
   * @param {any} data - Response payload
   * @param {number} statusCode - HTTP status code (default 200)
   * @param {object} extra - Optional backward compatibility or extra fields
   */
  static success(res, message = "Request completed successfully", data = {}, statusCode = 200, extra = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...extra
    });
  }

  /**
   * Send a standardized error response
   * @param {import('express').Response} res
   * @param {string} message - Human-readable error description
   * @param {string} code - Machine-readable error code (e.g. UNAUTHORIZED, NOT_FOUND)
   * @param {number} statusCode - HTTP status code (default 400)
   * @param {any} details - Optional error details (e.g. validation errors)
   */
  static error(res, message = "An error occurred", code = "BAD_REQUEST", statusCode = 400, details = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: {
        code,
        details
      }
    });
  }
}

module.exports = ApiResponse;
