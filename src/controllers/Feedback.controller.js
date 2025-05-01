const feedbackService = require("../services/Feedback.service");
const upload = require("../middlewares/UploadMiddleWare");
const { processFiles } = require("../utils/UploadUtil");

const createFeedback = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.error(-1, err.message);
      }
      const { userId } = req.user;

      const {
        product_id,
        variant_id,
        order_id,
        content,
        rating,
        color,
        variant,
      } = req.body;

      if (
        !product_id ||
        !order_id ||
        !content ||
        !rating ||
        !color ||
        !variant
      ) {
        return res.error(3, "Các thông tin là bắt buộc");
      }

      const { images, videos } = processFiles(req.files);

      const feedbackData = {
        product_id,
        color,
        variant,
        order_id,
        user_id: userId,
        content,
        rating,
        feedback_media: { images, videos },
      };

      const result = await feedbackService.createFeedback(feedbackData);
      return result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    });
  } catch (error) {
    return res.InternalError();
  }
};

const updateFeedback = async (req, res) => {
  try {
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.error(-1, err.message);
      }

      const feedbackId = req.params.id;
      const { content, rating, replied_by_admin } = req.body;

      const { images, videos } = processFiles(req.files);

      const updateData = {};
      if (content) updateData.content = content;
      if (rating) updateData.rating = rating;
      if (replied_by_admin) updateData.replied_by_admin = replied_by_admin;
      if (images.length || videos.length) {
        updateData.feedback_media = { images, videos };
      }

      const result = await feedbackService.updateFeedback(
        feedbackId,
        updateData
      );
      return result.EC === 0
        ? res.success({ feedback: result.data }, result.EM)
        : res.error(result.EC, result.EM);
    });
  } catch (error) {
    return res.InternalError();
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const result = await feedbackService.deleteFeedback(feedbackId);
    return result.EC === 0
      ? res.success(null, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const productId = req.params.productId;
    const result = await feedbackService.getAllFeedback(productId);
    return result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

module.exports = {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getAllFeedback,
};
