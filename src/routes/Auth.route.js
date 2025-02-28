const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
// const { verifyToken } = require("../middlewares/AuthMiddleWare");
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
router.post("/send_otp", AuthController.sendOTP);
router.post("/verify_otp", AuthController.verifyOtp);
router.patch("/reset_password", AuthController.resetPassword);
// router.post("/reset_password", verifyToken, AuthController.resetPassword);

module.exports = router; //export default
