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

router.get("/", verifyToken, UserController.getUser);
/**
 * @swagger
 * /get_all_user:
 *   get:
 *     summary: Lấy danh sách người dùng (chỉ dành cho Admin)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *       403:
 *         description: Không có quyền truy cập
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
 *                   example: "Password changed successfully"
 *       400:
 *         description: Thiếu thông tin đầu vào hoặc không hợp lệ
 *       401:
 *         description: Mật khẩu cũ không đúng
 *       404:
 *         description: Không tìm thấy người dùng
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
 *                   example: "Cập nhật thông tin thành công!"
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
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EC:
 *                   type: integer
 *                   example: 1
 *                 EM:
 *                   type: string
 *                   example: "Thiếu thông tin cần thiết!"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 EC:
 *                   type: integer
 *                   example: -1
 *                 EM:
 *                   type: string
 *                   example: "Internal server error"
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
 *         description: Lỗi dữ liệu đầu vào
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
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/address", verifyToken, UserController.addAddress);

router.delete("/address/:index", verifyToken, UserController.deleteAddress);

/**
 * @swagger
 * /user/save-discount:
 *   patch:
 *     summary: Lưu mã giảm giá cho người dùng
 *     description: Thêm một mã giảm giá vào danh sách mã giảm giá đã lưu của người dùng.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: string
 *                 example: "660afcabcdef9876"
 *     responses:
 *       200:
 *         description: Lưu mã giảm giá thành công
 *       400:
 *         description: Lỗi đầu vào hoặc mã giảm giá đã tồn tại
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Lỗi máy chủ
 */
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
 *                   example: Get discounts successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-discount", verifyToken, UserController.getDiscountUser);
module.exports = router;
