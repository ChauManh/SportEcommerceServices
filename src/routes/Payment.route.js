const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/Payment.controller");

router.post("/payos-webhook", PaymentController.handleWebhook)
module.exports = router;
