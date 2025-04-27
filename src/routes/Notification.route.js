const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/Notification.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /notification/create:
 *   post:
 *     summary: Tạo thông báo cho tất cả người dùng
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notify_type:
 *                 type: string
 *                 enum: [Khuyến mãi, Tình trạng đơn hàng, Tài khoản, Sản phẩm]
 *                 example: "Khuyến mãi"
 *               notify_title:
 *                 type: string
 *                 example: "Ưu đãi lớn cuối năm"
 *               notify_desc:
 *                 type: string
 *                 example: "Giảm giá 50% cho tất cả sản phẩm đến hết tháng này!"
 *               img:
 *                 type: string
 *                 example: "https://example.com/banner.jpg"
 *               redirect_url:
 *                 type: string
 *                 example: "/promotion"
 *     responses:
 *       200:
 *         description: Tạo thông báo cho tất cả người dùng thành công
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
 *                   example: "Tạo thông báo cho tất cả người dùng thành công"
 *                 data:
 *                   type: integer
 *                   example: 1200
 *       400:
 *         description: Không có người dùng nào trong hệ thống
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/create",
  verifyToken,
  identifyAdmin,
  notificationController.createNotificationForAll
);
/**
 * @swagger
 * /notification/read/{id}:
 *   patch:
 *     summary: Đánh dấu thông báo đã đọc
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của thông báo cần đánh dấu đã đọc
 *         schema:
 *           type: string
 *           example: "66133aa9697e7eae309cf9d7"
 *     responses:
 *       200:
 *         description: Đọc thông báo thành công
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
 *                   example: "Đọc thông báo thành công"
 *       400:
 *         description: Thông báo không tồn tại
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/read/:id", verifyToken, notificationController.readNotification);
/**
 * @swagger
 * /notification/get-detail/{id}:
 *   get:
 *     summary: Lấy chi tiết một thông báo
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của thông báo cần lấy chi tiết
 *         schema:
 *           type: string
 *           example: "66133aa9697e7eae309cf9d7"
 *     responses:
 *       200:
 *         description: Lấy thông tin thông báo thành công
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
 *                   example: "Lấy thông tin thông báo thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66133aa9697e7eae309cf9d7"
 *                     user_id:
 *                       type: string
 *                       example: "660f8e26a2f4db499c8a2580"
 *                     notify_type:
 *                       type: string
 *                       example: "Khuyến mãi"
 *                     notify_title:
 *                       type: string
 *                       example: "Giảm giá đặc biệt!"
 *                     notify_desc:
 *                       type: string
 *                       example: "Mua 1 tặng 1 hôm nay!"
 *                     isRead:
 *                       type: boolean
 *                       example: false
 *                     img:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     redirect_url:
 *                       type: string
 *                       example: "/promotion/123"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-26T14:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-26T14:00:00Z"
 *       400:
 *         description: Thông báo không tồn tại
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get-detail/:id",
  verifyToken,
  notificationController.getNotification
);
/**
 * @swagger
 * /notification/get-user-notifications:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông báo của người dùng thành công
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
 *                   example: "Lấy thông báo của người dùng thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66133aa9697e7eae309cf9d7"
 *                       notify_type:
 *                         type: string
 *                         example: "Khuyến mãi"
 *                       notify_title:
 *                         type: string
 *                         example: "Giảm giá cực sốc hôm nay!"
 *                       notify_desc:
 *                         type: string
 *                         example: "Nhanh tay mua ngay!"
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       img:
 *                         type: string
 *                         example: "https://example.com/img.jpg"
 *                       redirect_url:
 *                         type: string
 *                         example: "/product/123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-26T14:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-26T14:00:00Z"
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get-user-notifications",
  verifyToken,
  notificationController.getUserNotifications
);
router.get("/get-all", verifyToken, notificationController.getAllNotification); // optional for admin
/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Xóa thông báo theo ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của thông báo cần xóa
 *         schema:
 *           type: string
 *           example: "60c72b2f9b1d4d3c9f6e8f00"
 *     responses:
 *       200:
 *         description: Xóa thông báo thành công
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
 *                   example: "Xóa thông báo thành công"
 *       400:
 *         description: Thông báo không tồn tại
 *       403:
 *         description: Bạn không có quyền xóa thông báo này
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:id", verifyToken, notificationController.deleteNotification);
module.exports = router;
