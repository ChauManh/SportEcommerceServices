const mongoose = require("mongoose");
const MongooseDelete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    category_gender: {
      type: String,
      enum: ["Nam", "Nữ", "Unisex", null], 
      default: null
    },
    category_type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, 
    },
    category_parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true 
    },
    category_level: { type: Number, required: true, default: 1,},
    
  },
  {
    timestamps: true,
    collection: 'Category'
  }
);

categorySchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: "all" });

module.exports = mongoose.model("Category", categorySchema);
