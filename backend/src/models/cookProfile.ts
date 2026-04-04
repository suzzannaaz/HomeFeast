import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICookProfile extends Document {
  user: Types.ObjectId;
  bio: string;
  serviceArea: string;
  deliveryTime: string;
  cuisines: string[];
  mealType: "veg" | "non-veg";
  pricePerMeal: number; // ✅ Added to Interface
  availablePlans: ("daily" | "weekly" | "monthly")[]; // ✅ Added to Interface
  rating: number;
  isApproved: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CookProfileSchema = new Schema<ICookProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, required: true },
    serviceArea: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    cuisines: { type: [String], required: true },

    mealType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true,
    },

    pricePerMeal: {
      type: Number,
      required: true,
    },

    availablePlans: {
      type: [String],
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICookProfile>(
  "CookProfile",
  CookProfileSchema
);