const {
  updateCartService,
  getCartService,
  removeFromCartService,
  clearCartService,
  decreaseProductQuantity,
} = require("../services/Cart.service");

const cartController = {
  // Thêm sản phẩm vào giỏ hàng
  async addProductToCart(req, res) {
    const { userId } = req.user;
    const { productId } = req.body;
    try {
      const result = await updateCartService({
        user_id: userId,
        product_id: productId,
      });
      return result.EC === 0
        ? res.success(result.cart, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  // Lấy giỏ hàng của user
  async getCart(req, res) {
    const { userId } = req.user;
    try {
      const result = await getCartService(userId);
      return result.EC === 0
        ? res.success(result.cart, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeProductFromCart(req, res) {
    const { userId } = req.user;
    const { productId } = req.params;
    try {
      const result = await removeFromCartService({ user_id: userId, product_id: productId });
      return result.EC === 0
        ? res.success(result.cart, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart(req, res) {
    const { userId } = req.user;
    try {
      const result = await clearCartService(userId);
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM, 400);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async decreaseProductQuantity(req, res) {
    const { userId } = req.user;
    const { productId } = req.body;
    try {
      const result = await decreaseProductQuantity(userId, productId);
      return result.EC === 0
        ? res.success(result.cart, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },
};

module.exports = cartController;
