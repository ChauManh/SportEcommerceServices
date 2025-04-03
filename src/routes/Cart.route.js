const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart.controller");
const { verifyToken } = require("../middlewares/AuthMiddleWare"); // Middleware xác thực

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Quản lý giỏ hàng của người dùng
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *                 description: ID của sản phẩm (MongoDB ObjectId)
 *     responses:
 *       201:
 *         description: Sản phẩm được thêm vào giỏ hàng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/", verifyToken, CartController.addProductToCart);
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm trong giỏ hàng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", verifyToken, CartController.getCart);
/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Xóa một sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *                 description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:productId", verifyToken, CartController.removeProductFromCart);
/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Giỏ hàng được xóa thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/", verifyToken, CartController.clearCart);
/**
 * @swagger
 * /cart/decrease_quantity:
 *   patch:
 *     summary: Giảm số lượng sản phẩm trong giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
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
 *                 description: ID của sản phẩm cần giảm số lượng
 *     responses:
 *       200:
 *         description: Giảm số lượng sản phẩm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/decrease_quantity",
  verifyToken,
  CartController.decreaseProductQuantity
);

module.exports = router;
