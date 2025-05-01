const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Discount = require("../models/Discount.model");
const User = require("../models/User.model");
const Cart = require("../models/Cart.model");
const { createNotificationForUser } = require("./Notification.service");
const {
  createPaymentService,
  checkPaymentIsCancelService,
} = require("./Payment.service");
const { logActivityHistory } = require("./LoginHistory.service");

const createOrder = async (newOrder, user_id) => {
  let {
    shipping_address,
    products,
    order_payment_method,
    order_note,
    discount_ids,
  } = newOrder;
  if (!shipping_address) {
    return {
      EC: 2,
      EM: "Địa chỉ là bắt buộc",
    };
  }
  if (!order_payment_method) {
    return {
      EC: 3,
      EM: "Phương thức thanh toán là bắt buộc",
    };
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return { EC: 1, EM: "Yêu cầu phải có sản phẩm" };
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
      return { EC: 2, EM: `Không tìm thấy sản phẩm: ${productId}` };
    }

    let totalQuantity = 0;

    for (const item of items) {
      const color = product.colors.find(
        (c) => c.color_name === item.color_name
      );
      if (!color) {
        return { EC: 3, EM: `Không tìm thấy màu sản phẩm: ${item.color_name}` };
      }

      const variant = color.variants.find(
        (v) => v.variant_size === item.variant_name
      );
      if (!variant) {
        return {
          EC: 4,
          EM: `Không tìm thấy size sản phẩm: ${item.variant_name}`,
        };
      }

      if (variant.variant_countInStock < item.quantity) {
        return { EC: 5, EM: `Sản phẩm ${item.product_id} đã hết hàng` };
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
    EM: "Đơn hàng được tạo thành công",
    data: {
      ...savedOrder.toObject(),
      resultPayOS,
    },
    cart: [],
  };
};

const getAllOrder = async (orderStatus) => {
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
};

const getOrderByUser = async (userId, orderStatus) => {
  if (!userId) {
    return { EC: 1, EM: "Mã khách hàng là bắt buộc" };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { EC: 2, EM: "Người dùng không tồn tại" };
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
};

const previewOrder = async (newOrder, userId) => {
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
    return { EC: 1, EM: "Danh sách sản phẩm là bắt buộc" };
  }

  let delivery_fee = 50000;
  let order_total_price = 0;

  const orderProducts = await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product_id);
      if (!product)
        return { EC: 2, EM: `Không tìm thấy sản phẩm: ${item.product_id}` };

      const color = product.colors.find((c) => c._id.toString() === item.color);
      if (!color) {
        return { EC: 3, EM: `Không tìm thấy màu: ${item.color_id}` };
      }

      const variant = color.variants.find(
        (v) => v._id.toString() === item.variant
      );
      if (!variant) {
        return { EC: 4, EM: `Không tìm thấy mẫu: ${item.variant_id}` };
      }

      if (variant.variant_countInStock < item.quantity) {
        return { EC: 5, EM: `Sản phẩm ${item.product_id} đã hết hàng` };
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
          totalDiscount += (discountableTotal * discount.discount_number) / 100;
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
    EM: "Xem trước đơn hàng thành công",
    data: previewOrder,
  };
};

