const Discount = require("../models/Discount.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const {
  createNotificationForAll,
} = require("../services/Notification.service");

const createDiscount = async (newDiscount) => {
  const existingDiscount = await Discount.findOne({
    discount_code: newDiscount.discount_code,
  });
  if (existingDiscount) {
    return { EC: 1, EM: "Mã giảm giá này đã tồn tại", data: null };
  }
  const discountData = new Discount(newDiscount);
  await discountData.save();
  await User.updateMany(
    {},
    {
      $push: {
        discounts: discountData._id,
      },
    }
  );
  const startDate = new Date(
    discountData.discount_start_day
  ).toLocaleDateString("vi-VN");
  const endDate = new Date(discountData.discount_end_day).toLocaleDateString(
    "vi-VN"
  );
  await createNotificationForAll({
    notify_type: "Khuyến mãi",
    notify_title: `Ưu đãi mới: ${discountData.discount_title}`,
    notify_desc: `Từ ${startDate} đến ${endDate}, sử dụng mã "${discountData.discount_code}" để nhận giảm giá ${discountData.discount_number}%!`,
    discount_id: discountData._id,
    img: "https://cdn.lawnet.vn/uploads/tintuc/2022/11/07/khuyen-mai.jpg", // Nếu có ảnh thì truyền vào
    //   redirect_url: "/discounts", // URL chuyển hướng khi bấm vào noti (nếu có)
  });
  return {
    EC: 0,
    EM: "Tạo mã giảm giá mới thành công",
    data: discountData,
  };
};

const getDetailDiscount = async (discountId) => {
  const existingDiscount = await Discount.findById(discountId);
  if (!existingDiscount) {
    return { EC: 2, EM: "Mã giảm giá không tồn tại" };
  }
  return {
    EC: 0,
    EM: "Lấy thông tin mã giảm giá thành công",
    data: existingDiscount,
  };
};

const getAllDiscount = async () => {
  const listDiscount = await Discount.find();
  return {
    EC: 0,
    EM: "Lấy tất cả mã giảm giá thành công",
    data: listDiscount,
  };
};

const updateDiscount = async (discountId, updateData) => {
  const existingDiscount = await Discount.findById(discountId);

  if (!existingDiscount) {
    return { EC: 2, EM: "Mã giảm giá này không tồn tại" };
  }

  const updatedDiscount = await Discount.findByIdAndUpdate(
    discountId,
    updateData,
    { new: true, runValidators: true }
  );
  return {
    EC: 0,
    EM: "Cập nhật mã giảm giá thành công",
    data: updatedDiscount,
  };
};

const deleteDiscount = async (discountId) => {
  const existingDiscount = await Discount.findById(discountId);

  if (!existingDiscount) {
    return { EC: 2, EM: "Mã giảm giá này không tồn tại" };
  }

  await existingDiscount.delete();
  return {
    EC: 0,
    EM: "Xóa mã giảm giá thành công",
  };
};

const getForOrder = async (userId, productIds) => {
  const user = await User.findById(userId);
  if (!user) return { EC: 2, EM: "Không tìm thấy người dùng" };
  const products = await Product.find({ _id: { $in: productIds } }).populate(
    "product_category"
  );
  if (products.length === 0) return { EC: 3, EM: "Không tìm thấy sản phẩm" };
  const now = new Date();
  const discounts = await Discount.find({
    _id: { $in: user.discounts },
    status: "active",
    discount_start_day: { $lte: now },
    discount_end_day: { $gte: now },
  });
  if (discounts.length === 0)
    return { EC: 0, EM: "Không tìm thấy mã giảm giá", discounts: [] };
  const applicableDiscounts = discounts.filter((discount) => {
    const appliesToProduct = products.every((product) =>
      discount.applicable_products.some((dpid) => dpid.equals(product._id))
    );
    const appliesToCategory = products.every((product) =>
      discount.applicable_categories.some((dcid) =>
        dcid.equals(product.product_category._id)
      )
    );
    return appliesToProduct || appliesToCategory;
  });

  return {
    EC: 0,
    EM: "Lấy mã giảm giá thành công",
    data: applicableDiscounts,
  };
};

module.exports = {
  createDiscount,
  getDetailDiscount,
  getAllDiscount,
  updateDiscount,
  deleteDiscount,
  getForOrder,
};
