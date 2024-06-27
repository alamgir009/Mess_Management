const bcrypt = require("bcrypt");
const env = require("dotenv");
const UserModel = require("../models/user");
const { Resend } = require("resend");

env.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
          </style>
        </head>
        <body class="bg-gray-100">
          <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div class="text-center bg-gray-800 text-white py-4 rounded-t-lg">
              <h2 class="text-2xl font-semibold">Forgot Password: Request OTP</h2>
            </div>
            <div class="p-6">
              <p class="text-base">
                Dear ${user.name},<br><br>
                Thank you for choosing our service. Please find your One-Time Password (OTP) below for verification:<br><br>
                <strong>OTP: ${otp}</strong><br><br>
                This code is valid for 15 minutes. Don't share it with anyone to keep your account secure.<br><br>
                If you have any questions or require further assistance, please don't hesitate to contact us.<br>
                Best regards,<br><br>
                UnitedMess<br>
                Phone: 9052920326<br>
                Email: alamgirislam009@gmail.com
              </p>
            </div>
            <div class="text-center text-sm text-gray-600 py-4 bg-gray-200 rounded-b-lg">
              <p>&copy; ${new Date().getFullYear()} UnitedMess. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: "unitedmess@resend.dev",
      to: user.email,
      subject: "Your One-Time Password (OTP) for Verification",
      html: emailTemplate,
    });

    return res.status(200).json({ message: "OTP sent to email" });
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
