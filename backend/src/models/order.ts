import mongoose, { Document, Schema } from "mongoose";


export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  cook: mongoose.Types.ObjectId;
  planType: "daily" | "weekly" | "monthly";
  status: "pending" | "accepted" | "rejected" | "delivered" | "cancelled";
  deliveryTime: string;
  date: Date;
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
      ref: "CookProfile",
      required: true,
    },
    planType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryTime: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true
}
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);