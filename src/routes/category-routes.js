
import express from "express";
import { createCategoryController, getAllCategoryController } from "../controllers/category-controller.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();


router.post("/",protect,createCategoryController);
router.get("/", protect, getAllCategoryController);


export default router;