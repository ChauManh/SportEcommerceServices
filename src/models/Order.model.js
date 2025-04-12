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
      name: { type: String, required: true },
      phone: { type: String, required: true },
      home_address: { type: String, require: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String, required: true },
    },
    products: [
      {
        _id: false,
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        color: {type: String, require: true},
        variant: { type: String, required: true },
        //product_order_type: { type: String }
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
    is_feedback: { type: Boolean},
    is_paid: { type: Boolean, default: false },
    order_code: { type: Number },
    order_loyalty: {type: Number}
  },
  {
    timestamps: true,
    collection: "Order",
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
