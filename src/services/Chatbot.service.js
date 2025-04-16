const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const ChatHistory = require('../models/ChatHistory.model');
const Category = require('../models/Category.Model');

const chatWithBotService = async (message, user) => {
    try {
        console.log("User: ", user);
        if (!user) {
            throw new Error('Người dùng không hợp lệ');
        }
        let chat = await ChatHistory.findOne({ userId: user.userId });
        if (!chat) {
            chat = new ChatHistory({
                userId: user.userId,
                messages: [
                    {
                        role: 'system',
                        content: `Bạn là một trợ lý bán hàng chuyên tư vấn sản phẩm thể thao của cửa hàng WTM, bạn đang phục vụ khách hàng có tên là ${user.user_name}.`,
                    }
                ]
            });
        }

        // Thêm câu hỏi mới của user
        chat.messages.push({ role: 'user', content: message });

        // Gọi OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: chat.messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        // Lưu câu trả lời vào DB
        chat.messages.push({ role: 'assistant', content: reply });
        chat.updatedAt = new Date();
        await chat.save();
        return { EC: 0, EM: "Reply success", reply };

    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}

const SearchProductService = async (message) => {
    try {
      const categoryLevel1Docs = await Category.find({ category_level: 1 }, 'category_type');
      const categoryLevel2Docs = await Category.find({ category_level: 2 }, 'category_type');
      
      const category_name = [...new Set(categoryLevel1Docs.map(doc => doc.category_type))];
      const category_sub = [...new Set(categoryLevel2Docs.map(doc => doc.category_type))];
      
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Dựa vào thông tin message, hãy tạo string như sau:
                            {"category": string (phải nằm trong danh sách: [${category_name.join(', ')}]; và lấy category_type) "category_gender": string (phải nằm trong danh sách: [Nam, Nữ, Unisex], nếu không có thì để trống) "category_sub": string (nếu có)(phải nằm trong danh sách: [${category_sub.join(', ')}]; và lấy category_type) "price_min": number (nếu có - không có thì bằng 0) "price_max": number (nếu có - không có thì bằng 0) "product_color": string (nếu có) "product_brand": string (nếu có)}
                            Chỉ trả về string,`,
                    },
                    { role: 'user', content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const filters = response.data.choices[0].message.content;
        console.log(filters);
        return { EC: 0, EM: "Reply success", data: filters };

    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}
module.exports = {
    chatWithBotService,
    SearchProductService,
};