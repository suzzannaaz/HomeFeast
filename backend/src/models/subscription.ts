import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  user: mongoose.Types.ObjectId;
  cook: mongoose.Types.ObjectId;
  planType: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
  deliveryTime: string;
  status: "pending" |"active" | "paused" | "cancelled" | "rejected";
  pausedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cook: {
      type: Schema.Types.ObjectId,
      ref: "CookProfile",
      required: true,
    },
    planType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "paused", "cancelled", "rejected"],
      default: "pending",
    },
    pausedAt: { // <--- Add this
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);