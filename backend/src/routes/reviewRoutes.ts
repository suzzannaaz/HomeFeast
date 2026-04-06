import express from "express";
import {
  createReview,
  getMyCookReviews,
  getMyCookRating,
  getReviewedOrderIds,
} from "../controllers/reviewController";

import { protect } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// 👤 User adds review
router.post("/", protect, roleMiddleware("user"), createReview);
router.get("/my-reviewed-orders", protect, getReviewedOrderIds);

router.get("/my-reviews", protect, getMyCookReviews);
router.get("/my-rating", protect, getMyCookRating);

export default router;