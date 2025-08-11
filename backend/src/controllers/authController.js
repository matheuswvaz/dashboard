import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../config/database.js";
import transporter from "../config/mailer.js";
import env from "../config/env.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const registerAdmin = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return errorResponse(
      res,
      "Por favor, preencha todos os campos (username, password, email).",
      400
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return errorResponse(res, "Formato de e-mail inválido.", 400);
  }

  try {
    const [userRows] = await db.execute(
      "SELECT id FROM credenciais WHERE username = ? OR email = ?",
      [username, email]
    );
    if (userRows.length > 0) {
      return errorResponse(res, "Usuário ou e-mail já está em uso.", 400);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO credenciais (username, password, email, verification_token, verification_token_expires) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))",
      [username, hashedPassword, email, verificationToken]
    );

    const verificationLink = `${env.BASE_URL}/verify-email/${verificationToken}`;

    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      console.error(
        "ERRO DE CONFIGURAÇÃO: As credenciais de e-mail (EMAIL_USER, EMAIL_PASS) não estão definidas no arquivo .env. O e-mail de verificação não pode ser enviado."
      );
      return errorResponse(
        res,
        "Erro na configuração do servidor que impede o envio de e-mails. Verifique as variáveis de ambiente.",
        500
      );
    }

    const mailOptions = {
      from: `"${env.EMAIL_USER}" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Verifique seu E-mail - Dashboard Matheus", // ALTERADO
      html: `<p>Olá ${username},</p><p>Obrigado por se cadastrar. Por favor, clique no link a seguir para ativar sua conta:</p><a href="${verificationLink}" style="display: inline-block; padding: 12px 25px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Ativar Conta</a><p>Este link é válido por 24 horas.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return successResponse(
      res,
      "Cadastro realizado! Um link de verificação foi enviado para o seu e-mail.",
      null,
      201
    );
  } catch (err) {
    console.error("Erro ao cadastrar administrador:", err.message);
    return errorResponse(
      res,
      "Erro interno ao cadastrar administrador.",
      500,
      err
    );
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const [userRows] = await db.execute(
      "SELECT id, is_verified FROM credenciais WHERE verification_token = ? AND verification_token_expires > NOW()",
      [token]
    );

    if (userRows.length === 0) {
      return res
        .status(400)
        .send(
          "<h1>Link de verificação inválido ou expirado.</h1><p>Por favor, tente se registrar novamente ou contate o suporte.</p>"
        );
    }

    if (userRows[0].is_verified) {
      return res
        .status(200)
        .send(
          "<h1>Este e-mail já foi verificado.</h1><p>Você já pode fazer o login.</p>"
        );
    }

    await db.execute(
      "UPDATE credenciais SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?",
      [userRows[0].id]
    );

    return res.send(
      "<h1>E-mail verificado com sucesso!</h1><p>Sua conta foi ativada. Você já pode fechar esta aba e fazer o login.</p>"
    );
  } catch (err) {
    console.error("Erro ao verificar e-mail:", err.message);
    return res
      .status(500)
      .send(
        "<h1>Erro Interno do Servidor</h1><p>Ocorreu um problema ao tentar verificar seu e-mail. Por favor, tente novamente mais tarde.</p>"
      );
  }
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return errorResponse(res, "Por favor, preencha username e password.", 400);
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, username, password, is_verified FROM credenciais WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return errorResponse(res, "Usuário ou senha incorretos.", 401);
    }

    const admin = rows[0];

    if (!admin.is_verified) {
      return errorResponse(
        res,
        "Sua conta não foi verificada. Por favor, acesse o link enviado para o seu e-mail.",
        403
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return errorResponse(res, "Usuário ou senha incorretos.", 401);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    await db.execute("UPDATE credenciais SET last_login = NOW() WHERE id = ?", [
      admin.id,
    ]);

    return successResponse(res, "Login bem-sucedido!", { token });
  } catch (err) {
    console.error("Erro ao autenticar o administrador:", err.message);
    return errorResponse(res, "Erro interno durante a autenticação.", 500, err);
  }
};

