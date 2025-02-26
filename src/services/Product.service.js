const Product = require("../models/Product.Model"); // Import model
const Category = require("../models/Category.Model")
// Hàm tạo sản phẩm mới
const createProduct = async (newProduct) => {
    return new Promise(async (resolve, reject) =>{
        const {
            product_title,
            product_category,
            product_brand , 
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
        
              // Xây dựng dữ liệu sản phẩm mới
              const newProductData = {
                product_title,
                product_category,
                product_description,
                product_display,
                product_famous,
                product_rate,
                product_selled,
                product_brand,
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

module.exports = {
    createProduct
};
