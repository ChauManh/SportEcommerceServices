const Discount = require('../models/Discount.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const createDiscount = async (newDiscount) => {
    try {
        const existingDiscount = await Discount.findOne({ discount_code: newDiscount.discount_code });
        if (existingDiscount) {
            return { EC: 1, EM: "Discount already exists", data: null };
        }
        const discountData = new Discount(newDiscount);
        await discountData.save();
        await User.updateMany(
            {},
            {
                $push: {
                    discounts: discountData._id
                  }
            }
        )
        return {
            EC: 0,
            EM: "Create new discount successfully",
            data: discountData
        };
    } catch (error) {
        throw new Error(error.message)
    }
}

const getDetailDiscount = async (discountId) => {
    try {
        const existingDiscount = await Discount.findById(discountId);

        if (!existingDiscount) {
            return { EC: 2, EM: "Discount doesn't exits" }
        }

        return {
            EC: 0,
            EM: "Get discount successfully",
            data: existingDiscount
        };
    } catch (error) {
        throw new Error(error.message)
    }
}


const getAllDiscount = async () => {
    try {
        const listDiscount = await Discount.find();

        return {
            EC: 0,
            EM: "Get all discount successfully",
            data: listDiscount
        };
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateDiscount = async (discountId, updateData) => {
    try {
        const existingDiscount = await Discount.findById(discountId);

        if (!existingDiscount) {
            return { EC: 2, EM: "Discount doesn't exits" }
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            discountId,
            updateData,
            { new: true, runValidators: true }
        );

        return {
            EC: 0,
            EM: "Update discount successfully",
            data: updatedDiscount
        };
    } catch (error) {
        throw new Error(error.message)
    }
}


const deleteDiscount = async (discountId) => {
    try {
        const existingDiscount = await Discount.findById(discountId);

        if (!existingDiscount) {
            return { EC: 2, EM: "Discount doesn't exits" }
        }

        await existingDiscount.delete();
        return {
            EC: 0,
            EM: "Delete discount successfully",
        };
    } catch (error) {
        throw new Error(error.message)
    }
}

const getForOrder = async (userId, productIds) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { EC: 2, EM: "User not found" };

        const products = await Product.find({ _id: { $in: productIds } }).populate("product_category");

        if (products.length === 0) return { EC: 3, EM: "Product not found" };
        const now = new Date();
        const discounts = await Discount.find({
            _id: { $in: user.discounts },
            status: "active",
            discount_start_day: { $lte: now },
            discount_end_day: { $gte: now },
        });
        if (discounts.length === 0) return { EC: 0, EM: "Discount not found", discounts: [] };

        const applicableDiscounts = discounts.filter(discount => {
            const appliesToProduct = products.every(product =>
                discount.applicable_products.some(dpid => dpid.equals(product._id))
            );

            const appliesToCategory = products.every(product =>
                discount.applicable_categories.some(dcid => dcid.equals(product.product_category._id))
            );

            return appliesToProduct || appliesToCategory;
        });

        return {
            EC: 0,
            EM: "Get discount successfully",
            data: applicableDiscounts
        };

    } catch (error) {
        console.log(error.message)
        return { EC: -1, EM: error.message }
    }
}

module.exports = {
    createDiscount,
    getDetailDiscount,
    getAllDiscount,
    updateDiscount,
    deleteDiscount,
    getForOrder
}