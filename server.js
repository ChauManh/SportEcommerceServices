const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const db = require("./src/config/db");
const route = require("./src/routes/index.route");
require("dotenv").config();

db.connect();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(morgan("combined")); // HTTP Logger (console các thông tin request)
app.use(express.static(path.join(__dirname, "public"))); // Static files
app.use(express.urlencoded({ extended: true })); // Xử lý form
app.use(express.json()); // Xử lý dữ liệu JSON trong request body.
app.use(cors());

// Routes
route(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
