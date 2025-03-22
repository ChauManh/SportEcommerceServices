const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  { timestamps: true, collection: "Favourite" }
);

const Favourite = mongoose.model("Favourite", FavouriteSchema);

module.exports = Favourite;