export const forgotPassword = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return errorResponse(res, "Nome de usuário é obrigatório.", 400);
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, username, email FROM credenciais WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      console.warn(
        `Tentativa de recuperação de senha para usuário inexistente: ${username}`
      );
      return successResponse(
        res,
        "Se o usuário existir, um link de recuperação foi enviado para o e-mail cadastrado."
      );
    }

    const user = rows[0];

    const resetToken = jwt.sign(
      { id: user.id, username: user.username },
      env.JWT_RESET_SECRET,
      { expiresIn: "1h" }
    );

    await db.execute(
      "UPDATE credenciais SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?",
      [resetToken, user.id]
    );

    const resetLink = `${env.BASE_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"${env.EMAIL_USER}" <${env.EMAIL_USER}>`,
      to: user.email,
      subject: "Redefinição de Senha",
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h2 style="color: #333;">Redefinição de Senha Solicitada</h2>
                <p>Olá ${user.username},</p>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo para criar uma nova senha:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; margin: 20px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Redefinir Minha Senha
                </a>
                <p>Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.</p>
                <p style="font-size: 0.9em; color: #666;">Este link é válido por 1 hora.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
                <p style="font-size: 0.8em; color: #999;">Atenciosamente,<br>Equipe de Suporte</p>
              </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de recuperação enviado para: ${user.email}`);

    return successResponse(
      res,
      "Se o usuário existir, um link de recuperação foi enviado para o e-mail cadastrado."
    );
  } catch (err) {
    console.error("Erro no processo de forgot password:", err.message);
    return errorResponse(
      res,
      "Erro interno ao processar a solicitação.",
      500,
      err
    );
  }
};

export const showResetForm = async (req, res) => {
  const { token } = req.params;

  try {
    jwt.verify(token, env.JWT_RESET_SECRET);

    const [userRows] = await db.execute(
      "SELECT id FROM credenciais WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (userRows.length === 0) {
      return res.status(400).send(`
                <h1>Link Inválido ou Expirado</h1>
                <p>O link para redefinição de senha é inválido, expirou ou já foi utilizado. Por favor, solicite um novo link.</p>
                <a href="/admin-forgot-password">Solicitar novo link</a>
            `);
    }

    res.send(`
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redefinir Senha</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
              .container { background-color: #fff; padding: 30px 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 90%; }
              h1 { color: #333; margin-bottom: 25px; font-size: 24px; }
              .form-group { margin-bottom: 20px; text-align: left; }
              label { display: block; margin-bottom: 8px; color: #555; font-weight: 600; }
              input[type="password"] { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px; }
              button { background-color: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; width: 100%; transition: background-color 0.3s ease; }
              button:hover { background-color: #0056b3; }
              .error-message { color: #dc3545; margin-top: 5px; font-size: 14px; display: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Redefinir Senha</h1>
              <form id="resetForm" action="/admin-reset-password" method="POST">
                <input type="hidden" name="token" value="${token}">
                <div class="form-group">
                  <label for="newPassword">Nova Senha:</label>
                  <input type="password" id="newPassword" name="newPassword" required minlength="6">
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirmar Nova Senha:</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                  <p id="passwordError" class="error-message">As senhas não coincidem.</p>
                </div>
                <button type="submit">Redefinir Senha</button>
              </form>
            </div>
            <script>
              const form = document.getElementById('resetForm');
              const newPassword = document.getElementById('newPassword');
              const confirmPassword = document.getElementById('confirmPassword');
              const errorElement = document.getElementById('passwordError');

              form.addEventListener('submit', function(e) {
                errorElement.style.display = 'none';
                if (newPassword.value !== confirmPassword.value) {
                  e.preventDefault();
                  errorElement.style.display = 'block';
                  confirmPassword.focus();
                }
                else if (newPassword.value.length < 6) {
                     e.preventDefault();
                     alert('A senha deve ter pelo menos 6 caracteres.');
                     newPassword.focus();
                }
              });
            </script>
          </body>
          </html>
        `);
  } catch (err) {
    console.error("Erro ao verificar token para reset form:", err);
    return res.status(400).send(`
            <h1>Link Inválido ou Expirado</h1>
            <p>O link para redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.</p>
             <a href="/admin-forgot-password">Solicitar novo link</a>
        `);
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token) {
    return errorResponse(res, "Token de redefinição ausente.", 400);
  }
  if (!newPassword || !confirmPassword) {
    return errorResponse(
      res,
      "Nova senha e confirmação são obrigatórias.",
      400
    );
  }
  if (newPassword !== confirmPassword) {
    return errorResponse(res, "As senhas não coincidem.", 400);
  }
  if (newPassword.length < 6) {
    return errorResponse(
      res,
      "A nova senha deve ter pelo menos 6 caracteres.",
      400
    );
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_RESET_SECRET);
    } catch (jwtError) {
      await connection.rollback();
      connection.release();
      console.error("Erro de verificação JWT no reset:", jwtError.name);
      const message =
        jwtError.name === "TokenExpiredError"
          ? "Link expirado."
          : "Link inválido.";
      return errorResponse(res, message, 400);
    }

    const [userRows] = await connection.execute(
      "SELECT id FROM credenciais WHERE id = ? AND reset_token = ? AND reset_token_expires > NOW() FOR UPDATE",
      [decoded.id, token]
    );

    if (userRows.length === 0) {
      await connection.rollback();
      connection.release();
      return errorResponse(
        res,
        "Link inválido, expirado ou já utilizado.",
        400
      );
    }

    const userId = userRows[0].id;

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const [updateResult] = await connection.execute(
      "UPDATE credenciais SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, userId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("Falha ao atualizar a senha do usuário.");
    }

    await connection.commit();

    console.log(`Senha redefinida com sucesso para o usuário ID: ${userId}`);

    return res.redirect("/admin-login");
  } catch (err) {
    await connection.rollback();
    console.error("Erro ao redefinir senha:", err.message);
    return errorResponse(res, "Erro interno ao redefinir a senha.", 500, err);
  } finally {
    if (connection) connection.release();
  }
};