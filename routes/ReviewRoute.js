import express from "express";
import { addReview, getReviews, allReviews } from "../controllers/ReviewController.js";
import { verifyToken } from "../utils/auth.js";

const router = express.Router();

router.get("/:id/reviews", getReviews); 
router.post("/:id/reviews", verifyToken, addReview); 
router.get('/all', allReviews);

export default router;
