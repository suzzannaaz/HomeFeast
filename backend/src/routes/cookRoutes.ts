import { Router } from "express";
import {
  createCookProfile,
  getMyCookProfile,
  updateCookProfile,
  getFilteredCooks
} from "../controllers/cookController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

/* Only cook can access */
router.post("/", protect, roleMiddleware("cook"), createCookProfile);
router.get("/me", protect, roleMiddleware("cook"), getMyCookProfile);
router.put("/me", protect, roleMiddleware("cook"), updateCookProfile);
router.get("/filter", getFilteredCooks);

export default router;
