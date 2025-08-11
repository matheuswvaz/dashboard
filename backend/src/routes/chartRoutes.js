import express from "express";
import * as chartController from "../controllers/chartController.js";
import authenticateAdmin from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/chart-data", authenticateAdmin, chartController.getChartData);

export default router;
