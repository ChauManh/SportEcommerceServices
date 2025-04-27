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
 *                 example: "67f4c14f8448b36def8b29cd"
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
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", verifyToken, FavoriteController.getFavourite);
/**
 * @swagger
 * /favourite:
 *   delete:
 *     summary: Xóa toàn bộ danh sách sản phẩm yêu thích của người dùng
 *     tags: [Favourite]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa danh sách sản phẩm yêu thích thành công
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/", verifyToken, FavoriteController.clearFavourites);

module.exports = router; //export default
