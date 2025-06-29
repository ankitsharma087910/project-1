import mongoose, { Schema } from "mongoose";


const categorySchema = Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'Category name is required']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

export const Category = mongoose.model('Category',categorySchema);