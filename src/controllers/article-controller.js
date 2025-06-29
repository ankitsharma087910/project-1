import { Article } from "../models/Article.js"
import { responseHandler } from "../utils/responseHandler.js"
import { uploadToCloudinary } from './../helpers/cloudinaryHelper.js';
import fs from "fs";

export const getTopRatedArticles = async(req,res)=>{

  try{

    // Fetch top rated articles based on likes
    const articles = await Article.find()
    console.log(articles,'articles')

      // .sort({ likes: -1 }) // Sort by likes in descending order
      // .limit(10) // Limit to top 10 articles
      // .populate("category", "name") // Populate category name
      // .populate("author", "-password -refreshToken"); // Populate author without sensitive fields

    if (!articles || articles.length === 0) {
      return responseHandler(res, 404, null, "No top rated articles found");
    }

    return responseHandler(res, 200, articles, "Top rated articles fetched successfully");
  }catch(err){
    console.log(err, 'error fetching top rated articles');
    return responseHandler(res, 500, null, "Internal Server Error");
  }
}

export const likeArticleController= async(req,res)=>{

  try{
    const articleId = req.params.id;
    const userId = req.user._id;


    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }


    // Find the article by ID
    const article = await Article.findById(articleId);

  // check if the article is already liked by the user
     const isLiked = article.likes.includes(userId);
     if(isLiked){
      // remove the user from likes array
      article.likes = article.likes.filter((like)=>like.toString() !== userId.toString());
      return responseHandler(
        res,
        400,
        null,
        "Article already liked by you, removed from likes"
      );

     }else{
      article.likes.push(userId);
     }

    // Save the updated article
    await article.save();

    return responseHandler(res, 200, null, "Article liked successfully");

  }catch(err){
    console.log(err, 'error liking article');
    return responseHandler(res, 500, null, "Internal Server Error");
  }
}

export const deleteArticleController= async(req,res)=>{

  try{
    const articleId = req.params.id;
    // Find the article by ID
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
      return responseHandler(res, 404, null, "Article not found");
    }
    // If the article has an image, delete it from Cloudinary
    if (deletedArticle.image && deletedArticle.image.publicId) {
      const result = await uploadToCloudinary.destroy(deletedArticle.image.publicId);
      if (result.result !== 'ok') {
        return responseHandler(res, 500, null, "Failed to delete image from Cloudinary");
      }
    }
    // Delete the local file if it exists
    if (deletedArticle.image && deletedArticle.image.url) {
      const localFilePath = deletedArticle.image.url.split('/').pop();
      try {
        fs.unlinkSync(localFilePath);
      } catch (err) {
        console.error("Failed to delete local file:", err.message);
      }
    }
    return responseHandler(res, 200, null, "Article deleted successfully");
  }catch(err){
    console.log(err, 'error deleting article');
    return responseHandler(res, 500, null, "Internal Server Error");
  }
}

export const updateArticleController= async(req,res)=>{
  try{
    const articleId = req.params.id;
    const { title, content, category } = req.body;
    const file = req.file;

    if (!title || !content || !category) {
      return responseHandler(res, 400, null, "Title, content, and category are required");
    }

    // Find the article by ID
    const article = await Article.findById(articleId);
    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }

    // Update the article fields
    article.title = title;
    article.content = content;
    article.category = category;

    // If a new file is uploaded, update the image
    if (file) {
      // Upload to cloudinary
      const { url, publicId } = await uploadToCloudinary(file.path);
      if (!url || !publicId) {
        return responseHandler(res, 500, null, "Failed to upload image to Cloudinary");
      }
      // Update the image in the article
      article.image = { url, publicId };
      
      // Delete local file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to delete local file:", err.message);
      }
    }
    // Save the updated article
    await article.save();

    return responseHandler(res, 200, null, "Article updated successfully");

  }catch(err){
    console.log(err, 'error updating article');
    return responseHandler(res, 500, null, "Internal Server Error");
  }

}

export const getArticleController = async(req,res)=>{
  try {
    const articleId = req.params.id;
    const article = await Article.findById(articleId)
    .populate("category").populate("author", "-password -refreshToken");
    if (!article) {
      return responseHandler(res, 404, null, "Article not found");
    }
    return responseHandler(res, 200, article, "Article fetched successfully");
  }catch (err) {
    console.log(err, 'error fetching article');
    return responseHandler(res, 500, null, "Internal Server Error");
  }
}

export const getArticlesController = async(req,res)=>{
  try{
   const articles = await Article.find().populate({
    path:"category",
    select:"name createdBy",
    populate:{
      path:"createdBy",
      select:"email"
    }
   }).populate("author", "-password -refreshToken")
    if(!articles){
      return responseHandler(res, 404, null, "No articles found");
    }

   return responseHandler(res, 200, articles, "Articles fetched successfully"); 
  }catch(err){
    console.log(err, 'error fetching articles');
    return responseHandler(res, 500, null, "Internal Server Error");
  }
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
        createdBy: req.user?._id,
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
