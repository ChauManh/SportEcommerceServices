const {
  getLoginHistoryService,
  getLoginHistoryByIdService,
} = require("../services/LoginHistory.service");

const loginHistoryController = {
  async getLoginHistory(req, res) {
    try {
      const result = await getLoginHistoryService();
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async getLoginHistoryById(req, res) {
    try {
      const id = req.params.id;
      const result = await getLoginHistoryByIdService(id);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },
};

module.exports = loginHistoryController;
