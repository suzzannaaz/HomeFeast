import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "cook" | "admin";
  location?: string;
  isBlocked: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "cook", "admin"],
      default: "user"
    },
    location: String,
    isBlocked: { type: Boolean, default: false }
  },
  

  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
