const axios = require("axios");
const crypto = require("crypto");
const payOS = require("../config/PayOS");
const generateSignature = require("../utils/RenerateSignature");
require("dotenv").config();

const createPaymentService = async (amount, description) => {
  const DOMAIN = process.env.DOMAIN;

  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: Number(amount),
    description,
    returnUrl: `${DOMAIN}/checkout`,
    cancelUrl: `${DOMAIN}/checkout`,
  };
  console.log(body);

  try {
    const result = await payOS.createPaymentLink(body);
    return {
      EC: 0,
      EM: "Tạo link thanh toán thành công",
      result,
    };
  } catch (error) {
    console.error("Lỗi tạo payment link:", error);
    return {
      EC: 1,
      EM: error.message,
    };
  }
};

module.exports = createPaymentService;
