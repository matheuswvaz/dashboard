import db from "../config/database.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import env from "../config/env.js";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilenameFromUrlOrString = (input) => {
  if (!input || typeof input !== "string") {
    return null;
  }
  try {
    const url = new URL(input);
    return path.basename(url.pathname);
  } catch (e) {
    return path.basename(input);
  }
};

const getProfileImageUrl = (filename) => {
  if (!filename) {
    return null;
  }

  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  const uploadBase = env.UPLOAD_BASE_URL || "/uploads";
  if (filename.startsWith(uploadBase)) {
    if (filename.startsWith(env.BASE_URL)) {
      return filename;
    }
    return `${env.BASE_URL.replace(/\/$/, "")}${filename}`;
  }

  return `${env.BASE_URL.replace(/\/$/, "")}${uploadBase.replace(
    /\/$/,
    ""
  )}/${filename}`;
};

export const getUserData = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    console.error("getUserData called without userId after authentication.");
    return errorResponse(
      res,
      "ID do usuário não fornecido na requisição.",
      401
    );
  }
  try {
    const sql = `
          SELECT
              id,
              username as name,
              email,
              foto_url,
              DATE_FORMAT(last_login, '%d/%m/%Y às %H:%i') as last_login
          FROM credenciais
          WHERE id = ?`;

    const [userRows] = await db.execute(sql, [userId]);

    if (userRows.length === 0) {
      console.warn(
        `Authenticated user ID ${userId} not found in credenciais table.`
      );
      return errorResponse(res, "Usuário administrador não encontrado.", 404);
    }

    const user = userRows[0];

    const userDataWithFullUrl = {
      ...user,
      foto_url: getProfileImageUrl(user.foto_url),
    };

    return successResponse(
      res,
      "Dados do usuário obtidos com sucesso.",
      userDataWithFullUrl
    );
  } catch (err) {
    console.error(
      `Erro ao buscar dados do usuário admin (ID: ${userId}):`,
      err.message,
      err.stack
    );
    return errorResponse(
      res,
      "Erro interno ao buscar dados do usuário.",
      500,
      env.NODE_ENV === "development" ? err : null
    );
  }
};

export const getVisitorStats = async (req, res) => {
  try {
    const [tableExistsResult] = await db.execute(
      `SELECT COUNT(*) as count
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'access_logs'`
    );

    const tableExists = tableExistsResult[0]?.count > 0;

    let stats = { today: 0, month: 0, total: 0 };
    let message = "Estatísticas de visitantes obtidas com sucesso.";

    if (tableExists) {
      const [todayRows] = await db.execute(
        "SELECT COUNT(*) as count FROM access_logs WHERE DATE(access_time) = CURDATE()"
      );
      const [monthRows] = await db.execute(
        "SELECT COUNT(*) as count FROM access_logs WHERE YEAR(access_time) = YEAR(CURDATE()) AND MONTH(access_time) = MONTH(CURDATE())"
      );
      const [totalRows] = await db.execute(
        "SELECT COUNT(*) as count FROM access_logs"
      );

      stats = {
        today: todayRows[0]?.count || 0,
        month: monthRows[0]?.count || 0,
        total: totalRows[0]?.count || 0,
      };
    } else {
      message =
        "Estatísticas de visitantes (tabela 'access_logs' não encontrada).";
      console.warn(
        "Tabela 'access_logs' não encontrada. Retornando estatísticas zeradas."
      );
    }

    return successResponse(res, message, stats);
  } catch (err) {
    console.error(
      "Erro ao buscar estatísticas de visitantes:",
      err.message,
      err.stack
    );

    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao buscar estatísticas.",
      500,
      errorDetails
    );
  }
};

export const getMapData = async (req, res) => {
  try {
    const [tableExistsResult] = await db.execute(
      `SELECT COUNT(*) as count
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'access_logs'`
    );
    const tableExists = tableExistsResult[0]?.count > 0;

    let mapData = [];
    let message = "Dados para o mapa obtidos com sucesso.";

    if (tableExists) {
      const sql = `
        SELECT
          country,
          city, 
          latitude,
          longitude, 
          COUNT(*) as value
        FROM access_logs
        WHERE 
          country IS NOT NULL AND country != '' AND 
          city IS NOT NULL AND city != '' AND
          latitude IS NOT NULL AND 
          longitude IS NOT NULL
        GROUP BY country, city, latitude, longitude 
        ORDER BY country, value DESC; 
      `;
      const [rows] = await db.execute(sql);
      mapData = rows.map((row) => ({
        country: row.country,
        city: row.city,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        value: parseInt(row.value, 10),
      }));
    } else {
      message = "Dados para o mapa (tabela 'access_logs' não encontrada).";
      console.warn(
        "Tabela 'access_logs' não encontrada para dados do mapa. Retornando lista vazia."
      );
    }
    return successResponse(res, message, mapData);
  } catch (err) {
    console.error("Erro ao buscar dados para o mapa:", err.message, err.stack);
    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao buscar dados para o mapa.",
      500,
      errorDetails
    );
  }
};

