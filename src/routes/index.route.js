const authRouter = require("./Auth.route");
const cartRouter = require("./Cart.route");
const favouriteRouter = require("./Favourite.route");
const productRouter = require("./Product.route");
const orderRouter = require("./Order.route");
const feedbackRouter = require("./Feedback.route");
const discountRouter = require("./Discount.route");
const categoryRouter = require("./Category.route");
const userRouter = require("./User.route");
const paymentRouter = require("./Payment.route");
const chatbotRouter = require("./Chatbot.route");
const notificationRouter = require("./Notification.route");
const storeRouter = require("./Store.route");
const loginHistory = require("./LoginHistory.route");
function router(app) {
  app.use("/auth", authRouter);
  app.use("/favourite", favouriteRouter);
  app.use("/cart", cartRouter);
  app.use("/product", productRouter);
  app.use("/order", orderRouter);
  app.use("/feedback", feedbackRouter);
  app.use("/discount", discountRouter);
  app.use("/category", categoryRouter);
  app.use("/user", userRouter);
  app.use("/payment", paymentRouter);
  app.use("/chat", chatbotRouter);
  app.use("/notification", notificationRouter);
  app.use("/login_history", loginHistory);
  app.use("/store", storeRouter);
  app.get("/", (req, res) => {
    res.send("Hello WTM Sport Ecommerce Service");
  });
}

module.exports = router;
