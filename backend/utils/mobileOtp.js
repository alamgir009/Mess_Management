const { Vonage } = require("@vonage/server-sdk");
const env = require("dotenv");
env.config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const requestMobileOtp = async (req, res) => {
  try {
    let { to } = req.body;
    const from = process.env.VONAGE_BRAND_NAME;
    const text = "A text message sent using the Vonage SMS API";

    // Ensure the phone number is in the correct format
    if (!to.startsWith("+91")) {
      to = `+91${to}`;
    }

    console.log(to);

    const response = await vonage.sms.send({ to, from, text });
    console.log("Message sent successfully:", response);

    return res
      .status(200)
      .json({ message: "Message sent successfully", response });
  } catch (error) {
    console.error("There was an error sending the SMS:", error);
    return res
      .status(500)
      .json({ message: "There was an error sending the SMS", error });
  }
};

const verifyMobileOtp = async (req, res) => {
  try {
    const { requestId, code } = req.body;
    const result = await vonage.verify.check({
      request_id: requestId,
      code: code,
    });

    if (result.status === "0") {
      res.status(200).json({ message: "Verification successful" });
    } else {
      res
        .status(400)
        .json({ message: "Invalid OTP", error: result.error_text });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

module.exports = {
  requestMobileOtp,
  verifyMobileOtp,
};
