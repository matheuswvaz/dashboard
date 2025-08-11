import jwt from "jsonwebtoken";
import db from "../config/database.js";
import env from "../config/env.js";
import { errorResponse } from "../utils/responseHandler.js";

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "É necessário um token de autenticação.", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Token de autenticação faltando.", 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    const [userRows] = await db.execute(
      "SELECT id FROM credenciais WHERE id = ?",
      [decoded.id]
    );

    if (userRows.length === 0) {
      return errorResponse(
        res,
        "Autenticação falhou, usuário não encontrado.",
        401
      );
    }

    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (err) {
    console.error("Authentication Error:", err.message);
    let message = "Authentication failed.";
    let statusCode = 401;

    if (err.name === "JsonWebTokenError") {
      message = "Token inválido.";
    } else if (err.name === "TokenExpiredError") {
      message =
        "Código Token de autentiação expirado. Por favor, realize o login novamente.";
      statusCode = 403;
    } else {
      message = "Ocorreu um erro durante a autenticação.";
      statusCode = 500;
    }
    return errorResponse(res, message, statusCode, err);
  }
};

export default authenticateAdmin;
