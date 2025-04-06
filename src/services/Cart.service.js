const Cart = require("../models/Cart.model");
const mongoose = require("mongoose");
const Product = require("../models/Product.Model");

const updateCartService = async ({ user_id, product_id, color_name, variant_name }) => {

  const product = await Product.findOneWithDeleted({ _id: product_id });
  if (!product) {
    return { EC: 1, EM: "Sản phẩm không tồn tại", cart: null };
  }

  const color = product.colors.find((c) => c.color_name === color_name);
  if (!color) {
    return { EC: 1, EM: "Màu sắc không tồn tại trong sản phẩm", cart: null };
  }
  
  const variant = color.variants.find((v) => v.variant_size === variant_name);
  if (!variant) {
    return { EC: 1, EM: "Size không tồn tại trong màu đã chọn", cart: null };
  }
  const color_id = color._id;
  const variant_id = variant._id;

  let cart = await Cart.findOne({ user_id });

  if (!cart) {
    cart = new Cart({ user_id, products: [] });
  }

  const productIndex = cart.products.findIndex(
    (p) =>
      console.log(p) &&
      p.product_id.toString() === product_id.toString() &&
      p.color_id.toString() === color_id.toString() &&
      p.variant_id.toString() === variant_id.toString()
  );

  if (productIndex > -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({
      product_id,
      color_name,
      variant_name,
      quantity: 1,
    });
  }

  await cart.save();

  return { EC: 0, EM: "Cập nhật giỏ hàng thành công", cart };
};

// Lấy giỏ hàng của user
const getCartService = async (user_id) => {
  // const cart = await Cart.findOne({ user_id }).populate(
  //   "products.product_id"
  // );
  let cart = await Cart.findOne({ user_id }).populate("products.product_id").populate("user_id");
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
