// === logAccessMiddleware ===
import geoip from "geoip-lite";
import db from "../config/database.js";
import env from "../config/env.js";

const getRealIp = (req) => {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    null;
  if (ip && typeof ip === "string" && ip.includes("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  return ip;
};

function shouldIgnoreRequest(path, method) {
  const exactPathsToIgnore = [
    "/api/chart-data",
    "/api/log-view",
    "/admin-login",
    "/admin-register",
    "/admin-forgot-password",
    "/verify-token",
    "/api/upload/imagem",
    "/chatbot"
  ];

  const prefixesToIgnore = [
    "/api/admin/",
    "/reset-password/",
    "/api/postagens",
  ];

  if (exactPathsToIgnore.includes(path)) return true;
  for (const prefix of prefixesToIgnore) {
    if (path.startsWith(prefix)) return true;
  }
  return false;
}

const logAccessMiddleware = async (req, res, next) => {
  const startTime = process.hrtime();
  const originalUrlForCheck = req.originalUrl || "";
  const methodForCheck = req.method;

  res.on("finish", async () => {
    const pathForMatching = originalUrlForCheck.split("?")[0];
    const pathForDbColumn = req.path || null;

    if (shouldIgnoreRequest(pathForMatching, methodForCheck)) return;

    const diff = process.hrtime(startTime);
    const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);

    const analyticsConsentGiven =
      req.headers["x-consent-analytics"] === "granted";
    const marketingConsentGiven =
      req.headers["x-consent-marketing"] === "granted";
    const ip = analyticsConsentGiven ? getRealIp(req) : null;
    const userAgent = analyticsConsentGiven
      ? req.headers["user-agent"]?.substring(0, 1024) || null
      : null;

    let country = null;
    let city = null;
    if (analyticsConsentGiven && ip) {
      try {
        const geoData = geoip.lookup(ip);
        if (geoData) {
          country = geoData.country || null;
          city = geoData.city || null;
        }
      } catch (geoError) {
        console.warn(
          `[GEOIP WARN] Falha ao obter localização: ${geoError.message}`
        );
      }
    }

    const methodLabel = analyticsConsentGiven ? "VIEW" : "ANON";
    const fullRequestedUrlForLog = analyticsConsentGiven
      ? originalUrlForCheck
      : "/anon";
    const pathForLog = analyticsConsentGiven ? pathForDbColumn : "/anon";

    if (String(env.LOG_ALL_REQUESTS_TO_DB).toLowerCase() === "true") {
      try {
        const consentDetails = JSON.stringify({
          analytics: analyticsConsentGiven,
          marketing: marketingConsentGiven,
        });
        const sql = `
          INSERT INTO access_logs
          (access_time, http_method, requested_url, status_code, response_time_ms, user_id,
           path, country, city, consent_details, is_page_view)
          VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          methodLabel,
          fullRequestedUrlForLog.substring(0, 2048),
          res.statusCode,
          parseFloat(responseTime),
          req.userId || null,
          pathForLog.substring(0, 2048),
          country,
          city,
          consentDetails,
          false,
        ];
        await db.execute(sql, values);
      } catch (dbError) {
        console.error(
          `[DB LOG ERROR] Falha ao registrar log de acesso: ${dbError.message} para ${originalUrlForCheck}`
        );
      }
    }

    console.log(
      `[ACCESS] ${methodForCheck} ${originalUrlForCheck} - ${res.statusCode} - ${city || "?"}, ${country || "?"} - Consent: ${analyticsConsentGiven ? "SIM" : "NÃO"} - ${responseTime}ms`
    );
  });

  next();
};

export default logAccessMiddleware;
// === FIM ===
