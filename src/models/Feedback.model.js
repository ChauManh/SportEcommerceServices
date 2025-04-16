const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");

const feedbackSchema = new mongoose.Schema(
  {
    product_id: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true,},
    color: {type: String, require: true},
    variant: { type: String, required: true },
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

feedbackSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
