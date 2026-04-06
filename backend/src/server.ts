import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import "./cron/orderCron.js";
import authRoutes from "./routes/authRoutes.js";
import cookRoutes from "./routes/cookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();



// app.use(cors({
//   origin: [
//     "https://home-feast.vercel.app",
//     "https://home-feast-git-main-suzzan-naazs-projects.vercel.app",
//     "https://home-feast-hv2qxm1hi-suzzan-naazs-projects.vercel.app"
//   ],
//   credentials: true
// }));

app.use(cors({
  origin: "*"
}));


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
