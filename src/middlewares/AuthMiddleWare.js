require("dotenv").config();
const { expressjwt: expressJwt } = require("express-jwt");
const crypto = require("crypto");

const verifyToken = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // Thuật toán mã hóa JWT
  requestProperty: "user", // Lưu thông tin user vào req.user
});

const identifyAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      EC: 3,
      EM: "Forbidden! Admin access required",
    });
  }
};

const verifyPayOSSignature = (req, res, next) => {
  try {
    const signature = req.headers["x-payos-signature"];
    console.log("Headers:", req.headers);
    if (!signature) {
      return res.error(1, "Missing signature", 400);
    }

    const rawBody = JSON.stringify(req.body);
    const hmac = crypto.createHmac("sha256", process.env.PAYOS_CHECKSUM_KEY);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      console.log("Invalid signature");
      res.error(1, "Invalid signature", 400);
    }

    console.log("Signature verified");
    next(); // Tiếp tục đến controller xử lý webhook
  } catch (error) {
    console.error("Signature verification error:", error);
    return res.InternalError(error.message);
  }
};

module.exports = { verifyToken, identifyAdmin, verifyPayOSSignature };
