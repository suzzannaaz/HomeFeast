// import { Request, Response } from "express";
// import Order from "../models/order.js";
// import cookProfile from "../models/cookProfile.js";


// // ➕ User places order
// export const createOrder = async (req: Request, res: Response) => {
//   try {
//     const { cook, planType, deliveryTime, date } = req.body;

//     // 🛡️ Prevent duplicates: Check if user already placed this exact order in the last 30 seconds
//     const existingOrder = await Order.findOne({
//         user: req.user?.id,
//         cook,
//         planType,
//         status: "pending" // ✅ stronger duplicate protection
//       });

//     if (existingOrder) {
//       return res.status(400).json({ message: "Please wait a moment before re-ordering." });
//     }

//     const order = new Order({
//       user: req.user?.id,
//       cook,
//       planType,
//       deliveryTime,
//       date: new Date(date),
//     });

//     const savedOrder = await order.save();
//     res.status(201).json(savedOrder);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 📋 User: View own orders

// export const getUserOrders = async (req: Request, res: Response) => {
//   try {
//     const orders = await Order.find({ user: req.user?.id })
//       .populate({
//         path: 'cook', // 1. Populates the CookProfile
//         model: 'CookProfile', 
//         populate: { 
//           path: 'user', // 2. Populates the User document inside the CookProfile
//           model: 'User',
//           select: 'name' // 3. Only selects the 'name' field from the User
//         }
//       })
//       .sort({ createdAt: -1 });
    
//     res.json(orders);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //user cancel order
// export const cancelOrder = async (req: Request, res: Response) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Only owner can cancel
//     if (order.user.toString() !== req.user?.id) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     order.status = "cancelled";
//     await order.save();

//     res.json({ message: "Order cancelled", order });
//   } catch (err: any) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const getCookOrders = async (req: Request, res: Response) => {
//   try {
//     const CookProfile = await cookProfile.findOne({ user: req.user?.id });

//     // ✅ VERY IMPORTANT CHECK
//     if (!CookProfile) {
//       return res.status(404).json({ message: "Cook profile not found" });
//     }

//     const orders = await Order.find({ cook: CookProfile._id })
//       .populate("user", "name")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error: any) {
//     console.error(error); // 👈 ADD THIS
//     res.status(500).json({ message: error.message });
//   }
// };
// // ✅ Cook: Accept Order
// export const acceptOrder = async (req: Request, res: Response) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Ensure only assigned cook updates it
//     if (order.cook.toString() !== req.user?.id) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     order.status = "accepted";
//     await order.save();

//     res.json(order);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ❌ Cook: Reject Order
// export const rejectOrder = async (req: Request, res: Response) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.cook.toString() !== req.user?.id) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     order.status = "rejected";
//     await order.save();

//     res.json(order);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const markAsDelivered = async (req: Request, res: Response) => {
//   try {
//     const order = await Order.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Only the assigned cook can mark delivered
//     if (order.cook.toString() !== req.user?.id) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     order.status = "delivered";
//     await order.save();

//     res.json(order);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

import { Request, Response } from "express";
import Order from "../models/order.js";
import CookProfile from "../models/cookProfile.js";


// ➕ User places order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cook, planType, deliveryTime, date } = req.body;

    const existingOrder = await Order.findOne({
      user: req.user?.id,
      cook,
      planType,
      status: "pending",
    });

    if (existingOrder) {
      return res.status(400).json({ message: "Please wait before re-ordering." });
    }

    const order = new Order({
      user: req.user?.id,
      cook, // ✅ CookProfile._id
      planType,
      deliveryTime,
      date: new Date(date),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 📋 User: View own orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .populate({
        path: "cook",
        model: "CookProfile",
        populate: {
          path: "user",
          model: "User",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ User cancel order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// 👨‍🍳 Cook: View orders
export const getCookOrders = async (req: Request, res: Response) => {
  try {
    const cookProfile = await CookProfile.findOne({ user: req.user?.id });

    if (!cookProfile) {
      return res.status(404).json({ message: "Cook profile not found" });
    }

    const orders = await Order.find({ cook: cookProfile._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// 🧠 Helper: check ownership
const verifyCook = async (order: any, userId: string) => {
  const cookProfile = await CookProfile.findOne({ user: userId });
  if (!cookProfile) return false;

  return order.cook.toString() === cookProfile._id.toString();
};


// ✅ Cook: Accept Order
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = await verifyCook(order, req.user!.id);
    if (!isOwner) return res.status(403).json({ message: "Not allowed" });

    order.status = "accepted";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// ❌ Cook: Reject Order
export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = await verifyCook(order, req.user!.id);
    if (!isOwner) return res.status(403).json({ message: "Not allowed" });

    order.status = "rejected";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// 🚚 Cook: Mark as Delivered
export const markAsDelivered = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = await verifyCook(order, req.user!.id);
    if (!isOwner) return res.status(403).json({ message: "Not allowed" });

    order.status = "delivered";
    await order.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};