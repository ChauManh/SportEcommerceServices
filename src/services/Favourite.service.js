const Favourite = require("../models/Favourite.model");
const mongoose = require("mongoose");

const updateProductToFavourService = async ({ user_id, product_id }) => {
  try {
    // Chuyển product_id thành ObjectId để đảm bảo đúng kiểu
    const productObjectId = new mongoose.Types.ObjectId(product_id);

    // Tìm danh sách yêu thích của user
    let favourite = await Favourite.findOne({ user_id });

    if (!favourite) {
      // Nếu chưa có danh sách yêu thích, tạo mới và thêm sản phẩm
      favourite = new Favourite({
        user_id,
        products: [productObjectId], // Thêm trực tiếp ObjectId
      });
    } else {
      // Kiểm tra xem product_id đã tồn tại hay chưa
      const index = favourite.products.indexOf(productObjectId);

      if (index !== -1) {
        // Nếu có rồi, xóa nó khỏi danh sách
        favourite.products.splice(index, 1);

        // Nếu danh sách trống sau khi xóa, thì xóa luôn document Favourite
        if (favourite.products.length === 0) {
          await Favourite.deleteOne({ user_id });
          return {
            EC: 0,
            EM: "Favourite list is empty, removed from database",
          };
        }
      } else {
        // Nếu chưa có, thêm mới vào danh sách
        favourite.products.push(productObjectId);
      }
    }

    // Lưu lại vào database
    await favourite.save();

    return {
      EC: 0,
      EM: "Favourite list updated successfully",
      favourite,
    };
  } catch (error) {
    console.log(error.message);
    return {
      EC: -1,
      EM: "Error updating favourite list",
      details: error.message,
    };
  }
};

const getFavouriteService = async (user_id) => {
  try {
    // const cart = await Cart.findOne({ user_id }).populate(
    //   "products.product_id"
    // );
    const favourite = await Favourite.findOne({ user_id });
    if (!favourite) {
      return { EC: 2, EM: "Favourite not found" };
    }
    return {
      EC: 0,
      EM: "Favourite fetched successfully",
      favourites: favourite.products,
    };
  } catch (error) {
    return { EC: 1, EM: "Error fetching Favourite", details: error.message };
  }
};

const clearFavouritesService = async (user_id) => {
  try {
    await Favourite.deleteOne({ user_id });
    return { EC: 0, EM: "Favourite list cleared successfully" };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error clearing Favourite list",
      details: error.message,
    };
  }
};

module.exports = {
  updateProductToFavourService,
  getFavouriteService,
  clearFavouritesService,
};
