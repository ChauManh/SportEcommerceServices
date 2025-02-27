const Product = require("../models/Product.Model"); // Import model
const Category = require("../models/Category.Model")
// Hàm tạo sản phẩm mới
const createProduct = async (newProduct) => {
    return new Promise(async (resolve, reject) =>{
        const {
            product_title,
            product_category,
            product_brand , 
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
            const checkProductTitle = await Product.findOne({product_title})
            //check exist title
            if (checkProductTitle !== null) {
                return reject({
                status: "ERR",
                message: "Product exist",
                });
            }

            // check exist category
            // const checkProductCategory = await Category.findById(product_category);
            // if (checkProductCategory == null) {
            //     return reject({
            //     status: "ERR",
            //     message: "Category don't exist",
            //     });
            // }

            // create product
            const product_price = Math.min(
                ...variants.map((variant) => variant.product_price)
              );
            const product_countInStock = variants.reduce(
            (acc, variant) => acc + variant.product_countInStock, 0
            );
        
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
                return resolve({
                  status: "OK",
                  message: "Create product successfully",
                  data: newProductInstance,
                });
              }
        } catch (error) {
            return reject({
                status: "ERROR",
                message: error.message
            });
        }
    })
};

const updateProduct = async (productId, updatedProduct) => {
  return new Promise(async (resolve, reject) => {
      try {
          const existingProduct = await Product.findById(productId);
          console.log(existingProduct)
          if (!existingProduct) {
              return reject({
                  status: "ERR",
                  message: "Product not found",
              });
          }

          let updateData = { ...updatedProduct };

          // console.log("updatedata", updateData.variants)
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
        
          // else {
          //   updateData.product_price = existingProduct.product_price;
          //   updateData.product_countInStock = existingProduct.product_countInStock;
          // }

          const updatedProductInstance = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
          );

          if (updatedProductInstance) {
              return resolve({
                  status: "OK",
                  message: "Product updated successfully",
                  data: updatedProductInstance,
              });
          } else {
              return reject({
                  status: "ERR",
                  message: "Failed to update product",
              });
          }
      } catch (error) {
          return reject({
              status: "ERROR",
              message: error.message,
          });
      }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      })
      // .populate("product_category", "category_title category_parent_id category_level")
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Get details product successfully",
        data: product,
      });
    } catch (error) {
      return reject({
        status: "ERROR",
        message: error.message,
    });
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async(resolve, reject)=>{
    try {
      const product = await Product.findOne({
        _id: id,
      })

      if (!product) {
        return resolve({
          status: "ERROR",
          message: "The product don't exist",
        });
      }
      await product.delete();

      return resolve({
        status: "SUCCESS",
        message: "Delete product successfully"
      })
    } catch (error) {
      return reject({
        status: "ERROR",
        message: error.message,
    });
    }
  })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct
};
