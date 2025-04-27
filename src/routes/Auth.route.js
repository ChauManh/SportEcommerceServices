const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/Auth.controller");
/**
 * @swagger
 * /auth/sign_up:
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
 *                 example: test
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "test123"
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
 *                 result:
 *                   type: object
 *                   example: "null"
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc tài khoản đã tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/sign_up", AuthController.createUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     description: API cho phép người dùng đăng nhập bằng user_name và password.
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
 *                 description: Tên người dùng
 *                 example: test
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của tài khoản
 *                 example: "test123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token xác thực và thông tin người dùng
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
 *                   example: "Đăng nhập thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "680d76a1ea0060829fed291a"
 *                         user_name:
 *                           type: string
 *                           example: "test"
 *                         email:
 *                           type: string
 *                           example: "test@gmail.com"
 *                         role:
 *                           type: string
 *                           example: "user"
 *       400:
 *         description: Sai thông tin đăng nhập (username hoặc password không đúng)
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/login", AuthController.loginUser);
router.post("/signup_with_google", AuthController.SignUpWithGoogle);
router.post("/login_with_google", AuthController.loginUserWithGoogle);
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
 *                 example: test@gmail.com
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
 *                   example: "Gửi OTP thành công"
 *                 result:
 *                   type: object
 *                   example: null
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
 *                 example: test@gmail.com
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
 *                   example: "Xác thực OTP thành công"
 *                 result:
 *                   type: object
 *                   example: null
 *       400:
 *         description: OTP không hợp lệ
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
 *                 example: test@gmail.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới của tài khoản
 *                 example: "newtest123"
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
 *                   example: "Đặt lại mật khẩu thành công"
 *                 result:
 *                   type: object
 *                   example: null
 *       400:
 *         description: Xác thực OTP là bắt buộc trước khi đặt lại mật khẩu
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/reset_password", AuthController.resetPassword);
/**
 * @swagger
 * /auth/refresh_token:
 *   post:
 *     summary: Làm mới accessToken
 *     description: API cho phép người dùng làm mới accessToken với refreshToken.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token hợp lệ
 *                 example: "refreshToken"
 *     responses:
 *       200:
 *         description: Làm mới token thành công
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
 *                   example: "Làm mới token thành công"
 *                 result:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: newAccessToken
 *       400:
 *         description: Refresh token là bắt buộc || Lỗi xác thực refresh token
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/refresh_token", AuthController.refreshToken);

module.exports = router;
