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
    !filesMap["product_img"] ||
    filesMap["product_img"].length === 0
  ) {
    throw new Error("Ảnh chính sản phẩm là bắt buộc");
  }

  productData.product_img = filesMap["product_img"]
    ? filesMap["product_img"][0]
    : "";

  productData.colors.forEach((color, index) => {
    color.imgs = {
      img_main: filesMap[`color_img_${index}_main`]
        ? filesMap[`color_img_${index}_main`][0]
        : "",
        img_subs: filesMap[`color_img_${index}_subs`] || [],
    };
  });

  return productData;
};

const updateProductImages = (filesMap, productData, existingProduct) => {
  if (
    !filesMap["product_img"] ||
    filesMap["product_img"].length === 0
  ) {
    throw new Error("Ảnh chính sản phẩm là bắt buộc");
  }
  productData.product_img = filesMap["product_img"]
  ? filesMap["product_img"][0]
  : "";


  if (productData.colors) {
    productData.colors = productData.colors.map((color, index) => ({
      ...color,
      imgs: {
        img_main:
          filesMap[`color_img_${index}_main`]?.[0] ||
          color?.imgs?.img_main ||
          existingProduct?.colors?.[index]?.imgs?.img_main ||
          "",
          img_subs:
          filesMap[`color_img_${index}_subs`] ||
          color?.imgs?.img_subs ||
          existingProduct?.colors?.[index]?.imgs?.imgs_subs ||
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
      return { success: false, message: "Không có ảnh đại diện tải lên", avatar: null };
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
