import mongoose, { Schema } from "mongoose";
import { ImageSchema } from "./Image.js";

const commentSchema = Schema({
    content:{
        type:String,
        required:[true, 'Comment content is required'],
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const articleSchema = Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
  },
  image: {
    type: ImageSchema,
    required:false
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
});

articleSchema.pre("save",function(next){
    this.updatedAt=Date.now();
    next();
})

export const Article = mongoose.model("Article",articleSchema)