const Order = require('../models/Order.Model')
const Product = require('../models/Product.Model')
const Discount = require('../models/Discount.Model');
const User = require('../models/User.model');

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { user_id, shipping_address, products, order_payment_method, order_note, discount_ids } = newOrder;

            if (!products || !Array.isArray(products) || products.length === 0) {
                return reject(new Error("Products array is required"));
            }

            let delivery_fee = 50000;
            let order_total_price = 0;

            const orderProducts = await Promise.all(products.map(async (item) => {

                const product = await Product.findById(item.product_id);
                if (!product) throw new Error(`Product not found: ${item.product_id}`);

                const variant = product.variants.find(v => v._id.equals(item.variant));
                if (!variant) throw new Error(`Variant not found: ${item.variant}`);

                if (variant.variant_countInStock < item.quantity) {
                    throw new Error(`Variant ${item.variant} is out of stock`);
                }

                await Product.findOneAndUpdate(
                    { _id: item.product_id, "variants._id": item.variant },
                    {
                        $inc: {
                            "variants.$.variant_countInStock": -item.quantity, 
                            product_countInStock: -item.quantity, 
                            product_selled: item.quantity 
                        }
                    },
                    { new: true }
                );

                return {
                    product_id: product._id,
                    quantity: item.quantity,
                    variant: variant._id,
                    product_order_type: item.product_order_type || "default",
                    product_price: variant.variant_price * item.quantity,
                };
            }));

            order_total_price = orderProducts.reduce((total, item) => total + item.product_price, 0);

            let totalDiscount = 0;
            if (discount_ids?.length > 0) {
                const discounts = await Discount.find({ _id: { $in: discount_ids } });
                totalDiscount = discounts.reduce((sum, discount) => {
                    return discount.type === "percentage"
                        ? sum + (order_total_price * discount.value) / 100
                        : sum + discount.value;
                }, 0);
            }

            const order_total_final = order_total_price + delivery_fee - totalDiscount;

            const estimatedDeliveryDate = new Date();
            estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);

            const newOrderData = new Order({
                user_id,
                shipping_address,
                products: orderProducts,
                discount_ids,
                delivery_fee,
                order_total_price,
                order_total_discount: totalDiscount,
                order_total_final,
                order_payment_method,
                order_note,
                order_status: "Chờ xác nhận",
                estimated_delivery_date: estimatedDeliveryDate,
                is_feedback: false,
            });

            const savedOrder = await newOrderData.save();
            resolve(savedOrder);
        } catch (error) {
            reject(error);
        }
    });
};

const getAllOrder = async (orderStatus) => {
    try {
        let filter = {};

        if (orderStatus.toLowerCase() !== "all") {
            const validStatuses = [
                "Chờ xác nhận",
                "Đang chuẩn bị hàng",
                "Đang giao",
                "Giao hàng thành công",
                "Hoàn hàng",
                "Hủy hàng",
            ];

            if (!validStatuses.includes(orderStatus)) {
                throw new Error("Trạng thái đơn hàng không hợp lệ");
            }

            filter.order_status = orderStatus;
        }

        const orders = await Order.find(filter);

        return {
            status: "OK",
            message: "Get orders successfully",
            data: orders
        };
    } catch (error) {
        throw error; 
    }
};


const getOrderByUser = async(userId, orderStatus) =>{
    try {
        const user = User.findById(userId);

        if(!user){
            throw new Error("User doesn't exist");
        }

        let filter = {};
        filter.user_id = userId;

        if (orderStatus.toLowerCase() !== "all") {
            const validStatuses = [
                "Chờ xác nhận",
                "Đang chuẩn bị hàng",
                "Đang giao",
                "Giao hàng thành công",
                "Hoàn hàng",
                "Hủy hàng",
            ];

            if (!validStatuses.includes(orderStatus)) {
                throw new Error("Trạng thái đơn hàng không hợp lệ");
            }

            filter.order_status = orderStatus;
        }

        const orders = await Order.find(filter);

        return {
            status: "OK",
            message: "Get orders successfully",
            data: orders
        };
    } catch (error) {
        throw error;
    }
}


