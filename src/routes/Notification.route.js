const express = require('express')
const router = express.Router();
const notificationController = require('../controllers/Notification.controller')
const {verifyToken, identifyAdmin} = require('../middlewares/AuthMiddleWare')

router.post('/create', verifyToken, notificationController.createNotification)
router.patch('/read/:id', verifyToken, notificationController.readNotification)
router.get('/get-detail/:id', verifyToken,  notificationController.getNotification)
router.get('/get-all', verifyToken, notificationController.getAllNotification)
router.delete('/delete/:id', verifyToken, notificationController.deleteNotification)
module.exports = router;