
import express from "express";
import { addCommentController, createArticleController, deleteArticleController, getArticleController, getArticlesController, getTopRatedArticles, likeArticleController, updateArticleController } from "../controllers/article-controller.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import protect from './../middleware/authMiddleware.js';

const router = express.Router();


router.post("/",uploadMiddleware.single("image"),protect,createArticleController);
router.get("/", getArticlesController);
router.get('/:id/',getArticleController);
router.patch("/:id/", protect,updateArticleController);
router.delete("/:id/",protect, deleteArticleController);
router.post("/:id/like",protect, likeArticleController);
router.post("/:id/comment",protect, addCommentController);
router.get("/top-rated",getTopRatedArticles);


export default router;