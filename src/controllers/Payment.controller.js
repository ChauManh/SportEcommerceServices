const {
  handleWebhookService,
  getInfoOfPaymentService,
  deletePaymentService,
} = require("../services/Payment.service");

require("dotenv").config();

const paymentController = {
  async handleWebhook(req, res) {
    const data = req.body;
    const { signature } = req.body;
    try {
      const response = await handleWebhookService(data, signature);
      response.EC === 0
        ? res.success(data, response.EM)
        : res.error(response.EC, response.EM, response?.status);
    } catch (error) {
      return res.InternalError();
    }
  },

  async getInfoOfPayment(req, res) {
    const { orderCode } = req.params;
    try {
      const response = await getInfoOfPaymentService(orderCode);
      response.EC === 0
        ? res.success(response.data, response.EM)
        : res.error(response.EC, response.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async deletePayment(req, res) {
    const { orderCode } = req.body;
    try {
      const response = await deletePaymentService(orderCode);
      response.EC === 0
        ? res.success(response.data, response.EM)
        : res.error(response.EC, response.EM);
    } catch (error) {
      return res.InternalError();
    }
  },
};

module.exports = paymentController;
