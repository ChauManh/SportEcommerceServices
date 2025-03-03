
const { rawListeners } = require('../models/Product.Model')
const orderService = require('../services/Order.service')

const createOrder = async(req, res) =>{
    try {
        const newOrder = {...req.body};
        console.log(newOrder)
        const response = await orderService.createOrder(newOrder);
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const getAllOrder = async(req, res) =>{
    try {
        const {orderStatus} = req.query;

        if (!orderStatus) {
            return res.status(400).json({
                message: "Order Status is required",
            });
        }

        const response = await orderService.getAllOrder(orderStatus);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const getOrderByUser = async (req, res) =>{
    try {
        const { userId, orderStatus} = req.query;

        if(!userId || !orderStatus){
            return res.status(400).json({
                message: "Order status and userId are required",
            });
        }

        const response = await orderService.getOrderByUser(userId, orderStatus);

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        }) 
    }
}

const previewOrder = async(req, res) =>{
    try {
        const newOrder = req.body;
        const response = await orderService.previewOrder(newOrder);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        }) 
    }
}

const updateStatus = async(req, res) =>{
    try {
        const orderId = req.params.id;
        const {statusOrder} = req.body;
        console.log(req.body)
        if(!orderId || !statusOrder){
            return res.status(400).json({
                message: "OderId and status are required",
            }) 
        }
        const response = await orderService.updateStatus(orderId, statusOrder);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        }) 
    }
}

const getDetailOrder = async(req, res) =>{
    try {
        const orderId = req.params.id
        if(!orderId){
            return res.status(400).json({
                message: "OderId is required",
            }) 
        }
        const response = await orderService.getDetailOrder(orderId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
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