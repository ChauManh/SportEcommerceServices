const {
  getAllUsersService,
  changePasswordService,
  updateUserService,
  addAddressService,
  updateAddressService,
  getUserService,
} = require("../services/User.service");
const { uploadAvtUser } = require("../utils/UploadUtil");

const userController = {
  async getUser(req, res) {
    try {
      const { userId } = req.user;
      const result = await getUserService(userId);
      return result.EC === 0
        ? res.success(result.user, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  // API lấy danh sách user
  async getAllUsers(req, res) {
    try {
      const result = await getAllUsersService();
      return result.EC === 0
        ? res.success(result.users, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async changePassword(req, res) {
    const { email } = req.user; // Lấy email từ token
    const { oldPassword, newPassword } = req.body;

    try {
      const result = await changePasswordService(
        email,
        oldPassword,
        newPassword
      );
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError(error.message);
    }
  },

  async updateUser(req, res) {
    try {
      // Upload avatar nếu có
      const uploadResult = await uploadAvtUser(req, res);

      const { userId } = req.user;
      let dataUpdate  = req.body;
      console.log("dataUpdate 111", dataUpdate);
      // // Gửi form data nên là string, convert qua JSON
      if (typeof dataUpdate === "string") {
        dataUpdate = JSON.parse(dataUpdate);
      }

      // Nếu có file avatar, thêm vào dataUpdate
      if (uploadResult.success) {
        const avatarFile = req.files.req.files[0].path;
        dataUpdate.avt_img = avatarFile.path; // Lưu đường dẫn avatar
      }

      const updateResult = await updateUserService(userId, dataUpdate);

      return updateResult.EC === 0
        ? res.success(updateResult.user, updateResult.EM)
        : res.error(updateResult.EC, updateResult.EM);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.InternalError(error.message);
    }
  },

  async addAddress(req, res) {
    try {
      const { userId } = req.user;
      const { newAddress } = req.body;

      // if (!addressData || !addressData.name || !addressData.phone) {
      //   return res.status(400).json({ EC: 1, EM: "Thiếu thông tin địa chỉ!" });
      // }

      const result = await addAddressService(userId, newAddress);
      return result.EC === 0
        ? res
            .status(200)
            .json({ EC: 0, EM: result.EM, addresses: result.addresses })
        : res.status(400).json({ EC: result.EC, EM: result.EM });
    } catch (error) {
      return res.status(500).json({ EC: -1, EM: "Internal server error" });
    }
  },

  async updateAddress(req, res) {
    try {
      const { userId } = req.user;
      const index = parseInt(req.params.index);
      const { updateData } = req.body;

      // if (isNaN(index)) {
      //   return res.status(400).json({ EC: 1, EM: "Index không hợp lệ!" });
      // }

      const result = await updateAddressService(userId, index, updateData);
      return result.EC === 0
        ? res
            .status(200)
            .json({ EC: 0, EM: result.EM, addresses: result.addresses })
        : res.status(400).json({ EC: result.EC, EM: result.EM });
    } catch (error) {
      return res.status(500).json({ EC: -1, EM: "Internal server error" });
    }
  },
};

module.exports = userController;
