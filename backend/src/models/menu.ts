import mongoose, { Document, Schema } from "mongoose";

// Interface
export interface IMenu extends Document {
  cook: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const menuSchema: Schema<IMenu> = new Schema(
  {
    cook: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model<IMenu>("Menu", menuSchema);