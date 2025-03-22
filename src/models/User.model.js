const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    home_address: { type: String },
    province: { type: String, required: true },
    district: { type: String, required: true },
    commune: { type: String, required: true },
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
    birth: { type: Date },
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
      default: "Nam",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true, collection: "User" }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
