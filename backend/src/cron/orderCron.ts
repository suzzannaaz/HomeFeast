import cron from "node-cron";
import Subscription from "../models/subscription";
import Order from "../models/order";


cron.schedule("0 6 * * *", async () => {
  console.log("⏰ Running daily order job...");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize time

    // ✅ Get active subscriptions
    const subs = await Subscription.find({
      status: "active",
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    for (const sub of subs) {
      // ✅ Check if today's order already exists
      const existingOrder = await Order.findOne({
        user: sub.user,
        cook: sub.cook,
        date: today,
      });

      if (existingOrder) {
        console.log(`⏭ Order already exists for ${sub.user}`);
        continue;
      }

      // ✅ Create new order
      await Order.create({
        user: sub.user,
        cook: sub.cook,
        planType: sub.planType,
        deliveryTime: sub.deliveryTime,
        date: today,
      });
    }

    console.log("✅ Daily job completed");
  } catch (error) {
    console.error("❌ Cron error:", error);
  }
});