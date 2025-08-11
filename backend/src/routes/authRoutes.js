import express from "express";
import rateLimit from "express-rate-limit"; 
import * as authController from "../controllers/authController.js";
import authenticateAdmin from "../middlewares/authMiddleware.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js"; 

const router = express.Router();

// INICIO DA CONFIGURAÇÃO DO RATE LIMITER PARA AUTENTICAÇÃO
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limitar cada IP a 10 tentativas nas rotas de autenticação por janela
  message:
    "Muitas tentativas de autenticação vindas deste IP, por favor tente novamente após 15 minutos.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // Logar a tentativa que excedeu o limite
    console.warn(
      `Auth rate limit excedido para IP ${req.ip}: ${options.message} na rota ${req.originalUrl}`
    );
    // Usar errorResponse para padronizar a resposta de erro
    errorResponse(res, options.message, options.statusCode);
  },
});
// FIM DA CONFIGURAÇÃO DO RATE LIMITER PARA AUTENTICAÇÃO

// INICIO DAS ROTAS DE AUTENTICAÇÃO
router.post("/admin-register", authLimiter, authController.registerAdmin);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/admin-login", authLimiter, authController.loginAdmin);
router.post(
  "/admin-forgot-password",
  authLimiter,
  authController.forgotPassword
);
router.get("/reset-password/:token", authController.showResetForm); // GET não costuma precisar de rate limit tão estrito
router.post("/admin-reset-password", authLimiter, authController.resetPassword);

// INICIO DA ROTA DE VERIFICAÇÃO DE TOKEN
router.get("/verify-token", authenticateAdmin, (req, res) => {
  // INICIO DA FUNÇÃO DE CALLBACK verify-token
  console.log(`Token verificado com sucesso para usuário ID: ${req.userId}`);
  successResponse(res, "Token válido.", {
    user: {
      id: req.userId,
      username: req.username, // req.username é populado pelo authMiddleware
    },
  });
  // FIM DA FUNÇÃO DE CALLBACK verify-token
});
// FIM DA ROTA DE VERIFICAÇÃO DE TOKEN

// FIM DAS ROTAS DE AUTENTICAÇÃO
export default router;

// FIM DO ARQUIVO src/routes/authRoutes.js
