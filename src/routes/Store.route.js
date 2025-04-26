const express = require('express')
const router = express.Router()
const storeController = require("../controllers/Store.controller")
const { identifyAdmin, verifyToken } = require('../middlewares/AuthMiddleWare')

router.post("/create", verifyToken, identifyAdmin,storeController.createStore)
router.patch("/update/:id", verifyToken, identifyAdmin, storeController.updateStore)
router.get("/get-detail/:id", storeController.getDetailStore)
module.exports = router