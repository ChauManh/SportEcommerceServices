const { handleWebhookService } = require("../services/Payment.service");

require("dotenv").config();

const paymentController = {
  async handleWebhook(req, res) {
    const data = req.body;
    const signature = req.headers["x-payos-signature"];
    try {
      const response = await handleWebhookService(data, signature);
      response.EC === 0
        ? res.success(data, response.EM)
        : res.error(response.EC, response.EM, 403);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },
};

module.exports = paymentController;
