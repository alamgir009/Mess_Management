const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const isVerify = async (req, res, next) => {
  try {
    // Extract token from cookies or authorization header
    let token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    console.log(decoded);

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(500)
      .json({ message: "Server error during authentication!" });
  }
};

module.exports = isVerify;
