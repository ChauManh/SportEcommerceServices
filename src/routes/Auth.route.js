const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
const { verifyToken } = require("../middlewares/AuthMiddleWare");
/**
 * @swagger
 * /auth/sign_in:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: API cho phép người dùng đăng ký tài khoản mới với user_name, email và password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Đăng ký thành công
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
 *                   example: "User created successfully"
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc tài khoản đã tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/sign_in", AuthController.createUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     description: API cho phép người dùng đăng nhập bằng user_name hoặc email và password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Tên người dùng hoặc email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của tài khoản
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token xác thực
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
 *                   example: "Logged in successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Sai thông tin đăng nhập (username hoặc password không đúng)
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/login", AuthController.loginUser);
/**
 * @swagger
 * /auth/send_otp:
 *   post:
 *     summary: Gửi mã OTP qua email
 *     description: API gửi mã OTP đến email của người dùng để xác thực trước khi đặt lại mật khẩu.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: chaumanh1108@gmail.com
 *     responses:
 *       200:
 *         description: OTP đã được gửi thành công
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
 *                   example: "OTP sent successfully"
 *       400:
 *         description: Email không tồn tại hoặc lỗi đầu vào
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/send_otp", AuthController.sendOTP);
/**
 * @swagger
 * /auth/verify_otp:
 *   post:
 *     summary: Xác thực mã OTP
 *     description: API cho phép người dùng nhập mã OTP để xác thực email trước khi đặt lại mật khẩu.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: johndoe@example.com
 *               otp:
 *                 type: string
 *                 description: Mã OTP đã được gửi đến email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP xác thực thành công
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
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Mã OTP không hợp lệ hoặc đã hết hạn
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/verify_otp", AuthController.verifyOtp);
/**
 * @swagger
 * /auth/reset_password:
 *   patch:
 *     summary: Đặt lại mật khẩu
 *     description: API cho phép người dùng đặt lại mật khẩu sau khi đã xác thực OTP thành công.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: johndoe@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới của tài khoản
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
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
 *                   example: "Password reset successfully"
 *       400:
 *         description: OTP chưa được xác thực hoặc dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/reset_password", AuthController.resetPassword);
/**
 * @swagger
 * /auth/change_password:
 *   patch:
 *     summary: Đổi mật khẩu
 *     description: API cho phép người dùng đổi mật khẩu bằng cách nhập email, mật khẩu cũ và mật khẩu mới.
 *     tags:
 *       - Authentication
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
 *                 EC:
 *                   type: integer
 *                   example: 0
 *                 EM:
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
router.patch("/change_password", verifyToken, AuthController.changePassword);

module.exports = router;
