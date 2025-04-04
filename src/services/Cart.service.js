const Cart = require("../models/Cart.model");

const updateCartService = async ({ user_id, product_id }) => {
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
};

// Lấy giỏ hàng của user
const getCartService = async (user_id) => {
  // const cart = await Cart.findOne({ user_id }).populate(
  //   "products.product_id"
  // );
  let cart = await Cart.findOne({ user_id }).populate("products.product_id").populate("user_id", "full_name email phone addresses ");
  if (!cart) {
    return { EC: 0, EM: "Cart is empty" };
  }
  await cart.save();
  return { EC: 0, EM: "Cart fetched successfully", cart };
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCartService = async ({ user_id, product_id }) => {
  let cart = await Cart.findOne({ user_id });
  if (!cart) {
    return { EC: 2, EM: "Cart not found" };
  }

  // Lọc và xóa sản phẩm khỏi giỏ hàng
  cart.products = cart.products.filter(
    (p) => p.product_id.toString() !== product_id
  );

  // Lưu lại giỏ hàng đã được cập nhật
  await cart.save();

  return { EC: 0, EM: "Product removed from cart", cart };
};


// Xóa toàn bộ giỏ hàng
const clearCartService = async (user_id) => {
  let cart = await Cart.findOne({ user_id });
  if (!cart) {
    return { EC: 2, EM: "Cart not found" };
  } else {
    await Cart.deleteOne({ user_id });
    return { EC: 0, EM: "Cart cleared successfully" };
  }
};


const decreaseProductQuantity = async (user_id, product_id) => {
  const cart = await Cart.findOne({ user_id });
  // Tìm sản phẩm trong giỏ hàng
  const productIndex = cart.products.findIndex(
    (item) => item.product_id.toString() === product_id
  );
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
};

module.exports = {
  updateCartService,
  getCartService,
  removeFromCartService,
  clearCartService,
  decreaseProductQuantity,
};
