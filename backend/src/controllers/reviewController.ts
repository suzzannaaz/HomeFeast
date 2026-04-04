import mongoose from "mongoose";
import { Request, Response } from "express";
import Review from "../models/review.js";
import Order from "../models/order.js";
import CookProfile from "../models/cookProfile.js";


// ➕ Create / Update Review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(order)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const foundOrder = await Order.findById(order);
    if (!foundOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (foundOrder.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (foundOrder.status !== "delivered") {
      return res.status(400).json({ message: "Review only after delivery" });
    }

    let review = await Review.findOne({
      user: req.user?.id,
      order,
    });

    // ✅ UPDATE
    if (review) {
      review.rating = rating;
      review.comment = comment;
      review.cook = foundOrder.cook; // ✅ DIRECT

      await review.save();
      return res.json({ message: "Review updated", review });
    }

    // ✅ CREATE
    review = await Review.create({
      user: req.user?.id,
      cook: foundOrder.cook, // ✅ DIRECT
      order,
      rating,
      comment,
    });

    res.status(201).json({ message: "Review created", review });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 📋 Get reviews for logged-in cook
export const getMyCookReviews = async (req: Request, res: Response) => {
  try {
    const cookProfile = await CookProfile.findOne({
      user: req.user?.id,
    });

    if (!cookProfile) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    const reviews = await Review.find({
      cook: cookProfile._id,
    }).populate("user", "name");

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get reviews for a cook (public view)
export const getCookReviewsById = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({
      cook: req.params.cookId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// ⭐ Get average rating
export const getMyCookRating = async (req: Request, res: Response) => {
  try {
    const cookProfile = await CookProfile.findOne({
      user: req.user?.id,
    });

    if (!cookProfile) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    const result = await Review.aggregate([
      { $match: { cook: cookProfile._id } },
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


// 📋 Get reviewed order IDs (for frontend)
export const getReviewedOrderIds = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ user: req.user?.id }).select("order");

    const reviewedIds = reviews.map((rev) => rev.order.toString());

    res.json(reviewedIds);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};