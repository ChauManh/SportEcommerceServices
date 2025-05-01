const Discount = require("../models/Discount.model");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const getUserService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    return { EC: 1, EM: "Không tìm thấy người dùng" };
  }
  return {
    EC: 0,
    EM: "Lấy thông tin người dùng thành công",
    user,
  };
};

const getAllUsersService = async () => {
  const users = await User.find({ role: { $ne: "admin" } }).select("-password");
  return {
    EC: 0,
    EM: "Lấy tất cả người dùng thành công",
    users,
  };
};

const changePasswordService = async (email, oldPassword, newPassword) => {
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return { EC: 2, EM: "Mật khẩu cũ không chính xác" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { EC: 0, EM: "Đổi mật khẩu thành công" };
};

const updateUserService = async (userId, dataUpdate) => {
  const user = await User.findById(userId);

  // Cập nhật thông tin
  Object.assign(user, dataUpdate);
  await user.save();

  return { EC: 0, EM: "Thay đổi thông tin thành công!", user };
};

const addAddressService = async (userId, addressData) => {
  const user = await User.findById(userId);

  // Nếu địa chỉ mới là mặc định, reset tất cả địa chỉ trước đó
  if (addressData.is_default) {
    user.addresses.forEach((addr) => (addr.is_default = false));
  }

  user.addresses.push(addressData);
  await user.save();

  return {
    EC: 0,
    EM: "Thêm địa chỉ thành công",
    addresses: user.addresses,
  };
};

const updateAddressService = async (userId, index, updateData) => {
  const user = await User.findById(userId);

  if (index < 0 || index >= user.addresses.length) {
    return { EC: 2, EM: "Không tìm thấy địa chỉ" };
  }

  // Cập nhật thông tin địa chỉ
  Object.assign(user.addresses[index], updateData);

  // Nếu đặt mặc định, bỏ mặc định của các địa chỉ khác
  if (updateData.is_default) {
    user.addresses.forEach((addr, i) => (addr.is_default = i === index));
  }

  await user.save();
  return {
    EC: 0,
    EM: "Cập nhật địa chỉ thành công",
    addresses: user.addresses,
  };
};

const saveDiscount = async (userId, discountId) => {
  const user = await User.findById(userId);
  if (!user) return { EC: 1, EM: "Không tìm thấy người dùng" };

  const discount = await Discount.findById(discountId);
  if (!discount) return { EC: 2, EM: "Mã giảm giá không tồn tại" };

  const alreadySaved = user.discounts.some((d) => d.equals(discount._id));
  if (alreadySaved) return { EC: 0, EM: "Mã giảm giá đã được lưu" };

  user.discounts.push(discount._id);
  await user.save();
  return { EC: 0, EM: "Lưu mã giảm giá thành công", data: user.discounts };
};

const getDiscountUser = async (userId) => {
  const user = await User.findById(userId);
  const discounts = await Discount.find({ _id: { $in: user.discounts } });

  return { EC: 0, EM: "Lấy mã giảm giá thành công", data: discounts };
};

const deleteAddressService = async (userId, index) => {
  try {
    const user = await User.findById(userId);

    if (index < 0 || index >= user.addresses.length) {
      return { EC: 2, EM: "Địa chỉ không tồn tại" };
    }

    if (user.addresses[index].is_default) {
      // Nếu địa chỉ xóa là mặc định, đặt mặc định cho địa chỉ đầu tiên còn lại
      const newDefaultIndex = index === 0 ? 1 : 0;
      if (user.addresses[newDefaultIndex]) {
        user.addresses[newDefaultIndex].is_default = true;
      }
    }
    user.addresses.splice(index, 1);

    await user.save();

    return { EC: 0, EM: "Xóa địa chỉ thành công" };
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
};

const deleteSearchHistoryService = async (userId, index) => {
  const user = await User.findById(userId);

  if (index < 0 || index >= user.searchhistory.length) {
    return { EC: 2, EM: "Chỉ số không phù hợp." };
  }

  user.searchhistory.splice(index, 1);
  await user.save();

  return { EC: 0, EM: "Xóa tìm kiếm thành công." };
};

module.exports = {
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
};
