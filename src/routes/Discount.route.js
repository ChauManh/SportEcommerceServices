const express = require("express");
const router = express.Router();
const discountController = require("../controllers/Discount.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

/**
 * @swagger
 * /discount/create:
 *   post:
 *     summary: Tạo mã giảm giá mới
 *     description: Thêm một chương trình giảm giá mới vào hệ thống.
 *     tags:
 *       - Discount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discount_title
 *               - discount_code
 *               - discount_type
 *               - discount_start_day
 *               - discount_end_day
 *               - discount_amount
 *               - discount_number
 *             properties:
 *               discount_title:
 *                 type: string
 *                 description: Tiêu đề của mã giảm giá
 *               discount_code:
 *                 type: string
 *                 description: Mã giảm giá duy nhất
 *               discount_type:
 *                 type: string
 *                 enum: ["shipping", "product"]
 *                 description: Loại giảm giá (Vận chuyển hoặc sản phẩm)
 *               discount_start_day:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu giảm giá
 *               discount_end_day:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc giảm giá
 *               discount_amount:
 *                 type: number
 *                 description: Giá trị giảm giá (có thể là số tiền hoặc phần trăm)
 *               discount_number:
 *                 type: number
 *                 description: Phần trăm giảm giá
 *     responses:
 *       200:
 *         description: Tạo mã giảm giá mới thành công
 *       400:
 *         description: Mã giảm giá này đã tồn tại
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/create",
  verifyToken,
  identifyAdmin,
  discountController.createDiscount
);
/**
 * @swagger
 * /discount/get-detail/{discountId}:
 *   get:
 *     summary: Lấy thông tin chi tiết của mã giảm giá
 *     description: Trả về chi tiết một mã giảm giá dựa trên ID
 *     tags:
 *       - Discount
 *     parameters:
 *       - in: path
 *         name: discountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá
 *     responses:
 *       200:
 *         description: Lấy thông tin mã giảm giá thành công
 *       400:
 *         description: Mã giảm giá không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-detail/:discountId", discountController.getDetailDiscount);
/**
 * @swagger
 * /discount/get-all:
 *   get:
 *     summary: Lấy danh sách tất cả mã giảm giá
 *     description: Trả về danh sách toàn bộ mã giảm giá trong hệ thống.
 *     tags:
 *       - Discount
 *     responses:
 *       200:
 *         description: Lấy tất cả mã giảm giá thành công
 *       500:
 *         description: Lỗi máy chủ
 */

router.get("/get-all", discountController.getAllDiscount);

/**
 * @swagger
 * /discount/update/{discountId}:
 *   patch:
 *     summary: Cập nhật thông tin mã giảm giá
 *     description: Cập nhật các thông tin của mã giảm giá theo ID.
 *     tags:
 *       - Discount
 *     parameters:
 *       - in: path
 *         name: discountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount_title:
 *                 type: string
 *               discount_code:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: ["shipping", "product"]
 *               discount_start_day:
 *                 type: string
 *                 format: date
 *               discount_end_day:
 *                 type: string
 *                 format: date
 *               discount_amount:
 *                 type: number
 *               discount_number:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật mã giảm giá thành công
 *       400:
 *         description: Mã giảm giá này không tồn tại
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch(
  "/update/:discountId",
  verifyToken,
  identifyAdmin,
  discountController.updateDiscount
);
/**
 * @swagger
 * /discount/delete/{discountId}:
 *   delete:
 *     summary: Xóa mềm mã giảm giá
 *     description: Đánh dấu một mã giảm giá là đã bị xóa mà không xóa hoàn toàn khỏi cơ sở dữ liệu.
 *     tags:
 *       - Discount
 *     parameters:
 *       - in: path
 *         name: discountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của mã giảm giá cần xóa
 *     responses:
 *       200:
 *         description: Xóa mã giảm giá thành công
 *       404:
 *         description: Mã giảm giá này không tồn tại
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/delete/:discountId",
  verifyToken,
  identifyAdmin,
  discountController.deleteDiscount
);

/**
 * @swagger
 * /discount/get-for-order:
 *   get:
 *     summary: Lấy danh sách mã giảm giá có thể áp dụng cho đơn hàng
 *     description: Trả về các mã giảm giá user đã lưu và có thể áp dụng cho các sản phẩm cụ thể trong đơn hàng hiện tại.
 *     tags:
 *       - Discount
 *     security:
 *       - bearerAuth: []   # Nếu route có verifyToken thì cần khai báo xác thực Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6618a3f5e6b6a8e82bc8b1c2", "6618a40ae6b6a8e82bc8b1c4"]
 *     responses:
 *       200:
 *         description: Danh sách mã giảm giá áp dụng được
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
 *                   example: Lấy mã giảm giá thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *       401:
 *         description: Token không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post(
  "/get-for-order",
  verifyToken,
  discountController.getForOrder
)

module.exports = router;
