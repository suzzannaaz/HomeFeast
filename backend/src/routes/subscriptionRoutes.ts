import express from "express";
import {
  createSubscription,
  getUserSubscriptions,
  pauseSubscription,
  cancelSubscription,
  resumeSubscription,
  getCookSubscriptions,
  updateSubscriptionStatus
} from "../controllers/subscriptionController";

import { protect } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", protect, roleMiddleware("user"), createSubscription);
router.get("/", protect, roleMiddleware("user"), getUserSubscriptions);
router.put("/:id/pause", protect, roleMiddleware("user"), pauseSubscription);
router.put("/:id/resume", protect, roleMiddleware("user"), resumeSubscription );
router.put("/:id/cancel", protect, roleMiddleware("user"), cancelSubscription);

// 👨‍🍳 Cook routes
router.get("/cook", protect, roleMiddleware("cook"), getCookSubscriptions);
router.put("/:id/status", protect, roleMiddleware("cook"), updateSubscriptionStatus);

export default router;