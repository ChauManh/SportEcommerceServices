const express = require('express')
const router = express.Router();
const notificationController = require('../controllers/Notification.controller')
const {verifyToken, identifyAdmin} = require('../middlewares/AuthMiddleWare')

router.post('/create', verifyToken, identifyAdmin, notificationController.createNotificationForAll)
router.patch('/read/:id', verifyToken, notificationController.readNotification)
router.get('/get-detail/:id', verifyToken,  notificationController.getNotification)
router.get('/get-user-notifications', verifyToken, notificationController.getUserNotifications)
router.get('/get-all', verifyToken, notificationController.getAllNotification) // optional for admin
router.delete('/:id', verifyToken, notificationController.deleteNotification)
module.exports = router;