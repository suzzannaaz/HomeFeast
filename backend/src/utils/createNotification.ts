import Notification from "../models/notifications.js";

export const createNotification = async (
  userId: string,
  message: string,
  type: "order" | "subscription"
) => {
  await Notification.create({
    user: userId,
    message,
    type,
  });
};