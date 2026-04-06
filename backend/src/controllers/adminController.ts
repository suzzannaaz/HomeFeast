import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Subscription from "../models/subscription.js";

/* GET all cook profiles */
export const getAllCooks = async (_req: Request, res: Response) => {
  const cooks = await CookProfile.find().populate("user", "name email location");
  res.json(cooks);
};

/* APPROVE cook */
export const approveCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!cook) return res.status(404).json({ message: "Cook not found" });

  res.json({ message: "Cook approved", cook });
};

/* REJECT cook */
export const rejectCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: false, isAvailable: true },
    { new: true }
  );

  if (!cook) return res.status(404).json({ message: "Cook not found" });

  res.json({ message: "Cook rejected", cook });
};

// USERS
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.json(users);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}` });
};

// ORDERS
export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find().populate("user", "name email").populate("cook", "name");
  res.json(orders);
};

export const getOrdersByStatus = async (req: Request, res: Response) => {
  const orders = await Order.find({ status: req.params.status });
  res.json(orders);
};

// SUBSCRIPTIONS
export const getAllSubscriptions = async (_req: Request, res: Response) => {
  const subs = await Subscription.find().populate("user", "name email").populate({
    path: "cook",
    populate: {
      path: "user",
      select: "name"
    }
  });
  res.json(subs);
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const sub = await Subscription.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!sub) return res.status(404).json({ message: "Subscription not found" });

  res.json({ message: "Subscription status updated", sub });
};

// DASHBOARD STATS
export const getAdminStats = async (_req: Request, res: Response) => {
  const usersCount = await User.countDocuments({ role: "user" });
  const cooksCount = await CookProfile.countDocuments();
  const ordersCount = await Order.countDocuments();
  const subsCount = await Subscription.countDocuments();

  res.json({
    users: usersCount,
    cooks: cooksCount,
    orders: ordersCount,
    subscriptions: subsCount,
  });
};