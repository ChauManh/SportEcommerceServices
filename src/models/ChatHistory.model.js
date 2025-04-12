// models/ChatHistory.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: String, // 'user' hoặc 'assistant'
  content: String
});

const chatHistorySchema = new mongoose.Schema({
  userId: String,
  messages: [messageSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
