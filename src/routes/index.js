// const authMiddleware = require('../middleware/auth');
// const authRoter = require("./auth");
// const userRouter = require("./user");
// const adminRouter = require("./admin");

function router(app) {
  //   app.use("/auth", authRoter);
  //   app.use("/user", authMiddleware, userRouter);
  //   app.use("/admin", adminRouter);
  app.get("/", (req, res) => {
    res.send("Hello Sport Ecommerce Service 123");
  });
}

module.exports = router;
