import mysql from "mysql2/promise";
import env from "./env.js";

const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((connection) => {
    console.log("📁 Banco de dados conectado com sucesso!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  });

export default db;
