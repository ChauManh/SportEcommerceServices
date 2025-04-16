const axios = require('axios');
const ChatbotService = require('../services/Chatbot.service');
const User = require('../models/User.model');
const dotenv = require('dotenv');
dotenv.config();

const ChatbotController = {
    async chatWithBot(req, res) {
        const { message } = req.body;
        const result = await ChatbotService.chatWithBotService(message, req.user);
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM)
    },

    async SearchProduct(req, res){
        const { message } = req.query;
        console.log("Message: ", message);
        const result = await ChatbotService.SearchProductService(message);
        console.log(req.user);
        if (req.user && result.EC === 0) {
        
            await User.findByIdAndUpdate(
              req.user.userId,
              {
                $push: {
                  searchhistory: {
                    message,
                    filters: JSON.stringify(result.data),
                    searchedAt: new Date(), 
                  },
                },
              },
              { new: true }
            );
        }

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM)
    }
};
exports.ChatbotController = ChatbotController;