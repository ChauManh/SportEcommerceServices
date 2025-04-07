const Order = require("../models/Order.Model");
const Product = require("../models/Product.Model");
const Discount = require("../models/Discount.Model");
const User = require("../models/User.model");
const Cart = require("../models/Cart.model");

const createOrder = async (newOrder, user_id) => {
  try {
    let {
      shipping_address,
      products,
      order_payment_method,
      order_note,
      discount_ids,
    } = newOrder;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return { EC: 1, EM: "Products array is required" };
    }
    let delivery_fee = 50000;
    let order_total_price = 0;
    const productMap = new Map();

    for (const item of products) {
      if (!productMap.has(item.product_id)) {
        productMap.set(item.product_id, []);
      }
      productMap.get(item.product_id).push(item);
    }

    const orderProducts = [];

    for (const [productId, items] of productMap.entries()) {
      const product = await Product.findById(productId);
      if (!product) {
        return { EC: 2, EM: `Product not found: ${productId}` };
      }

      let totalQuantity = 0;

      for (const item of items) {
        const color = product.colors.find(c => c.color_name === item.color_name);
        if (!color) {
          return { EC: 3, EM: `Color not found: ${item.color_name}` };
        }

        const variant = color.variants.find(v => v.variant_size === item.variant_name);
        if (!variant) {
          return { EC: 4, EM: `Variant not found: ${item.variant_name}` };
        }

        if (variant.variant_countInStock < item.quantity) {
          return { EC: 5, EM: `Product ${item.product_id} is out of stock` };
        }

        variant.variant_countInStock -= item.quantity;
        totalQuantity += item.quantity;

        orderProducts.push({
          EC: 0,
          product_id: product._id,
          quantity: item.quantity,
          color: item.color_name,
          variant: item.variant_name,
          product_order_type: item.product_order_type || "default",
          product_price: product.product_price * item.quantity,
          category_id: product.category_id,
        });
      }

      product.product_selled += totalQuantity;
      product.product_countInStock -= totalQuantity;
      await product.save();
    }

    if (orderProducts.some((item) => item.EC)) {
      return orderProducts.find((item) => item.EC);
    }

    order_total_price = orderProducts.reduce(
      (total, item) => total + item.product_price,
      0
    );

    let discountUsed = [];
    let totalDiscount = 0;
    if (discount_ids?.length > 0) {
      const discounts = await Discount.find({ _id: { $in: discount_ids } });

      for (const discount of discounts) {
        const now = new Date();
        if (
          discount.discount_start_day > now ||
          discount.discount_end_day < now
        ) {
          continue;
        }

        if (order_total_price < discount.min_order_value) {
          continue;
        }

        if (discount.discount_type === "product") {
          let discountableTotal = 0;
          orderProducts.forEach((item) => {
            if (
              discount.applicable_products.some((p) =>
                p.equals(item.product_id)
              ) ||
              discount.applicable_categories.some((c) =>
                c.equals(item.category_id)
              )
            ) {
              discountableTotal += item.product_price;
              discountUsed.push(discount)
            }
          });

          if (discountableTotal > 0) {
            totalDiscount +=
              (discountableTotal * discount.discount_number) / 100;
          }
        } else if (discount.discount_type === "shipping") {
          delivery_fee -= (delivery_fee * discount.discount_number) / 100;
          if (delivery_fee < 0) delivery_fee = 0;
        }
      }

      await Discount.updateMany(
        { _id: { $in: discount_ids } },
        { $inc: { discount_amount: -1 } },
      );
      
    }

    const order_total_final = order_total_price + delivery_fee - totalDiscount;

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 5) + 3
    );

    console.log(order_total_final*0.0001)
    await User.updateOne(
      { _id: user_id},
      {$inc: {user_loyalty: order_total_final*0.0001}},
      {
        $pull: {
          discounts: { $in: discountUsed }
        }
      }
    )

    await Cart.updateOne(
      { user_id: user_id },
      { $set: { products: [] } } 
    );

    const newOrderData = new Order({
      user_id,
      shipping_address,
      products: orderProducts,
      discount_ids,
      delivery_fee,
      order_total_price,
      order_total_discount: totalDiscount,
      order_total_final,
      order_payment_method,
      order_note,
      order_status: "Chờ xác nhận",
      estimated_delivery_date: estimatedDeliveryDate,
      is_feedback: false,
    });
    
    const savedOrder = await newOrderData.save();
    return { EC: 0, EM: "Order created successfully", data: savedOrder, cart: [] };
  } catch (error) {
    return { EC: 5, EM: error.message };
  }
};


