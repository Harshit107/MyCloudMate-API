const User = require("../login/model/User");
const QRCode = require("../login/model/QRCode");
const VerificationLink = require("../login/model/VerificationLink");
const ProjectList = require("../modal/ProjectList");
const { v4: uuidv4 } = require("uuid");
const freelyEmail = require("../config/freelyEmail");
const AppError = require("../utils/appError");
const {
  appName,
  appEmail,
  appReplyEmail,
  appVerificationUrl,
} = require("../login/config");

class UserService {
  /**
   * Helper to create verification link
   */
  static async createTemporaryVerificationLink(email) {
    const newVerificationLink = new VerificationLink({ email });
    await newVerificationLink.save();
    return appVerificationUrl + newVerificationLink._id;
  }

  /**
   * Helper to generate 6-digit OTP
   */
  static generateOTP() {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return Number(otp);
  }

  /**
   * Register a new user
   */
  static async registerUser({ email, password, name, phone }, clientIp) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw AppError.conflict("User is already registered with us", "USER_EXISTS");
    }

    const userName = name || email.substring(0, email.indexOf("@"));
    const newUser = new User({ email, password, name: userName, phone });
    newUser.ip = clientIp;
    newUser.lastIP = clientIp;
    await newUser.save();

    let token;
    try {
      token = await newUser.generateToken();

      // Create Default Project
      const defaultProject = new ProjectList({
        projectName: "Default Project",
        userId: newUser._id,
      });
      await defaultProject.save();

      // Send Verification Email
      const temporaryVerificationLink = await this.createTemporaryVerificationLink(email);
      const verificationEmailObject = {
        app: appName,
        recipient: email,
        sender: appEmail,
        replyTo: appReplyEmail,
        subject: "Verify your email - MyCloudMate",
        link: temporaryVerificationLink,
        withValidTime: 60,
      };
      // Send link asynchronously (doesn't block response and won't fail registration if email provider fails)
      try {
        if (freelyEmail && typeof freelyEmail.sendLink === "function") {
          freelyEmail.sendLink(verificationEmailObject).catch((err) => {
            console.error("Failed to send verification email:", err.message);
          });
        }
      } catch (emailErr) {
        console.error("Failed to initiate verification email:", emailErr.message);
      }
    } catch (err) {
      // Cleanup partially created user if subsequent critical steps fail
      await User.findByIdAndDelete(newUser._id);
      throw err;
    }

    return {
      user: newUser,
      token,
      userId: newUser._id,
    };
  }

  /**
   * Login user with email & password
   */
  static async loginUser(email, password, clientIp) {
    const user = await User.findByCredentails(email, password);
    user.ip = clientIp;
    user.lastIP = clientIp;
    const token = await user.generateToken();

    return {
      user,
      token,
    };
  }

  /**
   * QR Code: Generate unique session code
   */
  static async generateQrCode() {
    const uniqueId = uuidv4();
    const newQrCode = new QRCode({ code: uniqueId });
    await newQrCode.save();
    return { code: newQrCode.code };
  }

  /**
   * QR Code: Authenticated device stores token for scanned QR
   */
  static async storeQrToken(code, user) {
    if (!code) {
      throw AppError.badRequest("QR Code is required", "MISSING_QR_CODE");
    }

    const qrRecord = await QRCode.findOne({ code });
    if (!qrRecord) {
      throw AppError.notFound("Invalid or expired QR Code", "INVALID_QR_CODE");
    }

    if (qrRecord.token) {
      throw AppError.badRequest("QR Code has already been claimed", "QR_ALREADY_USED");
    }

    const newToken = await user.generateToken();
    qrRecord.token = newToken;
    await qrRecord.save();

    return { message: "QR Code authenticated successfully" };
  }

  /**
   * QR Code: Polling client claims token
   */
  static async validateQrCode(code) {
    if (!code) {
      throw AppError.badRequest("QR Code is required", "MISSING_QR_CODE");
    }

    const qrRecord = await QRCode.findOne({ code });
    if (!qrRecord) {
      throw AppError.notFound("Invalid or expired QR Code", "INVALID_QR_CODE");
    }

    if (!qrRecord.token) {
      throw AppError.badRequest("Waiting for mobile confirmation", "QR_PENDING");
    }

    const claimedToken = qrRecord.token;
    await QRCode.deleteOne({ _id: qrRecord._id });

    return { token: claimedToken };
  }

  /**
   * Logout current session
   */
  static async logout(user, token) {
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    return { message: "Current session logged out successfully" };
  }

  /**
   * Logout all sessions
   */
  static async logoutAll(user) {
    user.tokens = [];
    await user.save();
    return { message: "All sessions logged out successfully" };
  }

  /**
   * Logout all sessions except current one
   */
  static async logoutAllExceptCurrent(user, currentToken) {
    user.tokens = user.tokens.filter((t) => t.token === currentToken);
    await user.save();
    return { message: "All sessions except current device logged out successfully" };
  }

  /**
   * Logout specific device token
   */
  static async logoutDevice(user, tokenToRemove) {
    if (!tokenToRemove) {
      throw AppError.badRequest("Device token is required", "MISSING_DEVICE_TOKEN");
    }

    const beforeLength = user.tokens.length;
    user.tokens = user.tokens.filter((t) => t.token !== String(tokenToRemove));

    if (user.tokens.length === beforeLength) {
      throw AppError.notFound("Device session not found", "SESSION_NOT_FOUND");
    }

    await user.save();
    return { message: "Device session revoked successfully" };
  }

  /**
   * Resend email verification
   */
  static async sendVerificationEmail(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw AppError.notFound("No user found with this email", "USER_NOT_FOUND");
    }

    const temporaryVerificationLink = await this.createTemporaryVerificationLink(email);
    const verificationEmailObject = {
      app: appName,
      recipient: email,
      sender: appEmail,
      replyTo: appReplyEmail,
      subject: "Verify your email - MyCloudMate",
      link: temporaryVerificationLink,
      withValidTime: 60,
    };

    const emailInfo = await freelyEmail.sendLink(verificationEmailObject);
    return { message: "Verification email sent successfully", emailInfo };
  }

  /**
   * Verify email link
   */
  static async verifyEmailToken(id) {
    const linkDoc = await VerificationLink.findById(id);
    if (!linkDoc) {
      throw AppError.badRequest("Verification link is invalid or expired", "LINK_EXPIRED");
    }

    const user = await User.findOne({ email: linkDoc.email });
    if (!user) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    user.isVerified = true;
    await user.save();
    await VerificationLink.findByIdAndDelete(id);

    return { message: "Email verified successfully" };
  }

  /**
   * Initiate forgot password flow: generates and emails OTP
   */
  static async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw AppError.notFound("No user registered with this email address", "USER_NOT_FOUND");
    }

    const otp = this.generateOTP();
    const emailResult = await freelyEmail.sendOTP({
      app: appName,
      subject: "Reset your password OTP - MyCloudMate",
      recipient: email,
      sender: appEmail,
      replyTo: appReplyEmail,
      otp: String(otp),
      withValidTime: 10,
    });

    if (!emailResult || !emailResult.data) {
      throw AppError.internal("Failed to send OTP email, please try again later", "EMAIL_SEND_FAILED");
    }

    user.otp = otp;
    await user.save();
    return { message: "OTP sent successfully to your email" };
  }

  /**
   * Verify OTP and update password
   */
  static async verifyOtpAndResetPassword(email, otp, newPassword) {
    if (!otp) {
      throw AppError.badRequest("Please enter a valid OTP", "INVALID_OTP");
    }

    if (!newPassword || newPassword.length < 7) {
      throw AppError.badRequest("Password must be at least 7 characters long", "INVALID_PASSWORD");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }

    if (String(user.otp) !== String(otp)) {
      throw AppError.badRequest("Invalid OTP entered", "INVALID_OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    return { message: "Password updated successfully" };
  }

  /**
   * Get user profile
   */
  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User profile not found", "USER_NOT_FOUND");
    }
    return user;
  }

  /**
   * Get user active sessions
   */
  static async getUserTokens(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }
    return user.tokens || [];
  }

  /**
   * Admin verify user email
   */
  static async adminVerify(email) {
    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    if (!user) {
      throw AppError.notFound("User not found", "USER_NOT_FOUND");
    }
    return { message: "User verified successfully by administrator" };
  }
}

module.exports = UserService;
