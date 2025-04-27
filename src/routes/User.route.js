const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.Controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Quản lý người dùng (Admin)
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     description: Lấy thông tin người dùng dựa trên ID người dùng trong token. Token phải được gửi trong header Authorization.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
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
 *                   example: "Lấy thông tin người dùng thành công"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "609c72ef1b7e8d63f0572c7d"
 *                     username:
 *                       type: string
 *                       example: "test"
 *                     email:
 *                       type: string
 *                       example: "test@gmail.com"
 *                     name:
 *                       type: string
 *                       example: "test"
 *       400:
 *         description: Không tìm thấy người dùng
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", verifyToken, UserController.getUser);
/**
 * @swagger
 * /get_all_user:
 *   get:
 *     summary: Lấy tất cả người dùng
 *     description: Lấy danh sách tất cả người dùng trong hệ thống (không bao gồm admin).
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
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
 *                   example: "Lấy tất cả người dùng thành công"
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "609c72ef1b7e8d63f0572c7d"
 *                       username:
 *                         type: string
 *                         example: "user1"
 *                       email:
 *                         type: string
 *                         example: "user1@example.com"
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/get_all_user",
  verifyToken,
  identifyAdmin,
  UserController.getAllUsers
);
/**
 * @swagger
 * /user/change_password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     description: API cho phép người dùng đổi mật khẩu bằng cách nhập mật khẩu cũ và mật khẩu mới.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu cũ của tài khoản
 *                 example: "oldpassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới để thay thế mật khẩu cũ
 *                 example: "newpassword456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Mật khẩu cũ không chính xác
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/change_password", verifyToken, UserController.changePassword);
/**
 * @swagger
 * /user/:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               email:
 *                 type: string
 *                 example: "nguyenvana@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.jpg"
 *               address:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
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
 *                   example: "Thay đổi thông tin thành công!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65a3d79f98b4f42a4c8d5a72"
 *                     name:
 *                       type: string
 *                       example: "Nguyen Van A"
 *                     email:
 *                       type: string
 *                       example: "nguyenvana@gmail.com"
 *                     phone:
 *                       type: string
 *                       example: "0123456789"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     address:
 *                       type: string
 *                       example: "123 Đường ABC, Quận 1, TP.HCM"
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/", verifyToken, UserController.updateUser);
/**
 * @swagger
 * /user/address/{index}:
 *   patch:
 *     summary: Cập nhật địa chỉ theo index
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: Chỉ mục của địa chỉ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Updated"
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *       400:
 *         description: Không tìm thấy địa chỉ
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/address/:index", verifyToken, UserController.updateAddress);
/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Thêm địa chỉ mới
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - province
 *               - district
 *               - commune
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               home_address:
 *                 type: string
 *                 example: "123 Đường ABC"
 *               province:
 *                 type: string
 *                 example: "Hà Nội"
 *               district:
 *                 type: string
 *                 example: "Hoàn Kiếm"
 *               commune:
 *                 type: string
 *                 example: "Hàng Bạc"
 *               is_default:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Thêm địa chỉ thành công
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/address", verifyToken, UserController.addAddress);
/**
 * @swagger
 * /user/address/{index}:
 *   delete:
 *     summary: Xóa địa chỉ người dùng
 *     description: Xóa một địa chỉ người dùng tại vị trí chỉ định trong mảng địa chỉ. Nếu địa chỉ xóa là mặc định, một địa chỉ mới sẽ được chọn làm mặc định.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         description: Vị trí của địa chỉ trong mảng địa chỉ người dùng
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
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
 *                   example: "Xóa địa chỉ thành công"
 *       400:
 *         description: Địa chỉ không tồn tại
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/address/:index", verifyToken, UserController.deleteAddress);
router.patch("/save-discount", verifyToken, UserController.saveDiscount);

/**
 * @swagger
 * /user/get-discount:
 *   get:
 *     summary: Lấy danh sách mã giảm giá đã lưu của người dùng
 *     description: Trả về danh sách các mã giảm giá mà người dùng đã lưu trước đó.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách mã giảm giá
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
 *                   example: Lấy mã giảm giá thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-discount", verifyToken, UserController.getDiscountUser);
/**
 * @swagger
 * /user/delete-search-history/{index}:
 *   delete:
 *     summary: Xóa lịch sử tìm kiếm của người dùng
 *     description: Xóa một mục trong lịch sử tìm kiếm của người dùng tại vị trí chỉ định trong mảng lịch sử tìm kiếm.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     parameters:
 *       - in: path
 *         name: index
 *         required: true
 *         description: Vị trí của mục trong lịch sử tìm kiếm của người dùng
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Xóa lịch sử tìm kiếm thành công
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
 *                   example: "Xóa tìm kiếm thành công."
 *       400:
 *         description: Dữ liệu yêu cầu không hợp lệ
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/delete-search-history/:index",
  verifyToken,
  UserController.deleteSearchHistory
);
/**
 * @swagger
 * /user/get-chat-history:
 *   get:
 *     summary: Lấy lịch sử chat của người dùng
 *     description: Lấy toàn bộ lịch sử chat của người dùng dựa trên userId trong token. Token phải được gửi trong header Authorization.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     responses:
 *       200:
 *         description: Lấy lịch sử chat thành công
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
 *                   example: "Lấy lịch sử chat thành công."
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
 *                         type: string
 *                         example: "user"
 *                       content:
 *                         type: string
 *                         example: "Hello, how are you?"
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-27T12:00:00Z"
 *       400:
 *         description: Không có đoạn chat của user này.
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-chat-history", verifyToken, UserController.getChatHistory);
/**
 * @swagger
 * /user/delete-chat-history:
 *   delete:
 *     summary: Xóa lịch sử chat của người dùng
 *     description: Xóa toàn bộ lịch sử chat của người dùng dựa trên userId trong token. Token phải được gửi trong header Authorization.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # Yêu cầu bearer token trong header
 *     responses:
 *       200:
 *         description: Xóa lịch sử chat thành công
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
 *                   example: "Xóa đoạn chat thành công."
 *       400:
 *         description: Không có đoạn chat của user này
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/delete-chat-history",
  verifyToken,
  UserController.deleteChatHistory
);
module.exports = router;
