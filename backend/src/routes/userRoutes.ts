import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getAvailableCooks, updateProfile, getMyProfile, getCookById } from "../controllers/userController";

const router = Router();

/* Public route (no login required) */
router.get("/cooks", getAvailableCooks);
router.get("/cooks/:id", getCookById);
router.put("/profile", protect, updateProfile);
router.get("/profile", protect, getMyProfile);

export default router;