const test = require("node:test");
const assert = require("node:assert");
const { storageManager, r2Provider } = require("../src/storage");

test("StorageManager has default CLOUDFLARE_R2 provider registered", () => {
  const provider = storageManager.getProvider("CLOUDFLARE_R2");
  assert.strictEqual(provider, r2Provider);
});

test("StorageManager throws error for unregistered provider", () => {
  assert.throws(
    () => {
      storageManager.getProvider("NON_EXISTENT");
    },
    (err) => err.code === "UNKNOWN_STORAGE_PROVIDER"
  );
});
