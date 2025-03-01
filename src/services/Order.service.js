const Order = require('../models/Order.Model')
const Product = require('../models/Product.Model')
const Discount = require('../models/Discount.Model')

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


module.exports = {
    createOrder
}