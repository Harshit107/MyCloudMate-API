const test = require("node:test");
const assert = require("node:assert");
const AppError = require("../src/utils/appError");

test("AppError factory methods set proper status codes and codes", () => {
  const badReq = AppError.badRequest("Invalid data");
  assert.strictEqual(badReq.statusCode, 400);
  assert.strictEqual(badReq.code, "BAD_REQUEST");

  const unauth = AppError.unauthorized("Not logged in");
  assert.strictEqual(unauth.statusCode, 401);
  assert.strictEqual(unauth.code, "UNAUTHORIZED");

  const forbid = AppError.forbidden("Denied");
  assert.strictEqual(forbid.statusCode, 403);
  assert.strictEqual(forbid.code, "FORBIDDEN");

  const notFound = AppError.notFound("File not found");
  assert.strictEqual(notFound.statusCode, 404);
  assert.strictEqual(notFound.code, "RESOURCE_NOT_FOUND");
});
