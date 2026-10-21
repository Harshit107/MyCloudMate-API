const test = require("node:test");
const assert = require("node:assert");
const {
  validateUserCredentials,
  validateEmail,
  validateProjectInput,
  validateFileInput,
} = require("../src/utils/validator");

test("validateUserCredentials accepts valid email and password", () => {
  const result = validateUserCredentials({
    email: "TEST@domain.com ",
    password: "securePassword123",
  });

  assert.strictEqual(result.email, "test@domain.com");
  assert.strictEqual(result.password, "securePassword123");
});

test("validateUserCredentials throws on invalid email", () => {
  assert.throws(
    () => {
      validateUserCredentials({ email: "invalid-email", password: "securePassword123" });
    },
    (err) => err.code === "INVALID_EMAIL"
  );
});

test("validateUserCredentials throws on short password", () => {
  assert.throws(
    () => {
      validateUserCredentials({ email: "valid@email.com", password: "123" });
    },
    (err) => err.code === "INVALID_PASSWORD"
  );
});

test("validateEmail accepts valid email and normalizes it", () => {
  const result = validateEmail({ email: "  User@Example.COM  " });
  assert.strictEqual(result.email, "user@example.com");
});

test("validateProjectInput rejects empty project names", () => {
  assert.throws(
    () => {
      validateProjectInput({ projectName: "   " });
    },
    (err) => err.code === "INVALID_PROJECT_NAME"
  );
});

test("validateFileInput validates all required file properties", () => {
  const valid = validateFileInput({
    name: "document.pdf",
    projectId: "proj_123",
    type: "PDF",
    downloadUrl: "https://storage.googleapis.com/test/document.pdf",
    size: "1.5Mb",
  });

  assert.strictEqual(valid.name, "document.pdf");
  assert.strictEqual(valid.projectId, "proj_123");
  assert.strictEqual(valid.type, "pdf");
  assert.strictEqual(valid.downloadUrl, "https://storage.googleapis.com/test/document.pdf");
  assert.strictEqual(valid.size, "1.5Mb");
});