const updateStatus = async (
  orderId,
  status,
  currentUserId,
  currentUserRole,
  login_history_id,
  options = { bypassPermission: false }
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return { EC: 1, EM: "Đơn hàng không tồn tại" };
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
  const canUpdateOrderStatus = ({ currentStatus, newStatus, isOwner }) => {
    if (options.bypassPermission) return true;
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
  const updateFields = {
    order_status: status,
  };
  if (isAdmin && status === "Hoàn thành") {
    updateFields.is_paid = true;
    updateFields.received_date = new Date();
  }
  if (isOwner && status === "Yêu cầu hoàn") {
    updateFields.is_require_refund = true;
  }
  const updateOrder = await Order.findByIdAndUpdate(orderId, updateFields, {
    new: true,
    runValidators: true,
  });
  if (!updateOrder) {
    return {
      EC: 3,
      EM: "Cập nhật đơn hàng không thành công",
    };
  } else {
    if (["Hủy hàng", "Hoàn hàng"].includes(status)) {
      try {
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
      } catch (err) {
        return {
          EC: 4,
          EM: "Lỗi khi hoàn hàng về kho",
        };
      }
    }
    const sendOrderStatusNotification = async () => {
      const role = options.bypassPermission
        ? "system"
        : isAdmin
        ? "admin"
        : "owner";

      const descMap = {
        admin: {
          "Đang chuẩn bị hàng": "Đơn hàng của bạn đang được chuẩn bị.",
          "Đang giao": "Đơn hàng đang được giao đến bạn.",
          "Hoàn thành":
            order.order_status === "Yêu cầu hoàn"
              ? "Rất tiếc, yêu cầu hoàn hàng của bạn không được chấp nhận."
              : "Đơn hàng đã được giao, cảm ơn bạn đã mua hàng tại WTM Sport!",
          "Hoàn hàng": "Đơn hàng đã được hoàn trả thành công.",
        },
        owner: {
          "Yêu cầu hoàn":
            "Yêu cầu hoàn hàng của bạn đã được tiếp nhận, vui lòng chờ để được liên hệ làm việc.",
          "Hủy hàng": "Đơn hàng của bạn đã được hủy, xin lỗi quý khách.",
        },
        system: {
          "Hủy hàng":
            "Đơn hàng của bạn đã bị hủy do quá thời gian thanh toán, vui lòng đặt lại đơn hàng nếu cần.",
        },
      };

      const imageMap = {
        admin: {
          "Đang chuẩn bị hàng":
            "https://media.istockphoto.com/id/1372074867/vi/vec-to/chu%E1%BA%A9n-b%E1%BB%8B-s%C6%A1-b%E1%BB%99.jpg",
          "Đang giao":
            "https://dungculambanh.com.vn/wp-content/uploads/freight-icon-png-11.png",
          "Hoàn thành":
            order.order_status === "Yêu cầu hoàn"
              ? "https://vietcalib.vn/wp-content/uploads/2023/02/Icon-doi-tra.png"
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfz3upZJUzgki4bn27faJf6gPIIo7Yo5HxZg&s",
          "Hoàn hàng":
            "https://beewatch.vn/wp-content/uploads/2021/07/Icon-Doi-Tra-Hang.jpg",
        },
        owner: {
          "Yêu cầu hoàn":
            "https://icon-library.com/images/cancelled-icon/cancelled-icon-4.jpg",
          "Hủy hàng":
            "https://png.pngtree.com/png-clipart/20240513/original/pngtree-help-desk-icon-reception-info-professional-photo-png-image_15081159.png",
        },
        system: {
          "Hủy hàng":
            "https://img.freepik.com/premium-vector/payment-canceled-illustration_8499-3034.jpg",
        },
      };

      const notify_desc = descMap[role]?.[status];
      const img = imageMap[role]?.[status];

      if (notify_desc && img) {
        await createNotificationForUser(updateOrder.user_id, {
          notify_type: "Tình trạng đơn hàng",
          notify_title: `Đơn hàng #${updateOrder._id} đã được cập nhật.`,
          notify_desc,
          order_id: updateOrder._id,
          img,
        });
      }
    };
    await sendOrderStatusNotification();
    if (isAdmin && login_history_id) {
      await logActivityHistory({
        login_history_id,
        activity: {
          action: "Cập nhật trạng thái đơn hàng",
          order_id: updateOrder._id,
          prev_status: currentStatus,
          new_status: status,
        },
      });
    }
    return {
      EC: 0,
      EM: "Cập nhật trạng thái đơn hàng thành công",
      data: updateOrder,
    };
  }
};

const getDetailOrder = async (orderId, user) => {
  const order = await Order.findById(orderId).populate("products.product_id");
  if (!order) {
    return { EC: 1, EM: "Đơn hàng không tồn tại", data: null };
  }
  if (order.user_id) {
    if (!order.user_id === user.userId || !user.role === "admin") {
      return {
        EC: 2,
        EM: "Bạn không có quyền truy cập đơn hàng này",
      };
    }
  }
  return {
    EC: 0,
    EM: "Xem chi tiết đơn hàng thành công",
    data: order,
  };
};

const handleCancelPaymentService = async (
  orderCode,
  currentUserId,
  currentUserRole
) => {
  if (!orderCode) {
    return { EC: 1, EM: "Mã đơn hàng là bắt buộc" };
  }
  if (!checkPaymentIsCancelService(orderCode)) {
    return { EC: 2, EM: "Thông tìn là bắt buộc" };
  } else {
    const order = await Order.findOne({ order_code: orderCode });
    if (!order) {
      return { EC: 3, EM: "Đơn hàng không tồn tại" };
    }
    if (order.order_payment_method === "Paypal" && order.is_paid === false) {
      const result = await updateStatus(
        order._id,
        "Hủy hàng",
        currentUserId,
        currentUserRole
      );
      if (result.EC === 0) {
        return { EC: 0, EM: "Hủy đơn hàng thành công", data: result.data };
      } else {
        return { EC: 4, EM: result.EM };
      }
    }
  }
};

const getRevenue = async (year) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${parseInt(year) + 1}-01-01`);
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $facet: {
        byMonth: [
          {
            $group: {
              _id: {
                month: { $month: "$createdAt" },
                status: "$order_status",
                payment: "$is_paid",
              },
              total: { $sum: "$order_total_final" },
            },
          },
        ],
      },
    },
  ]);

  const { byMonth, byCategory } = result[0];
  // Doanh thu theo tháng
  const fullMonthly = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const filtered = byMonth.filter((b) => b._id.month === month);
    const completedRevenue = filtered
      .filter((f) => f._id.status === "Hoàn thành")
      .reduce((acc, curr) => acc + curr.total, 0);
    const cancelledRevenue = filtered
      .filter((f) => f._id.status === "Hủy hàng")
      .reduce((acc, curr) => acc + curr.total, 0);
    const paidRevenue = filtered
      .filter((f) => f._id.payment === true)
      .reduce((acc, curr) => acc + curr.total, 0);

    return {
      month,
      completedRevenue,
      cancelledRevenue,
      paidRevenue,
    };
  });

  return {
    EC: 0,
    EM: "Lấy thống kê thành công",
    data: {
      revenueByMonth: fullMonthly,
    },
  };
};

module.exports = {
  createOrder,
  getAllOrder,
  getOrderByUser,
  previewOrder,
  updateStatus,
  getDetailOrder,
  handleCancelPaymentService,
  getRevenue,
};
