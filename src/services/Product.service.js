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

      // Calculate product_price and product_countInStock
      const product_price = Math.min(
          ...variants.map((variant) => variant.product_price)
      );
      const product_countInStock = variants.reduce(
          (acc, variant) => acc + variant.product_countInStock,
          0
      );

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
          variants,
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
      const product = await Product.findById(id);
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

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct
};
