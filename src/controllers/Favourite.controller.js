const {
  updateProductToFavourService,
  getFavouriteService,
} = require("../services/Favourite.service");

const favouriteController = {
  // Thêm sản phẩm vào giỏ hàng
  async updateFavourite(req, res) {
    try {
      const { userId } = req.user;
      const { productId } = req.body;
      const data = await updateProductToFavourService({
        user_id: userId,
        product_id: productId,
      });

      if (data.EC === 0) {
        return res.status(201).json(data);
      } else {
        return res.status(400).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in update product into favourite:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  async getFavourite(req, res) {
    const { userId } = req.user;

    try {
      const data = await getFavouriteService(userId);

      if (data.EC === 0) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({ message: data.EM });
      }
    } catch (error) {
      console.error("Error in Favourite:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  // async clearFavourite(req, res) {
  //   const { userId } = req.params;

  //   try {
  //     const data = await clearCartService(userId);

  //     if (data.EC === 0) {
  //       return res.status(200).json(data);
  //     } else {
  //       return res.status(404).json({ message: data.EM });
  //     }
  //   } catch (error) {
  //     console.error("Error in clearCart:", error);
  //     return res
  //       .status(500)
  //       .json({ message: "Internal server error", error: error.message });
  //   }
  // },
};

module.exports = favouriteController;
