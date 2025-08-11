
import db from "../config/database.js";
import transporter from "../config/mailer.js";
import env from "../config/env.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import he from "he";

// INICIO DA FUNÇÃO sendLeadEmail
export const sendLeadEmail = async (req, res) => {
  // INICIO DO CORPO DA FUNÇÃO sendLeadEmail
  // Adicionado 'consentMarketing' ao destructuring (o frontend envia como 'consentMarketingForm')
  const {
    nome,
    email,
    telefone,
    consentMarketing: consentMarketingForm,
  } = req.body;

  if (!nome || !email || !telefone) {
    return errorResponse(
      res,
      "Por favor, preencha todos os campos: nome, email e telefone.",
      400
    );
  }

  // Converte o valor de consentMarketingForm para booleano para o banco de dados
  const marketingConsentGiven =
    consentMarketingForm === true ||
    String(consentMarketingForm).toLowerCase() === "true";

  try {
    // Modificada a query para incluir data_envio (com NOW()) e consent_marketing
    // Certifique-se que sua tabela 'leads' tem as colunas 'data_envio' (TIMESTAMP) e 'consent_marketing' (BOOLEAN)
    await db.execute(
      "INSERT INTO leads (nome, email, telefone, data_envio, consent_marketing) VALUES (?, ?, ?, NOW(), ?)",
      [nome, email, telefone, marketingConsentGiven]
    );
    console.log(
      `Lead saved for: ${email}. Marketing consent from form: ${marketingConsentGiven}`
    );

    // Escapar dados para o corpo do e-mail HTML
    const escapedNome = he.encode(nome);
    const escapedEmail = he.encode(email);
    const escapedTelefone = he.encode(telefone);

    const mailOptions = {
      from: `"${env.EMAIL_USER}" <${env.EMAIL_USER}>`, // Nome do remetente e e-mail
      to: env.CONTACT_EMAIL, // E-mail de destino configurado no .env
      subject: "Novo Lead Recebido - Site Grupo Nepen", // Assunto do e-mail
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 20px;">
                  <img src="https://www.gruponepen.com.br/logos.png" alt="Logo Grupo Nepen" style="max-width: 200px;"/>
                </div>
                <h2 style="color: #005188; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px;">Novo Lead Recebido</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 5px; font-weight: bold; color: #333; width: 100px;">Nome:</td>
                    <td style="padding: 10px 5px; color: #555;">${escapedNome}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 5px; font-weight: bold; color: #333;">Email:</td>
                    <td style="padding: 10px 5px; color: #555;">${escapedEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 10px 5px; font-weight: bold; color: #333;">Telefone:</td>
                    <td style="padding: 10px 5px; color: #555;">${escapedTelefone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 5px; font-weight: bold; color: #333;">Consentimento para Marketing:</td>
                    <td style="padding: 10px 5px; color: ${marketingConsentGiven ? "#10893e" : "#d83b01"}; font-weight: bold;">${marketingConsentGiven ? "SIM" : "NÃO"}</td>
                  </tr>
                </table>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 0.9em; color: #777; text-align: center;">
                  Esta mensagem foi enviada automaticamente através do formulário de contato do site Grupo Nepen.
                </p>
              </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Lead notification email sent to: ${env.CONTACT_EMAIL}`);

    return successResponse(
      res,
      "Contato enviado com sucesso!",
      null,
      201
    );
  } catch (err) {
    // Log detalhado do erro no servidor
    console.error(
      "Erro ao processar o contato:",
      err.message,
      err.stack ? err.stack : ""
    );

    // Retorna uma mensagem de erro genérica para o cliente, mas loga os detalhes no servidor
    return errorResponse(
      res,
      "Ocorreu um erro ao processar seu contato. Por favor, tente novamente mais tarde.",
      500,
      // Envia detalhes do erro apenas em ambiente de desenvolvimento
      env.NODE_ENV === "development"
        ? { message: err.message, code: err.code }
        : undefined
    );
  }
  // FIM DO CORPO DA FUNÇÃO sendLeadEmail
};
// FIM DA FUNÇÃO sendLeadEmail

// FIM DO ARQUIVO src/controllers/leadController.js
