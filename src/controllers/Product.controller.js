const productService = require("../services/Product.service");
const Product = require("../models/Product.Model");
const {
  uploadImgProduct,
  processUploadedFiles,
  mapProductImages,
  updateProductImages,
} = require("../utils/UploadUtil");

// const uploadImgProduct = (req, res, next) => {
//     console.log("Received body before Multer:", req.body);

//     const multerMiddleware = upload.any();

//     multerMiddleware(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ message: "Upload error", error: err.message });
//         }

//         console.log("Received body after Multer:", req.body);
//         console.log("Received files:", req.files);

//         try {
//             // if (!req.body.variants) {
//             //     return res.status(400).json({ message: "Variants data is required" });
//             // }

//             // let variants = JSON.parse(req.body.variants);
//             // if (!Array.isArray(variants)) {
//             //     return res.status(400).json({ message: "Invalid variants format. Expected an array." });
//             // }

//             next();
//         } catch (error) {
//             return res.status(400).json({ message: "Invalid variants JSON format", error: error.message });
//         }
//     });
// };

const createProduct = async (req, res) => {
  try {
    const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
    if (!uploadResult.success) {
      //return res.status(400).json({ message: "Upload error", error: uploadResult.error });
      return res.error(1, uploadResult.error);
    }

    let productData = { ...req.body };

    productData.colors =
      typeof productData.colors === "string"
        ? JSON.parse(productData.colors)
        : [];

    if (!Array.isArray(productData.colors)) {
      return res.error(1, "Invalid colors format. Expected an array.");
    }

    const filesMap = processUploadedFiles(req);

    try {
      productData = mapProductImages(productData, filesMap);
    } catch (error) {
      // return res.status(400).json({ message: error.message });
      return res.error(1, error.message);
    }

    const result = await productService.createProduct(productData);
    //return res.status(200).json(response);
    result.EC === 0
      ? res.success(null, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.InternalError(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.error(1, "Product doesn't exist");
    }

    const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
    if (!uploadResult.success) {
      return res.error(1, uploadResult.error);
    }

    let productData = { ...req.body };

    if (req.body.colors) {
      try {
        productData.colors = JSON.parse(req.body.colors);
        if (!Array.isArray(productData.colors)) {
          return res.error(1, "Invalid variants format. Expected an array.");
        }
      } catch (error) {
        return res.error(1, "Invalid JSON format for variants");
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
    return res.InternalError(error.message);
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
    return res.InternalError(error.message);
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
    return res.InternalError(error.message);
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
    return res.InternalError(error.message);
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
