// routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const dotenv = require('dotenv');
const { verifyToken } = require('../middlewares/AuthMiddleWare');
const { ChatbotController } = require('../controllers/Chatbot.controller');
dotenv.config();

router.post('/', verifyToken ,ChatbotController.chatWithBot);
router.get('/', ChatbotController.SearchProduct);

module.exports = router;
