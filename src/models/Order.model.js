const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    discount_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
        required: false,
      },
    ],
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
    delivery_fee: { type: Number, required: true, default: 0 },
    shipping_address: {
      full_name: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        home_address: { type: String, require: true },
        province: { type: String, required: true },
        district: { type: String, required: true },
        commune: { type: String, required: true },
      },
    },
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        variant: { type: mongoose.Schema.Types.ObjectId, required: true },
        product_order_type: { type: String }, // mới thêm, oke không???
        // product_price: { type: Number, required: true, default: 0 },
      },
    ],
    order_status: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đang chuẩn bị hàng",
        "Đang giao", 
        "Hoàn thành", 
        "Hoàn hàng",
        "Hủy hàng",
      ],
      default: "Chờ xác nhận",
    },
    order_payment_method: {
      type: String,
      enum: ["credit_card", "paypal", "cod", "apple_pay", "momo"],
      required: true,
      default: "cod",
    },
    order_delivery_date: {type: Date,},
    estimated_delivery_date: {type: Date,},
    order_total_price: {type: Number, required: true,},
    order_total_final: {type: Number, required: true,},
    order_total_discount: {type: Number, required: true,},
    order_note: { type: String },
    is_feedback: { type: Boolean}
  },
  {
    timestamps: true,
    collection: "Order",
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
