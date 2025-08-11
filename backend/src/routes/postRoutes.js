import express from "express";
import * as postController from "../controllers/postController.js";
import authenticateAdmin from "../middlewares/authMiddleware.js";
import upload from "../config/upload.js"; // O Multer configurado
import multer from "multer"; // Importar Multer para tratar erros
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import env from "../config/env.js";

const router = express.Router();

router.post(
  "/postagens",
  authenticateAdmin,
  upload.single("imagem"), // Middleware Multer para a imagem de destaque
  postController.createPost
);

router.get("/postagens", postController.listPosts);
router.get("/postagens/:id", postController.getPostById);

router.put(
  "/postagens/:id",
  authenticateAdmin,
  upload.single("imagem"), // Middleware Multer para a imagem de destaque
  postController.updatePost
);

// Rota de delete
router.delete("/postagens/:id", authenticateAdmin, postController.deletePost);

// Rota para restaurar um post da lixeira
router.put(
  "/postagens/:id/restore",
  authenticateAdmin,
  postController.restorePost
);

// Rota para deletar um post permanentemente da lixeira
router.delete(
  "/postagens/:id/permanent",
  authenticateAdmin,
  postController.deletePostPermanent
);

// Rota para upload de imagem para o editor Tiptap (conteúdo)
router.post(
  "/upload/imagem",
  authenticateAdmin,
  upload.single("imagem"), // Middleware Multer para imagens do editor
  (req, res) => {
    if (!req.file) {
      return errorResponse(
        res,
        "Nenhum arquivo de imagem válido foi enviado para o conteúdo.",
        400
      );
    }
    // Supondo que `req.file.filename` é o nome do arquivo salvo pelo Multer
    const imageUrl = `${env.BASE_URL}${env.UPLOAD_BASE_URL}/${req.file.filename}`;
    return successResponse(res, "Upload de imagem bem-sucedido.", {
      imageUrl: imageUrl,
    });
  },
  // Middleware de tratamento de erros específico para Multer
  (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      // Erros específicos do Multer (ex: tamanho de arquivo excedido)
      return errorResponse(
        res,
        `Erro no upload da imagem (editor): ${error.message}`,
        400
      );
    } else if (error) {
      // Outros erros durante o upload
      return errorResponse(
        res,
        error.message || "Erro ao processar upload da imagem do editor.",
        500 // Alterado para 500 se for um erro interno não Multer
      );
    }
    next();
  }
);

export default router;