export const getLeads = async (req, res) => {
  let limit = parseInt(req.query.limit, 10);
  if (isNaN(limit) || limit <= 0 || limit > 1000) {
    limit = 10;
  }

  try {
    const [tableExistsResult] = await db.execute(
      `SELECT COUNT(*) as count
         FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'leads'`
    );
    const tableExists = tableExistsResult[0]?.count > 0;

    let leadsData = [];
    let message = "Leads obtidos com sucesso.";

    if (tableExists) {
      const sql = `
            SELECT
                id,
                nome,
                email,
                telefone,
                data_envio,
                consent_marketing
            FROM leads
            ORDER BY data_envio DESC
            LIMIT ${limit}`;

      const [leadRows] = await db.execute(sql);

      leadsData = leadRows.map((lead) => ({
        id: lead.id,
        name: lead.nome,
        email: lead.email,
        phone: lead.telefone,
        data_envio: lead.data_envio,
        consent_marketing: lead.consent_marketing,
      }));
    } else {
      message = "Leads obtidos com sucesso (tabela 'leads' não encontrada).";
      console.warn("Tabela 'leads' não encontrada. Retornando lista vazia.");
    }

    return successResponse(res, message, leadsData);
  } catch (err) {
    console.error(
      `Erro ao buscar leads (Limite: ${limit}):`,
      err.message,
      err.stack
    );
    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao buscar leads.",
      500,
      errorDetails
    );
  }
};

export const updateProfilePhoto = async (req, res) => {
  const userId = req.userId;
  const newImageFile = req.file;

  if (!newImageFile) {
    return errorResponse(res, "Nenhum arquivo de imagem enviado.", 400);
  }

  const newImageFilename = newImageFile.filename;
  let oldImageFilename = null;

  try {
    const [userRows] = await db.execute(
      "SELECT foto_url FROM credenciais WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      fs.promises
        .unlink(newImageFile.path)
        .catch((err) =>
          console.error("Error removing orphaned upload (user not found):", err)
        );
      return errorResponse(res, "Usuário não encontrado.", 404);
    }

    oldImageFilename = getFilenameFromUrlOrString(userRows[0].foto_url);

    const [updateResult] = await db.execute(
      "UPDATE credenciais SET foto_url = ? WHERE id = ?",
      [newImageFilename, userId]
    );

    if (updateResult.affectedRows === 0) {
      fs.promises
        .unlink(newImageFile.path)
        .catch((err) =>
          console.error(
            "Error removing orphaned upload (DB update failed):",
            err
          )
        );
      return errorResponse(
        res,
        "Falha ao atualizar a foto no banco de dados.",
        500
      );
    }

    if (oldImageFilename && oldImageFilename !== newImageFilename) {
      const oldImagePath = path.resolve(
        __dirname,
        "../../uploads",
        oldImageFilename
      );
      console.log(`Attempting to delete old profile photo: ${oldImagePath}`);
      fs.promises
        .unlink(oldImagePath)
        .then(() =>
          console.log(`Successfully deleted old photo: ${oldImageFilename}`)
        )
        .catch((err) => {
          console.warn(
            `Warning: Failed to delete old profile photo file (${oldImageFilename}): ${err.message}`
          );
        });
    }

    const newImageUrl = getProfileImageUrl(newImageFilename);
    console.log(
      `Foto de perfil atualizada para user ID ${userId}. Nova URL: ${newImageUrl}`
    );
    return successResponse(res, "Foto de perfil atualizada com sucesso!", {
      foto_url: newImageUrl,
    });
  } catch (err) {
    console.error(
      `Erro GERAL ao atualizar foto de perfil para usuário ID ${userId}:`,
      err.message,
      err.stack
    );

    fs.promises
      .unlink(newImageFile.path)
      .catch((unlinkErr) =>
        console.error(
          "Error removing orphaned upload after main error:",
          unlinkErr
        )
      );

    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao atualizar a foto de perfil.",
      500,
      errorDetails
    );
  }
};

