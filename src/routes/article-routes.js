
import express from "express";
import { addCommentController, createArticleController, deleteArticleController, getArticleController, getArticlesController, getTopRatedArticles, likeArticleController, updateArticleController } from "../controllers/article-controller.js";

const router = express.Router();


router.post("/",createArticleController);
router.get("/", getArticlesController);
router.get('/:id/',getArticleController);
router.patch("/:id/",updateArticleController);
router.delete("/:id/", deleteArticleController);
router.post("/:id/like", likeArticleController);
router.post("/:id/comment", addCommentController);
router.get("/top-rated",getTopRatedArticles);


export default router;