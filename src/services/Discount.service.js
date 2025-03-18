const Discount = require('../models/Discount.Model')

const createDiscount = async(newDiscount) =>{
    try {
        const existingDiscount = await Discount.findOne({discount_code: newDiscount.discount_code});
        if(existingDiscount){
            return { EC: 1, EM: "Discount already exists", data: null };
        }
        const discountData = new Discount(newDiscount);
        await discountData.save();
        return {
            EC: 0,
            EM: "Create new discount successfully",
            data: discountData
        };
    } catch (error) {
        throw new Error (error.message)
    }
}

const getDetailDiscount = async(discountId) =>{
    try {
        const existingDiscount = await Discount.findById(discountId);

        if(!existingDiscount){
            return {EC: 2, EM: "Discount doesn't exits"}
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


const getAllDiscount = async() =>{
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

const updateDiscount = async(discountId, updateData)=>{
    try {
        const existingDiscount = await Discount.findById(discountId);

        if(!existingDiscount){
            return {EC: 2, EM: "Discount doesn't exits"}
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


const deleteDiscount = async(discountId)=>{
    try {
        const existingDiscount = await Discount.findById(discountId);

        if(!existingDiscount){
            return {EC: 2, EM: "Discount doesn't exits"}
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
module.exports = {
    createDiscount,
    getDetailDiscount,
    getAllDiscount,
    updateDiscount,
    deleteDiscount
}