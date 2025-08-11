import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import db from "../config/database.js";
import env from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFilenameFromUrlOrString = (input) => {
  if (!input || typeof input !== "string") return null;
  try {
    return path.basename(new URL(input).pathname);
  } catch {
    return path.basename(input);
  }
};

const getImageUrl = (imageFilename) => {
  if (!imageFilename) return null;
  if (/^https?:\/\//.test(imageFilename)) return imageFilename;
  const uploadBaseUrl = (env.UPLOAD_BASE_URL || "/uploads").replace(/\/$/, "");
  const baseUrl = env.BASE_URL.replace(/\/$/, "");
  return `${baseUrl}${uploadBaseUrl}/${imageFilename}`;
};

// ===================================================================
// FUNÇÃO listPosts
// ===================================================================
export const listPosts = async (req, res) => {
  const { categoria, status } = req.query; // Pega 'status' da query string

  try {
    let sql = `
      SELECT id, titulo, autor, subtitulo, imagem, conteudo, 
        data_publicacao,
        DATE_FORMAT(data_publicacao, '%d/%m/%Y às %H:%i') as data_formatada,
        data_agendamento,
        DATE_FORMAT(data_agendamento, '%d/%m/%Y às %H:%i') as data_agendamento_formatada,
        status,
        legenda_imagem_destaque,
        categoria
      FROM postagens
    `;
    const params = [];
    let conditions = [];

    // 1. Filtro por STATUS:
    // Se um status específico for solicitado (ex: 'publicado', 'agendado'), usa ele, se não usa 'publicado'.
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    } else {
      conditions.push("status = ?");
      params.push("publicado");
    }

    // 2. Filtro por CATEGORIA:
    if (categoria) {
      conditions.push("categoria = ?");
      params.push(categoria);
    }

    // Junta as condições na query, se houver alguma.
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    // 3. Ordenação:
    // Ordena por data de publicação para posts publicados
    // e por data de agendamento para os demais.
    sql +=
      " ORDER BY CASE WHEN status = 'publicado' THEN data_publicacao WHEN status = 'agendado' THEN data_agendamento ELSE id END DESC";

    const [rows] = await db.execute(sql, params);

    const posts = rows.map((post) => ({
      ...post,
      imagem: getImageUrl(post.imagem),
      data_publicacao: post.data_publicacao,
      data_formatada: post.data_formatada || "Não publicado",
      data_agendamento: post.data_agendamento,
      data_agendamento_formatada: post.data_agendamento_formatada || "-",
    }));

    return successResponse(res, "Postagens listadas com sucesso.", posts);
  } catch (err) {
    console.error("Erro ao listar posts:", err.message);
    return errorResponse(res, "Erro interno ao buscar postagens.", 500, err);
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10)))
    return errorResponse(res, "ID inválido.", 400);
  try {
    const sql = `
      SELECT *,
        DATE_FORMAT(data_publicacao, '%d/%m/%Y %H:%i:%s') as data_publicacao_formatada,
        DATE_FORMAT(data_agendamento, '%Y-%m-%dT%H:%i') as data_agendamento_iso
      FROM postagens WHERE id = ?`;
    const [rows] = await db.execute(sql, [id]);
    if (rows.length === 0)
      return errorResponse(res, "Post não encontrado.", 404);

    const post = rows[0];
    const postComImagemUrl = {
      ...post,
      imagem: getImageUrl(post.imagem),
    };
    return successResponse(res, "Postagem encontrada.", postComImagemUrl);
  } catch (err) {
    console.error(`Erro buscar post ID ${id}:`, err.message);
    return errorResponse(res, "Erro interno buscar post.", 500, err);
  }
};

