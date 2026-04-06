import express from "express";
import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenusByCook
} from "../controllers/menuController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createMenu);
router.get("/", getMenus);
router.get("/cook/:cookId", getMenusByCook);
router.get("/:id", getMenuById);



router.put("/:id", protect, updateMenu);
router.delete("/:id", protect, deleteMenu);

export default router;