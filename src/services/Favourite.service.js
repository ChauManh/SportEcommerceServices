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
    EM: "Favourite list updated successfully",
    favourite,
  };
};

const getFavouriteService = async (user_id) => {
  console.log("user_id", user_id);

  // Tìm danh sách yêu thích của user
  const favourite = await Favourite.findOne({ user_id });

  console.log("favourite", favourite);

  // Nếu không tìm thấy danh sách yêu thích
  if (!favourite) {
    return { EC: 0, EM: "Favourite list is empty", favourites: [] };
  }

  console.log("favourite.products", favourite.products);

  // Nếu danh sách sản phẩm rỗng, trả về mảng rỗng thay vì truy cập thuộc tính không tồn tại
  if (!favourite.products || favourite.products.length === 0) {
    return { EC: 0, EM: "Favourite list is empty", favourites: [] };
  }

  return {
    EC: 0,
    EM: "Favourite fetched successfully",
    favourites: favourite.products,
  };
};


const clearFavouritesService = async (user_id) => {
  
  let favourite = await Favourite.findOne( {user_id} );
  if (!favourite) {
    return { EC: 2, EM: "Favourite not found" };
  }

  // Xóa tất cả sản phẩm khỏi mảng products
  favourite.products = [];

  // Lưu lại vào database
  await favourite.save();

  return { EC: 0, EM: "Favourite list cleared successfully" };
};


module.exports = {
  updateProductToFavourService,
  getFavouriteService,
  clearFavouritesService,
};
