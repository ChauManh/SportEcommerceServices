const Notification = require ('../models/Notification.model')
const User = require('../models/User.model')

const createNotification = async (notificationData) => {
    try {
      const users = await User.find({}, '_id');
  
      if (!users || users.length === 0) {
        return {
          EC: 1,
          EM: 'Không có người dùng nào trong hệ thống',
        };
      }
  
      const notifications = users.map((user) => ({
        ...notificationData,
        user_id: user._id,
      }));
  
      await Notification.insertMany(notifications);
  
      return {
        EC: 0,
        EM: 'Tạo thông báo cho tất cả người dùng thành công',
        data: notifications.length,
      };
    } catch (error) {
      return {
        EC: -1,
        EM: error.message,
      };
    }
  };

const readNotification = async(notificationId) =>{
    try {
        const notification = await Notification.findById(notificationId);

        if(!notification){
            return{
                EC: 1,
                EM: "Thong bao k ton tai"
            }
        }

        const updateNotification = await Notification.findByIdAndUpdate(
            notificationId,
            {$set : {isRead : true}},
            { new: true, runValidators: true }
        )

        return {
            EC: 0,
            EM: "Doc thong bao thanh cong",
        }
    } catch (error) {
        return{
            EC: -999,
            EM: error.message
        }
    }
}

const getNotification = async(notificationId) =>{
    try {
        const notification = await Notification.findById(notificationId);

        if(!notification){
            return{
                EC: 1,
                EM: "Thong bao k ton tai"
            }
        }
        return {
            EC: 0,
            EM: "Lay thong bao thanh cong",
            data: notification
        }
    } catch (error) {
        return{
            EC: -999,
            EM: error.message
        }
    }
}

const getAllNotification = async() =>{
    try {
        const notification = await Notification.find({});
        return {
            EC: 0,
            EM: "Lay tat ca thong bao thanh cong",
            data: notification
        }
    } catch (error) {
        return{
            EC: -999,
            EM: error.message
        }
    }
}


const deleteNotification = async(notificationId) =>{
    try {
        const notification = await Notification.findById(notificationId);

        if(!notification){
            return{
                EC: 1,
                EM: "Thong bao k ton tai"
            }
        }

        await notification.delete({_id: notificationId});

        return {
            EC: 0,
            EM: "Xoa thong bao thanh cong"
        }
    } catch (error) {
        return{
            EC: -999,
            EM: error.message
        }
    }
}

module.exports = {
    createNotification,
    readNotification,
    getNotification,
    getAllNotification,
    deleteNotification
}