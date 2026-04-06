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
  getAllSubscriptions,
  updateSubscriptionStatus,
  getAdminStats,
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = Router();

// Cooks
router.get("/cooks", protect, roleMiddleware("admin"), getAllCooks);
router.put("/cooks/:id/approve", protect, roleMiddleware("admin"), approveCook);
router.put("/cooks/:id/reject", protect, roleMiddleware("admin"), rejectCook);

// Users
router.get("/users", protect, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", protect, roleMiddleware("admin"), deleteUser);
router.put("/users/:id/block", protect, roleMiddleware("admin"), toggleBlockUser);

// Orders
router.get("/orders", protect, roleMiddleware("admin"), getAllOrders);
router.get("/orders/:status", protect, roleMiddleware("admin"), getOrdersByStatus);

// Subscriptions
router.get("/subscriptions", protect, roleMiddleware("admin"), getAllSubscriptions);
router.put("/subscriptions/:id/status", protect, roleMiddleware("admin"), updateSubscriptionStatus);

// Dashboard stats
router.get("/stats", protect, roleMiddleware("admin"), getAdminStats);

export default router;