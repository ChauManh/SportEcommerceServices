const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const variantSchema = new mongoose.Schema({
    variant_color: { type: String },
    variant_size: { type: String },
    variant_img: {
      image_main: { type: String, required: true }, 
      image_subs: [{ type: String }] 
    },
    variant_price: { type: Number, required: true, default: 0 },
    variant_countInStock: { type: Number, required: true, default: 0 },
    variant_percent_discount: { type: Number, default: 0 }
  });
  
const productSchema = new mongoose.Schema(
  {
    product_title: { type: String, required: true },
    product_category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    product_img: {
      image_main: { type: String, required: true }, 
      image_subs: [{ type: String }] 
    },
    product_brand: { type: String, required: true }, 
    product_description: { type: String, required: true },
    product_display: { type: Boolean, required: true, default: true },
    product_famous: { type: Boolean, required: true, default: false },
    product_rate: { type: Number },
    product_feedback: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }],
    product_selled: { type: Number, required: false },
    product_percent_discount: { type: Number },
    product_price: { type: Number, required: true, default: 0},
    product_countInStock: { type: Number, required: true, default: 0 },
    variants: [variantSchema],
  },
  {
    timestamps: true,
    collection: "Product"
  }
);

productSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: "all" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
