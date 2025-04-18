const Order = require("../models/Order.Model");
const Product = require("../models/Product.Model");
const Discount = require("../models/Discount.Model");
const User = require("../models/User.model");
const Cart = require("../models/Cart.model");
const {
  createPaymentService,
  checkPaymentIsCancelService,
} = require("./Payment.service");

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
        const color = product.colors.find(
          (c) => c.color_name === item.color_name
        );
        if (!color) {
          return { EC: 3, EM: `Color not found: ${item.color_name}` };
        }

        const variant = color.variants.find(
          (v) => v.variant_size === item.variant_name
        );
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
          product_name: product.product_title,
          quantity: item.quantity,
          color: item.color_name,
          variant: item.variant_name,
          product_order_type: item.product_order_type || "default",
          product_price: variant.variant_price * item.quantity,
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
          totalDiscount = (discount.discount_number / 100) * order_total_price;
        } else if (discount.discount_type === "shipping") {
          delivery_fee -= (delivery_fee * discount.discount_number) / 100;
          if (delivery_fee < 0) delivery_fee = 0;
        }
      }

      await Discount.updateMany(
        { _id: { $in: discount_ids } },
        { $inc: { discount_amount: -1 } }
      );
    }

    const order_total_final = order_total_price + delivery_fee - totalDiscount;

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 5) + 3
    );

    await User.updateOne(
      { _id: user_id },
      { $inc: { user_loyalty: order_total_final * 0.0001 } },
      {
        $pull: {
          discounts: { $in: discountUsed },
        },
      }
    );
    const orderCode = Math.floor(Math.random() * 900000) + 100000; // Generate a random 6-digit order code

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
      order_code: orderCode,
    });

    const savedOrder = await newOrderData.save();
    let resultPayOS = null;
    // tạo QR trước khi update cart
    if (order_payment_method == "Paypal") {
      const description = `Thanh toán đơn #${orderCode}`;
      result = await createPaymentService(
        orderCode,
        order_total_final,
        description,
        orderProducts,
        savedOrder._id.toString()
      );
      if (result.EC === 0) {
        resultPayOS = result.result;
      } else {
        return result;
      }
    }
    if (user_id) {
      await Cart.updateOne({ user_id: user_id }, { $set: { products: [] } });
    }

    return {
      EC: 0,
      EM: "Order created successfully",
      data: {
        ...savedOrder.toObject(),
        resultPayOS,
      },
      cart: [],
    };
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
        "Hoàn thành",
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
        "Hoàn thành",
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

        const color = product.colors.find(
          (c) => c._id.toString() === item.color
        );
        if (!color) {
          return { EC: 3, EM: `Color not found: ${item.color_id}` };
        }

        const variant = color.variants.find(
          (v) => v._id.toString() === item.variant
        );
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