export const createPost = async (req, res) => {
  const {
    titulo,
    conteudo,
    categoria,
    autor,
    subtitulo,
    legendaImagemDestaque,
    dataAgendamento,
    status: requestedStatus,
  } = req.body;
  const imagemFile = req.file;

  if (!titulo || !autor) {
    if (imagemFile) fs.promises.unlink(imagemFile.path).catch(console.error);
    return errorResponse(
      res,
      "Campos obrigatórios (título, subtítulo) não preenchidos.",
      400
    );
  }

  const imagemFilename = imagemFile ? imagemFile.filename : null;
  let status = "publicado";
  let dataPublicacao = null;
  let dataAgendamentoFormatada = null;

  if (requestedStatus === "draft") {
    status = "draft";
  } else if (dataAgendamento) {
    const parsedDate = new Date(dataAgendamento);
    if (isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
      if (imagemFile) fs.promises.unlink(imagemFile.path).catch(console.error);
      return errorResponse(
        res,
        "Data e hora de agendamento inválidas ou no passado.",
        400
      );
    }
    status = "agendado";
    dataAgendamentoFormatada = parsedDate;
  } else {
    status = "publicado";
    dataPublicacao = new Date();
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO postagens (titulo, conteudo, categoria, autor, subtitulo, imagem, legenda_imagem_destaque, data_publicacao, status, data_agendamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        titulo,
        conteudo || "",
        categoria,
        autor,
        subtitulo || null,
        imagemFilename,
        legendaImagemDestaque || null,
        dataPublicacao,
        status,
        dataAgendamentoFormatada,
      ]
    );
    return successResponse(
      res,
      `Postagem salva como ${status} com sucesso!`,
      { id: result.insertId, status },
      201
    );
  } catch (err) {
    console.error("Erro ao criar postagem:", err.message);
    if (imagemFile) fs.promises.unlink(imagemFile.path).catch(console.error);
    return errorResponse(res, "Erro interno ao criar a postagem.", 500, err);
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    conteudo,
    categoria,
    autor,
    subtitulo,
    imagemExistenteUrl,
    removerImagem,
    legendaImagemDestaque,
    dataAgendamento,
    status: requestedStatus,
  } = req.body;
  const novaImagemFile = req.file;

  try {
    const [existingPostRows] = await db.execute(
      "SELECT imagem, status, data_publicacao FROM postagens WHERE id = ?",
      [id]
    );
    if (existingPostRows.length === 0) {
      if (novaImagemFile)
        fs.promises.unlink(novaImagemFile.path).catch(console.error);
      return errorResponse(res, "Postagem não encontrada.", 404);
    }

    const {
      imagem: nomeArquivoAntigoNoDB,
      status: statusAntigo,
      data_publicacao: dataPublicacaoAntiga,
    } = existingPostRows[0];
    let filenameParaSalvar =
      getFilenameFromUrlOrString(imagemExistenteUrl) || nomeArquivoAntigoNoDB;
    let imagemAntigaParaDeletarDoFS = null;

    if (novaImagemFile) {
      filenameParaSalvar = novaImagemFile.filename;
      if (nomeArquivoAntigoNoDB)
        imagemAntigaParaDeletarDoFS = nomeArquivoAntigoNoDB;
    } else if (removerImagem === "true" || removerImagem === true) {
      filenameParaSalvar = null;
      if (nomeArquivoAntigoNoDB)
        imagemAntigaParaDeletarDoFS = nomeArquivoAntigoNoDB;
    }

    let status = statusAntigo;
    let dataPublicacao = dataPublicacaoAntiga;
    let dataAgendamentoFormatada = null;

    if (requestedStatus === "draft") {
      status = "draft";
      dataPublicacao = null;
      dataAgendamentoFormatada = null;
    } else if (dataAgendamento) {
      const parsedDate = new Date(dataAgendamento);
      if (isNaN(parsedDate.getTime())) {
        // Permitir agendamento para o passado para edições
        if (novaImagemFile)
          fs.promises.unlink(novaImagemFile.path).catch(console.error);
        return errorResponse(res, "Data de agendamento inválida.", 400);
      }
      status = "agendado";
      dataPublicacao = null;
      dataAgendamentoFormatada = parsedDate;
    } else {
      // requestedStatus é 'publicado' ou indefinido
      status = "publicado";
      if (statusAntigo !== "publicado") {
        dataPublicacao = new Date();
      }
      dataAgendamentoFormatada = null;
    }

    await db.execute(
      "UPDATE postagens SET titulo = ?, conteudo = ?, categoria = ?, autor = ?, subtitulo = ?, imagem = ?, legenda_imagem_destaque = ?, status = ?, data_publicacao = ?, data_agendamento = ? WHERE id = ?",
      [
        titulo,
        conteudo,
        categoria,
        autor,
        subtitulo || null,
        filenameParaSalvar,
        legendaImagemDestaque || null,
        status,
        dataPublicacao,
        dataAgendamentoFormatada,
        id,
      ]
    );

    if (
      imagemAntigaParaDeletarDoFS &&
      imagemAntigaParaDeletarDoFS !== filenameParaSalvar
    ) {
      const oldImagePath = path.resolve(
        __dirname,
        "../../uploads",
        imagemAntigaParaDeletarDoFS
      );
      fs.promises
        .unlink(oldImagePath)
        .catch((err) =>
          console.warn(`Aviso: Falha ao deletar imagem antiga: ${err.message}`)
        );
    }

    return successResponse(res, "Postagem atualizada com sucesso!", {
      id,
      status,
    });
  } catch (err) {
    console.error(`Erro ao atualizar postagem ID ${id}:`, err.message);
    if (novaImagemFile)
      fs.promises.unlink(novaImagemFile.path).catch(console.error);
    return errorResponse(
      res,
      "Erro interno ao atualizar a postagem.",
      500,
      err
    );
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "UPDATE postagens SET status = 'trashed' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, "Postagem não encontrada.", 404);
    }

    return successResponse(res, "Postagem movida para a lixeira!");
  } catch (err) {
    console.error(
      `Erro ao mover postagem ID ${id} para a lixeira:`,
      err.message
    );
    return errorResponse(
      res,
      "Erro interno ao mover a postagem para a lixeira.",
      500,
      err
    );
  }
};

