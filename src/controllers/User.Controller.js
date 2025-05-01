const {
  getAllUsersService,
  changePasswordService,
  updateUserService,
  addAddressService,
  updateAddressService,
  getUserService,
  saveDiscount,
  getDiscountUser,
  deleteAddressService,
  deleteSearchHistoryService,
} = require("../services/User.service");
const { uploadAvtUser } = require("../utils/UploadUtil");
const ChatHistory = require("../models/ChatHistory.model");

const userController = {
  async getUser(req, res) {
    try {
      const { userId } = req.user;
      const result = await getUserService(userId);
      return result.EC === 0
        ? res.success(result.user, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
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
      return res.InternalError();
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
      return res.InternalError();
    }
  },

  async updateUser(req, res) {
    try {
      // Upload avatar nếu có
      const uploadResult = await uploadAvtUser(req, res);

      const { userId } = req.user;
      let dataUpdate = req.body;
      // // Gửi form data nên là string, convert qua JSON
      if (typeof dataUpdate === "string") {
        dataUpdate = JSON.parse(dataUpdate);
      }

      // Nếu có file avatar, thêm vào dataUpdate
      if (uploadResult.success && uploadResult.avatar) {
        dataUpdate.avt_img = uploadResult.avatar; // Đây là đường dẫn avatar file
      }

      const updateResult = await updateUserService(userId, dataUpdate);

      return updateResult.EC === 0
        ? res.success(updateResult.user, updateResult.EM)
        : res.error(updateResult.EC, updateResult.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async addAddress(req, res) {
    try {
      const { userId } = req.user;
      const newAddress = req.body;
      const result = await addAddressService(userId, newAddress);
      return result.EC === 0
        ? res.success({ EC: 0, EM: result.EM, addresses: result.addresses })
        : res.error({ EC: result.EC, EM: result.EM });
    } catch (error) {
      return res.InternalError();
    }
  },

  async updateAddress(req, res) {
    try {
      const { userId } = req.user;
      const index = parseInt(req.params.index);
      const updateData = req.body;
      const result = await updateAddressService(userId, index, updateData);
      return result.EC === 0
        ? res.success({ EC: 0, EM: result.EM, addresses: result.addresses })
        : res.error({ EC: result.EC, EM: result.EM });
    } catch (error) {
      return res.InternalError();
    }
  },

  async deleteAddress(req, res) {
    try {
      const { userId } = req.user;
      const index = parseInt(req.params.index);
      const result = await deleteAddressService(userId, index);
      return result.EC === 0
        ? res.success({ EC: 0, EM: result.EM })
        : res.error({ EC: result.EC, EM: result.EM });
    } catch (error) {
      return res.InternalError();
    }
  },

  async saveDiscount(req, res) {
    try {
      const { userId } = req.user;
      const { discount } = req.body;
      const result = await saveDiscount(userId, discount);
      return result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async getDiscountUser(req, res) {
    try {
      const { userId } = req.user;
      const result = await getDiscountUser(userId);
      return result.EC === 0
        ? res.success(result.data, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async deleteSearchHistory(req, res) {
    try {
      const userId = req.user.userId;
      const index = req.params.index;
      const response = await deleteSearchHistoryService(userId, index);
      return response.EC === 0
        ? res.success({ EC: 0, EM: response.EM })
        : res.error({ EC: response.EC, EM: response.EM });
    } catch (error) {
      console.error(error);
      return res.InternalError();
    }
  },

  async getChatHistory(req, res) {
    try {
      const userId = req.user.userId;
      const response = await ChatHistory.findOne({ userId });
      if (!response) {
        return res.error(1, "Không có đoạn chat của user này");
      }
      return res.success(response.messages, "Lấy lịch sử chat thành công");
    } catch (error) {
      console.error(error);
      return res.InternalError();
    }
  },

  async deleteChatHistory(req, res) {
    try {
      const userId = req.user.userId;
      const response = await ChatHistory.findOneAndDelete({ userId });
      if (!response) {
        return res.error(1, "Không có đoạn chat của user này");
      }
      return res.success(null, "Xóa đoạn chat thành công");
    } catch (error) {
      console.error(error);
      return res.InternalError();
    }
  },
};

module.exports = userController;
