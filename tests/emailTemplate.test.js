const test = require("node:test");
const assert = require("node:assert/strict");
const { getFileShareEmailTemplate, escapeHtml } = require("../src/utils/emailTemplate");

test("escapeHtml prevents HTML injection", () => {
  const dangerous = `<script>alert('xss')</script>&"test"`;
  const escaped = escapeHtml(dangerous);
  assert.equal(escaped.includes("<script>"), false);
  assert.equal(escaped.includes("&lt;script&gt;"), true);
  assert.equal(escaped.includes("&quot;test&quot;"), true);
});

test("getFileShareEmailTemplate generates valid dark cyber-teal HTML email", () => {
  const html = getFileShareEmailTemplate({
    fileName: "AnnualReport2026.pdf",
    fileType: "application/pdf",
    fileSize: "4.2 MB",
    downloadUrl: "https://pub-r2.dev/AnnualReport2026.pdf",
    senderName: "Harshit",
    customMessage: "Please review before Monday meeting",
  });

  assert.ok(html.includes("AnnualReport2026.pdf"));
  assert.ok(html.includes("application/pdf"));
  assert.ok(html.includes("4.2 MB"));
  assert.ok(html.includes("https://pub-r2.dev/AnnualReport2026.pdf"));
  assert.ok(html.includes("Please review before Monday meeting"));
  assert.ok(html.includes("MyCloudMate"));
  assert.ok(html.includes("#060913"));
  assert.ok(html.includes("#0ea5e9"));
});
