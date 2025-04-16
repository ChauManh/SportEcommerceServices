const Discount = require("../models/Discount.Model");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
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
    console.log(dataUpdate);
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

const saveDiscount = async(userId, discountId)=>{
  try {
    const user = await User.findById(userId);
    if (!user) return { EC: 1, EM: "User not found" };

    const discount = await Discount.findById(discountId);
    if (!discount) return { EC: 2, EM: "Discount not found" };

    const alreadySaved = user.discounts.some(d => d.equals(discount._id));
    if (alreadySaved) return { EC: 0, EM: "Discount already saved"};

    user.discounts.push(discount._id);
    await user.save();
    return { EC: 0, EM: "Save discount successfully", data: user.discounts };
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
}

const getDiscountUser = async(userId) =>{
  try {
    const user = await User.findById(userId);
    if (!user) return { EC: 1, EM: "User not found" };

    const discounts = await Discount.find({_id : {$in: user.discounts}})

    return {EC: 0, EM: "Get discounts successfully", data: discounts}
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
}

const deleteAddressService = async (userId, index) => {
  try {
    const user = await User.findById(userId);

    if (index < 0 || index >= user.addresses.length) {
      return { EC: 2, EM: "Address not found" };
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

    return { EC: 0, EM: "Deleted address successfully" };
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
};

const deleteSearchHistoryService = async (userId, index) => {
  try {
    if (!userId) {
      return { EC: 2, EM: "Bạn cần đăng nhập để xoá lịch sử tìm kiếm." };
    }

    const user = await User.findById(userId);

    if (index < 0 || index >= user.searchhistory.length) {
      return { EC: 2, EM: "Chỉ số không phù hợp." };
    }

    user.searchhistory.splice(index, 1);
    await user.save();

    return { EC: 0, EM: "Xóa tìm kiếm thành công." };
  } catch (error) {
    return { EC: 3, EM: error.message };
  }
}

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