export const removeProfilePhoto = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return errorResponse(res, "Autenticação necessária.", 401);
  }

  let currentFotoValue = null;

  try {
    const [userRows] = await db.execute(
      "SELECT foto_url FROM credenciais WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return errorResponse(res, "Usuário não encontrado.", 404);
    }

    currentFotoValue = userRows[0].foto_url;

    if (!currentFotoValue) {
      return successResponse(res, "Nenhuma foto de perfil para remover.");
    }

    const [updateResult] = await db.execute(
      "UPDATE credenciais SET foto_url = NULL WHERE id = ?",
      [userId]
    );

    if (updateResult.affectedRows === 0) {
      console.warn(
        `Attempted to remove photo for user ${userId}, but DB update affected 0 rows.`
      );
      return errorResponse(
        res,
        "Falha ao remover referência da foto no banco de dados.",
        500
      );
    }

    const filenameToRemove = getFilenameFromUrlOrString(currentFotoValue);

    if (filenameToRemove) {
      const imagePath = path.resolve(
        __dirname,
        "../../uploads",
        filenameToRemove
      );
      console.log(`Attempting to delete profile photo file: ${imagePath}`);

      fs.promises
        .unlink(imagePath)
        .then(() =>
          console.log(
            `Successfully deleted photo file: ${filenameToRemove} for user ${userId}`
          )
        )
        .catch((err) => {
          console.warn(
            `Aviso: Falha ao deletar arquivo de foto (${filenameToRemove}) para usuário ID ${userId}: ${err.message}. A referência no DB foi removida.`
          );
        });
    } else {
      console.warn(
        `Could not extract filename from foto_url ('${currentFotoValue}') for user ${userId} during photo removal. DB reference removed.`
      );
    }

    console.log(`Foto de perfil removida do DB para usuário ID ${userId}.`);
    return successResponse(res, "Foto de perfil removida com sucesso!", {
      foto_url: null,
    });
  } catch (err) {
    console.error(
      `Erro GERAL ao remover foto de perfil para usuário ID ${userId}:`,
      err.message,
      err.stack
    );
    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao tentar remover a foto de perfil.",
      500,
      errorDetails
    );
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.userId;
  const { name, email } = req.body;

  if (!name || !email) {
    return errorResponse(res, "Nome e email são obrigatórios.", 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse(res, "Formato de email inválido.", 400);
  }

  try {
    const [updateResult] = await db.execute(
      "UPDATE credenciais SET username = ?, email = ? WHERE id = ?",
      [name.trim(), email.trim().toLowerCase(), userId]
    );

    if (updateResult.affectedRows === 0) {
      return errorResponse(
        res,
        "Usuário não encontrado para atualização.",
        404
      );
    }

    console.log(`Perfil (nome/email) atualizado para usuário ID ${userId}.`);
    return successResponse(res, "Perfil atualizado com sucesso!", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
  } catch (err) {
    console.error(
      `Erro ao atualizar perfil para usuário ID ${userId}:`,
      err.message,
      err.stack
    );

    if (err.code === "ER_DUP_ENTRY") {
      let field = "Valor";
      if (err.message.includes("username")) field = "Nome de usuário";
      else if (err.message.includes("email")) field = "Email";
      return errorResponse(
        res,
        `${field} já está em uso por outra conta.`,
        409
      );
    }

    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao atualizar o perfil.",
      500,
      errorDetails
    );
  }
};

export const updateUserPassword = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(
      res,
      "Senha atual e nova senha são obrigatórias.",
      400
    );
  }
  if (newPassword.length < 6) {
    return errorResponse(
      res,
      "A nova senha deve ter pelo menos 6 caracteres.",
      400
    );
  }

  try {
    const [userRows] = await db.execute(
      "SELECT password FROM credenciais WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return errorResponse(res, "Usuário não encontrado.", 404);
    }
    const storedHash = userRows[0].password;

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      storedHash
    );
    if (!isCurrentPasswordValid) {
      return errorResponse(res, "Senha atual incorreta.", 401);
    }

    const isNewSameAsOld = await bcrypt.compare(newPassword, storedHash);
    if (isNewSameAsOld) {
      return errorResponse(
        res,
        "A nova senha não pode ser igual à senha atual.",
        400
      );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const [updateResult] = await db.execute(
      "UPDATE credenciais SET password = ? WHERE id = ?",
      [newHashedPassword, userId]
    );

    if (updateResult.affectedRows === 0) {
      console.error(
        `Failed to update password for user ${userId} despite successful validation.`
      );
      return errorResponse(res, "Falha inesperada ao atualizar a senha.", 500);
    }

    console.log(`Senha atualizada com sucesso para usuário ID ${userId}.`);
    return successResponse(res, "Senha alterada com sucesso!");
  } catch (err) {
    console.error(
      `Erro ao alterar senha para usuário ID ${userId}:`,
      err.message,
      err.stack
    );
    const errorDetails = env.NODE_ENV === "development" ? err : null;
    return errorResponse(
      res,
      "Erro interno ao alterar a senha.",
      500,
      errorDetails
    );
  }
};
