import { Request, Response } from "express";
import CookProfile from "../models/cookProfile.js";

/* GET all cook profiles */
export const getAllCooks = async (_req: Request, res: Response) => {
  const cooks = await CookProfile.find()
    .populate("user", "name email location");

  res.json(cooks);
};


/* APPROVE cook */
export const approveCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );

  if (!cook) {
    return res.status(404).json({ message: "Cook not found" });
  }

  res.json({ message: "Cook approved", cook });
};


/* REJECT cook (optional) */
export const rejectCook = async (req: Request, res: Response) => {
  const cook = await CookProfile.findByIdAndUpdate(
    req.params.id,
    { isApproved: false, isAvailable: false },
    { new: true }
  );

  res.json({ message: "Cook rejected", cook });
};