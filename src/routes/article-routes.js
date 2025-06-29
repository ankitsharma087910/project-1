
import express from "express";
import {  createArticleController, deleteArticleController, getArticleController, getArticlesController, getTopRatedArticles, likeArticleController, updateArticleController } from "../controllers/article-controller.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import protect from './../middleware/authMiddleware.js';
import { addCommentController, getAllCommentsController } from "../controllers/comment-controller.js";

const router = express.Router();


router.post("/",uploadMiddleware.single("image"),protect,createArticleController);
router.get("/",protect, getArticlesController);
router.get("/top-rated", protect, getTopRatedArticles);

router.get('/:articleId/comment',protect,getAllCommentsController);
router.get('/:id/',getArticleController);
router.patch("/:id/", protect,updateArticleController);
router.delete("/:id/",protect, deleteArticleController);
router.post("/:id/like",protect, likeArticleController);
router.post("/:id/comment",protect, addCommentController);

export default router;