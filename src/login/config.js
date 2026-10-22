const DOMAINS = require("../config/domain");

const appName = "MyCloudMate";
const appEmail = "MyCloudMate";
const appReplyEmail = DOMAINS.EMAIL.CONTACT_EMAIL;
const appDomain = process.env.APP_DOMAIN || DOMAINS.CLOUD_MATE.APP_DOMAIN;

const isProduction = process.env.NODE_ENV === "production";
const apiBaseUrl =
  process.env.API_BASE_URL ||
  (isProduction
    ? DOMAINS.CLOUD_MATE.API
    : `http://localhost:${process.env.PORT || 3001}`);

const appVerificationUrl =
  process.env.APP_VERIFICATION_URL || `${apiBaseUrl}/users/verification/email/`;

const frontendAuthUrl =
  process.env.FRONTEND_AUTH_URL || `${DOMAINS.CLOUD_MATE.UI}/auth`;

module.exports = {
  appName,
  appEmail,
  appReplyEmail,
  appVerificationUrl,
  appDomain,
  apiBaseUrl,
  frontendAuthUrl,
  DOMAINS,
};