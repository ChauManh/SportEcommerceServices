const Product = require("../models/Product.model"); // Import model
const Category = require("../models/Category.model");
const {
  createNotificationForAll,
} = require("../services/Notification.service");
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
        EM: "Tạo sản phẩm mới thành công",
        data: newProductInstance,
      };
    }
  } catch (error) {
    return {
      EC: 2,
      EM: error.message,
      data: [],
    };
  }
};

const updateProduct = async (productId, updatedProduct) => {
  try {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
        data: [],
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
        EM: "Cập nhật sản phẩm thành công",
        data: updatedProductInstance,
      };
    } else {
      return {
        EC: 2,
        EM: "Cập nhật sản phẩm thất bại",
        data: [],
      };
    }
  } catch (error) {
    return {
      EC: 3,
      EM: error.message,
      data: [],
    };
  }
};

const getDetailsProduct = async (id) => {
  const product = await Product.findById(id).populate("product_category");
  // .populate("product_category", "category_title category_parent_id category_level");

  if (!product) {
    return {
      EC: 1,
      EM: "Không tìm thấy sản phẩm",
      data: [],
    };
  }

  return {
    EC: 0,
    EM: "Lấy chi tiết sản phẩm thành công",
    data: product,
  };
};

const deleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm",
        data: [],
      };
    }

    await product.deleteOne();

    return {
      EC: 0,
      EM: "Xóa sản phẩm thành công",
      data: [],
    };
  } catch (error) {
    return {
      EC: 2,
      EM: error.message,
      data: [],
    };
  }
};

const getAllProduct = async (filters) => {
  try {
    let query = {};
    const genderFilter =
      filters.category_gender?.length > 0 ? filters.category_gender : [];

    let categoryIds = [];

    if (
      genderFilter.length !== 3 &&
      !filters.category?.length &&
      !filters.category_sub?.length
    ) {
      const categories = await Category.find({
        category_gender: { $in: genderFilter },
      });
      categoryIds.push(...categories.map((cat) => cat._id));
    }

    if (filters.category) {
      const categoryArray = Array.isArray(filters.category)
        ? filters.category
        : [filters.category];

      for (const categoryType of categoryArray) {
        const matchedCategories = await Category.find({
          category_type: categoryType,
          category_gender: { $in: genderFilter },
        });

        for (const parent of matchedCategories) {
          categoryIds.push(parent._id);
          const subCats = await Category.find({
            category_parent_id: parent._id,
            category_gender: { $in: genderFilter },
          });
          categoryIds.push(...subCats.map((cat) => cat._id));
        }
      }
    }

    if (filters.category_sub) {
      const subArray = Array.isArray(filters.category_sub)
        ? filters.category_sub
        : [filters.category_sub];

      for (const categoryType of subArray) {
        const matchedSubCategories = await Category.find({
          category_type: categoryType,
          category_gender: { $in: genderFilter },
        });

        for (const category of matchedSubCategories) {
          categoryIds.push(category._id);
          const subSubCats = await Category.find({
            category_parent_id: category._id,
            category_gender: { $in: genderFilter },
          });
          categoryIds.push(...subSubCats.map((cat) => cat._id));
        }
      }
    }

    if (categoryIds.length > 0) {
      query.product_category = {
        $in: [...new Set(categoryIds.map((id) => id.toString()))],
      };
    }

    if (filters.price_min || filters.price_max) {
      query.product_price = {};
      if (filters.price_min)
        query.product_price.$gte = Number(filters.price_min);
      if (filters.price_max)
        query.product_price.$lte = Number(filters.price_max);
    }

    if (filters.product_color) {
      const colorArray = Array.isArray(filters.product_color)
        ? filters.product_color
        : [filters.product_color];
      if (colorArray.length > 0) {
        query["colors.color_name"] = { $in: colorArray };
      }
    }

    if (filters.product_brand?.length > 0) {
      query.product_brand = { $in: filters.product_brand };
    }

    const products = await Product.find(query).populate("product_category");
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
      data: [],
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