export const restorePost = async (req, res) => {
  const { id } = req.params;
  try {
    // Pega o post da lixeira para verificar se ele tinha agendamento
    const [postRows] = await db.execute(
      "SELECT data_agendamento, status FROM postagens WHERE id = ?",
      [id]
    );

    if (postRows.length === 0) {
      return errorResponse(res, "Postagem não encontrada.", 404);
    }
    const currentStatus = postRows[0].status;

    // Permite restaurar da lixeira ou publicar um rascunho
    if (currentStatus !== "trashed" && currentStatus !== "draft") {
      return errorResponse(
        res,
        "A postagem não está na lixeira ou não é um rascunho.",
        400
      );
    }

    // Se tinha data de agendamento no futuro, volta como 'agendado', senão, 'publicado'.
    const newStatus =
      postRows[0].data_agendamento &&
      new Date(postRows[0].data_agendamento) > new Date()
        ? "agendado"
        : "publicado";

    const dataPublicacao = newStatus === "publicado" ? new Date() : null;

    const [result] = await db.execute(
      "UPDATE postagens SET status = ?, data_publicacao = ? WHERE id = ?",
      [newStatus, dataPublicacao, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, "Falha ao restaurar/publicar a postagem.", 500);
    }

    return successResponse(res, "Postagem restaurada/publicada com sucesso!");
  } catch (err) {
    console.error(`Erro ao restaurar/publicar postagem ID ${id}:`, err.message);
    return errorResponse(
      res,
      "Erro interno ao restaurar a postagem.",
      500,
      err
    );
  }
};

// função para deletar permanentemente
export const deletePostPermanent = async (req, res) => {
  const { id } = req.params;
  try {
    const [postRows] = await db.execute(
      "SELECT imagem FROM postagens WHERE id = ? AND status = 'trashed'",
      [id]
    );

    if (postRows.length === 0) {
      return errorResponse(
        res,
        "Postagem não encontrada na lixeira para exclusão permanente.",
        404
      );
    }

    const nomeArquivoImagem = getFilenameFromUrlOrString(postRows[0].imagem);
    const [deleteResult] = await db.execute(
      "DELETE FROM postagens WHERE id = ?",
      [id]
    );

    if (deleteResult.affectedRows > 0 && nomeArquivoImagem) {
      const imagePath = path.resolve(
        __dirname,
        "../../uploads",
        nomeArquivoImagem
      );
      fs.promises
        .unlink(imagePath)
        .catch((err) =>
          console.warn(
            `Aviso: Falha ao deletar arquivo de imagem antigo: ${err.message}`
          )
        );
    }

    return successResponse(res, "Postagem deletada permanentemente!");
  } catch (err) {
    console.error(
      `Erro ao deletar permanentemente postagem ID ${id}:`,
      err.message
    );
    return errorResponse(
      res,
      "Erro interno ao deletar permanentemente a postagem.",
      500,
      err
    );
  }
};
