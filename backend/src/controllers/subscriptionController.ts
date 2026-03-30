import { Request, Response } from "express";
import Subscription from "../models/subscription.js";

// ➕ Create Subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { cook, planType, deliveryTime } = req.body;

    const startDate = new Date();
    let endDate = new Date();

    if (planType === "daily") {
      endDate.setDate(startDate.getDate() + 1);
    } else if (planType === "weekly") {
      endDate.setDate(startDate.getDate() + 7);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    const subscription = new Subscription({
      user: req.user?.id,
      cook,
      planType,
      deliveryTime,
      startDate,
      endDate,
    });

    const saved = await subscription.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 User subscriptions
export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const subs = await Subscription.find({ user: req.user?.id })
      .populate("cook", "name");

    res.json(subs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ⏸ Pause
export const pauseSubscription = async (req: Request, res: Response) => {
  const sub = await Subscription.findById(req.params.id);

  if (!sub) return res.status(404).json({ message: "Not found" });

  sub.status = "paused";
  await sub.save();

  res.json(sub);
};

// ❌ Cancel
export const cancelSubscription = async (req: Request, res: Response) => {
  const sub = await Subscription.findById(req.params.id);

  if (!sub) return res.status(404).json({ message: "Not found" });

  sub.status = "cancelled";
  await sub.save();

  res.json(sub);
};