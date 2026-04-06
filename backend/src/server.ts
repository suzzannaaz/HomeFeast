import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import "./cron/orderCron.js";
import authRoutes from "./routes/authRoutes";
import cookRoutes from "./routes/cookRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import menuRoutes from "./routes/menuRoutes";
import orderRoutes from "./routes/orderRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import reviewRoutes from "./routes/reviewRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cook", cookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/reviews", reviewRoutes);


app.get("/", (req, res) => {
  res.send("HomeFeast API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
