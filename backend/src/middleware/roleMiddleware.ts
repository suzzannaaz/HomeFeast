import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.js";

const roleMiddleware = (...allowedRoles: IUser["role"][]) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: Access denied"
      });
    }

    next();
  };
};

export default roleMiddleware;