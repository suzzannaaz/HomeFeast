import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";
import User from "../models/user.js";


/* Get all approved cooks (for users) */
export const getAvailableCooks = async (_req: Request, res: Response) => {
  const cooks = await CookProfile.find({
    isApproved: true,
    isAvailable: true
  }).populate("user", "name location");

  res.json(cooks);
};

// Get a single cook by ID
export const getCookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const cook = await CookProfile.findById(id).populate("user", "name location");

    if (!cook) {
      return res.status(404).json({ message: "Cook not found" });
    }

    res.json(cook);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

//get user profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//update user prfile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, location } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (location) user.location = location;

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

