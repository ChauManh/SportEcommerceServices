const { createUserService } = require("../services/Auth.service");

const authController = {
  async createUser(req, res) {
    const { username, full_name, email, phone, password, birth, gender } =
      req.body;

    try {
      const data = await createUserService({
        username,
        full_name,
        email,
        phone,
        password,
        birth,
        gender,
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
};
module.exports = authController;
