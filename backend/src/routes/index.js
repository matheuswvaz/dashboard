import express from "express";
import leadRoutes from "./leadRoutes.js";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import adminRoutes from "./adminRoutes.js";
import logRoutes from "./logRoutes.js";
import chartRoutes from "./chartRoutes.js";
import candidaturaRoutes from "./candidaturaRoutes.js";
import chatbotRoutes from "./chat.js";

const router = express.Router();

router.use("/", leadRoutes);
router.use("/", authRoutes);
router.use("/api", logRoutes);
router.use("/api", postRoutes);
router.use("/api", chartRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api", candidaturaRoutes);
router.use("/chatbot", chatbotRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

export default router;
