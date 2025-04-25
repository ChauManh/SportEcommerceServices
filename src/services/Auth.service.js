const User = require("../models/User.model");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} = require("../utils/JwtUtil");
const generateOTP = require("../utils/GenerateOTP");
const redis = require("../config/Redis");
const sendEmail = require("../config/Nodemailer");
const bcrypt = require("bcrypt");

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

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    EC: 0,
    EM: "Đăng nhập thành công",
    result: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

const loginWithGoogleService = async (email, user_name, uidToPassword) => {
  const user = await User.findOne({
    $or: [{ user_name: user_name }, { email: email }],
  });

  if (!user) {
    const hashedPassword = await bcrypt.hash(uidToPassword, 10);
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
  } else {
    const isMatchPassword = await bcrypt.compare(uidToPassword, user.password);
    if (!isMatchPassword) {
      return {
        EC: 3,
        EM: "Mật khẩu không chính xác",
      };
    }
  }
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    EC: 0,
    EM: "Đăng nhập thành công",
    result: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

const SignUpWithGoogleService = async (email, user_name, uidToPassword) => {
  const user = await User.findOne({
    $or: [{ user_name: user_name }, { email: email }],
  });
  if (!user) {
    const hashedPassword = await bcrypt.hash(uidToPassword, 10);
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
  } else {
    return {
      EC: 0,
      EM: "Tài khoản Google này đã được sử dụng",
      result: null,
    };
  }
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return {
    EC: 0,
    EM: "Đăng ký thành công",
    result: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
      },
    },
  };
};

const sentOTPService = async (email) => {
  // Kiểm tra email đã tồn tại chưa
  console.log(email);
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

const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    return {
      EC: 1,
      EM: "Refresh token is required",
    };
  }
  const user = verifyRefreshToken(refreshToken);
  console.log(user);
  if (!user) {
    return {
      EC: 2,
      EM: "Lỗi xác thực refresh token",
    };
  }
  const newAccessToken = createAccessToken(user);

  return {
    EC: 0,
    EM: "Làm mới token thành công",
    result: {
      accessToken: newAccessToken,
    },
  };
};

module.exports = {
  createUserService,
  loginService,
  sentOTPService,
  resetPasswordService,
  verifyOTPService,
  loginWithGoogleService,
  SignUpWithGoogleService,
  refreshTokenService,
};
