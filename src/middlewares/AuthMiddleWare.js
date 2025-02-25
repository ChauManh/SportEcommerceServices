require("dotenv").config();
const { expressjwt: expressJwt } = require("express-jwt");

const verifyToken = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // Thuật toán mã hóa JWT
  requestProperty: "user", // Lưu thông tin user vào req.user
});

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      EC: 3,
      EM: "Forbidden! Admin access required",
    });
  }
};

module.exports = { verifyToken, isAdmin };
