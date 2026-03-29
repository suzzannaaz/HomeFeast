import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";

/* Get all approved cooks (for users) */
export const getAvailableCooks = async (_req: Request, res: Response) => {
  const cooks = await CookProfile.find({
    isApproved: true,
    isAvailable: true
  }).populate("user", "name location");

  res.json(cooks);
};