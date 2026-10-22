const freelyEmailModule = require("freely-email");

const FREELY_EMAIL_BASE_URL =
  process.env.FREELY_EMAIL_BASE_URL ||
  "https://freelyemail-api.harshit107.online/api/v1/emails/";

const freelyEmail = freelyEmailModule.FreelyEmailClient
  ? new freelyEmailModule.FreelyEmailClient({ baseURL: FREELY_EMAIL_BASE_URL })
  : freelyEmailModule;

module.exports = freelyEmail;
