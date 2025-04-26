const Store = require("../models/Store.model")

const createStore = async(newStore) =>{
    try {
        const store = new Store(newStore);
        await store.save();
        return{
            EC: 0,
            EM: "Tạo thông tin cửa hàng thành công",
            data: store
        }
    } catch (error) {
        return{
            EC: -99,
            EM: error.message
        }
    }
}

const updateStore = async(updateData, storeId) =>{
    try {
        const store = await Store.findById(storeId);
        if(!store){
            return({
                EC: 2,
                EM: "Cửa hàng không tồn tại",
            })
        }

        const updateStore = await Store.findByIdAndUpdate(
            storeId,
            updateData,
            { new: true, runValidators: true }
        )

        return({
            EC: 0,
            EM: "Cập nhật thông tin cửa hàng thành công",
            data: updateStore
        })
    } catch (error) {
        return{
            EC: -99,
            EM: error.message
        }
    }
}

const getDetailStore = async(storeId) =>{
    try {
        const store = await Store.findById(storeId)

        if(!store){
            return({
                EC: 2,
                EM: "Cửa hàng không tồn tại"
            })
        }

        return({
            EC: 0,
            EM: "Lấy thông tin cửa hàng thành công",
            data: store
        })
    } catch (error) {
        return({
            EC: -99,
            EM: error.message
        })
    }
}

module.exports = {
    createStore,
    updateStore,
    getDetailStore
}   