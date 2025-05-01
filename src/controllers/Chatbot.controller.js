const axios = require("axios");
const ChatbotService = require("../services/Chatbot.service");
const User = require("../models/User.model");
const dotenv = require("dotenv");
dotenv.config();

const ChatbotController = {
  async chatWithBot(req, res) {
    const { message, history } = req.body;
    try {
      const result = await ChatbotService.chatWithBotService(
        message,
        req.user,
        history
      );
      result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async SearchProduct(req, res) {
    const { message } = req.query;
    try {
      const result = await ChatbotService.SearchProductService(message);
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
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },
};
exports.ChatbotController = ChatbotController;
