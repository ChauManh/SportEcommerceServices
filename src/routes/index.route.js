// const authMiddleware = require('../middleware/auth');
const authRouter = require("./Auth.route");
const cartRouter = require("./Cart.route");
const favouriteRouter = require("./Favourite.route");
// const userRouter = require("./user");
// const adminRouter = require("./admin");

function router(app) {
  app.use("/auth", authRouter);
  //   app.use("/user", authMiddleware, userRouter);
  //   app.use("/admin", adminRouter);
  app.use("/favourite", favouriteRouter);
  app.use("/cart", cartRouter);
  app.get("/", (req, res) => {
    res.send("Hello WTM Sport Ecommerce Service");
  });
}

module.exports = router;
