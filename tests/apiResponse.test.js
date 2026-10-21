const test = require("node:test");
const assert = require("node:assert");
const ApiResponse = require("../src/utils/apiResponse");

test("ApiResponse.success formats payload correctly", () => {
  let responseData = null;
  let responseStatus = null;

  const mockRes = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(payload) {
      responseData = payload;
      return this;
    },
  };

  ApiResponse.success(mockRes, "Files fetched", { files: [1, 2] }, 200, { extraProp: "compat" });

  assert.strictEqual(responseStatus, 200);
  assert.strictEqual(responseData.success, true);
  assert.strictEqual(responseData.message, "Files fetched");
  assert.deepStrictEqual(responseData.data, { files: [1, 2] });
  assert.strictEqual(responseData.extraProp, "compat");
});

test("ApiResponse.error formats error payload correctly", () => {
  let responseData = null;
  let responseStatus = null;

  const mockRes = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(payload) {
      responseData = payload;
      return this;
    },
  };

  ApiResponse.error(mockRes, "User not found", "USER_NOT_FOUND", 404, { id: "123" });

  assert.strictEqual(responseStatus, 404);
  assert.strictEqual(responseData.success, false);
  assert.strictEqual(responseData.message, "User not found");
  assert.strictEqual(responseData.error.code, "USER_NOT_FOUND");
  assert.deepStrictEqual(responseData.error.details, { id: "123" });
});
