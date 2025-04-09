const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/Payment.controller");
const { verifyToken, verifyPayOSSignature } = require("../middlewares/AuthMiddleWare"); // Middleware xác thực

router.post("/create", verifyToken, PaymentController.createPayment);
router.post("/payos-webhook", verifyPayOSSignature, PaymentController.handleWebhook)
module.exports = router;
