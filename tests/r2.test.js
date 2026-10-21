const test = require("node:test");
const assert = require("node:assert");
const r2Config = require("../src/config/r2.config");

test("r2Config loads bucket and endpoint correctly", () => {
  assert.strictEqual(r2Config.bucketName, "cloudmate");
  assert.strictEqual(
    r2Config.endpoint,
    "https://4f12985898a25040cca115677e5f254e.r2.cloudflarestorage.com"
  );
  assert.strictEqual(r2Config.accountId, "4f12985898a25040cca115677e5f254e");
});
