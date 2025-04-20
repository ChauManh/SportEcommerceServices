const { rawListeners } = require("../models/Product.model");
const orderService = require("../services/Order.service");

const createOrder = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    const newOrder = { ...req.body };
    // console.log(newOrder);
    const response = await orderService.createOrder(newOrder, userId);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const { orderStatus } = req.query;

    if (!orderStatus) {
      return res.error(400, "Order Status is required");
    }

    const response = await orderService.getAllOrder(orderStatus);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const { orderStatus } = req.query;
    const { userId } = req.user;
    if (!userId || !orderStatus) {
      return res.error(400, "Order status and userId are required");
    }

    const response = await orderService.getOrderByUser(userId, orderStatus);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const previewOrder = async (req, res) => {
  try {
    const newOrder = req.body;
    const { userId } = req.user;
    const response = await orderService.previewOrder(newOrder, userId);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const statusOrder = req.body.status;
    const { userId, role } = req.user;
    if (!orderId || !statusOrder) {
      return res.error(400, "OrderId and status are required");
    }

    const response = await orderService.updateStatus(
      orderId,
      statusOrder,
      userId,
      role
    );
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const getDetailOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { userId } = req.user;

    if (!orderId) {
      return res.error(400, "OrderId is required");
    }

    const response = await orderService.getDetailOrder(orderId);

    if (response.EC !== 0) {
      return res.error(response.EC, response.EM);
    }

    const order = response.data;

    // Kiểm tra quyền truy cập: chỉ chủ đơn hàng hoặc admin mới được xem
    if (order.user_id.toString() !== userId && req.user.role !== "admin") {
      return res.error(403, "You are not allowed to view this order");
    }

    return res.success(order, "Get order detail successfully");
  } catch (error) {
    return res.InternalError(error.message);
  }
};

const handleCancelPayment = async (req, res) => {
  try {
    const orderCode = req.params.orderCode;
    const { userId, role } = req.user;

    const response = await orderService.handleCancelPaymentService(orderCode, userId, role);
    console.log("response", response);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError(error.message);
  }
};

// const deleteOrder = async (req, res) => {
//   try {
//     const { orderCode } = req.params;
//     const { userId } = req.user;

//     if (!orderId) {
//       return res.error(400, "OrderId is required");
//     }

//     const response = await orderService.deleteOrderService(orderCode);
//     response.EC === 0
//       ? res.success(response.data, response.EM)
//       : res.error(response.EC, response.EM);
//   } catch (error) {
//     return res.InternalError(error.message);
//   }
// }

module.exports = {
  createOrder,
  getAllOrder,
  getOrderByUser,
  previewOrder,
  updateStatus,
  getDetailOrder,
  handleCancelPayment,
  // deleteOrder
};
