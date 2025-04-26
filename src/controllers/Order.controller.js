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
    return res.InternalError();
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
    return res.InternalError();
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
    return res.InternalError();
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
    return res.InternalError();
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const statusOrder = req.body.status;
    const { userId, role, login_history_id } = req.user;
    if (!orderId || !statusOrder) {
      return res.error(400, "OrderId and status are required");
    }

    const response = await orderService.updateStatus(
      orderId,
      statusOrder,
      userId,
      role,
      login_history_id
    );
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getDetailOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const user = req?.user;
    const response = await orderService.getDetailOrder(orderId, user);

    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const handleCancelPayment = async (req, res) => {
  try {
    const orderCode = req.params.orderCode;
    const { userId, role } = req.user;

    const response = await orderService.handleCancelPaymentService(
      orderCode,
      userId,
      role
    );
    console.log("response", response);
    response.EC === 0
      ? res.success(response.data, response.EM)
      : res.error(response.EC, response.EM);
  } catch (error) {
    return res.InternalError();
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
//     return res.InternalError();
//   }
// }

const getRevenue = async (req, res) => {
  try {
    const year = parseInt(req.query.year);

    const result = await orderService.getRevenue(year);

    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};
module.exports = {
  createOrder,
  getAllOrder,
  getOrderByUser,
  previewOrder,
  updateStatus,
  getDetailOrder,
  handleCancelPayment,
  getRevenue,
  // deleteOrder
};
