import "dotenv/config";

const envConfig = {
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET,
  UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  LOG_ALL_REQUESTS_TO_DB: process.env.LOG_ALL_REQUESTS_TO_DB,
};

if (!envConfig.JWT_SECRET || !envConfig.DB_HOST) {
  throw new Error("Variáveis de ambiente críticas não estão definidas!");
}

export default envConfig;