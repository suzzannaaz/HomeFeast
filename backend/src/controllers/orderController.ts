import { Request, Response } from "express";
import Order from "../models/order.js";


// ➕ User places order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cook, planType, deliveryTime } = req.body;

    const order = new Order({
      user: req.user?.id,
      cook,
      planType,
      deliveryTime,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 User: View own orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .populate("cook", "name")
      //  console.log("POPULATED ORDERS:", JSON.stringify(orders, null, 2));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


//user cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only owner can cancel
    if (order.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// 👨‍🍳 Cook: View orders received
export const getCookOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ cook: req.user?.id })
      .populate("user", "name");

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Cook: Accept Order
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure only assigned cook updates it
    if (order.cook.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "accepted";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Cook: Reject Order
export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.cook.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "rejected";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const markAsDelivered = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the assigned cook can mark delivered
    if (order.cook.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "delivered";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};