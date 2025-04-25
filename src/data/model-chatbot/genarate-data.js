require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('../../models/Product.model');
const Category = require('../../models/Category.model');

(async () => {
    await mongoose.connect('mongodb+srv://chaumanh1108:chaumanh1108@sportecommerce.v3qqi.mongodb.net/sportecommerce?retryWrites=true&w=majority&appName=sportecommerce', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
    const products = await Product.find();
    const productCount = await Product.countDocuments();
    const fineTuneData = [];
    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },  
        {
            role: 'user',
            content: 'Chính sách đổi trả sản phẩm của cửa hàng là gì?'
        },
        {
            role: 'assistant',
            content: "Chúng mình chấp nhận đổi trả trong vòng 14 ngày kể từ ngày mua hàng. Để đổi trả, bạn cần cung cấp hóa đơn mua hàng và sản phẩm phải còn nguyên vẹn, chưa qua sử dụng."
        }
    ]);
    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },
        {
            role: 'user',
            content: 'Cửa hàng có bảo mật thông tin không?'
        },
        {
            role: 'assistant',
            content: "Chúng mình cam kết tuân thủ các quy định pháp luật về bảo vệ dữ liệu và sử dụng thông tin cá nhân của khách hàng một cách cẩn thận và công bằng."
        }
    ]);
    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },
        {
            role: 'user',
            content: 'Có mấy phương thức thanh toán?'
        },
        {
            role: 'assistant',
            content: "Chúng mình có 2 phương thức thanh toán: chuyển khoản và thanh toán khi nhận hàng. Bạn có thể chọn phương thức nào phù hợp với mình nhất."
        }
    ]);
    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },
        {
            role: 'user',
            content: 'Bảo hành sản phẩm có được không?'
        },
        {
            role: 'assistant',
            content: "Hiện tại chúng mình không có chính sách bảo hành sản phẩm. Tuy nhiên, nếu sản phẩm gặp vấn đề kỹ thuật trong vòng 14 ngày kể từ ngày mua hàng, bạn có thể liên hệ với chúng mình để được hỗ trợ."
        }
    ]);

    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },
        {
            role: 'user',
            content: 'Hiện tại bên cửa hàng mình có bao nhiêu sản phẩm?'
        },
        {
            role: 'assistant',
            content: `Hiện tại chúng mình có khoảng ${productCount} sản phẩm khác nhau. Bạn có thể tham khảo trên trang web của chúng mình để biết thêm chi tiết.`
        }
    ]);
    fineTuneData.push([
        {
            role: "system",
            content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
        },
        {
            role: 'user',
            content: 'Hiện tại bên cửa hàng mình có bao nhiêu loại sản phẩm?'
        },
        {
            role: 'assistant',
            content: `Hiện tại chúng mình đang cung cấp ba loại sản phẩm gồm giày, áo, quần của các thương hiệu như Nike, Puma, Adidas.`
        }
    ]);
    // -----------------------------------------------
    const giayDaBongUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày đá bóng",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayDaBongUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày đá bóng Unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = giayDaBongUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayDaBongUnisex.length} sản phẩm giày đá bóng unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayDaBongNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày đá bóng",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayDaBongNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày đá bóng nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = giayDaBongNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayDaBongNam.length} sản phẩm giày đá bóng nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayDaBongNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày đá bóng",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayDaBongNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày đá bóng nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = giayDaBongNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayDaBongNu.length} sản phẩm giày đá bóng nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTennisNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tennis",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTennisNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày Tennis nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    }
    else {
        const productListText = giayTennisNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTennisNam.length} sản phẩm giày Tennis nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTennisNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tennis",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTennisNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày Tennis nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    } else {
        const productListText = giayTennisNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTennisNu.length} sản phẩm giày Tennis nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTennisUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tennis",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTennisUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày Tennis unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    } else {
        const productListText = giayTennisUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày Tennis unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTennisUnisex.length} sản phẩm giày Tennis unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTapGymUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tập gynm",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTapGymUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày tập gym unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    } else {
        const productListText = giayTapGymUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTapGymUnisex.length} sản phẩm giày tập gym unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTapGymNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tập gynm",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTapGymNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày tập gym nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    } else {
        const productListText = giayTapGymNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTapGymNam.length} sản phẩm giày tập gym nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayTapGymNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày tập gynm",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayTapGymNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại giày tập gym nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ])
    } else {
        const productListText = giayTapGymNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày tập gym nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayTapGymNu.length} sản phẩm giày tập gym nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayChayBoNam = await Product.aggregate([
        { $match: { product_countInStock: { $gt: 0 } } },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày chạy bộ",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayChayBoNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ nam?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày chạy bộ nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    } else {
        const productListText = giayChayBoNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayChayBoNam.length} sản phẩm giày chạy bộ nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayChayBoNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày chạy bộ",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayChayBoNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ nữ?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày chạy bộ nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    }
    else {
        const productListText = giayChayBoNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayChayBoNu.length} sản phẩm giày chạy bộ nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayChayBoUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày chạy bộ",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayChayBoUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ unisex?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày chạy bộ unisex tạm hết hàng.Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    }
    else {
        const productListText = giayChayBoUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày chạy bộ unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayChayBoUnisex.length} sản phẩm giày chạy bộ unisex đang bán chạy nhất: \n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayBongRoUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày bóng rổ",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayBongRoUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ unisex?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày bóng rổ unisex tạm hết hàng.Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    }
    else {
        const productListText = giayBongRoUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price} đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayBongRoUnisex.length} sản phẩm giày bóng rổ unisex đang bán chạy nhất: \n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayBongRoNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày bóng rổ",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayBongRoNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ nam?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày bóng rổ nam tạm hết hàng.Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    }
    else {
        const productListText = giayBongRoNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price} đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayBongRoNam.length} sản phẩm giày bóng rổ nam đang bán chạy nhất: \n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const giayBongRoNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Giày bóng rổ",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (giayBongRoNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ nữ?'
            },
            {
                role: 'assistant',
                content: 'Hiện tại giày bóng rổ nữ tạm hết hàng.Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!'
            }
        ]);
    }
    else {
        const productListText = giayBongRoNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price} đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm giày bóng rổ nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${giayBongRoNu.length} sản phẩm giày bóng rổ nữ đang bán chạy nhất: \n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    // ---------------------------

    const aoDaBongNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo đá bóng",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);
    if (aoDaBongNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo đá bóng nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = aoDaBongNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoDaBongNam.length} sản phẩm áo đá bóng nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const aoDaBongNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo đá bóng",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (aoDaBongNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo đá bóng nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = aoDaBongNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoDaBongNu.length} sản phẩm áo đá bóng nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const aoDaBongUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo đá bóng",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (aoDaBongUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo đá bóng unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    } else {
        const productListText = aoDaBongUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoDaBongUnisex.length} sản phẩm áo đá bóng unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const aoThunNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo thun",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (aoThunNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo thun nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = aoThunNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoThunNam.length} sản phẩm áo thun nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const aoThunNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo thun",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (aoThunNu.length === 0) {

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo thun nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    } else {

        const productListText = aoThunNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoThunNu.length} sản phẩm áo thun nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const aoThunUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Áo thun",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (aoThunUnisex.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại áo thun unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = aoThunUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm áo thun unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${aoThunUnisex.length} sản phẩm áo thun unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const quanDaBongNam = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Quần đá bóng",
                "product_category.category_gender": "Nam"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (quanDaBongNam.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại quần đá bóng nam tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    }
    else {
        const productListText = quanDaBongNam.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng nam?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${quanDaBongNam.length} sản phẩm quần đá bóng nam đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const quanDaBongNu = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Quần đá bóng",
                "product_category.category_gender": "Nữ"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);

    if (quanDaBongNu.length === 0) {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại quần đá bóng nữ tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    } else {
        const productListText = quanDaBongNu.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng nữ?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${quanDaBongNu.length} sản phẩm quần đá bóng nữ đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    const quanDaBongUnisex = await Product.aggregate([
        {
            $match: {
                product_countInStock: { $gt: 0 }
            }
        },
        {
            $lookup: {
                from: "Category",
                localField: "product_category",
                foreignField: "_id",
                as: "product_category"
            }
        },
        { $unwind: "$product_category" },
        {
            $match: {
                "product_category.category_type": "Quần đá bóng",
                "product_category.category_gender": "Unisex"
            }
        },
        { $sort: { product_selled: -1 } },
        { $limit: 3 }
    ]);


    if (quanDaBongUnisex.length === 0) {

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại quần đá bóng unisex tạm hết hàng. Tìm kiếm các sản phẩm khác trên trang web của chúng mình nhé!`
            }
        ]);
    } else {

        const productListText = quanDaBongUnisex.map((p, index) =>
            `${index + 1}. ${p.product_title} - Giá: ${p.product_price}đ`
        ).join('\n');

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: 'user',
                content: 'Gợi ý một số sản phẩm quần đá bóng unisex?'
            },
            {
                role: 'assistant',
                content: `Hiện tại chúng mình có ${quanDaBongUnisex.length} sản phẩm quần đá bóng unisex đang bán chạy nhất:\n${productListText}\nBạn có thể tìm kiếm thêm thông tin chi tiết trên trang web của chúng mình nhé!`
            }
        ]);
    }

    //   ----------------------------------------
    products.forEach(product => {
        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: "user",
                content: `Giới thiệu cho tôi sản phẩm "${product.product_title}"`
            },
            {
                role: "assistant",
                content: ` Hiện tại sản phẩm "${product.product_title}" có giá: ${product.product_price}VND.`
            }
        ]);

        fineTuneData.push([
            {
                role: "system",
                content: "Bạn là trợ lý bán hàng của cửa hàng bán đồ thể thao WTM."
            },
            {
                role: "user",
                content: ` Giá của "${product.product_title}" là bao nhiêu?`
            },
            {
                role: "assistant",
                content: ` Giá của "${product.product_title}" là ${product.product_price} VND.`
            }
        ]);
    });


    const jsonl = fineTuneData.map(chat => JSON.stringify({ messages: chat })).join('\n');
    fs.writeFileSync('train.jsonl', jsonl, 'utf8');

    console.log("✅ Đã tạo file train.jsonl");
    process.exit();
})();
