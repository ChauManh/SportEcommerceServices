const {
  getLoginHistoryService,
  getActivitiesByLoginHistoryIdService,
} = require("../services/LoginHistory.service");

const loginHistoryController = {
  async getLoginHistory(req, res) {
    try {
      const result = await getLoginHistoryService();
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async getActivitiesByLoginHistoryId(req, res) {
    try {
      const id = req.params.id;
      const result = await getActivitiesByLoginHistoryIdService(id);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },
};

module.exports = loginHistoryController;
