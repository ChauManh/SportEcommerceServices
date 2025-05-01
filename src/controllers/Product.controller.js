const productService = require("../services/Product.service");
const Product = require("../models/Product.model");
const {
  uploadImgProduct,
  processUploadedFiles,
  mapProductImages,
  updateProductImages,
} = require("../utils/UploadUtil");

const createProduct = async (req, res) => {
  try {
    const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
    if (!uploadResult.success) {
      return res.error(1, uploadResult.error);
    }

    let productData = { ...req.body };

    productData.colors =
      typeof productData.colors === "string"
        ? JSON.parse(productData.colors)
        : [];

    if (!Array.isArray(productData.colors)) {
      return res.error(1, "Định dạng màu không hợp lệ");
    }

    const filesMap = processUploadedFiles(req);

    try {
      productData = mapProductImages(productData, filesMap);
    } catch (error) {
      return res.error(1, error.message);
    }

    const result = await productService.createProduct(productData);
    result.EC === 0
      ? res.success(null, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
    if (!uploadResult.success) {
      return res.error(1, uploadResult.error);
    }

    let productData = { ...req.body };

    if (req.body.colors) {
      try {
        productData.colors = JSON.parse(req.body.colors);
        if (!Array.isArray(productData.colors)) {
          return res.error(1, "Định dạng màu không hợp lệ");
        }
      } catch (error) {
        return res.error(1, "Định dạng JSON không hợp lệ cho các biến thể");
      }
    } else {
      productData.colors = existingProduct.colors || [];
    }

    const filesMap = processUploadedFiles(req);

    try {
      productData = updateProductImages(filesMap, productData, existingProduct);
    } catch (error) {
      return res.error(1, error.message);
    }

    const result = await productService.updateProduct(productId, productData);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
    z;
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const result = await productService.deleteProduct(productId);

    return result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productService.getDetailsProduct(productId);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getAllProduct = async (req, res) => {
  try {
    const {
      category,
      category_gender,
      category_sub,
      price_min,
      price_max,
      product_color,
      product_brand,
    } = req.query;

    let genderFilter = category_gender
      ? [category_gender]
      : ["Nam", "Nữ", "Unisex"];

    const filters = {
      category,
      category_gender: genderFilter,
      category_sub,
      price_min,
      price_max,
      product_color,
      product_brand,
    };

    const result = await productService.getAllProduct(filters || null);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

module.exports = {
  createProduct,
  uploadImgProduct,
  updateProduct,
  deleteProduct,
  getDetailsProduct,
  getAllProduct,
};
