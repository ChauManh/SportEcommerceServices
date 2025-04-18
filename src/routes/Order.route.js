const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Order.controller");
const {
  verifyToken,
  identifyAdmin,
  optionalVerifyToken,
} = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /order/create:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "65abcf789123de456f789abc"
 *                 description: ID của người dùng
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       example: "65abcf789123de456f789abc"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               total_price:
 *                 type: number
 *                 example: 500000
 *               payment_method:
 *                 type: string
 *                 enum: [cod, bank_transfer, credit_card]
 *                 example: "cod"
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", optionalVerifyToken, orderController.createOrder);
/**
 * @swagger
 * /order/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all", verifyToken, identifyAdmin, orderController.getAllOrder);
/**
 * @swagger
 * /order/get-detail/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65abcf789123de456f789abc"
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đơn hàng
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-detail/:id", verifyToken, orderController.getDetailOrder);
/**
 * @swagger
 * /order/get-by-user:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-by-user", verifyToken, orderController.getOrderByUser);
/**
 * @swagger
 * /order/preview:
 *   get:
 *     summary: Xem trước đơn hàng trước khi đặt
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin xem trước đơn hàng
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/preview", verifyToken, orderController.previewOrder);
/**
 * @swagger
 * /order/update-status/{id}:
 *   patch:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65abcf789123de456f789abc"
 *         description: ID của đơn hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, canceled]
 *                 example: "shipped"
 *                 description: Trạng thái mới của đơn hàng
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái đơn hàng thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/update-status/:id", verifyToken, orderController.updateStatus);
router.patch(
  "/handle-cancel-payment/:orderCode",
  optionalVerifyToken,
  orderController.handleCancelPayment
);
// router.delete(":orderCode", verifyToken, identifyAdmin, orderController.deleteOrder);
module.exports = router;
