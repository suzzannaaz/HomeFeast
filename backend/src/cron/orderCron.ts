import cron from "node-cron";
import Subscription from "../models/subscription.js";
import Order from "../models/order.js";
import { createNotification } from "../utils/createNotification.js";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Running job...");

  const today = new Date();

  const subs = await Subscription.find({
    status: "active",
    startDate: { $lte: today },
    endDate: { $gte: today },
  });

  for (const sub of subs) {
    const order = await Order.create({
      user: sub.user,
      cook: sub.cook,
      planType: sub.planType,
      deliveryTime: sub.deliveryTime,
    });

    // 🔔 Notify USER
    await createNotification(
      sub.user.toString(),
      "Your meal order has been placed 🍽️",
      "order"
    );

    // 🔔 Notify COOK
    await createNotification(
      sub.cook.toString(),
      "New order received 👨‍🍳",
      "order"
    );
  }

  console.log("✅ Done");
});