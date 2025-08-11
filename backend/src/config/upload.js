
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import env from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../../uploads");

// Garante que o diretório de uploads existe
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    console.error(
      `❌ Falha ao criar o diretório de uploads em ${uploadsDir}:`,
      err
    );
    throw new Error(`Falha na criação do diretório: ${err.message}`);
  }
}

// Configuração de armazenamento (comum para todos os tipos de upload)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const originalName = path
      .parse(file.originalname)
      .name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${originalName}-${uniqueSuffix}${extension}`);
  },
});

// --- FILTROS DE ARQUIVO ---

// Filtro para aceitar apenas IMAGENS
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = /jpeg|jpg|png|gif|webp/;
  const mimetypeIsValid = allowedMimeTypes.test(file.mimetype);
  const extnameIsValid = allowedMimeTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetypeIsValid && extnameIsValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Falha no upload: Apenas arquivos de imagem (JPEG, PNG, GIF, WEBP) são permitidos!"
      ),
      false
    );
  }
};

// Filtro para aceitar apenas DOCUMENTOS (currículos)
const documentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtnames = /pdf|doc|docx/;

  const mimetypeIsValid = allowedMimeTypes.includes(file.mimetype);
  const extnameIsValid = allowedExtnames.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimetypeIsValid && extnameIsValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Falha no upload: Apenas documentos (PDF, DOC, DOCX) são permitidos!"
      ),
      false
    );
  }
};

// --- INSTÂNCIAS DO MULTER ---

// Instância do Multer para upload de IMAGENS
export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Instância do Multer para upload de DOCUMENTOS
export const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Exporta o de imagem como padrão para manter compatibilidade com o código antigo
export default uploadImage;
