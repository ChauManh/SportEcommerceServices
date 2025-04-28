const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const db = require("./src/config/db");
const route = require("./src/routes/index.route");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/config/swagger");
const responseHandler = require("./src/middlewares/ResponseHandler");
require("./src/chronos/OrderChecker");

require("dotenv").config();

db.connect();
const app = express();
const PORT = process.env.PORT || 5000;
// Gọi hàm setWebhook khi server khởi chạy

// Middleware
app.use(morgan("combined")); // HTTP Logger (console các thông tin request)
app.use(express.static(path.join(__dirname, "public"))); // Static files
app.use(express.urlencoded({ extended: true })); // Xử lý form
app.use(express.json()); // Xử lý dữ liệu JSON trong request body.

app.use(cors()); // CORS (cho phép truy cập từ các domain khác nhau)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // api documentation

app.use(responseHandler); // Thêm middleware chuẩn hóa response
// Routes
route(app);
// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on http://0.0.0.0:" + PORT);
});

module.exports = app;
