const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

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
};

const updateProduct = async (productId, updatedProduct) => {
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
};

const getDetailsProduct = async (id) => {
  const product = await Product.findById(id).populate("product_category");

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
};

const getAllProduct = async (filters) => {
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

  const categoryArray = Array.isArray(filters.category)
    ? filters.category
    : [filters.category];
  const subArray = Array.isArray(filters.category_sub)
    ? filters.category_sub
    : [filters.category_sub];

  let subCategoryParentIds = [];

  if (filters.category_sub) {
    const subCategories = await Category.find({
      category_type: { $in: subArray },
      category_gender: { $in: genderFilter },
    });

    subCategoryParentIds = subCategories.map((subCat) => ({
      parentId: subCat.category_parent_id,
      subId: subCat._id,
    }));
  }

  if (!filters.category && filters.category_sub) {
    for (const subCategory of subArray) {
      const subCategories = await Category.find({
        category_type: subCategory,
        category_gender: { $in: genderFilter },
      });

      for (const sub of subCategories) {
        categoryIds.push(sub._id);
      }
    }
  }

  for (const categoryType of categoryArray) {
    const matchedCategories = await Category.find({
      category_type: categoryType,
      category_gender: { $in: genderFilter },
    });

    for (const parent of matchedCategories) {
      const relatedSubs = subCategoryParentIds.filter(
        (item) => item.parentId.toString() === parent._id.toString()
      );

      if (relatedSubs.length > 0) {
        categoryIds.push(...relatedSubs.map((item) => item.subId));
      } else {
        categoryIds.push(parent._id);

        const subCats = await Category.find({
          category_parent_id: parent._id,
          category_gender: { $in: genderFilter },
        });
        categoryIds.push(...subCats.map((cat) => cat._id));
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
    if (filters.price_min) query.product_price.$gte = Number(filters.price_min);
    if (filters.price_max) query.product_price.$lte = Number(filters.price_max);
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
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
