import express from "express";
import * as leadController from "../controllers/leadController.js";

const router = express.Router();

router.post("/enviar-email", leadController.sendLeadEmail);

export default router;
