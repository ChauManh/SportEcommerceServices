const User = require("../models/User.model");

const getUserService = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return { EC: 1, EM: "User not found" };
    }
    return {
      EC: 0,
      EM: "Get user successfully",
      user,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error getting user",
    };
  }
};

const getAllUsersService = async () => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select(
      "-password"
    );
    return {
      EC: 0,
      EM: "Get all users successfully",
      users,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error getting users",
    };
  }
};

const changePasswordService = async (email, oldPassword, newPassword) => {
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return { EC: 2, EM: "Incorrect old password" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return { EC: 0, EM: "Password changed successfully" };
};

const updateUserService = async (userId, dataUpdate) => {
  try {
    const user = await User.findById(userId);

    // Cập nhật thông tin
    Object.assign(user, dataUpdate);
    await user.save();

    return { EC: 0, EM: "Update User Information Successfully!", user };
  } catch (error) {
    return { EC: 2, EM: error.message };
  }
};

const addAddressService = async (userId, addressData) => {
  try {
    const user = await User.findById(userId);

    // Nếu địa chỉ mới là mặc định, reset tất cả địa chỉ trước đó
    if (addressData.is_default) {
      user.addresses.forEach((addr) => (addr.is_default = false));
    }

    user.addresses.push(addressData);
    await user.save();

    return {
      EC: 0,
      EM: "Add Address Successfully!",
      addresses: user.addresses,
    };
  } catch (error) {
    return { EC: 2, EM: error.message };
  }
};

const updateAddressService = async (userId, index, updateData) => {
  try {
    const user = await User.findById(userId);
    console.log(updateData);

    if (index < 0 || index >= user.addresses.length) {
      return { EC: 2, EM: "Address not found" };
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
      EM: "Updated address successfully",
      addresses: user.addresses,
    };
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
};

module.exports = {
  getAllUsersService,
  changePasswordService,
  updateUserService,
  addAddressService,
  updateAddressService,
  getUserService,
};
