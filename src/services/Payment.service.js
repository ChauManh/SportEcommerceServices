const Order = require("../models/Order.Model");
const payOS = require("../config/PayOS");
require("dotenv").config();

const createPaymentService = async (
  orderCode,
  amount,
  description,
  products,
  orderId
) => {
  const DOMAIN = process.env.DOMAIN;
  const items = products.map((item) => ({
    name: `${item.product_name} ${item.color} Size ${item.variant}`,
    quantity: item.quantity,
    price: item.product_price, // đơn giá
  }));
  const body = {
    orderCode,
    amount: 2000,
    description,
    items,
    returnUrl: `${DOMAIN}/orders/order-details/${orderId}`,
    cancelUrl: `${DOMAIN}/checkout`,
  };

  const result = await payOS.createPaymentLink(body);
  return result;
};

const handleWebhookService = async (data, signature) => {
  const isValid = payOS.verifyPaymentWebhookData(data, signature);
  if (!isValid) {
    return {
      EC: 2,
      EM: "Xác thực đơn hàng không thành công",
    };
  } else {
    if (data.code === "00" && data.success) {
      // cập nhật is_paid = true cho đơn hàng
      const order = await Order.findOne({
        where: { order_code: data.orderCode },
      });
      if (!order) {
        return {
          EC: 1,
          EM: "Đơn hàng không tồn tại",
        };
      } else {
        await Order.update(
          { is_paid: true },
          {
            where: { order_code: data.orderCode },
          }
        );
      }
      return {
        EC: 0,
        EM: "Xác nhận thanh toán thành công",
      };
    }
    return {
      EC: 3,
      EM: "Thanh toán đơn hàng thất bại",
    };
  }
};

module.exports = { createPaymentService, handleWebhookService };
