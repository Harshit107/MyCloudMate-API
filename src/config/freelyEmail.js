const freelyEmailModule = require("freely-email");
const DOMAINS = require("./domain");

const FREELY_EMAIL_BASE_URL =
  process.env.FREELY_EMAIL_BASE_URL ||
  DOMAINS.EMAIL.API_V1_EMAILS;

const freelyEmail = freelyEmailModule.FreelyEmailClient
  ? new freelyEmailModule.FreelyEmailClient({ baseURL: FREELY_EMAIL_BASE_URL })
  : freelyEmailModule;

module.exports = freelyEmail;
