const User = require("../model/user_Model");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

const AuthUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Get token from header
      const token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get User From token
      const verified_user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.json({
        status: 500,
        message: "Not authorized, Please add token",
        info: error.message,
      });
    }
  }

  if (!token) {
    res.json({
      status: 404,
      message: "Not authorized, no token",
    });
  }
};

module.exports = { AuthUser };
