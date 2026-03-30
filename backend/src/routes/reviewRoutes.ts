import express from "express";
import {
  createReview,
  getCookReviews,
  getCookRating,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 User adds review
router.post("/", protect, roleMiddleware("user"), createReview);

// 📋 Get all reviews of a cook
router.get("/:cookId", getCookReviews);

// ⭐ Get rating summary
router.get("/:cookId/rating", getCookRating);

export default router;