const UserService = require("../services/user.service");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { validateUserCredentials, validateEmail } = require("../utils/validator");

class UserController {
  /**
   * POST /users/create
   */
  static register = asyncHandler(async (req, res) => {
    const validatedData = validateUserCredentials(req.body);
    const clientIp = req.ip || req.connection.remoteAddress || "127.0.0.1";

    const result = await UserService.registerUser(
      {
        ...req.body,
        email: validatedData.email,
        password: validatedData.password,
      },
      clientIp
    );

    return ApiResponse.success(
      res,
      "User registered successfully",
      {
        user: result.user,
        token: result.token,
        userId: result.userId,
      },
      201,
      // Backward compatibility fields for legacy clients
      {
        user: result.user,
        token: result.token,
        userId: result.userId,
      }
    );
  });

  /**
   * POST /users/login
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = validateUserCredentials(req.body);
    const clientIp = req.ip || req.connection.remoteAddress || "127.0.0.1";

    const result = await UserService.loginUser(email, password, clientIp);

    return ApiResponse.success(
      res,
      "User logged in successfully",
      {
        user: result.user,
        token: result.token,
      },
      200,
      // Backward compatibility fields for legacy clients
      {
        user: result.user,
        token: result.token,
      }
    );
  });

  /**
   * POST /users/login/qr/store
   */
  static createQrCode = asyncHandler(async (req, res) => {
    const result = await UserService.generateQrCode();
    return ApiResponse.success(res, "QR Code generated", result, 200, {
      message: result.code,
    });
  });

  /**
   * POST /users/login/qr/storetoken
   */
  static storeQrToken = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const result = await UserService.storeQrToken(code, req.user);
    return ApiResponse.success(res, result.message, result, 200);
  });

  /**
   * POST /users/login/qr/validate
   */
  static validateQrCode = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const result = await UserService.validateQrCode(code);
    return ApiResponse.success(
      res,
      "User logged in successfully via QR code",
      result,
      200,
      { token: result.token }
    );
  });

  /**
   * POST /users/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const result = await UserService.logout(req.user, req.token);
    return ApiResponse.success(res, result.message, null, 200);
  });

  /**
   * POST /users/logout/all
   */
  static logoutAll = asyncHandler(async (req, res) => {
    const result = await UserService.logoutAll(req.user);
    return ApiResponse.success(res, result.message, null, 200);
  });

  /**
   * POST /users/logout/all/current
   */
  static logoutAllExceptCurrent = asyncHandler(async (req, res) => {
    const result = await UserService.logoutAllExceptCurrent(req.user, req.token);
    return ApiResponse.success(res, result.message, null, 200);
  });

  /**
   * POST /users/logout/device
   */
  static logoutDevice = asyncHandler(async (req, res) => {
    const { token } = req.body;
    const result = await UserService.logoutDevice(req.user, token);
    return ApiResponse.success(res, result.message, null, 200);
  });

  /**
   * POST /users/verification/email
   */
  static sendVerificationEmail = asyncHandler(async (req, res) => {
    const { email } = validateEmail(req.body);
    const result = await UserService.sendVerificationEmail(email);
    return ApiResponse.success(res, result.message, result, 200);
  });

  /**
   * GET /users/verification/email/:id
   */
  static verifyEmailLink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await UserService.verifyEmailToken(id);
    return res.status(200).send("<h1>Email verified successfully</h1>");
  });

  /**
   * POST /users/forget
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = validateEmail(req.body);
    const result = await UserService.forgotPassword(email);
    return ApiResponse.success(res, result.message, null, 202);
  });

  /**
   * POST /users/verify/otp
   */
  static verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;
    const result = await UserService.verifyOtpAndResetPassword(email, otp, password);
    return ApiResponse.success(res, result.message, null, 200);
  });

  /**
   * GET /users/check/login
   */
  static checkLogin = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, "User is authenticated", { isLoggedIn: true }, 200, {
      message: "true",
    });
  });

  /**
   * GET /users/isVerified
   */
  static checkVerified = asyncHandler(async (req, res) => {
    return ApiResponse.success(
      res,
      "Verification status retrieved",
      { isVerified: req.user.isVerified },
      200,
      { message: req.user.isVerified }
    );
  });

  /**
   * GET /users/profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getProfile(req.user._id);
    return ApiResponse.success(res, "User profile retrieved", user, 200, {
      message: user,
    });
  });

  /**
   * GET /users/profile/token
   */
  static getUserTokens = asyncHandler(async (req, res) => {
    const tokens = await UserService.getUserTokens(req.user._id);
    return ApiResponse.success(res, "Active device sessions retrieved", tokens, 200, {
      message: tokens,
    });
  });

  /**
   * POST /users/admin/verify
   */
  static adminVerify = asyncHandler(async (req, res) => {
    const { email } = validateEmail(req.body);
    const result = await UserService.adminVerify(email);
    return ApiResponse.success(res, result.message, null, 200);
  });
}

module.exports = UserController;
