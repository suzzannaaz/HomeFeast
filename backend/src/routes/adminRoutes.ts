import { Router } from "express";
import {
  getAllCooks,
  approveCook,
  rejectCook
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = Router();

/* Only admin can access */
router.get("/cooks", protect, roleMiddleware("admin"), getAllCooks);

router.put(
  "/cooks/:id/approve",
  protect,
  roleMiddleware("admin"),
  approveCook
);

router.put(
  "/cooks/:id/reject",
  protect,
  roleMiddleware("admin"),
  rejectCook
);

export default router;