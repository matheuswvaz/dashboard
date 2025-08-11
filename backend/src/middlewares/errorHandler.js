import multer from "multer";
import { errorResponse } from "../utils/responseHandler.js";
import env from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err);

  if (err instanceof multer.MulterError) {
    let message = `Erro no upload: ${err.message}`;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Erro no upload: Arquivo muito grande (limite: 5MB).";
    }
    return errorResponse(res, message, 400, err);
  }

  if (
    err.message &&
    err.message.includes(
      "Apenas imagens (JPEG, PNG, GIF, WEBP) são permitidas!"
    )
  ) {
    return errorResponse(
      res,
      "Upload falhou: Apenas imagens são permitidas (JPEG, PNG, GIF, WEBP).",
      400,
      err
    );
  }

  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;

  const message =
    err.message && statusCode < 500 ? err.message : "Erro Interno do Servidor";

  const errorDetails = env.NODE_ENV === "development" ? err : null;

  return errorResponse(res, message, statusCode, errorDetails);
};

export default errorHandler;