const getAllOrder = async (orderStatus) => {
  try {
    let filter = {};

    if (orderStatus.toLowerCase() !== "all") {
      const validStatuses = [
        "Chờ xác nhận",
        "Đang chuẩn bị hàng",
        "Đang giao",
        "Giao hàng thành công",
        "Hoàn hàng",
        "Hủy hàng",
      ];

      if (!validStatuses.includes(orderStatus)) {
        return { EC: 1, EM: "Trạng thái đơn hàng không hợp lệ" };
      }

      filter.order_status = orderStatus;
    }

    const orders = await Order.find(filter);

    return {
      EC: 0,
      EM: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    return { EC: 2, EM: error.message };
  }
};

const getOrderByUser = async (userId, orderStatus) => {
  try {
    if (!userId) {
      return { EC: 1, EM: "User ID is required" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { EC: 2, EM: "User doesn't exist" };
    }

    let filter = { user_id: userId };

    if (orderStatus && orderStatus.toLowerCase() !== "all") {
      const validStatuses = [
        "Chờ xác nhận",
        "Đang chuẩn bị hàng",
        "Đang giao",
        "Giao hàng thành công",
        "Hoàn hàng",
        "Hủy hàng",
      ];

      if (!validStatuses.includes(orderStatus)) {
        return { EC: 3, EM: "Trạng thái đơn hàng không hợp lệ" };
      }

      filter.order_status = orderStatus;
    }

    const orders = await Order.find(filter).populate("products.product_id");

    return {
      EC: 0,
      EM: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    return { EC: 4, EM: error.message };
  }
};

const previewOrder = async (newOrder, userId) => {
  try {
    let {
      //user_id,
      shipping_address,
      products,
      order_status = "Chờ xác nhận",
      order_payment_method,
      order_note,
      discount_ids,
    } = newOrder;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return { EC: 1, EM: "Products array is required" };
    }

    let delivery_fee = 50000;
    let order_total_price = 0;

    const orderProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product)
          return { EC: 2, EM: `Product not found: ${item.product_id}` };

        const color = product.colors.find(c => c._id.toString() === item.color);
        if (!color) {
          return { EC: 3, EM: `Color not found: ${item.color_id}` };
        }

        const variant = color.variants.find(v => v._id.toString() === item.variant);
        if (!variant) {
          return { EC: 4, EM: `Variant not found: ${item.variant_id}` };
        }

        if (variant.variant_countInStock < item.quantity) {
          return { EC: 5, EM: `Product ${item.product_id} is out of stock` };
        }


        return {
          product_id: product._id,
          quantity: item.quantity,
          color: item.color,
          variant: item.variant,
          product_order_type: item.product_order_type || "default",
          product_price: variant.variant_price * item.quantity,
          category_id: product.category_id,
        };
      })
    );

    const errorProduct = orderProducts.find((item) => item.EC);
    if (errorProduct) return errorProduct;

    order_total_price = orderProducts.reduce(
      (total, item) => total + item.product_price,
      0
    );

    let totalDiscount = 0;
    if (discount_ids?.length > 0) {
      const discounts = await Discount.find({ _id: { $in: discount_ids } });

      for (const discount of discounts) {
        const now = new Date();
        if (
          discount.discount_start_day > now ||
          discount.discount_end_day < now
        ) {
          continue;
        }

        if (order_total_price < discount.min_order_value) {
          continue;
        }

        if (discount.discount_type === "product") {
          let discountableTotal = 0;
          orderProducts.forEach((item) => {
            if (
              discount.applicable_products.some((p) =>
                p.equals(item.product_id)
              ) ||
              discount.applicable_categories.some((c) =>
                c.equals(item.category_id)
              )
            ) {
              discountableTotal += item.product_price;
            }
          });

          if (discountableTotal > 0) {
            totalDiscount +=
              (discountableTotal * discount.discount_number) / 100;
          }
        } else if (discount.discount_type === "shipping") {
          delivery_fee -= (delivery_fee * discount.discount_number) / 100;
          if (delivery_fee < 0) delivery_fee = 0;
        }
      }
    }

    const order_total_final = order_total_price + delivery_fee - totalDiscount;

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 5) + 3
    );

    const previewOrder = {
      user_id: userId,
      products: orderProducts,
      delivery_fee,
      shipping_address,
      order_status,
      order_payment_method,
      order_note,
      discount_ids,
      order_total_price,
      order_total_final,
      order_total_discount: totalDiscount,
      estimated_delivery_date: estimatedDeliveryDate,
    };

    return {
      EC: 0,
      EM: "Get preview order successfully",
      data: previewOrder,
    };
  } catch (error) {
    return { EC: 99, EM: error.message };
  }
};

const updateStatus = async (orderId, status) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return { EC: 1, EM: "Order doesn't exist" };
    }

    const validStatuses = [
      "Chờ xác nhận",
      "Đang chuẩn bị hàng",
      "Đang giao",
      "Giao hàng thành công",
      "Hoàn hàng",
      "Hủy hàng",
    ];

    if (!validStatuses.includes(status)) {
      return { EC: 2, EM: "Invalid order status" };
    }

    if (["Hủy hàng", "Hoàn hàng"].includes(status)) {
      const products = order.products;
    
      const updateStockPromises = products.map(async (product) => {
        const productInfo = await Product.findById(product.product_id);
        if (!productInfo) return null;
    
        const color = productInfo.colors.find(c => c._id.equals(product.color));

        const variantIndex = color.variants.findIndex((v) =>
          v._id.equals(product.variant)
        );
    
        if (variantIndex === -1) return null;
    
        color.variants[variantIndex].variant_countInStock += product.quantity;
    
        productInfo.product_countInStock += product.quantity;
    
        return productInfo.save();
      });
    
      await Promise.all(updateStockPromises);
    }
    

    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_status: status },
      { new: true, runValidators: true }
    );

    return {
      EC: 0,
      EM: "Update order status successfully",
      data: updateOrder,
    };
  } catch (error) {
    return { EC: 99, EM: error.message };
  }
};

const getDetailOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("products.product_id");

    if (!order) {
      return { EC: 1, EM: "Order doesn't exist", data: null };
    }

    return {
      EC: 0,
      EM: "Get detail order successfully",
      data: order,
    };
  } catch (error) {
    return { EC: 99, EM: error.message, data: null };
  }
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderByUser,
  previewOrder,
  updateStatus,
  getDetailOrder,
};
