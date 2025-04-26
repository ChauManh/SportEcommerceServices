const notificationService = require("../services/Notification.service");

const createNotificationForAll = async (req, res) => {
  try {
    const notificationData = req.body;

    const result = await notificationService.createNotificationForAll(
      notificationData
    );
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const readNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const result = await notificationService.readNotification(notificationId);

    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const result = await notificationService.getNotification(notificationId);

    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getUserNotifications = async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await notificationService.getUserNotifications(userId);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getAllNotification = async (req, res) => {
  try {
    const result = await notificationService.getAllNotification();

    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const deleteNotification = async (req, res) => {
  try {
    const currentUser = req.user;
    const notificationId = req.params.id;

    const result = await notificationService.deleteNotification(notificationId, currentUser);

    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};
module.exports = {
  createNotificationForAll,
  readNotification,
  getNotification,
  getAllNotification,
  deleteNotification,
  getUserNotifications,
};
