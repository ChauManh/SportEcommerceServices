const Product = require("../models/Product.Model"); // Import model
const Category = require("../models/Category.Model");
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
    product_percent_discount,
    colors,
  } = newProduct;

  try {
    // const checkProductTitle = await Product.findOne({ product_title });
    // // Check if product title already exists
    // if (checkProductTitle !== null) {
    //   return {
    //     EC: 1,
    //     EM: "Product already exists",
    //   };
    // }

    let product_price = 0;
    let product_countInStock = 0;

    const allPrices = colors.flatMap((color) =>
      color.variants.map((variant) => Number(variant.variant_price))
    );

    product_price = allPrices.length > 0 ? Math.min(...allPrices) : 0;

    product_countInStock = colors.reduce((acc, color) => {
      return (
        acc +
        color.variants.reduce(
          (sum, variant) => sum + Number(variant.variant_countInStock),
          0
        )
      );
    }, 0);

    // Create new product
    const newProductData = {
      product_title,
      product_category,
      product_description,
      product_display,
      product_famous,
      product_rate,
      product_brand,
      product_img,
      product_percent_discount,
      colors,
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

    if (updateData.colors) {
      const validPrices = updateData.colors
        .map((color) =>
          color.variants.map((variant) => {
            Number(variant.variant_price);
          })
        )
        .filter((price) => !isNaN(price) && price > 0);

      updateData.product_price =
        validPrices.length > 0
          ? Math.min(...validPrices)
          : existingProduct.product_price;

      countInStockOfEachColor = updateData.colors.map((color) =>
        color.variants.reduce((sum, variant) => {
          const countInStock = variant._doc
            ? Number(variant._doc.variant_countInStock)
            : Number(variant.variant_countInStock);
          return sum + (countInStock || 0);
        }, 0)
      );
      console.log("countInStockOfEachColor", countInStockOfEachColor);
      updateData.product_countInStock = countInStockOfEachColor.reduce(
        (sum, count) => {
          return sum + count;
        },
        0
      );
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
  console.log("filters", filters);
  try {
    let query = {};

    if (filters.category_gender?.length > 0 && !filters.category?.length) {
      const categories = await Category.find({
        category_gender: { $in: filters.category_gender },
      });
    
      const categoryIds = categories.map((cat) => cat._id);
    
      query.product_category = { $in: categoryIds };
    }

    // Xử lý lọc theo danh mục cha (category)
    if (filters.category) {
      let categoryArray = [];
    
      if (Array.isArray(filters.category)) {
        categoryArray = filters.category;
      } else if (typeof filters.category === 'string') {
        categoryArray = [filters.category];
      }
    
      let categoryIds = [];
    
      for (const categoryType of categoryArray) {
        const category = await Category.findOne({
          category_type: categoryType,
          category_gender: { $in: filters.category_gender },
        });
    
        if (category) {
          const subCategories = await Category.find({
            category_parent_id: category._id,
            category_gender: { $in: filters.category_gender },
          });
    
          categoryIds.push(category._id, ...subCategories.map((cat) => cat._id));
        }
      }
    
      if (categoryIds.length === 0) {
        return { EC: 1, EM: "Danh mục không tồn tại", data: [] };
      }
    
      query.product_category = { $in: categoryIds };
    }
    
    // Xử lý lọc theo danh mục con (category_sub)
    if (filters.category_sub) {
      let subArray = [];
  
      if (Array.isArray(filters.category_sub)) {
        subArray = filters.category_sub;
      } else if (typeof filters.category_sub === 'string') {
        subArray = [filters.category_sub];
      }
  
      let categorySubIds = [];
  
      for (const categoryType of subArray) {
        const category = await Category.findOne({
          category_type: categoryType,
          category_gender: { $in: filters.category_gender },
        });
  
        if (category) {
          const subCategories = await Category.find({
            category_parent_id: category._id,
            category_gender: { $in: filters.category_gender },
          });
  
          categorySubIds.push(category._id, ...subCategories.map((cat) => cat._id));
        }
      }
  
      if (categorySubIds.length === 0) {
        return { EC: 1, EM: "Danh mục con không tồn tại", data: [] };
      }
  
      if (query.product_category?.$in) {
        query.product_category.$in.push(...categorySubIds);
      } else {
        query.product_category = { $in: categorySubIds };
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
      const colorArray = Array.isArray(filters.product_color)
        ? filters.product_color
        : [filters.product_color];
  
      if (colorArray.length > 0) {
        query["colors.color_name"] = { $in: colorArray };
      }
    }
  
    // Lọc theo thương hiệu
    if (filters.product_brand?.length > 0) {
      query.product_brand = { $in: filters.product_brand };
    }

    // Truy vấn danh sách sản phẩm
    const products = await Product.find(query).populate("product_category");
    // Đếm tổng số sản phẩm
    const totalProducts = await Product.countDocuments(query);

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      data: {
        total: totalProducts,
        products,
      },
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    };
  }
};


module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
