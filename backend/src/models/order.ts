import mongoose, { Document, Schema } from "mongoose";
// import { IUser } from "../models/user.js";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  cook: mongoose.Types.ObjectId;
  planType: "daily" | "weekly" | "monthly";
  status: "pending" | "accepted" | "rejected";
  deliveryTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cook: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    deliveryTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);