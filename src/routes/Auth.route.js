const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
// const auth = require("../middleware/auth"); // Middleware xác thực

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
// router.post('/login', AuthController.handleLogin);
// router.get('/user', auth, AuthController.getUser);  // Đảm bảo người dùng đã đăng nhập
// router.get('/account', auth, AuthController.getAccount);  // Lấy thông tin tài khoản người dùng
// router.post('/google', AuthController.handleGoogleAuth);
// router.post('/forgot-password', AuthController.forgotPassword);
// router.post('/verify-otp', AuthController.verifyOtp);
// router.post('/reset-password', AuthController.resetPassword);

module.exports = router; //export default
