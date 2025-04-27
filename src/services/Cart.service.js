const Cart = require("../models/Cart.model");
const mongoose = require("mongoose");
const Product = require("../models/Product.model");

const updateCartService = async ({ user_id, product_id, color_name, variant_name, quantity }) => {
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

  let cart = await Cart.findOne({ user_id });

  if (!cart) {
    cart = new Cart({ user_id, products: [] });
  }

  const productIndex = cart.products.findIndex(
    (p) =>
      p.product_id.toString() === product_id &&
      p.color_name === color.color_name &&
      p.variant_name === variant.variant_size
  );

  if (quantity !== undefined) {
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({
        product_id,
        color_name,
        variant_name,
        quantity: quantity,
      });
    }
  } else {
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
    return { EC: 0, EM: "Giỏ hàng trống" };
  }
  await cart.save();
  return { EC: 0, EM: "Lấy giỏ hàng thành công", cart };
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCartService = async ({ user_id, product_id, color_name, variant_name }) => {
  const product = await Product.findOneWithDeleted({ _id: product_id });
  if (!product) {
    return { EC: 2, EM: "Sản phẩm không tồn tại", cart: null };
  }

  const color = product.colors.find((c) => c.color_name === color_name);
  if (!color) {
    return { EC: 2, EM: "Màu sắc không tồn tại trong sản phẩm", cart: null };
  }
  
  const variant = color.variants.find((v) => v.variant_size === variant_name);
  if (!variant) {
    return { EC: 2, EM: "Size không tồn tại trong màu đã chọn", cart: null };
  }

  let cart = await Cart.findOne({ user_id });
  if (!cart) {
    return { EC: 1, EM: "Không tìm thấy giỏ hàng" };
  }

  // Lọc và xóa sản phẩm khỏi giỏ hàng
  cart.products = cart.products.filter(
    (p) => 
      !(p.product_id.toString() === product_id &&
      p.color_name === color_name &&
      p.variant_name === variant_name)
  );

  // Lưu lại giỏ hàng đã được cập nhật
  await cart.save();

  return { EC: 0, EM: "Xóa sản phẩm khỏi giỏ hàng thành công", cart };
};


// Xóa toàn bộ giỏ hàng
const clearCartService = async (user_id) => {
  let cart = await Cart.findOne({ user_id });
  if (!cart) {
    return { EC: 2, EM: "Không tìm thấy giỏ hàng" };
  } else {
    await Cart.deleteOne({ user_id });
    return { EC: 0, EM: "Xóa toàn bộ giỏ hàng thành công" };
  }
};


const decreaseProductQuantity = async (user_id, product_id, color_name, variant_name) => {
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

  let cart = await Cart.findOne( {user_id} );

  const productIndex = cart.products.findIndex(
    (item) => 
      item.product_id.toString() === product_id &&
      item.color_name === color.color_name &&
      item.variant_name === variant.variant_size
  );

  if (cart.products[productIndex].quantity > 1) {
    cart.products[productIndex].quantity -= 1;
  } else {
    cart.products.splice(productIndex, 1);
  }

  await cart.save();

  return {
    EC: 0,
    EM: "Giảm số lượng sản phẩm thành công",
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
