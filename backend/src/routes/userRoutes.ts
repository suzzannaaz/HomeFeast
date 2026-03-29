import { Router } from "express";
import { getAvailableCooks } from "../controllers/userController.js";

const router = Router();

/* Public route (no login required) */
router.get("/cooks", getAvailableCooks);

export default router;