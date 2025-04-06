const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

// Schema cho biến thể (Size)
const variantSchema = new mongoose.Schema({
  variant_size: { type: String, required: true }, // VD: S, M, L, XL
  variant_price: { type: Number, required: true, default: 0 }, // Giá theo size
  variant_countInStock: { type: Number, required: true, default: 0 }, // Số lượng tồn kho
  // percent_discount: { type: Number, default: 0 }, // Giảm giá theo size
});

// Schema cho màu sắc
const colorSchema = new mongoose.Schema({
  color_name: { type: String, required: true }, 
  imgs: {
    img_main: { type: String, required: true },
    img_subs: [{ type: String, required: true }],
  },
  variants: [variantSchema], // Mỗi màu có nhiều size
  // percent_discount: { type: Number, default: 0 }
});

// Schema cho sản phẩm chính
const productSchema = new mongoose.Schema(
  {
    product_title: { type: String, required: true }, // Tên sản phẩm
    product_brand: { type: String, required: true }, // Thương hiệu
    product_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    }, // Danh mục
    product_description: { type: String, required: true }, // Mô tả sản phẩm
    product_img: { type: String, required: true }, //
    product_price: { type: Number,  default: 0 }, // Giá gốc (trước giảm giá)
    product_percent_discount: { type: Number, default: 0 }, // Giảm giá chung
    colors: [colorSchema], // Danh sách màu (mỗi màu có nhiều size)
    product_display: { type: Boolean, required: true, default: true }, // Có hiển thị không?
    product_countInStock: { type: Number },
    product_famous: { type: Boolean, required: true, default: false }, // Sản phẩm nổi bật?
    product_rate: { type: Number, default: 0 }, // Điểm đánh giá
    product_feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feedback" }], // Feedback của khách hàng
    product_selled: { type: Number, default: 0 }, // Số lượng đã bán
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
    collection: "Product",
  }
);

// Plugin xóa mềm
productSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
