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
  app.get("/", (req, res) => {
    res.send("Hello WTM Sport Ecommerce Service! Duong Anh Vu123");
  });
}

module.exports = router;
