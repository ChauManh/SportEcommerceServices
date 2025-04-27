const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/Feedback.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Tạo feedback mới
 *     description: Người dùng có thể gửi feedback kèm ảnh/video cho sản phẩm đã mua.
 *     tags:
 *       - Feedback
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - order_id
 *               - user_id
 *               - content
 *               - rating
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm
 *               order_id:
 *                 type: string
 *                 description: ID của đơn hàng
 *               user_id:
 *                 type: string
 *                 description: ID của người dùng
 *               content:
 *                 type: string
 *                 description: Nội dung feedback
 *               rating:
 *                 type: integer
 *                 description: Số sao đánh giá (1-5)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Hình ảnh đính kèm
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Video đính kèm
 *     responses:
 *       200:
 *         description: Đánh giá thành công
 *       400:
 *         description: Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi! || Feedback chứa nội dung k phù hợp
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", verifyToken, feedbackController.createFeedback);
/**
 * @swagger
 * /feedback/{id}:
 *   patch:
 *     summary: Cập nhật feedback
 *     description: Người dùng có thể chỉnh sửa feedback của mình
 *     tags:
 *       - Feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của feedback cần cập nhật
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung feedback mới
 *               rating:
 *                 type: integer
 *                 description: Số sao đánh giá mới
 *               replied_by_admin:
 *                 type: string
 *                 description: Phản hồi từ admin (nếu có)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Ảnh cập nhật
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Video cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật đánh giá thành công
 *       400:
 *         description: Đánh giá không tồn tại
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/update/:id", verifyToken, identifyAdmin, feedbackController.updateFeedback);
/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Xóa feedback
 *     description: Người dùng có thể xóa feedback của mình
 *     tags:
 *       - Feedback
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của feedback cần xóa
 *     responses:
 *       200:
 *         description: Xóa đánh giá thành công
 *       400:
 *         description: Đánh giá không tồn tại
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete/:id", verifyToken, identifyAdmin, feedbackController.deleteFeedback);
/**
 * @swagger
 * /feedback/product/{productId}:
 *   get:
 *     summary: Lấy danh sách feedback của sản phẩm
 *     description: API để lấy tất cả feedback của một sản phẩm dựa trên productId.
 *     tags:
 *       - Feedback
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần lấy feedback
 *         example: "65abcf789123de456f789abc"
 *     responses:
 *       200:
 *         description: Lấy danh sách feedback thành công
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
 *                   example: "Lấy thông tin đánh giá thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       feedback_id:
 *                         type: string
 *                         example: "65abcd56789de456f789xyz"
 *                       user_id:
 *                         type: string
 *                         example: "65abcdef1234de456f789ghi"
 *                       content:
 *                         type: string
 *                         example: "Sản phẩm rất tốt!"
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       feedback_media:
 *                         type: object
 *                         properties:
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                           videos:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/video.mp4"]
 *       400:
 *         description: Sản phẩm không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all/:productId", feedbackController.getAllFeedback);
module.exports = router;
