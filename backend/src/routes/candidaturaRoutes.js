import express from "express";
import * as candidaturaController from "../controllers/candidaturaController.js";
import authenticateAdmin from "../middlewares/authMiddleware.js";
// Importa especificamente a configuração para documentos
import { uploadDocument } from "../config/upload.js";

const router = express.Router();

// --- ROTA PÚBLICA PARA SUBMISSÃO DE CANDIDATURA ---
// Esta rota agora usa o 'uploadDocument'
router.post(
  "/candidaturas",
  uploadDocument.single("anexo"),
  candidaturaController.createCandidatura
);

// --- ROTAS DE ADMINISTRAÇÃO (NÃO USAM UPLOAD AQUI) ---
router.get(
  "/admin/candidaturas",
  authenticateAdmin,
  candidaturaController.listCandidaturas
);
router.put(
  "/admin/candidaturas/:id/status",
  authenticateAdmin,
  candidaturaController.updateCandidaturaStatus
);
router.post(
  "/admin/candidaturas/:id/responder",
  authenticateAdmin,
  candidaturaController.responderCandidato
);

export default router;
