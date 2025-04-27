const express = require("express");
const router = express.Router();
const LoginHistoryController = require("../controllers/LoginHistory.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * tags:
 *   - name: LoginHistory
 *     description: Quản lý lịch sử đăng nhập admin - admin123
 */

/**
 * @swagger
 * /login_history:
 *   get:
 *     summary: Lấy danh sách lịch sử đăng nhập
 *     tags: [LoginHistory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch sử đăng nhập thành công
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
 *                   example: "Lấy danh sách lịch sử đăng nhập thành công"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "662cd8e7f1b134baae10e2c8"
 *                       user_id:
 *                         type: string
 *                         example: "662cd8e7f1b134baae10e2c7"
 *                       role:
 *                         type: string
 *                         example: "admin"
 *                       ip:
 *                         type: string
 *                         example: "192.168.1.1"
 *                       user_agent:
 *                         type: string
 *                         example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-27T10:00:00Z"
 *                       activities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "662cd9a0f1b134baae10e2d0"
 *                             action:
 *                               type: string
 *                               example: "Cập nhật trạng thái đơn hàng"
 *                             order_id:
 *                               type: string
 *                               example: "662cd99cf1b134baae10e2cf"
 *                             prev_status:
 *                               type: string
 *                               example: "Chờ xác nhận"
 *                             new_status:
 *                               type: string
 *                               example: "Đang vận chuyển"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-04-27T10:10:00Z"
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-04-27T10:15:00Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-27T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-04-27T10:05:00Z"
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/",
  verifyToken,
  identifyAdmin,
  LoginHistoryController.getLoginHistory
);

/**
 * @swagger
 * /login_history/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch sử đăng nhập theo ID
 *     tags: [LoginHistory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của lịch sử đăng nhập cần lấy
 *         schema:
 *           type: string
 *           example: "60b3b4bc2c3f2c001f4d65b0"
 *     responses:
 *       200:
 *         description: Lấy chi tiết lịch sử đăng nhập thành công
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
 *                   example: "Lấy chi tiết lịch sử đăng nhập thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "662cd8e7f1b134baae10e2c8"
 *                     user_id:
 *                       type: string
 *                       example: "662cd8e7f1b134baae10e2c7"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     ip:
 *                       type: string
 *                       example: "192.168.1.1"
 *                     user_agent:
 *                       type: string
 *                       example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-27T10:00:00Z"
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "662cd9a0f1b134baae10e2d0"
 *                           action:
 *                             type: string
 *                             example: "Cập nhật trạng thái đơn hàng"
 *                           order_id:
 *                             type: string
 *                             example: "662cd99cf1b134baae10e2cf"
 *                           prev_status:
 *                             type: string
 *                             example: "Chờ xác nhận"
 *                           new_status:
 *                             type: string
 *                             example: "Đang vận chuyển"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-04-27T10:10:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-04-27T10:15:00Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-27T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-04-27T10:05:00Z"
 *       400:
 *         description: Lịch sử đăng nhập không tồn tại
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/:id",
  verifyToken,
  identifyAdmin,
  LoginHistoryController.getLoginHistoryById
);

module.exports = router;
