const appName = "MyCloudMate";
const appEmail = "MyCloudMate";
const appReplyEmail = "contact@harshit107.online";
const appDomain = process.env.APP_DOMAIN || "mycloudmate.harshit107.online";

const isProduction = process.env.NODE_ENV === "production";
const apiBaseUrl =
  process.env.API_BASE_URL ||
  (isProduction
    ? "https://mycloudmate.api.harshit107.online"
    : `http://localhost:${process.env.PORT || 3001}`);

const appVerificationUrl =
  process.env.APP_VERIFICATION_URL || `${apiBaseUrl}/users/verification/email/`;

const frontendAuthUrl =
  process.env.FRONTEND_AUTH_URL || "https://mycloudmate.harshit107.online/auth";

module.exports = {
  appName,
  appEmail,
  appReplyEmail,
  appVerificationUrl,
  appDomain,
  apiBaseUrl,
  frontendAuthUrl,
};