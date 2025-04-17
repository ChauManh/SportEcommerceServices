const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/Payment.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

router.post("/payos-webhook", PaymentController.handleWebhook);
router.get(
  "/info-of-payment/:orderCode",
  verifyToken,
  identifyAdmin,
  PaymentController.getInfoOfPayment
);
router.delete(
  "/",
  verifyToken,
  identifyAdmin,
  PaymentController.deletePayment
);
module.exports = router;
