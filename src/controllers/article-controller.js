import { Article } from "../models/Article.js"
import { responseHandler } from "../utils/responseHandler.js"
import { uploadToCloudinary } from './../helpers/cloudinaryHelper.js';
import fs from "fs";

export const getTopRatedArticles = ()=>{

}
export const addCommentController = ()=>{

}

export const likeArticleController=()=>{

}

export const deleteArticleController=()=>{

}

export const updateArticleController=()=>{

}

export const getArticleController = ()=>{

}

export const getArticlesController = ()=>{

}

export const createArticleController = async(req,res,next)=>{
    try{
      const { title, content, category } = req.body;
      const file = req.file;

      if (!title || !content || !category) {
        return responseHandler(
          res,
          400,
          null,
          "Title, content, and category are required"
        );
      }

      if (!file) {
        return responseHandler(
          res,
          400,
          null,
          "File is required. Please upload an image"
        );
      }

      //   //upload to cloudinary
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      if (!url || !publicId) {
        return responseHandler(
          res,
          500,
          null,
          "Failed to upload image to Cloudinary"
        );
      }
      console.log(req.user, "user");

      //store the image url and public id along with the uploaded user id in database
      const newArticle = new Article({
        image: {
          url,
          publicId,
        },
        title,
        content,
        category,
        author: req.user?._id,
      });

      const response = await newArticle.save();
      console.log(response, "article response");
      // Delete local file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to delete local file:", err.message);
      }
      return responseHandler(res, 200, null, "Article Created Successfully");

      //delete the file from local stroage
    }catch(err){
console.log(err,'err');
    }
}