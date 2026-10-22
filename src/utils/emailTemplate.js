/**
 * Email template generators for MyCloudMate
 * Optimized for broad email client compatibility (Gmail, Outlook, Apple Mail)
 * Using dark obsidian and cyber-teal styling.
 */

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate a responsive, dark-mode email template for shared files
 * @param {object} params
 * @param {string} params.fileName - Name of the file
 * @param {string} params.fileType - MIME type or extension
 * @param {string} params.fileSize - Formatted size (e.g. "12.4 MB")
 * @param {string} params.downloadUrl - Download or view link
 * @param {string} [params.senderName] - Name or email of sender
 * @param {string} [params.customMessage] - Optional custom message from sender
 * @returns {string} Fully formatted HTML string
 */
function getFileShareEmailTemplate({
  fileName,
  fileType = "file",
  fileSize = "N/A",
  downloadUrl,
  senderName = "A MyCloudMate User",
  customMessage = "",
}) {
  const safeFileName = escapeHtml(fileName);
  const safeFileType = escapeHtml(fileType);
  const safeFileSize = escapeHtml(fileSize);
  const safeSenderName = escapeHtml(senderName);
  const safeCustomMessage = escapeHtml(customMessage);
  const safeDownloadUrl = escapeHtml(downloadUrl);

  const customMessageBlock = safeCustomMessage
    ? `
      <tr>
        <td style="padding: 16px 24px; background-color: #131e36; border-left: 3px solid #0ea5e9; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #cbd5e1; line-height: 1.5;">
            &ldquo;${safeCustomMessage}&rdquo;
          </p>
        </td>
      </tr>
      <tr><td height="20" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
    `
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>File Shared with You - MyCloudMate</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #060913; }
    @media screen and (max-width: 600px) {
      .responsive-table { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060913; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Background wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #060913;">
    <tr>
      <td align="center" style="padding: 40px 15px 40px 15px;">
        <!-- Card Container (max-width 580px) -->
        <table border="0" cellpadding="0" cellspacing="0" width="580" class="responsive-table" style="max-width: 580px; width: 100%; background-color: #0d1527; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Top Accent Gradient Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #0ea5e9 0%, #14b8a6 50%, #6366f1 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 30px 20px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <span style="font-size: 20px; font-weight: 800; color: #f8fafc; letter-spacing: -0.5px;">
                      MyCloudMate
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #38bdf8; background-color: rgba(14, 165, 233, 0.12); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 20px; padding: 4px 12px;">
                      Secure Share
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td height="1" style="background-color: #1e293b; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 30px 20px 30px;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="color: #f8fafc; font-size: 20px; font-weight: 700; line-height: 1.3; padding-bottom: 8px;">
                    A file was shared with you
                  </td>
                </tr>
                <tr>
                  <td style="color: #94a3b8; font-size: 14px; line-height: 1.6; padding-bottom: 24px;">
                    <strong style="color: #e2e8f0;">${safeSenderName}</strong> has shared a file with you through MyCloudMate Cloud Vault.
                  </td>
                </tr>

                <!-- Optional Custom Sender Message -->
                ${customMessageBlock}

                <!-- File Information Card -->
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111c35; border: 1px solid #1e3a5f; border-radius: 8px; padding: 20px;">
                      <tr>
                        <td>
                          <!-- File Name -->
                          <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">File Name</div>
                          <div style="font-size: 16px; font-weight: 700; color: #38bdf8; word-break: break-all; margin-bottom: 16px;">
                            ${safeFileName}
                          </div>

                          <!-- File Metadata Row -->
                          <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td width="50%" valign="top">
                                <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Type</div>
                                <div style="font-size: 13px; color: #cbd5e1; font-weight: 500;">${safeFileType}</div>
                              </td>
                              <td width="50%" valign="top">
                                <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Size</div>
                                <div style="font-size: 13px; color: #cbd5e1; font-weight: 500;">${safeFileSize}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Spacer -->
                <tr><td height="28" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #0ea5e9;">
                          <a href="${safeDownloadUrl}" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 8px; border: 1px solid #38bdf8; letter-spacing: 0.3px;">
                            Download File &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Direct link text for accessibility -->
                <tr>
                  <td align="center" style="padding-top: 18px; color: #64748b; font-size: 12px; line-height: 1.5;">
                    Or copy and paste this link into your browser:<br />
                    <a href="${safeDownloadUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline; word-break: break-all;">
                      ${safeDownloadUrl}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td height="12" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px 28px 30px; background-color: #090f1d; border-top: 1px solid #1e293b;" class="mobile-padding">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="color: #64748b; font-size: 12px; line-height: 1.6;">
                    This file was shared using <strong style="color: #94a3b8;">MyCloudMate</strong> secure cloud storage.<br />
                    Questions? Contact us at <a href="mailto:contact@harshit107.online" style="color: #38bdf8; text-decoration: none;">contact@harshit107.online</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px; color: #475569; font-size: 11px;">
                    &copy; ${new Date().getFullYear()} MyCloudMate. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  getFileShareEmailTemplate,
  escapeHtml,
};
