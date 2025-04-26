const {
  createUserService,
  loginService,
  sentOTPService,
  verifyOTPService,
  resetPasswordService,
  loginWithGoogleService,
  refreshTokenService,
  SignUpWithGoogleService,
} = require("../services/Auth.service");

const authController = {
  async createUser(req, res) {
    const { user_name, email, password } = req.body;
    try {
      const result = await createUserService({
        user_name,
        email,
        password,
      });
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async loginUser(req, res) {
    const { user_name, password } = req.body;
    const ip = req.ip;
    const user_agent = req.headers["user-agent"] || "unknown";
    try {
      const result = await loginService(user_name, password, ip, user_agent);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM, 401);
    } catch (error) {
      return res.InternalError();
    }
  },

  async SignUpWithGoogle(req, res) {
    const { email, user_name, uid } = req.body;
    try {
      const result = await SignUpWithGoogleService(email, user_name, uid);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM, 400);
    } catch (error) {
      return res.InternalError();
    }
  },

  async loginUserWithGoogle(req, res) {
    const { email, uid } = req.body;
    try {
      const result = await loginWithGoogleService(email, uid);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM, 401);
    } catch (error) {
      return res.InternalError();
    }
  },

  async sendOTP(req, res) {
    const { email } = req.body;
    try {
      const result = await sentOTPService(email);
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async verifyOtp(req, res) {
    const { email, otp } = req.body;
    try {
      const result = await verifyOTPService(email, otp);
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body;
    try {
      const result = await resetPasswordService(email, newPassword);
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    try {
      const result = await refreshTokenService(refreshToken);
      return result.EC === 0
        ? res.success(result.result, result.EM)
        : res.error(result.EC, result.EM, 401);
    } catch (error) {
      return res.InternalError();
    }
  },
};
module.exports = authController;
