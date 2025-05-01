const Favourite = require("../models/Favourite.model");
const mongoose = require("mongoose");

const updateProductToFavourService = async ({ user_id, product_id }) => {
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
    } else {
      // Nếu chưa có, thêm mới vào danh sách
      favourite.products.push(productObjectId);
    }
  }

  // Lưu lại vào database
  await favourite.save();

  return {
    EC: 0,
    EM: "Cập nhật danh sách sản phẩm yêu thích thành công",
    favourite,
  };
};

const getFavouriteService = async (user_id) => {
  // Tìm danh sách yêu thích của user
  const favourite = await Favourite.findOne({ user_id });

  // Nếu không tìm thấy danh sách yêu thích
  if (!favourite) {
    return {
      EC: 0,
      EM: "Danh sách sản phẩm yêu thích không tồn tại",
      favourites: [],
    };
  }

  // Nếu danh sách sản phẩm rỗng, trả về mảng rỗng thay vì truy cập thuộc tính không tồn tại
  if (!favourite.products || favourite.products.length === 0) {
    return { EC: 0, EM: "Danh sách sản phẩm yêu thích trống", favourites: [] };
  }

  return {
    EC: 0,
    EM: "Lấy danh sách sản phẩm yêu thích thành công",
    favourites: favourite.products,
  };
};

const clearFavouritesService = async (user_id) => {
  let favourite = await Favourite.findOne({ user_id });
  if (!favourite) {
    return { EC: 2, EM: "Không tìm thấy danh sách yêu th" };
  }

  // Xóa tất cả sản phẩm khỏi mảng products
  favourite.products = [];

  // Lưu lại vào database
  await favourite.save();

  return { EC: 0, EM: "Xóa danh sách yêu thích thành công" };
};

module.exports = {
  updateProductToFavourService,
  getFavouriteService,
  clearFavouritesService,
};
