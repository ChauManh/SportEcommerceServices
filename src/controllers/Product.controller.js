const productService = require("../services/Product.service");
const upload = require("../middlewares/UploadMiddleWare");

// Middleware upload ảnh sản phẩm + biến thể
const uploadImgProduct = (req, res, next) => {
    console.log("Received body before Multer:", req.body);

    const multerMiddleware = upload.any(); // Sử dụng `any()` để chấp nhận tất cả các file

    multerMiddleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "Upload error", error: err.message });
        }

        console.log("Received body after Multer:", req.body);
        console.log("Received files:", req.files);

        try {
            if (!req.body.variants) {
                return res.status(400).json({ message: "Variants data is required" });
            }

            let variants = JSON.parse(req.body.variants);
            let fields = [];

            variants.forEach((_, index) => {
                fields.push({ name: `variant_img_${index}_main`, maxCount: 1 });
                fields.push({ name: `variant_img_${index}_subs`, maxCount: 5 });
            });

            next();
        } catch (error) {
            return res.status(400).json({ message: "Invalid variants JSON format", error: error.message });
        }
    });
};



// API tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        console.log("Received files:", req.files);

        let productData = { ...req.body };

        productData.variants = typeof productData.variants === "string" ? JSON.parse(productData.variants) : [];

        if (!Array.isArray(productData.variants)) {
            return res.status(400).json({ message: "Invalid variants format. Expected an array." });
        }

        const filesMap = {};
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach(file => {
                if (!filesMap[file.fieldname]) {
                    filesMap[file.fieldname] = [];
                }
                filesMap[file.fieldname].push(file.path);
            });
        }

        productData.variants.forEach((variant, index) => {
            variant.variant_img = {
                image_main: filesMap[`variant_img_${index}_main`] ? filesMap[`variant_img_${index}_main`][0] : "",
                image_subs: filesMap[`variant_img_${index}_subs`] || []
            };
        });

        let missingImages = productData.variants.some(variant => !variant.variant_img.image_main);
        if (missingImages) {
            return res.status(400).json({ message: "Each variant must have an image_main" });
        }

        console.log("Processed variants before saving:", productData.variants);

        const response = await productService.createProduct(productData);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




module.exports = {
    createProduct,
    uploadImgProduct
};
