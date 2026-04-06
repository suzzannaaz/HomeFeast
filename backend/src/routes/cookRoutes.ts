import { Router } from "express";
import {
  createCookProfile,
  getMyCookProfile,
  updateCookProfile,
  getFilteredCooks
} from "../controllers/cookController";

import { protect } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

/* Only cook can access */
router.post("/", protect, roleMiddleware("cook"), createCookProfile);
router.get("/me", protect, roleMiddleware("cook"), getMyCookProfile);
router.put("/me", protect, roleMiddleware("cook"), updateCookProfile);
router.get("/filter", getFilteredCooks);

export default router;
