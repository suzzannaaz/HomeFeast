import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";

/* CREATE profile */
export const createCookProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const exists = await CookProfile.findOne({ user: req.user.id });
    if (exists) {
      return res.status(400).json({ message: "Profile already exists" });
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
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const profile = await CookProfile.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { returnDocument: 'after' }
  );

  res.json(profile);
};
