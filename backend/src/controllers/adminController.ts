import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";
import User from "../models/user.js";
import Order from "../models/order.js";

/* GET all cook profiles */
export const getAllCooks = async (_req: Request, res: Response) => {
  const cooks = await CookProfile.find()
    .populate("user", "name email location");

  res.json(cooks);
};


/* APPROVE cook */
export const approveCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!cook) {
    return res.status(404).json({ message: "Cook not found" });
  }

  res.json({ message: "Cook approved", cook });
};


/* REJECT cook (optional) */
export const rejectCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: false, isAvailable: false },
    { new: true }
  );

  res.json({ message: "Cook rejected", cook });
};

//Get users
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select("-password");
  res.json(users);
};

//Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
};

//Block or unblock user
export const toggleBlockUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
  });
};

//get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("cook", "name");

  res.json(orders);
};

//get order by status
export const getOrdersByStatus = async (req: Request, res: Response) => {
  const orders = await Order.find({ status: req.params.status });

  res.json(orders);
};