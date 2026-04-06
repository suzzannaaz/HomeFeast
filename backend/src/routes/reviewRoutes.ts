import express from "express";
import {
  createReview,
  getMyCookReviews,
  getMyCookRating,
  getReviewedOrderIds,
} from "../controllers/reviewController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// 👤 User adds review
router.post("/", protect, roleMiddleware("user"), createReview);
router.get("/my-reviewed-orders", protect, getReviewedOrderIds);

router.get("/my-reviews", protect, getMyCookReviews);
router.get("/my-rating", protect, getMyCookRating);

export default router;