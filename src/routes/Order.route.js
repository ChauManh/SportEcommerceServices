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
 *       200:
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
 *                   example: "Lấy danh sách đơn hàng thành công"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60b3b4bc2c3f2c001f4d65b0"
 *                       user_id:
 *                         type: string
 *                         example: "60b3b4bc2c3f2c001f4d65af"
 *                       order_status:
 *                         type: string
 *                         example: "Hoàn thành"
 *                       total_price:
 *                         type: number
 *                         example: 150000
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product_id:
 *                               type: string
 *                               example: "60b3b4bc2c3f2c001f4d65b1"
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
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
 *                   example: "Xem chi tiết đơn hàng thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b3b4bc2c3f2c001f4d65b0"
 *                     user_id:
 *                       type: string
 *                       example: "60b3b4bc2c3f2c001f4d65af"
 *                     order_status:
 *                       type: string
 *                       example: "Hoàn thành"
 *                     total_price:
 *                       type: number
 *                       example: 150000
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: string
 *                             example: "60b3b4bc2c3f2c001f4d65b1"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       400:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get-detail/:id",
  optionalVerifyToken,
  orderController.getDetailOrder
);
/**
 * @swagger
 * /order/get-by-user:
 *   get:
 *     summary: Lấy danh sách đơn hàng của người dùng
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: orderStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - all
 *             - Chờ xác nhận
 *             - Đang chuẩn bị hàng
 *             - Đang giao
 *             - Hoàn thành
 *             - Hoàn hàng
 *             - Hủy hàng
 *         description: Trạng thái đơn hàng (mặc định "all")
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng của người dùng
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
 *                   example: "Lấy danh sách đơn hàng thành công"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60b3b4bc2c3f2c001f4d65b0"
 *                       user_id:
 *                         type: string
 *                         example: "60b3b4bc2c3f2c001f4d65af"
 *                       order_status:
 *                         type: string
 *                         example: "Chờ xác nhận"
 *                       total_price:
 *                         type: number
 *                         example: 150000
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product_id:
 *                               type: string
 *                               example: "60b3b4bc2c3f2c001f4d65b1"
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *       400:
 *         description: Mã khách hàng là bắt buộc hoặc Người dùng không tồn tại
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
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: products
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID sản phẩm
 *               color:
 *                 type: string
 *                 description: Màu sản phẩm
 *               variant:
 *                 type: string
 *                 description: Mẫu sản phẩm
 *               quantity:
 *                 type: integer
 *                 description: Số lượng sản phẩm
 *       - in: query
 *         name: shipping_address
 *         required: true
 *         schema:
 *           type: string
 *         description: Địa chỉ giao hàng
 *       - in: query
 *         name: order_payment_method
 *         required: true
 *         schema:
 *           type: string
 *         description: Phương thức thanh toán
 *       - in: query
 *         name: order_note
 *         required: false
 *         schema:
 *           type: string
 *         description: Ghi chú đơn hàng
 *       - in: query
 *         name: discount_ids
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Danh sách ID mã giảm giá
 *     responses:
 *       200:
 *         description: Thông tin xem trước đơn hàng
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
 *                   example: "Xem trước đơn hàng thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "60b3b4bc2c3f2c001f4d65af"
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: string
 *                             example: "60b3b4bc2c3f2c001f4d65b1"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           color:
 *                             type: string
 *                             example: "red"
 *                           variant:
 *                             type: string
 *                             example: "XL"
 *                           product_price:
 *                             type: integer
 *                             example: 150000
 *                     order_total_price:
 *                       type: number
 *                       example: 300000
 *                     order_total_final:
 *                       type: number
 *                       example: 280000
 *                     estimated_delivery_date:
 *                       type: string
 *                       example: "2025-05-10T00:00:00Z"
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
/**
 * @swagger
 * /order/handle-cancel-payment/{orderCode}:
 *   patch:
 *     summary: Hủy đơn hàng khi thanh toán chưa thành công
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng cần hủy
 *     responses:
 *       200:
 *         description: Hủy đơn hàng thành công
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
 *                   example: "Hủy đơn hàng thành công"
 *                 result:
 *                   type: object
 *                   description: Thông tin đơn hàng đã hủy
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/handle-cancel-payment/:orderCode",
  optionalVerifyToken,
  orderController.handleCancelPayment
);
/**
 * @swagger
 * /order/get-revenue:
 *   get:
 *     summary: Lấy thống kê doanh thu theo năm
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Năm cần lấy thống kê doanh thu (ví dụ: 2025)"
 *     responses:
 *       200:
 *         description: Doanh thu theo tháng và trạng thái
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
 *                   example: "Lấy thống kê thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     revenueByMonth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: integer
 *                             description: Tháng trong năm
 *                             example: 1
 *                           completedRevenue:
 *                             type: number
 *                             description: Doanh thu từ các đơn hàng hoàn thành
 *                             example: 500000
 *                           cancelledRevenue:
 *                             type: number
 *                             description: Doanh thu từ các đơn hàng hủy
 *                             example: 200000
 *                           paidRevenue:
 *                             type: number
 *                             description: Doanh thu từ các đơn hàng đã thanh toán
 *                             example: 300000
 *       400:
 *         description: Yêu cầu không hợp lệ, năm không được cung cấp
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get-revenue",
  verifyToken,
  identifyAdmin,
  orderController.getRevenue
);

module.exports = router;
