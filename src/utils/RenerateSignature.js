const crypto = require("crypto");

const generateSignature = (
  orderCode,
  amount,
  description,
  returnUrl,
  cancelUrl,
  checksum
) => {
  // Đảm bảo đúng thứ tự alphabet theo tên key
  const rawData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;

  const signature = crypto
    .createHmac("sha256", checksum)
    .update(rawData)
    .digest("hex");

  return signature;
};

module.exports = generateSignature;
