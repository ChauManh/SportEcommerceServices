const express = require('express')
const router = express.Router()
const storeController = require("../controllers/Store.controller")

router.post("/create", storeController.createStore)
router.patch("/update/:id", storeController.updateStore)
router.get("/get-detail/:id", storeController.getDetailStore)
module.exports = router