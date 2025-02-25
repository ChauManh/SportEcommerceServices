const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/Favourite.controller");
const { verifyToken } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * tags:
 *   name: Favourite
 *   description: API quản lý danh sách yêu thích của người dùng
 */

/**
 * @swagger
 * /favourite:
 *   patch:
 *     summary: Thêm hoặc xóa sản phẩm vào danh sách yêu thích
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []  # Yêu cầu token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65abcf789123de456f789abc"
 *     responses:
 *       201:
 *         description: Cập nhật danh sách yêu thích thành công
 *       400:
 *         description: Lỗi yêu cầu
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/", verifyToken, FavoriteController.updateFavourite);
/**
 * @swagger
 * /favourite:
 *   get:
 *     summary: Lấy danh sách sản phẩm yêu thích của người dùng
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách yêu thích thành công
 *       401:
 *         description: Không có quyền truy cập (token không hợp lệ)
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", verifyToken, FavoriteController.getFavourite);
module.exports = router; //export default
