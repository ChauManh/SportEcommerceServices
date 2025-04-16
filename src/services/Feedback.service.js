const Feedback = require('../models/Feedback.model');
const Product = require('../models/Product.Model');

const createFeedback = async(newFeedback) =>{
    try {
        const { order_id, product_id, user_id, variant, color } = newFeedback;

        const existingFeedback = await Feedback.findOne({ order_id, product_id, user_id, variant, color });

        if (existingFeedback) {
            return {
                EC: 2,
                EM: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!",
                data: null
            };
        }
        const feedback = new Feedback(newFeedback);
        await feedback.save();
        return {
            EC: 0,
            EM: "Create feedback successfully",
            data: feedback
          };
    } catch (error) {
        throw error
    }
}

const updateFeedback = async (feedbackId, updateData) => {
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            updateData,
            { new: true, runValidators: true } 
        );

        if (!updatedFeedback) {
            return { EC: 2, EM: "Feedback không tồn tại", data: null };
        }

        return { EC: 0, EM: "Cập nhật feedback thành công", data: updatedFeedback };
    } catch (error) {
        throw error;
    }
};


const deleteFeedback = async(feedbackId) =>{
    try {
        const existFeedback = await Feedback.findById(feedbackId);
        if (!existFeedback) {
            return { EC: 1, EM: "Feedback không tồn tại", data: null };
        }
        await Feedback.findByIdAndDelete(feedbackId);
        return { EC: 0, EM: "Xóa feedback thành công"};
    } catch (error) {
        throw error;
    }
}

const getAllFeedback = async(productId) =>{
    try {
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return { EC: 1, EM: "Product không tồn tại", data: null };
        }

        const list_feedback = await Feedback.find({product_id: productId}) .populate('user_id', 'user_name avt_img');;
        return { EC: 0, EM: "Get feedback thành công", data: list_feedback};
    } catch (error) {
        throw error
    }
}
module.exports = {
    createFeedback,
    updateFeedback,
    deleteFeedback,
    getAllFeedback
}