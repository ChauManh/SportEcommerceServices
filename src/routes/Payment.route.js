const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/Payment.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /payment/payos-webhook:
 *   post:
 *     summary: Xử lý webhook từ PayOS khi có sự kiện thanh toán
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Dữ liệu từ PayOS webhook
 *               signature:
 *                 type: string
 *                 description: Chữ ký xác thực từ PayOS
 *     responses:
 *       200:
 *         description: Xử lý webhook thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EC:
 *                   type: integer
 *                   example: 0
 *                 EM:
 *                   type: string
 *                   example: "Xác nhận thanh toán thành công"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu
 *       403:
 *         description: Xác thực chữ ký không thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/payos-webhook", PaymentController.handleWebhook);
/**
 * @swagger
 * /payment/info-of-payment/{orderCode}:
 *   get:
 *     summary: Lấy thông tin thanh toán của đơn hàng
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         required: true
 *         description: Mã đơn hàng cần lấy thông tin thanh toán
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin thanh toán đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EC:
 *                   type: integer
 *                   example: 0
 *                 EM:
 *                   type: string
 *                   example: "Lấy thông tin thanh toán thành công"
 *                 result:
 *                   type: object
 *                   description: Thông tin thanh toán chi tiết của đơn hàng
 *                   properties:
 *                     paymentLink:
 *                       type: string
 *                       description: Đường link thanh toán của đơn hàng
 *                     paymentStatus:
 *                       type: string
 *                       description: Trạng thái thanh toán của đơn hàng
 *                     amount:
 *                       type: number
 *                       description: Số tiền thanh toán của đơn hàng
 *                       example: 150000
 *       400:
 *         description: Đơn hàng không tồn tại hoặc không có thông tin thanh toán
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/info-of-payment/:orderCode",
  verifyToken,
  identifyAdmin,
  PaymentController.getInfoOfPayment
);
router.delete("/", verifyToken, identifyAdmin, PaymentController.deletePayment);
module.exports = router;
