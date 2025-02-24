const {
  updateCartService,
  getCartService,
  removeFromCartService,
  clearCartService,
  decreaseProductQuantity,
} = require("../services/Cart.serivce");

const cartController = {
  // Thêm sản phẩm vào giỏ hàng
  async addProductToCart(req, res) {
    const { userId, productId, quantity } = req.body;

    try {
      const data = await updateCartService({
        user_id: userId,
        product_id: productId,
        quantity,
      });

      if (data.EC === 0) {
        return res.status(201).json(data);
      } else {
        return res.status(400).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in addProductToCart:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Lấy giỏ hàng của user
  async getCart(req, res) {
    const { userId } = req.params;

    try {
      const data = await getCartService(userId);

      if (data.EC === 0) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in getCart:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  async removeProductFromCart(req, res) {
    const { userId, productId } = req.body;

    try {
      const data = await removeFromCartService({
        user_id: userId,
        product_id: productId,
      });

      if (data.EC === 0) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in removeProductFromCart:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // Xóa toàn bộ giỏ hàng
  async clearCart(req, res) {
    const { userId } = req.params;

    try {
      const data = await clearCartService(userId);

      if (data.EC === 0) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in clearCart:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async decreaseProductQuantity(req, res) {
    const { userId, productId } = req.body;

    try {
      const response = await decreaseProductQuantity(userId, productId);

      if (response.EC === 0) {
        return res.status(200).json(response);
      } else {
        return res.status(400).json(response);
      }
    } catch (error) {
      return res.status(500).json({
        EC: -1,
        EM: "Internal server error",
        details: error.message,
      });
    }
  },
};

module.exports = cartController;
