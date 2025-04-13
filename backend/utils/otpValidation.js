const bcrypt = require("bcrypt");
const env = require("dotenv");
const nodemailer = require("nodemailer");
const UserModel = require("../models/user");

env.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password: Request OTP
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    user.resetPasswordOTP = otp;
    user.resetPasswordExpiry = otpExpiry;
    await user.save();

    const emailTemplate = `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Email</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Roboto', sans-serif;
            background-color: #f7f7f7;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
            padding: 20px;
            text-align: center;
          }
          .header h2 {
            margin: 0;
            font-size: 26px;
            letter-spacing: 0.5px;
          }
          .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
          }
          .content span{
            font-weight: bold;
          }
          .content p {
            margin-bottom: 20px;
          }
          .otp-box {
            background-color: #f1f1f1;
            border: 2px dashed #667eea;
            padding: 15px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #667eea;
            cursor: pointer;
            transition: background-color 0.3s ease;
            border-radius: 5px;
          }
          .otp-box:hover {
            background-color: #e0e0e0;
          }
          .footer {
           background: linear-gradient(135deg, #667eea, #764ba2);
            color: #ffffff;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
        </style>
        <script>
          function copyOTP() {
            var otpElement = document.getElementById('otpCode');
            var otp = otpElement.innerText;
            navigator.clipboard.writeText(otp).then(function() {
              alert('OTP copied to clipboard!');
            }, function() {
              alert('Unable to copy OTP.');
            });
          }
        </script>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Forgot Password: Request OTP</h2>
          </div>
          <div class="content">
            <p id="user">Dear <span>${user.name}</span>,</p>
            <p>
              Thank you for choosing our service. Please find your One-Time Password (OTP) below for verification:
            </p>
            <div class="otp-box" onclick="copyOTP()">
              <span id="otpCode">${otp}</span>
            </div>
            <p>
              This code is valid for 15 minutes. Don't share it with anyone to keep your account secure.
            </p>
            <p>
              If you have any questions or require further assistance, please don't hesitate to contact us.
            </p>
            <p>
              Best regards,<br>
              UnitedMess<br>
              Phone: 9052920326<br>
              Email: unitedmess96@gmail.com
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} UnitedMess. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;

    const info = await transporter.sendMail({
      // from: '"UnitedMess 👻" <alamgirislam009@outlook.com>',
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: emailTemplate,
    });

    if (info.messageId) {
      console.log(info);
      console.log(info.messageId);
      return res.status(200).json({ message: "OTP sent to email", info });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// Forgot Password: Validate OTP
const validateOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      user.resetPasswordOTP !== otp ||
      Date.now() > user.resetPasswordExpiry
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP validated", userId: user._id });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

// Forgot Password: Reset Password
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  requestOTP,
  validateOTP,
  resetPassword,
};
