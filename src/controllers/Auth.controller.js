const {
  createUserService,
  loginService,
  sentOTPService,
  verifyOTPService,
  resetPasswordService,
  loginWithGoogleService
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
      return res.InternalError(error.message);
    }
  },

  async loginUser(req, res) {
    const { user_name, password } = req.body;
    try {
      const result = await loginService(user_name, password);
      return result.EC === 0
        ? res.success({ accessToken: result.accessToken }, result.EM)
        : res.error(result.EC, result.EM, 401);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async loginUserWithGoogle(req, res) {
    const {email, user_name, uid } = req.body;
    console.log(email, user_name, uid);
    try {
      const result = await loginWithGoogleService(email, user_name, uid);
      return result.EC === 0
       ? res.success({ accessToken: result.accessToken }, result.EM)
        : res.error(result.EC, result.EM, 401);
    } catch (error) {
      return res.InternalError(error.message);
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
      return res.error(-1, error.message, 500);
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
      return res.InternalError(error.message);
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
      return res.InternalError(error.message);
    }
  },
};
module.exports = authController;
