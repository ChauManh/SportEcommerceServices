const {
  createUserService,
  loginService,
  sentOTPService,
  verifyOTPService,
  resetPasswordService,
  changePasswordService,
} = require("../services/Auth.service");

const authController = {
  async createUser(req, res) {
    const { user_name, email, password } = req.body;

    try {
      const data = await createUserService({
        user_name,
        email,
        password,
      });
      if (data) {
        return res.status(201).json(data);
      } else {
        return res
          .status(400)
          .json({ message: "User already exists or error occurred" });
      }
    } catch (error) {
      console.error("Error in createUser:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async loginUser(req, res) {
    const { user_name, password } = req.body;
    try {
      const userData = await loginService(user_name, password);

      if (userData.EC == 0) return res.status(200).json(userData);
      else {
        return res.status(401).json({
          EC: userData.EC,
          EM: userData.EM,
        });
      }
    } catch (e) {
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error",
        error: e.message,
      });
    }
  },

  async sendOTP(req, res) {
    const { email } = req.body;
    try {
      const Data = await sentOTPService(email);

      if (Data.EC == 0) return res.status(200).json(Data);
      else {
        return res.status(401).json({
          EC: Data.EC,
          EM: Data.EM,
        });
      }
    } catch (e) {
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error",
        error: e.message,
      });
    }
  },

  async verifyOtp(req, res) {
    const { email, otp } = req.body;
    try {
      const Data = await verifyOTPService(email, otp);

      if (Data.EC == 0) return res.status(200).json(Data);
      else {
        return res.status(401).json({
          EC: Data.EC,
          EM: Data.EM,
        });
      }
    } catch (e) {
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error",
        error: e.message,
      });
    }
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      const Data = await resetPasswordService(email, newPassword);

      if (Data.EC == 0) return res.status(200).json(Data);
      else {
        return res.status(401).json({
          EC: Data.EC,
          EM: Data.EM,
        });
      }
    } catch (e) {
      return res.status(500).json({
        EC: 3,
        EM: "Internal server error",
        error: e.message,
      });
    }
  },

  async changePassword(req, res) {
    const { email } = req.user;
    const { oldPassword, newPassword } = req.body;
    try {
      const Data = await changePasswordService(email, oldPassword, newPassword);

      if (Data.EC == 0) return res.status(200).json(Data);
      else {
        return res.status(401).json({
          EC: Data.EC,
          EM: Data.EM,
        });
      }
    } catch (e) {
      return res.status(500).json({
        EC: 4,
        EM: "Internal server error",
        error: e.message,
      });
    }
  },
};
module.exports = authController;
