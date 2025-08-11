import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import envConfig from "./config/env.js";
import allRoutes from "./routes/index.js";
import { errorResponse } from "./utils/responseHandler.js";
import logAccessMiddleware from "./middlewares/logAccessMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import { startPostScheduler } from "./utils/scheduler.js";

// INICIO DA CONFIGURAÇÃO DE CAMINHOS __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// FIM DA CONFIGURAÇÃO DE CAMINHOS __filename e __dirname

const app = express();

// INICIO DA CONFIGURAÇÃO DE PROXY (Para Rate Limiting e logs de IP mais precisos)
// Confiar no primeiro proxy reverso (ajuste '1' se houver mais proxies na frente)
app.set("trust proxy", 1);
// FIM DA CONFIGURAÇÃO DE PROXY

// INICIO DA CONFIGURAÇÃO DO HELMET (Cabeçalhos de Segurança HTTP)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
// FIM DA CONFIGURAÇÃO DO HELMET

// INICIO DA CONFIGURAÇÃO DE CORS
const clientUrl = process.env.CLIENT_URL;
const corsOptions = {
  origin: clientUrl,
  credentials: true, 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
console.log(`🔒 CORS enabled for origin: ${clientUrl}`);
// FIM DA CONFIGURAÇÃO DE CORS

// INICIO DA CONFIGURAÇÃO DOS PARSERS DE REQUEST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// FIM DA CONFIGURAÇÃO DOS PARSERS DE REQUES

// INICIO DA CONFIGURAÇÃO DO RATE LIMITING GERAL
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Limitar cada IP a 200 requisições por janela (aumentado de 100 para acomodar mais assets)
  standardHeaders: true, // Retornar informações de rate limit nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desabilitar os cabeçalhos `X-RateLimit-*`
  message:
    "Muitas requisições vindas deste IP, por favor tente novamente após 15 minutos.",
  handler: (req, res, next, options) => {
    // Logar a tentativa que excedeu o limite
    console.warn(
      `Rate limit geral excedido para IP ${req.ip}: ${options.message} na rota ${req.originalUrl}`
    );
    // Usar errorResponse para padronizar a resposta de erro
    errorResponse(res, options.message, options.statusCode);
  },
});
app.use(generalLimiter);
// FIM DA CONFIGURAÇÃO DO RATE LIMITING GERA

// INICIO DA CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (Uploads)
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use(envConfig.UPLOAD_BASE_URL, express.static(uploadsPath));
console.log(
  `📁 Servindo arquivos estáticos ${uploadsPath} at ${envConfig.UPLOAD_BASE_URL}`
);
// FIM DA CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS

// INICIO DA CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS DA APLICAÇÃO REACT (BUILD)
app.use(express.static(path.join(__dirname, "build")));
console.log(
  `🌐 Servindo arquivos estáticos da build em ${path.join(__dirname, "build")}`
);
// FIM DA CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS DA APLICAÇÃO REACT

// INICIO DA CONFIGURAÇÃO DO MIDDLEWARE DE LOG DE ACESSO
app.use(logAccessMiddleware);
// FIM DA CONFIGURAÇÃO DO MIDDLEWARE DE LOG DE ACESSO

// INICIO DA CONFIGURAÇÃO DAS ROTAS PRINCIPAIS
app.use("/", allRoutes);
// FIM DA CONFIGURAÇÃO DAS ROTAS PRINCIPAIS

// INICIO DO MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (404)
app.use((req, res, next) => {
  console.log(
    `❌ 404 - Route not handled by API: ${req.method} ${req.originalUrl}`
  );
  errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
});
// FIM DO MIDDLEWARE PARA ROTAS NÃO ENCONTRADAS (404)

// INICIO DO MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAL
app.use(errorHandler);
// FIM DO MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAL

// INICIO DA INICIALIZAÇÃO DO SERVIDOR
app.listen(envConfig.PORT, () => {
  console.log(`\n🚀 Servidor pronto em ${envConfig.BASE_URL}`);
  console.log(`   Environment: ${envConfig.NODE_ENV}`);
  console.log(`   Pressione CTRL+C para sair\n`);
  startPostScheduler();
});
// FIM DA INICIALIZAÇÃO DO SERVIDOR

export default app;

// FIM DO ARQUIVO src/server.js
