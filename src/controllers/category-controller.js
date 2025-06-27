import { responseHandler } from "../utils/responseHandler.js";
import { Category } from './../models/Category.js';


export const getAllCategoryController = async(req , res , next)=>{
    try{
        const categories =  await Category.find();
        return responseHandler(res, 201, categories, "Categories fetched successfully");
    }catch(err){
        console.log(err);
    }
}

export const createCategoryController = async(req , res, next)=>{
    try{
        const { name } = req.body;
        if (!name) {
          return responseHandler(res, 400, null, "Name is required");
        }
        const createdBy = req.user.email;
        const category = new Category({
          name,
          createdBy,
        });
        await category.save();
        return responseHandler(res, 201, null, "Category created successfully");
    }catch(err){
        console.log(err);
    }
}