const cron = require("node-cron");
const Order = require("../models/Order.model"); // đường dẫn tới model Order
const { updateStatus } = require("../services/Order.service");

// Chạy 0h mỗi ngày
cron.schedule("0 0 * * *", async () => {
  console.log("Đang kiểm tra các đơn chưa thanh toán...");
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  try {
    const expiredOrders = await Order.find({
      order_status: "Chờ xác nhận",
      order_payment_method: "Paypal",
      is_paid: false,
      createdAt: { $lt: fifteenMinutesAgo },
    });

    for (let order of expiredOrders) {
      await updateStatus(order._id, "Hủy hàng", null, null, {
        bypassPermission: true,
      });
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra đơn hàng:", error);
  }
});
