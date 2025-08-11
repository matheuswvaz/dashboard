import axios from "axios";
import { Cookies, getCookieConsentValue } from "react-cookie-consent";
import { CATEGORIES } from "../contexts/ConsentContext";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const publicPaths = [
      "/admin-login",
      "/admin-register",
      "/admin-forgot-password",
      "/reset-password",
      "/enviar-email",
    ];

    const isPublicForToken =
      publicPaths.some((path) => config.url.startsWith(path)) ||
      config.url.startsWith("/api/log-view") ||
      (config.url.startsWith("/api/postagens") && config.method === "get");

    if (!isPublicForToken) {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    const analyticsConsent =
      getCookieConsentValue(`dashboardMatheusConsent_${CATEGORIES.ANALYTICS}`) === "true" ||
      Cookies.get(`dashboardMatheusConsent_${CATEGORIES.ANALYTICS}`) === "true";

    const marketingConsent =
      getCookieConsentValue(`dashboardMatheusConsent_${CATEGORIES.MARKETING}`) === "true" ||
      Cookies.get(`dashboardMatheusConsent_${CATEGORIES.MARKETING}`) === "true";

    config.headers["X-Consent-Analytics"] = analyticsConsent
      ? "granted"
      : "denied";
    config.headers["X-Consent-Marketing"] = marketingConsent
      ? "granted"
      : "denied";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        const isLoginAttempt = error.config.url.includes("/admin-login");

        if (!isLoginAttempt) {
          console.error(
            "API Client: Erro 401 - Não autorizado ou token expirado. Redirecionando para login."
          );
          localStorage.removeItem("adminToken");

          if (window.location.pathname !== "/admin-login") {
            window.location.href = "/admin-login";
          }
        } else {
          console.warn("API Client: Falha na tentativa de login (401).");
        }
      }
    } else if (error.name === "CanceledError") {
      console.log("API Client: Requisição cancelada - ", error.message);
    } else {
      console.error("API Client: Erro de rede ou requisição - ", error.message);
    }
    return Promise.reject(error);
  }
);

export const setupAuthInterceptor = (logoutCallback) => {
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        if (logoutCallback) {
          logoutCallback();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default apiClient;
export { axios };