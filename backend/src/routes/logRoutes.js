// === logRoutes.js atualizado ===
import express from "express";
import geoip from "geoip-lite";
import db from "../config/database.js";
import { errorResponse } from "../utils/responseHandler.js";

const router = express.Router();

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

router.post("/log-view", async (req, res) => {
  const { path: pagePath } = req.body;

  if (!pagePath) {
    return errorResponse(
      res,
      'O campo "path" é obrigatório para registrar visualizações.',
      400
    );
  }

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
  let latitude = null;
  let longitude = null;

  if (analyticsConsentGiven && ip) {
    try {
      const geoData = geoip.lookup(ip);
      if (geoData) {
        country = geoData.country || null;
        city = geoData.city || null;
        if (Array.isArray(geoData.ll) && geoData.ll.length === 2) {
          latitude = geoData.ll[0];
          longitude = geoData.ll[1];
        }
      }
    } catch (geoipError) {
      console.warn(
        `[LOG VIEW - GEOIP] Falha ao obter localização: ${geoipError.message}`
      );
    }
  }

  try {
    const sql = `
      INSERT INTO access_logs
      (access_time, http_method, requested_url, path, user_agent,
       country, city, latitude, longitude, consent_details,
       is_page_view, status_code, response_time_ms, user_id)
      VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      analyticsConsentGiven ? "VIEW" : "ANON",
      analyticsConsentGiven ? pagePath.substring(0, 2048) : "/anon",
      analyticsConsentGiven ? pagePath.substring(0, 2048) : "/anon",
      userAgent,
      country,
      city,
      latitude,
      longitude,
      JSON.stringify({
        analytics: analyticsConsentGiven,
        marketing: marketingConsentGiven,
      }),
      true, // is_page_view
      200,
      null, // response_time_ms
      null, // user_id
    ];

    await db.execute(sql, values);

    console.log(
      `[LOG VIEW] ${analyticsConsentGiven ? "Completo" : "Anônimo"} → ${pagePath}`
    );

    return res.status(200).json({
      success: true,
      message: "Visualização registrada com sucesso.",
    });
  } catch (error) {
    console.error(`[DB ERROR] Erro ao registrar log-view: ${error.message}`);
    return errorResponse(res, "Erro ao registrar visualização de página.", 500);
  }
});

export default router;
// === FIM ===
