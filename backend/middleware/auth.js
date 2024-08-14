const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const isVerify = async (req, res, next) => {
  try {
    let { token } = req.cookies;

    // If not found in cookie, then check authorization header (Bearer Token)
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    console.log(req.user);
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid credentials!" });
  }
};

module.exports = isVerify;
