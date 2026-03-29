import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICookProfile extends Document {
  user: Types.ObjectId;
  bio: string;
  serviceArea: string;
  deliveryTime: string;
  cuisines: string[];
  rating: number;
  isApproved: boolean;
  isAvailable: boolean;
}

const CookProfileSchema = new Schema<ICookProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    bio: String,
    serviceArea: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    cuisines: [String],

    rating: {
      type: Number,
      default: 0
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICookProfile>(
  "CookProfile",
  CookProfileSchema
);
