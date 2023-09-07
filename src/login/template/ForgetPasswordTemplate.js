module.exports  = template = (link) => {
  return  `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
        <style>
          /* Reset some default styles */
          body,
          body * {
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }

          /* Styles for the email container */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f2f2f2;
          }

          /* Heading styles */
          h1 {
            color: #333333;
            margin-bottom: 20px;
          }

          /* Button styles */
          .reset-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
            width: fit-content;
          }

          /* Footer styles */
          .footer {
            margin-top: 20px;
            color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>Forgot Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
          <p>To reset your password, please click the following link:</p>
          <p style="text-align: center;">
            <a href=${link} class="reset-button">Reset Password</a>
          </p>
          <p class="footer">If you have any questions, please contact our support team.</p>
        </div>
      </body>
      </html>

  `;
};

