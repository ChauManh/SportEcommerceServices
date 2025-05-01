const Category = require("../models/Category.model");

const createCategory = async (categoryData) => {
  const { category_gender, category_type, category_parent_id, category_level } =
    categoryData;
  const existingCategory = await Category.findOne({
    category_type: category_type,
    category_gender: category_gender,
  });
  if (existingCategory) {
    return {
      EC: 1,
      EM: "Danh mục đã tồn tại",
    };
  }

  const newCategory = new Category(categoryData);
  await newCategory.save();
  return {
    EC: 0,
    EM: "Tạo danh mục mới thành công",
    data: newCategory,
  };
};

const getDetailCategory = async (categoryId) => {
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    return {
      EC: 2,
      EM: "Danh mục không tồn tại",
    };
  }

  return {
    EC: 0,
    EM: "Lấy chi tiết danh mục thành công",
    data: existingCategory,
  };
};

const getAllCategory = async () => {
  const listCategory = await Category.find();
  return {
    EC: 0,
    EM: "Lấy tất cả danh mục thành công",
    data: listCategory,
  };
};

const getSubCategory = async (categoryId) => {
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    return {
      EC: 2,
      EM: "Danh mục không tồn tại",
    };
  }
  const listSubCategory = await Category.find({
    category_parent_id: categoryId,
  });
  return {
    EC: 0,
    EM: "Lấy danh mục con thành công",
    data: listSubCategory,
  };
};

const updateCategory = async (categoryId, updateData) => {
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    return {
      EC: 2,
      EM: "Danh mục không tồn tại",
    };
  }
  const updateCategory = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true, runValidators: true }
  );
  return {
    EC: 0,
    EM: "Cập nhật danh mục thành công",
    data: updateCategory,
  };
};

const deleteCategory = async (categoryId) => {
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    return {
      EC: 2,
      EM: "Danh mục không tồn tại",
    };
  }
  await existingCategory.delete();
  return {
    EC: 0,
    EM: "Xóa danh mục thành công",
  };
};

module.exports = {
  createCategory,
  getDetailCategory,
  getSubCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
};
