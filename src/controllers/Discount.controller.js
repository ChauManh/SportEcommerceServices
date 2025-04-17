const discountService = require('../services/Discount.service')

const createDiscount = async(req, res) =>{
    try {
        const newDiscount = req.body;
        const result = await discountService.createDiscount(newDiscount)
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message);
    }
}

const getDetailDiscount = async(req, res) =>{
    try {
        const discountId = req.params.discountId;

        if(!discountId){
            return res.error(1, "Discount id is required");
        }

        const result = await discountService.getDetailDiscount(discountId);
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const getAllDiscount = async(req, res) =>{
    try {
        const result = await discountService.getAllDiscount();
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const updateDiscount = async(req, res) =>{
    try {
        const discountId = req.params.discountId;
        const updateData = req.body;

        if(!discountId){
            return res.error(1, "Discount id is required");
        }

        const result = await discountService.updateDiscount(discountId, updateData);
        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const deleteDiscount = async(req, res) =>{
    try {
        const discountId = req.params.discountId;

        if(!discountId){
            return res.error(1, "Discount id is required");
        }

        const result = await discountService.deleteDiscount(discountId);
        result.EC === 0
            ? res.success(null, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        return res.InternalError(error.message)
    }
}

const getForOrder = async(req, res) =>{
    try {
        const {userId} = req.user;
        const {productIds} = req.body;
        const result = await discountService.getForOrder(userId, productIds);

        result.EC === 0
            ? res.success(result.data, result.EM)
            : res.error(result.EC, result.EM);
    } catch (error) {
        console.log(error.message)
        return res.InternalError(error.message)
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