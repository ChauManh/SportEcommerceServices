const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_name: { type: String, required: true },
    full_name: { type: String, required: true },
    password: { type: String, required: true },
    avt_img: { type: String },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    birth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
      default: "Nam",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
