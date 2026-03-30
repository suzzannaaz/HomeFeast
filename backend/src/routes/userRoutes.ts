import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAvailableCooks, updateProfile, getMyProfile } from "../controllers/userController.js";

const router = Router();

/* Public route (no login required) */
router.get("/cooks", getAvailableCooks);
router.put("/profile", protect, updateProfile);
router.get("/profile", protect, getMyProfile);

export default router;