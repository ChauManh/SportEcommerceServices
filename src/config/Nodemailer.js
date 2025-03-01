const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: "Mã OTP của bạn",
      html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
