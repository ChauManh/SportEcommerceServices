const { createUserService, loginService } = require("../services/Auth.service");

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
};
module.exports = authController;
