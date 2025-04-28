require("dotenv").config();
const PayOS = require("@payos/node");

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const setWebhook = async () => {
  const webhookURL = `${process.env.BASE_URL_BE}/payment/payos-webhook`; // Thay đổi BASE_URL thành địa chỉ server của bạn
  console.log(webhookURL);
  try {
    const response = await payOS.confirmWebhook(webhookURL);
    console.log('Webhook confirmation successful:', response);
  } catch (error) {
    console.error('Error confirming webhook:', error);
  }
};

module.exports = { payOS, setWebhook };
