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
 *             required:
 *               - product_id
 *               - color_name
 *               - variant_name
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID của sản phẩm (MongoDB ObjectId)
 *                 example: "67f4c14f8448b36def8b29cd"
 *               color_name:
 *                 type: string
 *                 description: Tên màu sắc của sản phẩm
 *                 example: "Đen"
 *               variant_name:
 *                 type: string
 *                 description: Tên size/phiên bản của sản phẩm
 *                 example: "41"
 *               quantity:
 *                 type: integer
 *                 description: Số lượng sản phẩm thêm vào (mặc định là 1 nếu không truyền)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật giỏ hàng thành công
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
 *         description: Lấy giỏ hàng thành công || Giỏ hàng trống
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", verifyToken, CartController.getCart);
/**
 * @swagger
 * /cart/{productId}:
 *   delete:
  *     summary: Xóa một sản phẩm khỏi giỏ hàng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID của sản phẩm cần xóa
 *         schema:
 *           type: string
 *           example: "67f4c14f8448b36def8b29cd"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - color_name
 *               - variant_name
 *             properties:
 *               color_name:
 *                 type: string
 *                 description: Tên màu sắc của sản phẩm
 *                 example: "Đen"
 *               variant_name:
 *                 type: string
 *                 description: Tên size/phiên bản của sản phẩm
 *                 example: "41"
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ hàng thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:productId", verifyToken, CartController.removeProductFromCart);
/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Xóa toàn bộ giỏ hàng của người dùng
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa toàn bộ giỏ hàng thành công
 *       400:
 *         description: Không tìm thấy giỏ hàng
 *       401:
 *         description: Token không xác thực
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
 *                 example: "67f4c14f8448b36def8b29cd"
 *                 description: ID của sản phẩm cần giảm số lượng
 *               color_name:
 *                 type: string
 *                 description: Tên màu sắc của sản phẩm
 *                 example: "Đen"
 *               variant_name:
 *                 type: string
 *                 description: Tên size/phiên bản của sản phẩm
 *                 example: "41"
 *     responses:
 *       200:
 *         description: Giảm số lượng sản phẩm thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/decrease_quantity",
  verifyToken,
  CartController.decreaseProductQuantity
);

module.exports = router;
