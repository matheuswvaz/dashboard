import nodemailer from "nodemailer";
import env from "./env.js";

if (!env.EMAIL_USER || !env.EMAIL_PASS) {
  console.warn(
    "⚠️ Email credenciais (EMAIL_USER, EMAIL_PASS) não configuradas em .env."
  );
}

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer configuration error:", error);
  } else {
    console.log("📧 Mailer pronto!");
  }
});

export default transporter;
