// const authMiddleware = require('../middleware/auth');
const authRouter = require("./auth");
const cartRouter = require("./cart");
// const userRouter = require("./user");
// const adminRouter = require("./admin");

function router(app) {
  app.use("/auth", authRouter);
  //   app.use("/user", authMiddleware, userRouter);
  //   app.use("/admin", adminRouter);
  app.use("/cart", cartRouter);
  app.get("/", (req, res) => {
    res.send("Hello WTM Sport Ecommerce Service");
  });
}

module.exports = router;
