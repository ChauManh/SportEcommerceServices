const Category = require('../models/Category.Model')

const createCategory = async(categoryData) =>{
    try {
        const {category_gender, category_type, category_parent_id, category_level} = categoryData
        const existingCategory = await Category.findOne({category_type: category_type, category_gender: category_gender});
        if(existingCategory){
            return {
                EC: 1,
                EM: "Category already exists"
            }
        }

        const newCategory = new Category(categoryData)
        await newCategory.save()
        return{
            EC: 0,
            EM: "Create new category successfully",
            data: newCategory
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const getDetailCategory = async(categoryId) =>{
    try {
        const existingCategory = await Category.findById(categoryId);
        if(!existingCategory){
            return {
                EC: 2,
                EM: "Category doesn't exist"
            }
        }

        return{
            EC: 0,
            EM: "Get detail category successfully",
            data: existingCategory
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const getAllCategory = async(category_level) =>{
    try {
        const listCategory = await Category.find({category_level: category_level});

        return{
            EC: 0,
            EM: "Get detail category successfully",
            data: listCategory
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


const getSubCategory = async(categoryId) =>{
    try {
        const existingCategory = await Category.findById(categoryId);
        if(!existingCategory){
            return {
                EC: 2,
                EM: "Category doesn't exist"
            }
        }
        const listSubCategory = await Category.find({category_parent_id: categoryId})
        return{
            EC: 0,
            EM: "Get sub category successfully",
            data: listSubCategory
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const updateCategory = async(categoryId, updateData) =>{
    try {
        const existingCategory = await Category.findById(categoryId);
        if(!existingCategory){
            return {
                EC: 2,
                EM: "Category doesn't exist"
            }
        }
        const updateCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true}
        )
        return{
            EC: 0,
            EM: "Update category successfully",
            data: updateCategory
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteCategory = async(categoryId) =>{
    try {
        const existingCategory = await Category.findById(categoryId);
        if(!existingCategory){
            return {
                EC: 2,
                EM: "Category doesn't exist"
            }
        }
        
        await existingCategory.delete();

        return{
            EC: 0,
            EM: "Delete sub category successfully",
        }
    } catch (error) {
        throw new Error(error.message)
    }
}


module.exports = {
    createCategory,
    getDetailCategory,
    getSubCategory,
    updateCategory,
    getAllCategory,
    deleteCategory
}