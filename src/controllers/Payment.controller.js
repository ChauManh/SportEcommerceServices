const { handleWebhookService, getInfoOfPaymentService, deletePaymentService } = require("../services/Payment.service");

require("dotenv").config();

const paymentController = {
  async handleWebhook(req, res) {
    const data = req.body;
    const { signature } = req.body;
    try {
      const response = await handleWebhookService(data, signature);
      console.log("response", response);
      response.EC === 0
        ? res.success(data, response.EM)
        : res.error(response.EC, response.EM, 403);
    } catch (error) {
      console.log("Internal error", error);
      return res.InternalError(error.message);
    }
  },

  async getInfoOfPayment(req, res) {
    const { orderCode } = req.body;
    try {
      const response = await getInfoOfPaymentService(orderCode);
      response.EC === 0
        ? res.success(response.data, response.EM)
        : res.error(response.EC, response.EM);
    } catch (error) {
      console.log("Internal error", error);
      return res.InternalError(error.message);
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
      console.log("Internal error", error);
      return res.InternalError(error.message);
    }
  }
};

module.exports = paymentController;
