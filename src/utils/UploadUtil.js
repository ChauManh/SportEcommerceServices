const util = require("util");
const upload = require("../middlewares/UploadMiddleWare");

const uploadFiles = util.promisify(upload.any()); // Chuyển multer thành Promise

const uploadImgProduct = async (req, res) => {
  try {
    await uploadFiles(req, res); // Chờ upload hoàn tất
    console.log("Received body after Multer:", req.body);
    console.log("Received files:", req.files);
    return { success: true };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, error: err.message };
  }
};

const processUploadedFiles = (req) => {
  const filesMap = {};

  if (req.files) {
    req.files.forEach((file) => {
      if (!filesMap[file.fieldname]) {
        filesMap[file.fieldname] = [];
      }
      filesMap[file.fieldname].push(file.path);
    });
  }

  return filesMap;
};

const mapProductImages = (productData, filesMap) => {
  if (
    !filesMap["product_main_img"] ||
    filesMap["product_main_img"].length === 0
  ) {
    throw new Error("Main product image is required");
  }

  productData.product_img = {
    image_main: filesMap["product_main_img"]
      ? filesMap["product_main_img"][0]
      : "",
    image_subs: filesMap["product_subs_img"] || [],
  };

  productData.variants.forEach((variant, index) => {
    variant.variant_img = {
      image_main: filesMap[`variant_img_${index}_main`]
        ? filesMap[`variant_img_${index}_main`][0]
        : "",
      image_subs: filesMap[`variant_img_${index}_subs`] || [],
    };
  });

  return productData;
};

const updateProductImages = (filesMap, productData, existingProduct) => {
  productData.product_img = {
    image_main:
      filesMap["product_main_img"]?.[0] ||
      existingProduct?.product_img?.image_main ||
      "",
    image_subs:
      filesMap["product_subs_img"] ||
      existingProduct?.product_img?.image_subs ||
      [],
  };

  if (productData.variants) {
    productData.variants = productData.variants.map((variant, index) => ({
      ...variant,
      variant_img: {
        image_main:
          filesMap[`variant_img_${index}_main`]?.[0] ||
          variant?.variant_img?.image_main ||
          existingProduct?.variants?.[index]?.variant_img?.image_main ||
          "",
        image_subs:
          filesMap[`variant_img_${index}_subs`] ||
          variant?.variant_img?.image_subs ||
          existingProduct?.variants?.[index]?.variant_img?.image_subs ||
          [],
      },
    }));
  }
  return productData;
};

const processFiles = (files) => {
  const images = [];
  const videos = [];

  (files || []).forEach((file) => {
    if (file.mimetype.startsWith("image/")) {
      images.push(file.path);
    } else if (file.mimetype.startsWith("video/")) {
      videos.push(file.path);
    }
  });

  return { images, videos };
};

const uploadAvtUser = async (req, res) => {
  try {
    await uploadFiles(req, res); // Xử lý upload file

    if (!req.files || req.files.length === 0) {
      return { success: false, message: "No avatar uploaded", avatar: null };
    }

    const avatarFile = req.files.find((file) => file.fieldname === "avatar");

    return {
      success: true,
      avatar: avatarFile ? avatarFile.path : null,
    };
  } catch (err) {
    console.error("Upload avatar error:", err);
    return { success: false, error: err.message, avatar: null };
  }
};

module.exports = {
  processFiles,
  uploadImgProduct,
  processUploadedFiles,
  mapProductImages,
  updateProductImages,
  processFiles,
  uploadAvtUser,
};
