const notificationService = require('../services/Notification.service')

const createNotification = async(req, res) =>{
    try {
        const newNotification = req.body;

        const result =  await notificationService.createNotification(newNotification);
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message);
    }
}

const readNotification = async(req, res) =>{
    try {
        const notificationId = req.params.id;

        const result = await notificationService.readNotification(notificationId);

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const getNotification = async(req, res) => {
    try {
        const notificationId = req.params.id;

        const result = await notificationService.getNotification(notificationId);

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const getAllNotification = async(req, res) => {
    try {
        const result = await notificationService.getAllNotification();

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const deleteNotification = async(req, res) => {
    try {
        const notificationId = req.params.id;

        const result = await notificationService.deleteNotification(notificationId);

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}
module.exports = {
    createNotification,
    readNotification,
    getNotification,
    getAllNotification,
    deleteNotification
}