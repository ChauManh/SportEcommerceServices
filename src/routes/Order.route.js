const express = require("express");
const router = express.Router()
const orderController = require('../controllers/Order.controller')


router.post("/create", orderController.createOrder)
router.get("/get-all", orderController.getAllOrder)
router.get("/get-detail/:id", orderController.getDetailOrder)
router.get("/get-by-user", orderController.getOrderByUser)
router.get("/preview", orderController.previewOrder )
router.patch("/update-status/:id", orderController.updateStatus)

module.exports = router