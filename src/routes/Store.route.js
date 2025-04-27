const express = require('express')
const router = express.Router()
const storeController = require("../controllers/Store.controller")
const { identifyAdmin, verifyToken } = require('../middlewares/AuthMiddleWare')

/**
 * @swagger
 * /store/create:
 *   post:
 *     summary: Tạo thông tin cửa hàng
 *     description: Tạo mới một cửa hàng trong hệ thống. Cần có quyền admin để thực hiện thao tác này.
 *     tags:
 *       - Store
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_address:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *               store_phone:
 *                 type: string
 *                 example: "0901234567"
 *               store_email:
 *                 type: string
 *                 example: "store@example.com"
 *               store_banner:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "http://example.com/banner1.jpg"
 *     responses:
 *       200:
 *         description: Tạo cửa hàng thành công
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
 *                   example: "Tạo thông tin cửa hàng thành công"
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", verifyToken, identifyAdmin,storeController.createStore)
/**
 * @swagger
 * /store/update/{id}:
 *   patch:
 *     summary: Cập nhật thông tin cửa hàng
 *     description: Cập nhật thông tin cửa hàng theo ID. Cần quyền admin để thực hiện thao tác này.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 680a5a2fe8930a6de2ee81d2
 *           format: ObjectId
 *         description: ID của cửa hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_address:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *               store_phone:
 *                 type: string
 *                 example: "0901234567"
 *               store_email:
 *                 type: string
 *                 example: "store@example.com"
 *               store_banner:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "http://example.com/banner1.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin cửa hàng thành công
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
 *                   example: "Cập nhật thông tin cửa hàng thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Cửa hàng không tồn tại
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/update/:id", verifyToken, identifyAdmin, storeController.updateStore)
/**
 * @swagger
 * /store/get-detail/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết cửa hàng
 *     description: Lấy thông tin chi tiết của cửa hàng theo ID.
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 680a5a2fe8930a6de2ee81d2
 *           format: ObjectId
 *         description: ID của cửa hàng cần lấy thông tin
 *     responses:
 *       200:
 *         description: Lấy thông tin cửa hàng thành công
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
 *                   example: "Lấy thông tin cửa hàng thành công"
 *                 data:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Cửa hàng không tồn tại
 *       401:
 *         description: Token không xác thực
 *       403:
 *         description: Token admin không xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get-detail/:id", storeController.getDetailStore)
module.exports = router