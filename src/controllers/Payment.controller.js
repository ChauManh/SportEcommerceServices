const createPaymentService = require("../services/Payment.service");
const verifyPayOSSignature = require("../middlewares/AuthMiddleWare");
require("dotenv").config();

const paymentController = {
  // Thêm sản phẩm vào giỏ hàng
  async createPayment(req, res) {
    const { amount, description } = req.body;
    try {
      const result = await createPaymentService(amount, description);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async handleWebhook(req, res) {
    const data = req.body;
    try {
      console.log("Webhook received:", data);
      // 👉 TODO: Xử lý logic cập nhật đơn hàng tại đây
      // Ví dụ:
      // 1. Tìm đơn hàng theo orderCode hoặc paymentLinkId
      // 2. Cập nhật trạng thái đơn hàng thành "paid", "cancelled", ...
      // 3. Ghi log, gửi thông báo, v.v.

      // Giả sử bạn dùng MongoDB:
      // await Order.findOneAndUpdate({ orderCode }, { status: 'paid', paymentTime: Date.now() });
      return res.success(data);
    } catch (error) {
      console.error("Error in handleWebhook:", error.message);
      return res.InternalError(error.message);
    }
  },
};

module.exports = paymentController;
