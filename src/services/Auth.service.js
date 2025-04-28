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
const { logLoginHistory } = require("./LoginHistory.service");

const createUserService = async ({ user_name, email, password }) => {
  // Check exists
  const existingUser = await User.findOne({
    $or: [{ user_name }, { email }],
  });
  if (existingUser) {
    return {
      EC: 2,
      EM: "Người dùng đã tồn tại",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    user_name,
    email,
    password: hashedPassword,
    full_name: user_name,
  });

  await newUser.save();
  return {
    EC: 0,
    EM: "Đăng ký thành công",
  };
};

const loginService = async (user_name, password, ip, user_agent) => {
  const user = await User.findOne({
    $or: [{ user_name: user_name }],
  });

  if (!user) {
    return {
      EC: 1,
      EM: "Không tìm thấy người dùng",
    };
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);
  if (!isMatchPassword) {
    return {
      EC: 3,
      EM: "Mật khẩu không chính xác",
    };
  }

  let login_history_id = null;
  if (user.role === "admin") {
    const loginHistory = await logLoginHistory({
      user_id: user._id,
      role: user.role,
      ip,
      user_agent,
    });
    if (loginHistory.EC === 0) {
      login_history_id = loginHistory.result._id;
    } else {
      return {
        EC: 2,
        EM: "Lỗi khi lưu phiên đăng nhập",
      };
    }
  }

  const accessToken = createAccessToken(user, login_history_id);
  const refreshToken = createRefreshToken(user, login_history_id);

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

const loginWithGoogleService = async (email, uidToPassword) => {
  const user = await User.findOne({
    $or: [{ email: email }],
  });

  if (!user) {
    return {
      EC: 1,
      EM: "Tài khoản Google chưa được đăng ký",
    };
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
    $or: [{ email: email }],
  });
  if (!user) {
    const hashedPassword = await bcrypt.hash(uidToPassword, 10);
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
      full_name: user_name,
    });
    await newUser.save();
    const accessToken = createAccessToken(newUser);
    const refreshToken = createRefreshToken(newUser);
    return {
      EC: 0,
      EM: "Đăng ký thành công",
      result: {
        accessToken,
        refreshToken,
        user: {
          id: newUser._id,
          user_name: newUser.user_name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    };
  } else {
    return {
      EC: 1,
      EM: "Tài khoản Google này đã được sử dụng",
      result: null,
    };
  }
};

const sentOTPService = async (email) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return {
      EC: 2,
      EM: "Không tìm thấy người dùng",
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
    EM: "Gửi OTP thành công",
  };
};

const verifyOTPService = async (email, otp) => {
  // Lấy OTP từ Redis
  const storedOTP = await redis.get(`otp:${email}`);

  if (!storedOTP) {
    return {
      EC: 2,
      EM: "OTP không hợp lệ",
    };
  }

  // Kiểm tra OTP có khớp không
  if (storedOTP !== otp) {
    return {
      EC: 3,
      EM: "OTP không hợp lệ",
    };
  }

  // Xóa OTP sau khi xác thực thành công
  await redis.del(`otp:${email}`);

  // Lưu trạng thái xác thực OTP vào Redis (hết hạn sau 10 phút)
  await redis.set(`otp_verified:${email}`, "true", { EX: 600 });

  return {
    EC: 0,
    EM: "Xác thực OTP thành công",
  };
};

const resetPasswordService = async (email, newPassword) => {
  // Kiểm tra xem OTP đã được xác thực chưa
  const isVerified = await redis.get(`otp_verified:${email}`);

  if (!isVerified) {
    return {
      EC: 2,
      EM: "Xác thực OTP là bắt buộc trước khi đặt lại mật khẩu",
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
    EM: "Đặt lại mật khẩu thành công",
  };
};

const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    return {
      EC: 1,
      EM: "Refresh token là bắt buộc",
    };
  }
  const user = verifyRefreshToken(refreshToken);
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
