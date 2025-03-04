require("dotenv").config();
const User = require("../models/User.model");
const { createJwtPayload } = require("../utils/JwtUtil");
const generateOTP = require("../utils/GenerateOTP");
const redis = require("../config/Redis");
const sendEmail = require("../config/Nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUserService = async ({ user_name, email, password }) => {
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
};

const loginService = async (user_name, password) => {
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
};

const sentOTPService = async (email) => {
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
};

const verifyOTPService = async (email, otp) => {
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
};

const resetPasswordService = async (email, newPassword) => {
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
  user.password = hashedPassword;
  await user.save();

  // Xóa trạng thái OTP đã xác thực
  await redis.del(`otp_verified:${email}`);

  return {
    EC: 0,
    EM: "Password reset successfully",
  };
};

const changePasswordService = async (email, oldPassword, newPassword) => {
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return {
      EC: 1,
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
};

module.exports = {
  createUserService,
  loginService,
  sentOTPService,
  resetPasswordService,
  verifyOTPService,
  changePasswordService,
};
