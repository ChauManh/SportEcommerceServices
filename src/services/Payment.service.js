const axios = require("axios");
const payOS = require("../config/PayOS");
require("dotenv").config();

const createPaymentService = async (
  orderCode,
  amount,
  description,
  products
) => {
  const DOMAIN = process.env.DOMAIN;
  const items = products.map((item) => ({
    name: `${item.product_name} ${item.color} Size ${item.variant}`,
    quantity: item.quantity,
    price: item.product_price, // đơn giá
  }));
  const body = {
    orderCode,
    amount,
    description,
    items,
    returnUrl: `${DOMAIN}/checkout`,
    cancelUrl: `${DOMAIN}/checkout`,
  };
  console.log(body);

  const result = await payOS.createPaymentLink(body);
  return result;
};

module.exports = createPaymentService;
