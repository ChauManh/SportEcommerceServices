const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình nơi lưu ảnh trên Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "products", // Lưu trong thư mục "products" trên Cloudinary
            format: "png", // Luôn lưu file dưới dạng PNG
            public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "_"), // Xử lý tên file an toàn
        };
    },
});

// Middleware kiểm tra file ảnh hợp lệ
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
};

// Cấu hình Multer với giới hạn kích thước file
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB mỗi file
});

module.exports = upload;
