const Order = require("../models/Order.model");
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
  if (!result) {
    return {
      EC: 1,
      EM: "Tạo thông tin thanh toán không thành công",
    };
  } else {
    const order = await Order.findOne({ order_code: orderCode });
    if (!order) {
      return {
        EC: 1,
        EM: "Không tìm thấy đơn hàng để cập nhật link thanh toán",
      };
    }
    order.checkoutUrl = result.checkoutUrl;
    await order.save();
    return {
      EC: 0,
      EM: "Tạo thông tin thanh toán thành công",
      result,
    };
  }
};

const handleWebhookService = async (data, signature) => {
  const isValid = payOS.verifyPaymentWebhookData(data, signature);
  if (!isValid) {
    return {
      EC: 2,
      EM: "Xác thực đơn hàng không thành công",
      status: 403,
    };
  } else {
    if (data.code === "00" && data.desc === "success") {
      const order = await Order.findOne({ order_code: data.data.orderCode });
      if (!order) {
        return {
          EC: 1,
          EM: "Đơn hàng không tồn tại",
        };
      } else {
        order.is_paid = true;
        await order.save();
        return {
          EC: 0,
          EM: "Xác nhận thanh toán thành công",
        };
      }
    }
    return {
      EC: 3,
      EM: "Thanh toán đơn hàng thất bại",
    };
  }
};

const getInfoOfPaymentService = async (orderCode) => {
  const result = await payOS.getPaymentLinkInformation(orderCode);
  if (!result) {
    return {
      EC: 1,
      EM: "Không tìm thấy thông tin thanh toán",
    };
  } else {
    return {
      EC: 0,
      EM: "Lấy thông tin thanh toán thành công",
      data: result,
    };
  }
};

const deletePaymentService = async (orderCode) => {
  const result = await payOS.cancelPaymentLink(
    orderCode,
    "Người dùng không thực hiện thanh toán hoặc hủy"
  );
  if (!result) {
    return {
      EC: 1,
      EM: "Không tìm thấy thông tin thanh toán",
    };
  } else {
    return {
      EC: 0,
      EM: "Xóa thông tin thanh toán thành công",
      data: result,
    };
  }
};

const checkPaymentIsCancelService = async (orderCode) => {
  const result = await payOS.getPaymentLinkInformation(orderCode);
  if (!result) return false;
  if (result.status === "CANCELLED") return true;
};

module.exports = {
  createPaymentService,
  handleWebhookService,
  getInfoOfPaymentService,
  deletePaymentService,
  checkPaymentIsCancelService,
};
