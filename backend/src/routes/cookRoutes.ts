import { Router } from "express";
import {
  createCookProfile,
  getMyCookProfile,
  updateCookProfile
} from "../controllers/cookController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

/* Only cook can access */
router.post("/", protect, roleMiddleware("cook"), createCookProfile);
router.get("/me", protect, roleMiddleware("cook"), getMyCookProfile);
router.put("/me", protect, roleMiddleware("cook"), updateCookProfile);

export default router;
