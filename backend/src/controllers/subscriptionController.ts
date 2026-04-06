import { Request, Response } from "express";
import Subscription from "../models/subscription.js";
import CookProfile from "../models/cookProfile.js";

// ➕ Create Subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { cook, planType, deliveryTime } = req.body;

    const startDate = new Date();
    let endDate = new Date();

    if (planType === "daily") endDate.setDate(startDate.getDate() + 1);
    else if (planType === "weekly") endDate.setDate(startDate.getDate() + 7);
    else endDate.setMonth(startDate.getMonth() + 1);

    const existing = await Subscription.findOne({
      user: req.user?.id,
      cook, // ✅ DIRECT CookProfile._id
      status: "active",
    });

    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    const subscription = await Subscription.create({
      user: req.user?.id,
      cook, // ✅ DIRECT
      planType,
      deliveryTime,
      startDate,
      endDate,
    });

    res.status(201).json(subscription);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 User subscriptions
export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const subs = await Subscription.find({ user: req.user?.id })
      .populate({
    path: "cook",
    populate: {
      path: "user",
      select: "name"
    }
  });
    // console.log(JSON.stringify(subs, null, 2));
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
  sub.pausedAt = new Date();
  await sub.save();

  res.json(sub);
};

//resume subscription
export const resumeSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    // 1. Validation check
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status !== "paused") {
      return res.status(400).json({ message: "Only paused subscriptions can be resumed" });
    }

    // 2. Logic: Calculate pause duration and extend endDate
    if (subscription.pausedAt) {
      const now = new Date().getTime();
      const pauseStart = new Date(subscription.pausedAt).getTime();
      
      // Calculate how many milliseconds the subscription was "on hold"
      const pauseDuration = now - pauseStart;

      // Add that duration to the existing endDate so the user doesn't lose days
      subscription.endDate = new Date(subscription.endDate.getTime() + pauseDuration);
    }

    // 3. Update Status (Fixed variable name from 'sub' to 'subscription')
    subscription.status = "active";
    subscription.pausedAt = undefined; // Use undefined or null depending on your Schema
    
    // 4. Save and Return
    const updatedSubscription = await subscription.save();
    
    res.status(200).json({
      message: "Subscription resumed successfully",
      data: updatedSubscription
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Cancel
export const cancelSubscription = async (req: Request, res: Response) => {
  const sub = await Subscription.findById(req.params.id);

  if (!sub) return res.status(404).json({ message: "Not found" });

  sub.status = "cancelled";
  await sub.save();

  res.json(sub);
};



// 👨‍🍳 Cook: View subscriptions
export const getCookSubscriptions = async (req: Request, res: Response) => {
  try {
    const cookProfile = await CookProfile.findOne({ user: req.user?.id });

    if (!cookProfile) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    const subs = await Subscription.find({ cook: cookProfile._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(subs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 👨‍🍳 Cook: Accept / Reject subscription
export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Not found" });

    const cookProfile = await CookProfile.findOne({ user: req.user?.id });
    if (!cookProfile) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    // ✅ Ownership check
    if (sub.cook.toString() !== cookProfile._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    sub.status = status; // 'active' or 'rejected'
    await sub.save();

    res.json(sub);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};