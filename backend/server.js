import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import annualPujaRoutes from "./routes/annualPujaRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/annual-pujas", annualPujaRoutes);
app.use("/api/pujas", annualPujaRoutes); // Alias for compatibility
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Temple Backend API is running" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Temple Backend Server running on http://localhost:${PORT}`);
});
