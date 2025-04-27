const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/Category.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /category/create:
 *   post:
 *     summary: Tạo danh mục mới
 *     description: Tạo danh mục sản phẩm, có thể là danh mục cha hoặc con (nếu có `category_parent_id`)
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_gender:
 *                 type: string
 *                 enum: [Male, Female, Unisex, null]
 *                 example: Unisex
 *               category_type:
 *                 type: string
 *                 example: Áo thể thao
 *               category_parent_id:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               category_level:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tạo danh mục mới thành công
 *       400:
 *         description: Danh mục đã tồn tại hoặc dữ liệu không hợp lệ
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/create",
  verifyToken,
  identifyAdmin,
  categoryController.createCategory
);

/**
 * @swagger
 * /category/get-detail/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết danh mục
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Lấy chi tiết danh mục thành công
 *       400:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-detail/:id", categoryController.getDetailCategory);

/**
 * @swagger
 * /category/get-all:
 *   get:
 *     summary: Lấy tất cả danh mục
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: Lấy tất cả danh mục thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-all", categoryController.getAllCategory);

/**
 * @swagger
 * /category/get-sub/{id}:
 *   get:
 *     summary: Lấy danh sách danh mục con
 *     description: Trả về các danh mục con của một danh mục cha nhất định
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cha
 *     responses:
 *       200:
 *         description: Lấy danh mục con thành công
 *       400:
 *         description: Danh mục không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-sub/:id", categoryController.getSubCategory);

/**
 * @swagger
 * /category/update/{id}:
 *   patch:
 *     summary: Cập nhật danh mục
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_gender:
 *                 type: string
 *               category_type:
 *                 type: string
 *               category_parent_id:
 *                 type: string
 *               category_level:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật danh mục thành công
 *       400:
 *         description: Danh mục không tồn tại
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/update/:id",
  verifyToken,
  identifyAdmin,
  categoryController.updateCategory
);

/**
 * @swagger
 * /category/delete/{id}:
 *   delete:
 *     summary: Xoá danh mục
 *     description: Xoá mềm danh mục khỏi hệ thống (vẫn giữ trong DB với dấu xóa).
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần xoá
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       400:
 *         description: Danh mục không tồn tại
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/delete/:id",
  verifyToken,
  identifyAdmin,
  categoryController.deleteCategory
);

module.exports = router;
