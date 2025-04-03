const Product = require("../models/Product.Model"); // Import model
const Category = require("../models/Category.Model")
// Hàm tạo sản phẩm mới
const createProduct = async (newProduct) => {
  const {
      product_title,
      product_category,
      product_brand,
      product_img,
      product_description,
      product_display,
      product_famous,
      product_price: inputPrice,
      product_countInStock: inputCountInStock,
      product_rate,
      product_selled,
      product_percent_discount,
      variants,
  } = newProduct;

  try {
      const checkProductTitle = await Product.findOne({ product_title });
      // Check if product title already exists
      if (checkProductTitle !== null) {
          return {
              EC: 1,
              EM: "Product already exists",
          };
      }

      let product_price = 0;
      let product_countInStock = 0;
      let parsedVariants = [];

      if (variants.length !== 0) {
          parsedVariants = variants.map(variant => ({
              ...variant,
              variant_price: Number(variant.variant_price),
              variant_countInStock: Number(variant.variant_countInStock),
              variant_percent_discount: Number(variant.variant_percent_discount),
          }));

          product_price = Math.min(
              ...parsedVariants.map(variant => variant.variant_price)
          );

          product_countInStock = parsedVariants.reduce(
              (acc, variant) => acc + variant.variant_countInStock,
              0
          );
      } else {
          product_price = Number(inputPrice); 
          product_countInStock = Number(inputCountInStock); 
      }

      // Create new product
      const newProductData = {
          product_title,
          product_category,
          product_description,
          product_display,
          product_famous,
          product_rate,
          product_selled,
          product_brand,
          product_img,
          product_percent_discount,
          variants: parsedVariants,
          product_price,
          product_countInStock,
      };

      const newProductInstance = await Product.create(newProductData);
      if (newProductInstance) {
          return {
              EC: 0,
              EM: "Create new product successfully",
              data: newProductInstance,
          };
      }
  } catch (error) {
      return {
          EC: 2,
          EM: error.message,
      };
  }
};


const updateProduct = async (productId, updatedProduct) => {
  try {
      const existingProduct = await Product.findById(productId);
      
      if (!existingProduct) {
          return {
              EC: 1,
              EM: "Product not found",
          };
      }

      let updateData = { ...updatedProduct };

      if (updateData.variants) {
          const validPrices = updateData.variants
              .map((variant) => Number(variant.variant_price))
              .filter((price) => !isNaN(price) && price > 0);

          updateData.product_price = validPrices.length > 0 
              ? Math.min(...validPrices) 
              : existingProduct.product_price;

          updateData.product_countInStock = updateData.variants.reduce((acc, variant) => {
              const countInStock = variant._doc 
                  ? Number(variant._doc.variant_countInStock) 
                  : Number(variant.variant_countInStock);
              return acc + (countInStock || 0);
          }, 0);
      }

      const updatedProductInstance = await Product.findByIdAndUpdate(
          productId,
          updateData,
          { new: true, runValidators: true }
      );

      if (updatedProductInstance) {
          return {
              EC: 0,
              EM: "Product updated successfully",
              data: updatedProductInstance,
          };
      } else {
          return {
              EC: 2,
              EM: "Failed to update product",
          };
      }
  } catch (error) {
      return {
          EC: 3,
          EM: error.message,
      };
  }
};

const getDetailsProduct = async (id) => {
  try {
      const product = await Product.findById(id).populate("product_category");
      // .populate("product_category", "category_title category_parent_id category_level");

      if (!product) {
          return {
              EC: 1,
              EM: "The product is not defined",
          };
      }

      return {
          EC: 0,
          EM: "Get product details successfully",
          data: product,
      };
  } catch (error) {
      return {
          EC: 2,
          EM: error.message,
      };
  }
};

const deleteProduct = async (id) => {
  try {
      const product = await Product.findById(id);

      if (!product) {
          return {
              EC: 1,
              EM: "The product does not exist",
          };
      }

      await product.deleteOne();

      return {
          EC: 0,
          EM: "Product deleted successfully",
      };
  } catch (error) {
      return {
          EC: 2,
          EM: error.message,
      };
  }
};

const getAllProduct = async (filters) => {
    try {
      let query = {};
  
      // Tìm danh mục và tất cả danh mục con
      if (filters.category) {
        const category = await Category.findOne({ category_type: filters.category });
        if (category) {
          const subCategories = await Category.find({ category_parent_id: category._id });
  
          const categoryIds = [category._id, ...subCategories.map(cat => cat._id)];
  
          query.product_category = { $in: categoryIds };
        } else {
          return { EC: 1, EM: "Danh mục không tồn tại", data: [] };
        }
      }

      if (filters.category_sub) {
        const category = await Category.findOne({ category_type: filters.category_sub });
        if (category) {
          const subCategories = await Category.find({ category_parent_id: category._id });
  
          const categoryIds = [category._id, ...subCategories.map(cat => cat._id)];
  
          query.product_category = { $in: categoryIds };
        } else {
          return { EC: 1, EM: "Danh mục không tồn tại", data: [] };
        }
      }
  
      // Lọc theo khoảng giá
      if (filters.price_min || filters.price_max) {
        query.product_price = {};
        if (filters.price_min) query.product_price.$gte = Number(filters.price_min);
        if (filters.price_max) query.product_price.$lte = Number(filters.price_max);
      }
  
      // Lọc theo màu sắc
      if (filters.product_color) {
        query["variants.variant_color"] = filters.product_color;
      }
  
      //  Tìm kiếm theo `product_title`
      if (filters.search) {
        query.product_title = { $regex: filters.search, $options: "i" }; 
      }
  
      
      // Truy vấn danh sách sản phẩm
      const products = await Product.find(query)
        .populate("product_category") 
  
      // Đếm tổng số sản phẩm 
      const totalProducts = await Product.countDocuments(query);
  
      return {
        EC: 0,
        EM: "Lấy danh sách sản phẩm thành công",
        data: {
          total: totalProducts,
          products
        }
      };
    } catch (error) {
      return { EC: 1, EM: "Lỗi khi lấy danh sách sản phẩm", error: error.message };
    }
  };

  
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
};
