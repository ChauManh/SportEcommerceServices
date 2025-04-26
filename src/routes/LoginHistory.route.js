const express = require("express");
const router = express.Router();
const LoginHistoryController = require("../controllers/LoginHistory.controller");
const { verifyToken, identifyAdmin } = require("../middlewares/AuthMiddleWare");

router.get(
  "/",
  verifyToken,
  identifyAdmin,
  LoginHistoryController.getLoginHistory
);
router.get(
  "/:id",
  verifyToken,
  identifyAdmin,
  LoginHistoryController.getActivitiesByLoginHistoryId
);

module.exports = router;
