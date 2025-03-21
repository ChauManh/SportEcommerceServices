const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/Category.controller')

router.post('/create', categoryController.createCategory)
router.get('/get-detail/:id', categoryController.getDetailCategory)
router.get('/get-all', categoryController.getAllCategory)
router.get('/get-sub/:id', categoryController.getSubCategory)
router.patch('/update/:id', categoryController.updateCategory)
router.delete('/delete/:id', categoryController.deleteCategory)

module.exports = router