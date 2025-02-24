const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/Favourite.controller");
// const auth = require("../middleware/auth"); // Middleware xác thực

router.patch("/", FavoriteController.updateFavourite);
router.get("/:userId", FavoriteController.getFavourite);
module.exports = router; //export default
