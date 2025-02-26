const Cart = require("../models/Cart.model");

const updateCartService = async ({ user_id, product_id }) => {
  try {
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      // Nếu user chưa có giỏ hàng, tạo mới
      cart = new Cart({ user_id, products: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const productIndex = cart.products.findIndex(
      (p) => p.product_id.toString() === product_id
    );

    if (productIndex > -1) {
      // Nếu có rồi, cập nhật số lượng
      cart.products[productIndex].quantity += 1;
    } else {
      // Nếu chưa có, thêm mới
      cart.products.push({ product_id, quantity: 1 });
    }

    await cart.save();
    return { EC: 0, EM: "Cart updated successfully", cart };
  } catch (error) {
    return { EC: 1, EM: "Error updating cart", details: error.message };
  }
};

// Lấy giỏ hàng của user
const getCartService = async (user_id) => {
  try {
    // const cart = await Cart.findOne({ user_id }).populate(
    //   "products.product_id"
    // );
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return { EC: 2, EM: "Cart not found" };
    }
    return { EC: 0, EM: "Cart fetched successfully", cart };
  } catch (error) {
    return { EC: 1, EM: "Error fetching cart", details: error.message };
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCartService = async ({ user_id, product_id }) => {
  try {
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return { EC: 2, EM: "Cart not found" };
    }

    cart.products = cart.products.filter(
      (p) => p.product_id.toString() !== product_id
    );

    await cart.save();
    return { EC: 0, EM: "Product removed from cart", cart };
  } catch (error) {
    return { EC: 1, EM: "Error removing product", details: error.message };
  }
};

// Xóa toàn bộ giỏ hàng
const clearCartService = async (user_id) => {
  try {
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      return { EC: 2, EM: "Cart not found" };
    }

    cart.products = [];
    await cart.save();

    return { EC: 0, EM: "Cart cleared successfully" };
  } catch (error) {
    return { EC: 1, EM: "Error clearing cart", details: error.message };
  }
};

const decreaseProductQuantity = async (user_id, product_id) => {
  try {
    // Tìm giỏ hàng của user
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return {
        EC: 1,
        EM: "Cart not found",
      };
    }

    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (item) => item.product_id.toString() === product_id
    );

    if (productIndex === -1) {
      return {
        EC: 2,
        EM: "Product not found in cart",
      };
    }

    // Giảm số lượng sản phẩm đi 1
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      // Nếu quantity = 1 thì xóa sản phẩm khỏi giỏ hàng
      cart.products.splice(productIndex, 1);
    }

    // Lưu giỏ hàng sau khi cập nhật
    await cart.save();

    return {
      EC: 0,
      EM: "Product quantity decreased successfully",
      cart,
    };
  } catch (error) {
    return {
      EC: -1,
      EM: "Error decreasing product quantity",
      details: error.message,
    };
  }
};

module.exports = {
  updateCartService,
  getCartService,
  removeFromCartService,
  clearCartService,
  decreaseProductQuantity,
};
