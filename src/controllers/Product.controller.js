const productService = require("../services/Product.service");
const upload = require("../middlewares/UploadMiddleWare");

// Middleware upload ảnh sản phẩm + biến thể
const uploadImgProduct = (req, res, next) => {
    try {
        let fields = [];
        console.log("Received body:", req.body);
        // Kiểm tra nếu có biến thể, thêm trường ảnh vào Multer
        if (req.body.variants) {
            try {
                let variants = JSON.parse(req.body.variants);
                variants.forEach((_, index) => {
                    fields.push({ name: `variant_img_${index}_main`, maxCount: 1 });
                    fields.push({ name: `variant_img_${index}_subs`, maxCount: 5 });
                });
            } catch (error) {
                return res.status(400).json({ message: "Invalid variants JSON format", error: error.message });
            }
        } else {
            return res.status(400).json({ message: "Variants data is required" });
        }

        const Upload = upload.fields(fields);
        Upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ message: "Upload error", error: err.message });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// API tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        console.log("Received files:", req.files);

        const productData = req.body ;

        productData.variants = productData.variants ? JSON.parse(productData.variants) : [];

        if (!req.files) req.files = {};

        // Gán ảnh vào từng biến thể
        productData.variants.forEach((variant, index) => {
            variant.variant_img = {
                image_main: req.files[`variant_img_${index}_main`]?.[0]?.path || null,
                image_subs: req.files[`variant_img_${index}_subs`]?.map(file => file.path) || []
            };
        });

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
