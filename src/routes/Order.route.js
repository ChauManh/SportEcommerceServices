const express = require("express");
const router = express.Router()
const orderController = require('../controllers/Order.controller')


router.post("/create", orderController.createOrder)

module.exports = router