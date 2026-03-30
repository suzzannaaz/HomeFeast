import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";

/* CREATE profile */
export const createCookProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

     // ✅ Extra role safety check
    if (req.user.role !== "cook") {
      return res.status(403).json({ message: "Only cooks can create profile" });
    }

    const exists = await CookProfile.findOne({ user: req.user.id });
    if (exists) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const { bio, serviceArea, deliveryTime, cuisines } = req.body;

    // ✅ Basic validation
    if (!serviceArea || !deliveryTime || !cuisines) {
      return res.status(400).json({
        message: "serviceArea, deliveryTime and cuisines are required"
      });
    }

    const profile = await CookProfile.create({
      user: req.user.id,
      bio: req.body.bio,
      serviceArea: req.body.serviceArea,
      deliveryTime: req.body.deliveryTime,
      cuisines: req.body.cuisines
    });

    res.status(201).json(profile);
  } catch {
    res.status(500).json({ message: "Failed to create profile" });
  }
};


/* GET my profile */
export const getMyCookProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const profile = await CookProfile.findOne({ user: req.user.id });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  res.json(profile);
};


/* UPDATE profile */
export const updateCookProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = await CookProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true } // ✅ better than returnDocument
    );

    // ✅ Handle if profile doesn't exist
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
