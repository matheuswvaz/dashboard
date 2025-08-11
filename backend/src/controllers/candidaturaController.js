import db from "../config/database.js";
import transporter from "../config/mailer.js";
import env from "../config/env.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import fs from "fs"; 

export const createCandidatura = async (req, res) => {
  const { nome, email, telefone, vaga, resumo } = req.body;
  const anexo = req.file;

  if (!nome || !email || !telefone || !vaga || !anexo) {
    if (anexo) {
      fs.promises
        .unlink(anexo.path)
        .catch((err) =>
          console.error("Erro ao remover anexo após falha de validação:", err)
        );
    }
    return errorResponse(
      res,
      "Todos os campos e o currículo são obrigatórios.",
      400
    );
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO candidaturas (nome, email, telefone, vaga, resumo, caminho_anexo, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nome, email, telefone, vaga, resumo, anexo.filename, "Recebida"]
    );

    const mailOptions = {
      from: `"${env.EMAIL_USER}" <${env.EMAIL_USER}>`,
      to: env.CONTACT_EMAIL,
      subject: `Nova Candidatura Recebida para a Vaga: ${vaga}`,
      html: `<p>Uma nova candidatura foi submetida por <strong>${nome}</strong> (${email}) para a vaga de <strong>${vaga}</strong>.</p><p>Acesse o painel de administração para mais detalhes.</p>`,
    };
    await transporter.sendMail(mailOptions);

    return successResponse(
      res,
      "Candidatura enviada com sucesso!",
      { id: result.insertId },
      201
    );
  } catch (err) {
    console.error("Erro ao criar candidatura:", err);
    if (anexo) {
      fs.promises
        .unlink(anexo.path)
        .catch((unlinkErr) =>
          console.error("Erro ao remover anexo após falha no DB:", unlinkErr)
        );
    }
    return errorResponse(
      res,
      "Erro interno ao processar sua candidatura.",
      500
    );
  }
};

export const listCandidaturas = async (req, res) => {
  try {
    const [candidaturas] = await db.execute(
      "SELECT id, nome, email, telefone, vaga, resumo, caminho_anexo, status, DATE_FORMAT(data_envio, '%d/%m/%Y %H:%i') as data_envio_formatada FROM candidaturas ORDER BY data_envio DESC"
    );
    const candidaturasComUrl = candidaturas.map((c) => ({
      ...c,
      url_anexo: `${env.BASE_URL}${env.UPLOAD_BASE_URL}/${c.caminho_anexo}`,
    }));
    return successResponse(
      res,
      "Candidaturas listadas com sucesso.",
      candidaturasComUrl
    );
  } catch (err) {
    console.error("Erro ao listar candidaturas:", err);
    return errorResponse(res, "Erro interno ao buscar candidaturas.", 500);
  }
};

export const updateCandidaturaStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return errorResponse(res, "O campo 'status' é obrigatório.", 400);
  }

  try {
    const [result] = await db.execute(
      "UPDATE candidaturas SET status = ? WHERE id = ?",
      [status, id]
    );
    if (result.affectedRows === 0) {
      return errorResponse(res, "Candidatura não encontrada.", 404);
    }
    return successResponse(
      res,
      "Status da candidatura atualizado com sucesso!"
    );
  } catch (err) {
    console.error("Erro ao atualizar status da candidatura:", err);
    return errorResponse(res, "Erro interno ao atualizar status.", 500);
  }
};

export const responderCandidato = async (req, res) => {
  const { id } = req.params;
  const { assunto, mensagem } = req.body;

  if (!assunto || !mensagem) {
    return errorResponse(res, "Assunto e mensagem são obrigatórios.", 400);
  }

  try {
    const [rows] = await db.execute(
      "SELECT nome, email FROM candidaturas WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return errorResponse(res, "Candidato não encontrado.", 404);
    }
    const candidato = rows[0];

    const mailOptions = {
      from: `"${env.EMAIL_USER}" <${env.EMAIL_USER}>`,
      to: candidato.email,
      subject: assunto,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Olá, ${candidato.nome},</p>
          <p>Agradecemos seu interesse em fazer parte da nossa equipe.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>${mensagem.replace(/\n/g, "<br>")}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Atenciosamente,</p>
          <p><strong>Equipe de Recrutamento - Dashboard Matheus</strong></p> 
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return successResponse(res, "Email de resposta enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar email de resposta:", err);
    return errorResponse(res, "Erro interno ao enviar e-mail.", 500);
  }
};