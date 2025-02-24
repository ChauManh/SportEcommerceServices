const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    category_gender: {type: String},
    category_type: {type: String, required: true,},
    category_parent_id: {type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, },
    // slug: { 
    //   type: String, 
    //   unique: true, 
    //   required: true, 
    //   default: function() { return ""; } // Đảm bảo `slug` không bị lưu null
    // },
    category_level: { type: Number, required: true, default: 1,},
    // isActive: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
    collection: 'Category'
  }
);

module.exports = mongoose.model("Category", CategorySchema);
