const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/Category.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

router.post(
  "/create",
  verifyToken,
  identifyAdmin,
  categoryController.createCategory
);
router.get("/get-detail/:id", categoryController.getDetailCategory);
router.get("/get-all", categoryController.getAllCategory);
router.get("/get-sub/:id", categoryController.getSubCategory);
router.patch(
  "/update/:id",
  verifyToken,
  identifyAdmin,
  categoryController.updateCategory
);
router.delete(
  "/delete/:id",
  verifyToken,
  identifyAdmin,
  categoryController.deleteCategory
);

module.exports = router;
