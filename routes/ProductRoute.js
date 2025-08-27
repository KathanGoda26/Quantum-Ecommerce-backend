import express from "express";
import { getProducts, getProductById } from "../controllers/ProductController.js";

const router = express.Router();

router.get("/products", getProducts); 
router.get("/products/:id", getProductById); 

export default router;
