const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/Product.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     description: Chỉ admin có thể tạo sản phẩm mới.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_title
 *               - product_category
 *               - product_price
 *               - product_countInStock
 *             properties:
 *               product_title:
 *                 type: string
 *                 example: Áo thể thao nam Nike
 *               product_category:
 *                 type: string
 *                 example: 6618a27ce6b6a8e82bc8b0c3
 *               product_brand:
 *                 type: string
 *                 example: Nike
 *               product_img:
 *                 type: string
 *                 example: /uploads/products/image1.jpg
 *               product_description:
 *                 type: string
 *                 example: Áo thể thao chất liệu thoáng mát, co giãn tốt.
 *               product_display:
 *                 type: boolean
 *                 example: true
 *               product_famous:
 *                 type: boolean
 *                 example: false
 *               product_price:
 *                 type: number
 *                 example: 499000
 *               product_countInStock:
 *                 type: number
 *                 example: 20
 *               product_rate:
 *                 type: number
 *                 example: 4.5
 *               product_selled:
 *                 type: number
 *                 example: 120
 *               product_percent_discount:
 *                 type: number
 *                 example: 10
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     variant_color:
 *                       type: string
 *                       example: Đỏ
 *                     variant_size:
 *                       type: string
 *                       example: L
 *                     variant_price:
 *                       type: number
 *                       example: 499000
 *                     variant_countInStock:
 *                       type: number
 *                       example: 10
 *                     variant_percent_discount:
 *                       type: number
 *                       example: 5
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Sản phẩm đã tồn tại hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/create",
  verifyToken,
  identifyAdmin,
  ProductController.createProduct
);

/**
 * @swagger
 * /product/update/{id}:
 *   patch:
 *     summary: Cập nhật sản phẩm
 *     description: Chỉ admin mới được cập nhật thông tin sản phẩm.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_title:
 *                 type: string
 *                 example: Áo bóng đá Real Madrid 2024
 *               product_category:
 *                 type: string
 *               product_brand:
 *                 type: string
 *               product_img:
 *                 type: string
 *               product_description:
 *                 type: string
 *               product_display:
 *                 type: boolean
 *               product_famous:
 *                 type: boolean
 *               product_price:
 *                 type: number
 *               product_countInStock:
 *                 type: number
 *               product_rate:
 *                 type: number
 *               product_selled:
 *                 type: number
 *               product_percent_discount:
 *                 type: number
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     variant_color:
 *                       type: string
 *                     variant_size:
 *                       type: string
 *                     variant_price:
 *                       type: number
 *                     variant_countInStock:
 *                       type: number
 *                     variant_percent_discount:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền admin
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/update/:id",
  verifyToken,
  identifyAdmin,
  ProductController.updateProduct
);
/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Xóa mềm sản phẩm
 *     description: Đánh dấu sản phẩm là đã bị xóa thay vì xóa vĩnh viễn.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *       400:
 *         description: Thiếu productId hoặc lỗi request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "The productId is required"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.delete(
  "/delete/:id",
  verifyToken,
  identifyAdmin,
  ProductController.deleteProduct
);

/**
 * @swagger
 * /product/get_details/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     description: API lấy thông tin chi tiết của một sản phẩm dựa vào ID.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: ID của sản phẩm cần lấy thông tin
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "SUCCESS"
 *                 data:
 *                   type: object
 *                   example:
 *                     _id: "65fd13d4a7e8a234c4a5b123"
 *                     product_title: "Áo thể thao Nike"
 *                     product_price: 500000
 *                     product_countInStock: 20
 *                     product_description: "Áo thể thao chính hãng Nike với chất liệu cao cấp"
 *       400:
 *         description: Thiếu productId hoặc lỗi request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "The productId is required"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/get-details/:id", ProductController.getDetailsProduct);

/**
 * @swagger
 * /product/get-all:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     description: Trả về danh sách tất cả các sản phẩm có trong hệ thống.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
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
 *                   example: Get all products successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all", ProductController.getAllProduct);

module.exports = router;
