const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    home_address: { type: String },
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, unique: true, required: true },
    full_name: { type: String },
    password: { type: String, required: true },
    avt_img: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    addresses: [addressSchema], // Nhúng trực tiếp mảng địa chỉ vào User
    discounts:
      [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
        required: false,
      }],
    user_loyalty: {type: Number},
    birth: { type: Date },
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
      default: "Nam",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    searchhistory: [
      {
        message: { type: String },
        filters: { type: String }, 
        searchedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true, collection: "User" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
