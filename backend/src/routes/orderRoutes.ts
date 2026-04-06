import express from "express";
import {
  createOrder,
  getUserOrders,
  getCookOrders,
  acceptOrder,
  rejectOrder,
  markAsDelivered 
} from "../controllers/orderController";
import { cancelOrder } from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";
import roleMiddleware from "../middleware/roleMiddleware";

const router = express.Router();

// 👤 User routes
router.post("/", protect, roleMiddleware("user"), createOrder);
router.get("/my-orders", protect, roleMiddleware("user"), getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

// 👨‍🍳 Cook routes
router.get("/cook-orders", protect, roleMiddleware("cook"), getCookOrders);
router.put("/:id/accept", protect, roleMiddleware("cook"), acceptOrder);
router.put("/:id/reject", protect, roleMiddleware("cook"), rejectOrder);
router.put("/:id/delivered", protect, roleMiddleware("cook"), markAsDelivered);

export default router;