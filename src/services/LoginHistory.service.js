const LoginHistory = require("../models/LoginHistory.model");

/**
 * Log login history for admin user
 * @param {Object} params
 * @param {ObjectId} params.user_id - ID của người dùng
 * @param {String} params.role - Vai trò (mặc định là "admin")
 * @param {String} params.ip - Địa chỉ IP từ client
 * @param {String} params.user_agent - Trình duyệt / thiết bị
 */
const logLoginHistory = async ({ user_id, role, ip, user_agent }) => {
  // Tạo bản ghi LoginHistory cho admin
  const history = await LoginHistory.create({
    user_id,
    role,
    ip,
    user_agent,
  });
  return {
    EC: 0,
    EM: "Ghi lại phiên đăng nhập admin thành công",
    result: history,
  };
};

/**
 * Log activities during a login session
 * @param {Object} params
 * @param {ObjectId} params.login_history_id - ID của LoginHistory đã lưu
 * @param {Array} params.activities - Mảng các hoạt động trong phiên đăng nhập
 */
const logActivityHistory = async ({ login_history_id, activity }) => {
  // Cập nhật activity vào loginHistory
  await LoginHistory.findByIdAndUpdate(
    login_history_id,
    { $push: { activities: activity } },
    { new: true } // Trả về bản ghi mới sau khi cập nhật
  );
  return {
    EC: 0,
    EM: "Ghi lại phiên đăng nhập admin thành công",
    result: activity,
  };
};

const getLoginHistoryService = async () => {
  const result = await LoginHistory.find().sort({ createdAt: -1 });
  return {
    EC: 0,
    EM: "Lấy danh sách lịch sử đăng nhập thành công",
    result,
  };
};

const getLoginHistoryByIdService = async (id) => {
  const loginHistory = await LoginHistory.findById(id);
  if (!loginHistory) {
    return {
      EC: -1,
      EM: "Lịch sử đăng nhập không tồn tại",
      result: null,
    };
  }
  return {
    EC: 0,
    EM: "Lấy chi tiết lịch sử đăng nhập thành công",
    result: loginHistory,
  };
};

module.exports = {
  logLoginHistory,
  logActivityHistory,
  getLoginHistoryService,
  getLoginHistoryByIdService,
};
