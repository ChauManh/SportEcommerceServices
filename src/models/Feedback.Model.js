const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true,},
    variant_id: { type: String, required: false },
    order_id: {type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true,},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    content: { type: String, required: true },
    feedback_media: {
        images: [{ type: String }], 
        videos: [{ type: String }], 
    },
    rating: { type: Number, required: true },
    replied_by_admin: { type: String },
  },
  {
    timestamps: true,
    collection: "Feedback",
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
