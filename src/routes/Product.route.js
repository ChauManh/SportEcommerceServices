const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/Product.controller');
const multer = require("multer");
const upload = require("../middlewares/UploadMiddleWare");


/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     description: API cho phép tạo một sản phẩm mới, bao gồm thông tin sản phẩm, hình ảnh và biến thể.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - product_title
 *               - product_category
 *               - product_brand
 *               - product_description
 *               - product_price
 *               - product_countInStock
 *               - product_main_img
 *             properties:
 *               product_title:
 *                 type: string
 *                 description: Tên sản phẩm
 *                 example: "Áo thể thao Nike"
 *               product_category:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID danh mục sản phẩm
 *                 example: "65fd13d4a7e8a234c4a5b123"
 *               product_brand:
 *                 type: string
 *                 description: Thương hiệu của sản phẩm
 *                 example: "Nike"
 *               product_description:
 *                 type: string
 *                 description: Mô tả chi tiết về sản phẩm
 *                 example: "Áo thể thao chính hãng Nike với chất liệu cao cấp"
 *               product_price:
 *                 type: number
 *                 description: Giá sản phẩm
 *                 example: 500000
 *               product_countInStock:
 *                 type: integer
 *                 description: Số lượng sản phẩm còn trong kho
 *                 example: 20
 *               product_display:
 *                 type: boolean
 *                 description: Trạng thái hiển thị sản phẩm
 *                 example: true
 *               product_famous:
 *                 type: boolean
 *                 description: Đánh dấu sản phẩm nổi bật
 *                 example: false
 *               product_rate:
 *                 type: number
 *                 description: Đánh giá trung bình của sản phẩm
 *                 example: 4.5
 *               product_selled:
 *                 type: integer
 *                 description: Số lượng sản phẩm đã bán
 *                 example: 100
 *               product_percent_discount:
 *                 type: number
 *                 description: Phần trăm giảm giá sản phẩm
 *                 example: 10
 *               product_main_img:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh chính của sản phẩm (bắt buộc)
 *               product_subs_img:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách ảnh phụ của sản phẩm
 *               variants:
 *                 type: array
 *                 description: Danh sách các biến thể của sản phẩm
 *                 items:
 *                   type: object
 *                   required:
 *                     - variant_color
 *                     - variant_size
 *                     - variant_price
 *                     - variant_countInStock
 *                     - variant_img_main
 *                   properties:
 *                     variant_color:
 *                       type: string
 *                       description: Màu sắc của biến thể
 *                       example: "Đỏ"
 *                     variant_size:
 *                       type: string
 *                       description: Kích thước của biến thể
 *                       example: "L"
 *                     variant_price:
 *                       type: number
 *                       description: Giá của biến thể
 *                       example: 550000
 *                     variant_countInStock:
 *                       type: integer
 *                       description: Số lượng tồn kho của biến thể
 *                       example: 15
 *                     variant_img_main:
 *                       type: string
 *                       format: binary
 *                       description: Ảnh chính của biến thể (bắt buộc)
 *                     variant_img_subs:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: binary
 *                       description: Danh sách ảnh phụ của biến thể
 *     responses:
 *       200:
 *         description: Tạo sản phẩm thành công
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
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Lỗi do dữ liệu đầu vào không hợp lệ
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
 *                   example: "Main product image is required"
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
router.post("/create", ProductController.uploadImgProduct, ProductController.createProduct);

/**
 * @swagger
 * /product/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm
 *     description: API này cập nhật thông tin sản phẩm, bao gồm hình ảnh và biến thể.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của sản phẩm cần cập nhật
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               product_title:
 *                 type: string
 *                 description: Tiêu đề sản phẩm
 *                 example: "Áo thể thao Adidas"
 *               product_category:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID danh mục sản phẩm
 *                 example: "65fd13d4a7e8a234c4a5b123"
 *               product_brand:
 *                 type: string
 *                 description: Thương hiệu sản phẩm
 *                 example: "Adidas"
 *               product_description:
 *                 type: string
 *                 description: Mô tả chi tiết sản phẩm
 *                 example: "Áo thể thao Adidas chính hãng với chất liệu cao cấp"
 *               product_price:
 *                 type: number
 *                 description: Giá sản phẩm
 *                 example: 600000
 *               product_countInStock:
 *                 type: integer
 *                 description: Số lượng sản phẩm trong kho
 *                 example: 30
 *               product_display:
 *                 type: boolean
 *                 description: Trạng thái hiển thị sản phẩm
 *                 example: true
 *               product_famous:
 *                 type: boolean
 *                 description: Đánh dấu sản phẩm nổi bật
 *                 example: false
 *               product_percent_discount:
 *                 type: number
 *                 description: Phần trăm giảm giá
 *                 example: 15
 *               product_main_img:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh chính của sản phẩm (có thể cập nhật)
 *               product_subs_img:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách ảnh phụ của sản phẩm
 *               variants:
 *                 type: array
 *                 description: Danh sách biến thể sản phẩm
 *                 items:
 *                   type: object
 *                   properties:
 *                     variant_color:
 *                       type: string
 *                       description: Màu sắc biến thể
 *                       example: "Xanh"
 *                     variant_size:
 *                       type: string
 *                       description: Kích thước biến thể
 *                       example: "XL"
 *                     variant_price:
 *                       type: number
 *                       description: Giá biến thể
 *                       example: 650000
 *                     variant_countInStock:
 *                       type: integer
 *                       description: Số lượng tồn kho của biến thể
 *                       example: 10
 *                     variant_img_main:
 *                       type: string
 *                       format: binary
 *                       description: Ảnh chính của biến thể (có thể cập nhật)
 *                     variant_img_subs:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: binary
 *                       description: Danh sách ảnh phụ của biến thể
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
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
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu ảnh bắt buộc
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
 *                   example: "Invalid request data"
 *       404:
 *         description: Không tìm thấy sản phẩm
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
 *                   example: "Product not found"
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

router.patch("/update/:id", ProductController.uploadImgProduct, ProductController.updateProduct)
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

router.delete('/delete/:id', ProductController.deleteProduct)

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
router.get('/get-details/:id', ProductController.getDetailsProduct)
// router.get('/get-all-product', ProductController.getAllProduct)

module.exports = router