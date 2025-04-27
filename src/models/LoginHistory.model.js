const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String, // ví dụ: "UPDATE_ORDER_STATUS"
      required: true,
      enum: ["Cập nhật trạng thái đơn hàng"], // Bạn có thể thêm nhiều action khác tại đây nếu cần
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true, // Cần có order_id để liên kết với đơn hàng
    },
    prev_status: {
      type: String,
      required: true,
    },
    new_status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const loginHistorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin"], // Nếu chỉ có một role, bạn có thể giữ như này, nếu có thêm role khác, mở rộng enum
    },
    ip: {
      type: String,
      required: true,
    },
    user_agent: {
      type: String,
      default: "unknown", // Nếu không có user_agent, sẽ mặc định là "unknown"
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    activities: [activitySchema], // Lưu mảng activities để theo dõi hành động trong phiên đăng nhập
  },
  { timestamps: true,
    collection: "LoginHistory"
   }
);

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
module.exports = LoginHistory;
