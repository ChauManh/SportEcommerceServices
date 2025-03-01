require("dotenv").config();
const User = require("../models/User.model");
const { createJwtPayload } = require("../utils/JwtUtil");
const generateOTP = require("../utils/GenerateOTP");
const redis = require("../config/Redis");
const sendEmail = require("../config/Nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async ({ user_name, email, password }) => {
  try {
    // Check exists
    const existingUser = await User.findOne({
      $or: [{ user_name }, { email }],
    });
    if (existingUser) {
      return {
        EC: 2,
        EM: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return {
      EC: 0,
      EM: "User created successfully",
    };
  } catch (err) {
    return {
      EC: 1,
      EM: "Error occurred during sign-up",
      details: err.message,
    };
  }
};

const loginService = async (user_name, password) => {
  try {
    console.log(user_name);
    const user = await User.findOne({
      $or: [{ user_name: user_name }, { email: user_name }],
    });

    if (!user) {
      return {
        EC: 2,
        EM: "User not found",
      };
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 3,
        EM: "Invalid password",
      };
    }

    const payload = createJwtPayload(user);

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      EC: 0,
      EM: "Logged in successfully",
      accessToken,
    };
  } catch (e) {
    console.log(e.message);
    return {
      EC: 1,
      EM: "Error occurred during login",
    };
  }
};

const sentOTPService = async (email) => {
  try {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return {
        EC: 2,
        EM: "User not found",
      };
    }
    const otp = generateOTP();
    const expiresIn = 300;
    // Lưu OTP vào Redis (hết hạn sau 5 phút)
    await redis.set(`otp:${email}`, otp, { EX: expiresIn });
    // Gửi email bằng Resend
    await sendEmail(email, otp);
    return {
      EC: 0,
      EM: "OTP sent successfully",
    };
  } catch (e) {
    return {
      EC: 1,
      EM: "Error occurred during OTP sending",
      Message: e.message,
    };
  }
};

const verifyOTPService = async (email, otp) => {
  try {
    // Lấy OTP từ Redis
    const storedOTP = await redis.get(`otp:${email}`);

    if (!storedOTP) {
      return {
        EC: 2,
        EM: "OTP expired or not found",
      };
    }

    // Kiểm tra OTP có khớp không
    if (storedOTP !== otp) {
      return {
        EC: 3,
        EM: "Invalid OTP",
      };
    }

    // Xóa OTP sau khi xác thực thành công
    await redis.del(`otp:${email}`);

    // Lưu trạng thái xác thực OTP vào Redis (hết hạn sau 10 phút)
    await redis.set(`otp_verified:${email}`, "true", { EX: 600 });

    return {
      EC: 0,
      EM: "OTP verified successfully",
    };
  } catch (e) {
    return {
      EC: 1,
      EM: "Error occurred during OTP verification",
      Message: e.message,
    };
  }
};

const resetPasswordService = async (email, newPassword) => {
  try {
    // Kiểm tra xem OTP đã được xác thực chưa
    const isVerified = await redis.get(`otp_verified:${email}`);

    if (!isVerified) {
      return {
        EC: 2,
        EM: "OTP verification required before resetting password",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong database
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 3,
        EM: "User not found",
      };
    }

    user.password = hashedPassword;
    await user.save();

    // Xóa trạng thái OTP đã xác thực
    await redis.del(`otp_verified:${email}`);

    return {
      EC: 0,
      EM: "Password reset successfully",
    };
  } catch (e) {
    return {
      EC: 1,
      EM: "Error occurred during password reset",
      Message: e.message,
    };
  }
};

const changePasswordService = async (email, oldPassword, newPassword) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        EC: 1,
        EM: "User not found",
      };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return {
        EC: 2,
        EM: "Password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return {
      EC: 0,
      EM: "Password changed successfully",
    };
  } catch (e) {
    return {
      EC: 3,
      EM: "Error occurred during password change",
      error: e.message,
    };
  }
};

module.exports = {
  createUserService,
  loginService,
  sentOTPService,
  resetPasswordService,
  verifyOTPService,
  changePasswordService,
};
