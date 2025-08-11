// === INÍCIO: logView.js ===
import apiClient from "./axios";
import { Cookies } from "react-cookie-consent";
import { CATEGORIES } from "../contexts/ConsentContext";

export const logView = async () => {
  // 🔒 Trava imediata de concorrência
  if (window.__logViewDispatched) {
    console.log("⛔ logView bloqueado por flag global");
    return;
  }

  // 🔒 Trava por sessãoStorage
  if (sessionStorage.getItem("logViewSent") === "true") {
    console.log("⚠️ logView já enviado nesta sessão.");
    return;
  }

  // 🟢 Marca como enviado — tanto na flag quanto na sessão
  window.__logViewDispatched = true;

  const analyticsConsent =
    Cookies.get(`grupoNepenConsent_${CATEGORIES.ANALYTICS}`) === "true";

  const basePayload = {
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };

  try {
    if (analyticsConsent) {
      const fullPayload = {
        ...basePayload,
        tipo: "visita_completa",
        userAgent: navigator.userAgent,
        idioma: navigator.language,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
      };

      await apiClient.post("/api/log-view", fullPayload);
      console.log("✅ Log detalhado enviado.");
    } else {
      const anonPayload = {
        ...basePayload,
        tipo: "visita_anonima",
      };

      await apiClient.post("/api/log-view", anonPayload);
      console.log("🔒 Log anônimo enviado.");
    }

    sessionStorage.setItem("logViewSent", "true");
  } catch (error) {
    console.error("❌ Falha ao enviar log de visualização:", error);
  }
};
// === FIM ===
