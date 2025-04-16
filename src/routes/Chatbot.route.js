// routes/chat.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { optionalVerifyToken } = require('../middlewares/AuthMiddleWare');
const { ChatbotController } = require('../controllers/Chatbot.controller');
dotenv.config();

router.post('/', optionalVerifyToken ,ChatbotController.chatWithBot);
router.get('/', optionalVerifyToken, ChatbotController.SearchProduct);

module.exports = router;
