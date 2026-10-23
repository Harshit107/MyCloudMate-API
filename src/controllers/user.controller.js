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
    const { frontendAuthUrl } = require("../login/config");

    try {
      await UserService.verifyEmailToken(id);
      return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified - MyCloudMate</title>
  <meta http-equiv="refresh" content="5;url=${frontendAuthUrl}">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top, #0c1a32 0%, #060913 70%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      padding: 20px;
    }
    .card {
      background: #0d1527;
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: 16px;
      padding: 44px 36px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(14, 165, 233, 0.15);
    }
    .badge {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.15);
      border: 2px solid #10b981;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: #10b981;
      font-size: 34px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 24px;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.5px;
    }
    p {
      margin: 0 0 28px;
      font-size: 15px;
      line-height: 1.6;
      color: #94a3b8;
    }
    .btn {
      display: inline-block;
      padding: 13px 34px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    .btn:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
    .countdown {
      margin-top: 20px;
      font-size: 13px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">&#10003;</div>
    <h1>Email Verified Successfully</h1>
    <p>Your MyCloudMate account has been verified. You now have full access to cloud vaults, secure storage, and file sharing.</p>
    <a href="${frontendAuthUrl}" class="btn">Proceed to Sign In &rarr;</a>
    <div class="countdown">Redirecting to sign-in in 5 seconds...</div>
  </div>
</body>
</html>`);
    } catch (err) {
      return res.status(400).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Expired - MyCloudMate</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top, #1e111a 0%, #060913 70%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e2e8f0;
      padding: 20px;
    }
    .card {
      background: #0d1527;
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 16px;
      padding: 44px 36px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(239, 68, 68, 0.15);
    }
    .badge {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid #ef4444;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: #ef4444;
      font-size: 34px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 24px;
      font-weight: 700;
      color: #f8fafc;
    }
    p {
      margin: 0 0 28px;
      font-size: 15px;
      line-height: 1.6;
      color: #94a3b8;
    }
    .btn {
      display: inline-block;
      padding: 13px 34px;
      background: #1e293b;
      border: 1px solid #334155;
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      border-radius: 8px;
    }
    .btn:hover { background: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">&#10005;</div>
    <h1>Link Expired or Invalid</h1>
    <p>${err.message || "This email verification link has expired or is invalid. Please sign in to request a fresh verification link."}</p>
    <a href="${frontendAuthUrl}" class="btn">Return to MyCloudMate</a>
  </div>
</body>
</html>`);
    }
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
