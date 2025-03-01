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

module.exports = {
    createOrder
}