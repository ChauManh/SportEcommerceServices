const axios = require('axios')

const checkFeedbackAndModerate = async (feedback) => {
  try {
    const chatMessages = [
      { role: 'system', content: 'Bạn là người kiểm tra từ ngữ nhạy cảm trong phản hồi của người dùng.' },
      { role: 'user', content: `Hãy kiểm tra nội dung của feedback này: "${feedback}". Kiểm tra xem có từ ngữ thô tục, xúc phạm hoặc từ viết tắt như "cặc", "lồn", "con mẹ mày", "cc", "dcm", "vl",... hay không. chỉ trả lời có hoặc không` },
    ];

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', 
        messages: chatMessages, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data;

    const content = result.choices[0].message.content.toLowerCase();
    
    console.log(content)

    if (content === "có") {
      return {
        isFlagged: true
      };
    } else {
      return {
        isFlagged: false
      };
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra từ ngữ:', error.response ? error.response.data : error.message);
    return {
      isFlagged: true,
      message: 'Đã xảy ra lỗi trong quá trình kiểm tra feedback.',
    };
  }
};
  module.exports = checkFeedbackAndModerate;