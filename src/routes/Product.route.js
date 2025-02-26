const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/Product.controller');
const multer = require("multer");
const upload = multer();

router.post("/create", ProductController.uploadImgProduct, ProductController.createProduct);
// router.patch('/update/:id', ProductController.uploadFields, ProductController.updateProduct)
// router.delete('/delete/:id', ProductController.deleteProduct)
// router.delete('/delete-many', ProductController.deleteManyProduct)
// router.get('/get-details/:id', ProductController.getDetailsProduct)
// router.get('/get-all-product', ProductController.getAllProduct)

module.exports = router