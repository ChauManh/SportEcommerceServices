const {
  updateProductToFavourService,
  getFavouriteService,
  clearFavouritesService,
} = require("../services/Favourite.service");

const favouriteController = {
  async updateFavourite(req, res) {
    try {
      const { userId } = req.user;
      const { productId } = req.body;
      const result = await updateProductToFavourService({
        user_id: userId,
        product_id: productId,
      });
      return result.EC === 0
        ? res.success(result.favourite, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async getFavourite(req, res) {
    const { userId } = req.user;
    try {
      const result = await getFavouriteService(userId);
      return result.EC === 0
        ? res.success(result.favourites, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },

  async clearFavourites(req, res) {
    const { userId } = req.user;
    try {
      const result = await clearFavouritesService(userId);
      return result.EC === 0
        ? res.success(null, result.EM)
        : res.error(result.EC, result.EM);
    } catch (error) {
      return res.InternalError();
    }
  },
};

module.exports = favouriteController;