const updateStatus = async (
  orderId,
  status,
  currentUserId,
  currentUserRole
) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return { EC: 1, EM: "Order doesn't exist" };
    }
    const isOwner = order.user_id.toString() === currentUserId;
    const isAdmin = currentUserRole === "admin";
    const currentStatus = order.order_status;

    const validStatuses = [
      "Chờ xác nhận",
      "Đang chuẩn bị hàng",
      "Đang giao",
      "Hoàn thành",
      "Hủy hàng",
      "Yêu cầu hoàn",
      "Hoàn hàng",
    ];

    // Kiểm tra quyền cập nhật trạng thái
    const canUpdateOrderStatus = ({
      role,
      currentStatus,
      newStatus,
      isOwner,
    }) => {
      const disallowedTargets = ["Yêu cầu hoàn", "Hoàn hàng", "Hủy hàng"];

      if (isAdmin) {
        if (currentStatus === "Hoàn thành") return false;
        if (["Hủy hàng", "Hoàn hàng"].includes(currentStatus)) return false;

        if (
          ["Chờ xác nhận", "Đang chuẩn bị hàng", "Đang giao"].includes(
            currentStatus
          )
        ) {
          return !disallowedTargets.includes(newStatus);
        }

        if (
          currentStatus === "Yêu cầu hoàn" &&
          ["Hoàn hàng", "Hoàn thành"].includes(newStatus)
        ) {
          return true;
        }

        return false;
      }

      if (
        isOwner &&
        currentStatus === "Chờ xác nhận" &&
        newStatus === "Hủy hàng"
      ) {
        return true;
      }

      if (
        isOwner &&
        currentStatus === "Hoàn thành" &&
        newStatus === "Yêu cầu hoàn"
      ) {
        return true;
      }

      if (
        isOwner &&
        currentStatus === "Yêu cầu hoàn" &&
        newStatus === "Hoàn thành"
      ) {
        return true;
      }

      return false;
    };

    if (
      !canUpdateOrderStatus({
        role: currentUserRole,
        currentStatus,
        newStatus: status,
        isOwner,
      })
    ) {
      return {
        EC: 403,
        EM: "Không thể cập nhật, hãy kiểm tra lại trạng thái",
      };
    }

    if (!validStatuses.includes(status)) {
      return { EC: 2, EM: "Invalid order status" };
    }

    if (["Hủy hàng", "Hoàn hàng"].includes(status)) {
      console.log("Updating stock for order:", orderId);
      const products = order.products;

      const updateStockPromises = products.map(async (product) => {
        const productInfo = await Product.findById(product.product_id);
        if (!productInfo) return null;

        const color = productInfo.colors.find(
          (c) => c.color_name === product.color
        );

        const variantIndex = color.variants.findIndex(
          (v) => v.variant_size === product.variant
        );

        if (variantIndex === -1) return null;

        color.variants[variantIndex].variant_countInStock += product.quantity;

        productInfo.product_countInStock += product.quantity;

        return productInfo.save();
      });

      await Promise.all(updateStockPromises);
    }

    const updateFields = {
      order_status: status,
    };

    if (isAdmin && status === "Hoàn thành") {
      updateFields.is_paid = true;
      updateFields.received_date = new Date();
    }

    const updateOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
      new: true,
      runValidators: true,
    });

    return {
      EC: 0,
      EM: "Cập nhật trạng thái đơn hàng thành công",
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

const handleCancelPaymentService = async (
  orderCode,
  currentUserId,
  currentUserRole
) => {
  if (!orderCode) {
    return { EC: 1, EM: "Order code is required" };
  }
  if (!checkPaymentIsCancelService(orderCode)) {
    return { EC: 2, EM: "Invalid Information" };
  } else {
    const order = await Order.findOne({ order_code: orderCode });
    if (!order) {
      return { EC: 3, EM: "Order doesn't exist" };
    }
    if (order.order_payment_method === "Paypal" && order.is_paid === false) {
      const result = await updateStatus(
        order._id,
        "Hủy hàng",
        currentUserId,
        currentUserRole
      );
      if (result.EC === 0) {
        return { EC: 0, EM: "Order cancelled successfully", data: result.data };
      } else {
        return { EC: 4, EM: result.EM };
      }
    }
  }
};

// const deleteOrderService = async (orderCode) => {
//   // try {
//   //   const order = await Order.findOne({ order_code: orderCode });
//   //   if (!order) {
//   //     return { EC: 1, EM: "Order doesn't exist" };
//   //   }
//   //   if (order.order_payment_method === "Cod") {
//   //       if(order.order_status === "Chờ xác nhận") {
//   //         // Xóa đơn hàng nếu trạng thái là "Chờ xác nhận"
//   //         await order.remove();
//   //       } else {
//   //         // Nếu trạng thái không phải là "Chờ xác nhận", chỉ cập nhật trạng thái
//   //         order.order_status = "Hủy hàng";
//   //         await order.save();
//   //       }
//   //   }
//   // } catch (error) {
//   //   return { EC: 99, EM: error.message };
//   // }
// };

module.exports = {
  createOrder,
  getAllOrder,
  getOrderByUser,
  previewOrder,
  updateStatus,
  getDetailOrder,
  handleCancelPaymentService,
  // deleteOrderService,
};