const previewOrder = async(newOrder) =>{
    try {
        let { user_id, shipping_address, products, order_status = "Chờ xác nhận", order_payment_method, order_note, discount_ids } = newOrder;

        if (!products || !Array.isArray(products) || products.length === 0) {
            throw new Error("Products array is required");
        }

        let delivery_fee = 50000;
        let order_total_price = 0;

        const orderProducts = await Promise.all(products.map(async (item) => {

            const product = await Product.findById(item.product_id);
            if (!product) throw new Error(`Product not found: ${item.product_id}`);

            const variant = product.variants.find(v => v._id.equals(item.variant));
            if (!variant) throw new Error(`Variant not found: ${item.variant}`);

            if (variant.variant_countInStock < item.quantity) {
                throw new Error(`Variant ${item.variant} is out of stock`);
            }

            await Product.findOneAndUpdate(
                { _id: item.product_id, "variants._id": item.variant },
                {
                    $inc: {
                        "variants.$.variant_countInStock": -item.quantity, 
                        product_countInStock: -item.quantity, 
                        product_selled: item.quantity 
                    }
                },
                { new: true }
            );

            return {
                product_id: product._id,
                quantity: item.quantity,
                variant: variant._id,
                product_order_type: item.product_order_type || "default",
                product_price: variant.variant_price * item.quantity,
            };
        }));

        order_total_price = orderProducts.reduce((total, item) => total + item.product_price, 0);

        let totalDiscount = 0;
        if (discount_ids?.length > 0) {
            const discounts = await Discount.find({ _id: { $in: discount_ids } });
            totalDiscount = discounts.reduce((sum, discount) => {
                return discount.type === "percentage"
                    ? sum + (order_total_price * discount.value) / 100
                    : sum + discount.value;
            }, 0);
        }

        const order_total_final = order_total_price + delivery_fee - totalDiscount;

        const estimatedDeliveryDate = new Date();
        estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + Math.floor(Math.random() * 5) + 3);

        const previewOrder = {
            user_id,
            products: orderProducts,
            delivery_fee,
            shipping_address, 
            order_status, 
            order_payment_method, 
            order_note, 
            discount_ids,
            order_total_price: order_total_price,
            order_total_final: order_total_final,
            order_total_discount: totalDiscount,
            estimated_delivery_date: estimatedDeliveryDate
        } 
        console.log(previewOrder)
        return {
            status: "OK",
            message: "Get preview order successfully",
            data: previewOrder
        }
    } catch (error) {
        throw error;
    }
}

const updateStatus = async(orderId, status) =>{
    try {
        const order = await Order.findById(orderId);
        if(!order){
            throw new Error("Order doesn't exist");
        }

        if(["Hủy hàng", "Hoàn hàng"].includes(status)){
            const products = order.products;

            await Promise.all(
                products.map(async (product) => {
                const productInfo = await Product.findById(product.product_id);

                if (!productInfo) {
                    throw new Error(
                    `Product not found: ${product.product_id}`
                    );
                }

                const variantIndex = productInfo.variants.findIndex((v) =>
                    v._id.equals(product.variant)
                );

                if (variantIndex === -1) {
                    throw new Error(
                    `Variant not found ID: ${product.variant} of product ${product.product_id}`
                    );
                }

                productInfo.variants[variantIndex].variant_countInStock += product.quantity;
                productInfo.product_countInStock += product.quantity;

                await productInfo.save();
                })
            );
        }
        const updateOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                order_status: status
            },
            {
                new: true,
                runValidators: true,
            }
        )

        return {
            status: "OK",
            message: "Update status order successfully",
            data: updateOrder
        }
    } catch (error) {
        throw error
    }
}

const getDetailOrder = async (orderId) =>{
    try {
        const order = await Order.findById(orderId);

        if(!order){
            throw new Error("Order doesn't exist");
        }

        return {
            status: 'OK',
            message: "Get detail order successfully",
            data: order
        }
    } catch (error) {
        throw error
    }
}
module.exports = {
    createOrder,
    getAllOrder,
    getOrderByUser,
    previewOrder,
    updateStatus,
    getDetailOrder
}