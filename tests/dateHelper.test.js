const test = require("node:test");
const assert = require("node:assert");
const { convertDateToString, checkStringMessage } = require("../src/utils/dateHelper");

test("convertDateToString accurately converts timestamps", () => {
  // 2024-05-15 UTC
  const fixedTimestamp = new Date("2024-05-15T12:00:00Z").getTime();
  const formatted = convertDateToString(fixedTimestamp);
  assert.strictEqual(formatted, "15-05-2024");
});

test("checkStringMessage translates jwt malformed message", () => {
  const translated = checkStringMessage("jwt malformed");
  assert.strictEqual(translated, "Device token expired or invalid");
});
