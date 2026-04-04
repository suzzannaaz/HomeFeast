import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  cook: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
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
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

// ⭐ Prevent duplicate reviews (IMPORTANT)
reviewSchema.index({ user: 1, order: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);