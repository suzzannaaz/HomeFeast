import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "cook" | "admin";
  location?: string;
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
    location: String
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
