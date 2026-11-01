import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import registrationRoutes from "./routes/registrations.js";
import attendanceRoutes from "./routes/attendance.js";
import notificationRoutes from "./routes/notifications.js";
import emergencyRoutes from "./routes/emergency.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://halimayesminomi2002_db_user:cdaabzFp3Nh55WmK@kindconnect.6ymngxp.mongodb.net/kindconnect";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
    });

app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to KindConnect Backend!");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KindConnect Backend is Running!"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/emergency", emergencyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`KindConnect Server running on port ${PORT}`);
});
