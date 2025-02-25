const express = require("express");
const router = express.Router();
const CartController = require("../controllers/Cart.controller");
const { VerifyToken } = require("../middlewares/AuthMiddleWare"); // Middleware xác thực

router.post("/", CartController.addProductToCart);
router.get("/:userId", CartController.getCart);
router.delete("/remove_product", CartController.removeProductFromCart);
router.delete("/clear/:userId", CartController.clearCart);
router.patch("/decrease_quantity", CartController.decreaseProductQuantity);

module.exports = router; //export default
