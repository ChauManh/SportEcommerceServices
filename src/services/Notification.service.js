const Notification = require("../models/Notification.model");
const User = require("../models/User.model");

const createNotificationForAll = async (notificationData) => {
  const users = await User.find({}, "_id");

  if (!users || users.length === 0) {
    return {
      EC: 1,
      EM: "Không có người dùng nào trong hệ thống",
    };
  }

  const notifications = users.map((user) => ({
    ...notificationData,
    user_id: user._id,
  }));

  await Notification.insertMany(notifications);

  return {
    EC: 0,
    EM: "Tạo thông báo cho tất cả người dùng thành công",
    data: notifications.length,
  };
};

const readNotification = async (notificationId) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return {
      EC: 1,
      EM: "Thông báo không tồn tại",
    };
  }

  await Notification.findByIdAndUpdate(
    notificationId,
    { $set: { isRead: true } },
    { new: true, runValidators: true }
  );

  return {
    EC: 0,
    EM: "Đọc thông báo thành công",
  };
};

const getNotification = async (notificationId) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return {
      EC: 1,
      EM: "Thông báo không tồn tại",
    };
  }
  return {
    EC: 0,
    EM: "Lấy thông tin thông báo thành công",
    data: notification,
  };
};

const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({ user_id: userId }).sort({
    createdAt: -1,
  }); // Mới nhất lên trước
  if (!notifications || notifications.length === 0) {
    return {
      EC: 0,
      EM: "Không có thông báo nào",
      data: [],
    };
  }

  return {
    EC: 0,
    EM: "Lấy thông báo của người dùng thành công",
    data: notifications,
  };
};

const getAllNotification = async () => {
  const notification = await Notification.find({});
  return {
    EC: 0,
    EM: "Lấy tất cả thông tin thông báo thành công",
    data: notification,
  };
};

const deleteNotification = async (notificationId, currentUser) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    return {
      EC: 1,
      EM: "Thông báo không tồn tại",
    };
  }
  if (currentUser.role !== "admin") {
    if (
      !notification.user_id ||
      notification.user_id.toString() !== currentUser.userId
    ) {
      return res.status(403).json({
        EC: 2,
        EM: "Bạn không có quyền xóa thông báo này",
      });
    }
  }
  await notification.delete();
  return {
    EC: 0,
    EM: "Xóa thông báo thành công",
  };
};

const createNotificationForUser = async (userId, notificationData) => {
  const notification = new Notification({
    ...notificationData,
    user_id: userId,
  });

  await notification.save();

  return {
    EC: 0,
    EM: "Tạo thông báo thành công",
    data: notification,
  };
};

module.exports = {
  createNotificationForAll,
  createNotificationForUser,
  readNotification,
  getNotification,
  getAllNotification,
  deleteNotification,
  getUserNotifications,
};
