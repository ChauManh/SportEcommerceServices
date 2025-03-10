const productService = require("../services/Product.service");
const upload = require("../middlewares/UploadMiddleWare");
const Product = require("../models/Product.Model");
const {uploadImgProduct, processUploadedFiles, mapProductImages, updateProductImages} = require('../utils/UploadUtil')

// const uploadImgProduct = (req, res, next) => {
//     console.log("Received body before Multer:", req.body);

//     const multerMiddleware = upload.any();

//     multerMiddleware(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ message: "Upload error", error: err.message });
//         }

//         console.log("Received body after Multer:", req.body);
//         console.log("Received files:", req.files);

//         try {
//             // if (!req.body.variants) {
//             //     return res.status(400).json({ message: "Variants data is required" });
//             // }

//             // let variants = JSON.parse(req.body.variants);
//             // if (!Array.isArray(variants)) {
//             //     return res.status(400).json({ message: "Invalid variants format. Expected an array." });
//             // }

//             next(); 
//         } catch (error) {
//             return res.status(400).json({ message: "Invalid variants JSON format", error: error.message });
//         }
//     });
// };



const createProduct = async (req, res) => {
    try {
        console.log("Received body:", req.body);
        console.log("Received files:", req.files);

        const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
        if (!uploadResult.success) {
            //return res.status(400).json({ message: "Upload error", error: uploadResult.error });
            return res.error(1, uploadResult.error);
        }

        let productData = { ...req.body };

        productData.variants = typeof productData.variants === "string" ? JSON.parse(productData.variants) : [];

        if (!Array.isArray(productData.variants)) {
            return res.error(1, "Invalid variants format. Expected an array.");
        }

        const filesMap = processUploadedFiles(req);

        try {
            productData = mapProductImages(productData, filesMap);
        } catch (error) {
            // return res.status(400).json({ message: error.message });
            return res.error(1, error.message);

        }
        // const filesMap = {};
        // if (req.files) {
        //     req.files.forEach(file => {
        //         if (!filesMap[file.fieldname]) {
        //             filesMap[file.fieldname] = [];
        //         }
        //         filesMap[file.fieldname].push(file.path);
        //     });
        // }

        // if (!filesMap["product_main_img"] || filesMap["product_main_img"].length === 0) {
        //     return res.status(400).json({ message: "Main product image is required" });
        // }

        // productData.product_img = {
        //     image_main: filesMap["product_main_img"] ? filesMap["product_main_img"][0] : "",
        //     image_subs: filesMap["product_subs_img"] || []
        // };

        // productData.variants.forEach((variant, index) => {
        //     variant.variant_img = {
        //         image_main: filesMap[`variant_img_${index}_main`] ? filesMap[`variant_img_${index}_main`][0] : "",
        //         image_subs: filesMap[`variant_img_${index}_subs`] || []
        //     };
        // });

        // let missingImages = productData.variants.some(variant => !variant.variant_img.image_main);
        // if (missingImages) {
        //     return res.status(400).json({ message: "Each variant must have an image_main" });
        // }

        console.log("Processed product data before saving:", productData);

        const result = await productService.createProduct(productData);
        //return res.status(200).json(response);
        result.EC === 0
                ? res.success(null, result.EM)
                : res.error(result.EC, result.EM);
    } catch (error) {
        console.error("Error creating product:", error);
        return res.InternalError(error.message);
    }
};


const updateProduct = async (req, res) => {
    try {
        const productId  = req.params.id;
        // console.log("productId:", productId);
        // console.log("body:", req.body);
        // console.log("files:", req.files);

        const existingProduct = await Product.findById(productId);
        // console.log("product:", existingProduct);
        if (!existingProduct) {
            return res.error(1, "Product doesn't exist")
        }

        const uploadResult = await uploadImgProduct(req, res); // Gọi hàm upload
        if (!uploadResult.success) {
            //return res.status(400).json({ message: "Upload error", error: uploadResult.error });
            return res.error(1, uploadResult.error);
        }
        
        let productData = { ...req.body };

        if (req.body.variants) {
            try {
                productData.variants = JSON.parse(req.body.variants);
                if (!Array.isArray(productData.variants)) {
                    return res.error(1, "Invalid variants format. Expected an array.");
                }
            } catch (error) {
                return res.error(1, "Invalid JSON format for variants");
                //return res.status(400).json({ message: "Invalid JSON format for variants" });
            }
        } else {
            productData.variants = existingProduct.variants || [];
        }

        const filesMap = processUploadedFiles(req);

        try {
            productData = updateProductImages(filesMap, productData, existingProduct);
        } catch (error) {
            return res.error(1, error.message);
            //return res.status(400).json({ message: error.message });
        }
        // const filesMap = {};
        // if (req.files) {
        //     req.files.forEach(file => {
        //         if (!filesMap[file.fieldname]) {
        //             filesMap[file.fieldname] = [];
        //         }
        //         filesMap[file.fieldname].push(file.path);
        //     });
        // }

        // productData.product_img = {
        //     image_main: filesMap["product_main_img"]?.[0] || existingProduct.product_img.image_main,
        //     image_subs: filesMap["product_subs_img"] || existingProduct.product_img.image_subs
        // };

        // if (productData.variants) {
        //     productData.variants = productData.variants.map((variant, index) => ({
        //         ...variant,
        //         variant_img: {
        //             image_main: filesMap[`variant_img_${index}_main`]?.[0] 
        //                 || variant.variant_img?.image_main 
        //                 || existingProduct.variants?.[index]?.variant_img?.image_main 
        //                 || "",
        //             image_subs: filesMap[`variant_img_${index}_subs`] 
        //                 || variant.variant_img?.image_subs 
        //                 || existingProduct.variants?.[index]?.variant_img?.image_subs 
        //                 || []
        //         }
        //     }));

        //     const missingImages = productData.variants.some(variant => !variant.variant_img.image_main);
        //     if (missingImages) {
        //         return res.status(400).json({ message: "Each variant must have an image_main" });
        //     }
        // }

        console.log("Processed product data before updating:", productData.variants);

        const result = await productService.updateProduct(productId, productData);
        result.EC === 0
                ? res.success(result.data, result.EM)
                : res.error(result.EC, result.EM);
    } catch (error) {
        // console.error("Error updating product:", error);
        return res.InternalError(error.message);
        //return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const deleteProduct = async(req, res) =>{
    try {
        const productId = req.params.id;

        const result = await productService.deleteProduct(productId);

        return result.EC === 0
                ? res.success(result.data, result.EM)
                : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message);
    }
}

const getDetailsProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const result = await productService.getDetailsProduct(productId);
      result.EC === 0
                ? res.success(result.data, result.EM)
                : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message);
    }
  };

module.exports = {
    createProduct,
    uploadImgProduct,
    updateProduct,
    deleteProduct,
    getDetailsProduct
};
