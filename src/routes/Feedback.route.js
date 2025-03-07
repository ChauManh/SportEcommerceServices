const express = require ('express')
const router = express.Router()
const feedbackController = require('../controllers/Feedback.controller')
router.post('/create', feedbackController.createFeedback)
router.patch('/update/:id', feedbackController.updateFeedback)
router.delete('/delete/:id', feedbackController.deleteFeedback)
router.get('/get-all/:productId', feedbackController.getAllFeedback)
module.exports = router