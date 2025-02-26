const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình nơi lưu ảnh trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Tạo thư mục trên Cloudinary
    format: async (req, file) => "png", // Định dạng file
    public_id: (req, file) => Date.now() + "-" + file.originalname // Tên file duy nhất
  }
});

// Khởi tạo middleware Multer
const upload = multer({ storage });

module.exports = upload;



