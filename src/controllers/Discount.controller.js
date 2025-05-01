const discountService = require("../services/Discount.service");

const createDiscount = async (req, res) => {
  try {
    const newDiscount = req.body;
    const result = await discountService.createDiscount(newDiscount);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getDetailDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const result = await discountService.getDetailDiscount(discountId);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getAllDiscount = async (req, res) => {
  try {
    const result = await discountService.getAllDiscount();
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const updateDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const updateData = req.body;
    const result = await discountService.updateDiscount(discountId, updateData);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    const result = await discountService.deleteDiscount(discountId);
    result.EC === 0
      ? res.success(null, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};

const getForOrder = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productIds } = req.body;
    const result = await discountService.getForOrder(userId, productIds);
    result.EC === 0
      ? res.success(result.data, result.EM)
      : res.error(result.EC, result.EM);
  } catch (error) {
    return res.InternalError();
  }
};
module.exports = {
  createDiscount,
  getDetailDiscount,
  getAllDiscount,
  updateDiscount,
  deleteDiscount,
  getForOrder,
};
