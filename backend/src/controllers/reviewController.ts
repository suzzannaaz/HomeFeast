import mongoose from "mongoose";
import { Request, Response } from "express";
import Review from "../models/review.js";
import Order from "../models/order.js";

// ➕ Create Review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { cook, rating, comment } = req.body;

    // ✅ Validate cook ID
    if (!mongoose.Types.ObjectId.isValid(cook)) {
      return res.status(400).json({ message: "Invalid cook ID" });
    }

    // ✅ Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // ✅ Check if user ordered
    const hasOrdered = await Order.findOne({
      user: req.user?.id,
      cook,
      status: "delivered",
    });

    if (!hasOrdered) {
      return res.status(403).json({
        message: "You can review only after receiving the order",
      });
    }

    // ✅ Prevent duplicate review
    const existing = await Review.findOne({
      user: req.user?.id,
      cook,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this cook",
      });
    }

    const review = await Review.create({
      user: req.user?.id,
      cook,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get Reviews for a Cook
export const getCookReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      cook: req.params.cookId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ⭐ Get Average Rating
export const getCookRating = async (req: Request, res: Response) => {
  try {
    const cookId = req.params.cookId as string;

    const result = await Review.aggregate([
      { $match: { cook: new mongoose.Types.ObjectId(cookId) } },
      {
        $group: {
          _id: "$cook",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json(result[0] || { avgRating: 0, totalReviews: 0 });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};