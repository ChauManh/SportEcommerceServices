const Feedback = require("../models/Feedback.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const checkFeedbackAndModerate = require("../utils/OpenAIModeration");

const createFeedback = async (newFeedback) => {
  const { order_id, product_id, user_id, variant, color, content } =
    newFeedback;

  const existingFeedback = await Feedback.findOne({
    order_id,
    product_id,
    user_id,
    variant,
    color,
  });

  if (existingFeedback) {
    return {
      EC: 2,
      EM: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!",
      data: null,
    };
  }

  const moderationFeedback = await checkFeedbackAndModerate(content);
  if (moderationFeedback.isFlagged) {
    return {
      EC: 3,
      EM: "Feedback chứa nội dung k phù hợp",
    };
  }

  const feedback = new Feedback(newFeedback);
  await feedback.save();

  const allFeedbacks = await Feedback.find({ product_id });
  const totalRating = allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
  const avgRating = totalRating / allFeedbacks.length;

  await Order.findByIdAndUpdate(order_id, {
    $set: { is_feedback: true },
  });
  // Cập nhật product_rate
  await Product.findByIdAndUpdate(product_id, {
    $set: { product_rate: avgRating.toFixed(1) },
  });

  return {
    EC: 0,
    EM: "Đánh giá thành công",
    data: feedback,
  };
};

const updateFeedback = async (feedbackId, updateData) => {
  const updatedFeedback = await Feedback.findByIdAndUpdate(
    feedbackId,
    updateData,
    { new: true, runValidators: true }
  );

  if (!updatedFeedback) {
    return { EC: 2, EM: "Đánh giá không tồn tại", data: null };
  }

  return { EC: 0, EM: "Cập nhật đánh giá thành công", data: updatedFeedback };
};

const deleteFeedback = async (feedbackId) => {
  const existFeedback = await Feedback.findById(feedbackId);
  if (!existFeedback) {
    return { EC: 1, EM: "Đánh giá không tồn tại", data: null };
  }
  await Feedback.findByIdAndDelete(feedbackId);
  return { EC: 0, EM: "Xóa đánh giá thành công" };
};

const getAllFeedback = async (productId) => {
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    return { EC: 1, EM: "Sản phẩm không tồn tại", data: null };
  }

  const list_feedback = await Feedback.find({ product_id: productId }).populate(
    "user_id",
    "user_name avt_img"
  );
  return {
    EC: 0,
    EM: "Lấy thông tin đánh giá thành công",
    data: list_feedback,
  };
};
module.exports = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
