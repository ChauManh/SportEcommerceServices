const createJwtPayload = (user) => {
  return {
    userId: user._id,
    user_name: user.user_name,
    email: user.email,
    role: user.role,
  };
};

module.exports = { createJwtPayload };
