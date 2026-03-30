import { Router } from "express";
import {
  getAllCooks,
  approveCook,
  rejectCook,
  getAllUsers,
  deleteUser,
  toggleBlockUser,
  getAllOrders,
  getOrdersByStatus,
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


// ✅ USERS
router.get("/users", protect, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", protect, roleMiddleware("admin"), deleteUser);
router.put("/users/:id/block", protect, roleMiddleware("admin"), toggleBlockUser);

// ✅ ORDERS
router.get("/orders", protect, roleMiddleware("admin"), getAllOrders);
router.get("/orders/:status", protect, roleMiddleware("admin"), getOrdersByStatus);


export default router;