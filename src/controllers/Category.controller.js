const categoryService = require("../services/Category.service");

const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const result = await categoryService.createCategory(categoryData);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getDetailCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await categoryService.getDetailCategory(categoryId);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getAllCategory = async (req, res) => {
  try {
    const category_level = req.query.category_level
      ? parseInt(req.query.category_level, 10)
      : 1;

    const result = await categoryService.getAllCategory(category_level);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getSubCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await categoryService.getSubCategory(categoryId);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updateData = req.body;
    if (!categoryId) {
      return res.error((EC = 1), (EM = "Category id is required"));
    }
    const result = await categoryService.updateCategory(categoryId, updateData);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const result = await categoryService.deleteCategory(categoryId);
    result.EC === 0
      ? res.success(null, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

module.exports = {
  createCategory,
  getDetailCategory,
  getSubCategory,
  updateCategory,
  getAllCategory,
  deleteCategory,
};
