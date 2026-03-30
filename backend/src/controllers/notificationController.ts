import { Request, Response } from "express";
import Notification from "../models/notifications.js";

// 📋 Get notifications
export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await Notification.find({
    user: req.user?.id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

// ✅ Mark as read
export const markAsRead = async (req: Request, res: Response) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: "Not found" });
  }

  notification.isRead = true;
  await notification.save();

  res.json(notification);
};