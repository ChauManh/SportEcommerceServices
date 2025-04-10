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
  app.get("/", (req, res) => {
    res.send("Hello WTM Sport Ecommerce Service");
  });
}

module.exports = router;
