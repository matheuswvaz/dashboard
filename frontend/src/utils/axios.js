// INÍCIO: apiClient.js
import axios from "axios";
import { Cookies, getCookieConsentValue } from "react-cookie-consent";
import { CATEGORIES } from "../contexts/ConsentContext";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

// 1. Cria UMA ÚNICA instância do Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 2. Adiciona Interceptor de Requisição (combina lógica de token e consentimento)
apiClient.interceptors.request.use(
  (config) => {
    // --- Lógica do Token de Autenticação ---
    const publicPaths = [
      "/admin-login",
      "/admin-register",
      "/admin-forgot-password",
      "/reset-password", // Garanta que o path exato do token de reset seja coberto
      "/enviar-email",
    ];

    // A rota /api/log-view também é pública para token
    // Verifica se a URL da requisição atual começa com algum dos publicPaths
    // ou é exatamente /api/log-view.
    // Usar startsWith é geralmente mais seguro para caminhos base.
    const isPublicForToken =
      publicPaths.some((path) => config.url.startsWith(path)) ||
      config.url.startsWith("/api/log-view") ||
      (config.url.startsWith("/api/postagens") && config.method === "get"); // Exemplo: GET /api/postagens/ID também seria público

    if (!isPublicForToken) {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Considerar não logar para cada requisição, pode poluir o console.
        // console.warn(
        //   `API Client: Tentando acessar rota não pública (${config.url}) sem token.`
        // );
        // Se uma rota protegida for chamada sem token, o backend deve retornar 401,
        // que será tratado pelo interceptor de resposta.
      }
    }

    // --- Lógica dos Headers de Consentimento ---
    // Usar getCookieConsentValue para consistência se você o usa em outros lugares,
    // ou Cookies.get diretamente.
    const analyticsConsent =
      getCookieConsentValue(`grupoNepenConsent_${CATEGORIES.ANALYTICS}`) ===
        "true" ||
      Cookies.get(`grupoNepenConsent_${CATEGORIES.ANALYTICS}`) === "true"; // Fallback se um não estiver definido

    const marketingConsent =
      getCookieConsentValue(`grupoNepenConsent_${CATEGORIES.MARKETING}`) ===
        "true" ||
      Cookies.get(`grupoNepenConsent_${CATEGORIES.MARKETING}`) === "true";

    // Define os headers de consentimento. O backend deve estar preparado para recebê-los.
    config.headers["X-Consent-Analytics"] = analyticsConsent
      ? "granted"
      : "denied";
    config.headers["X-Consent-Marketing"] = marketingConsent
      ? "granted"
      : "denied";

    return config;
  },
  (error) => {
    // Erros durante a configuração da requisição
    return Promise.reject(error);
  }
);

// 3. Adiciona Interceptor de Resposta (para tratamento de erro 401)
apiClient.interceptors.response.use(
  (response) => response, // Passa as respostas de sucesso diretamente
  (error) => {
    // Verifica se o erro é uma resposta de erro da API
    if (error.response) {
      // Tratamento específico para erro 401 (Não Autorizado)
      if (error.response.status === 401) {
        // Verifica se não é um erro 401 na própria tela de login para evitar loop
        const isLoginAttempt = error.config.url.includes("/admin-login");

        if (!isLoginAttempt) {
          console.error(
            "API Client: Erro 401 - Não autorizado ou token expirado. Redirecionando para login."
          );
          localStorage.removeItem("adminToken"); // Remove o token inválido/expirado

          // Redireciona para a página de login, a menos que já esteja nela
          if (window.location.pathname !== "/admin-login") {
            window.location.href = "/admin-login"; // Força o redirecionamento
          }
        } else {
          // Se o erro 401 ocorreu na tentativa de login, não redireciona,
          // apenas repassa o erro para ser tratado pelo componente de login (ex: exibir "usuário/senha inválidos").
          console.warn("API Client: Falha na tentativa de login (401).");
        }
      }
      // Poderia adicionar tratamento para outros códigos de status aqui (ex: 500, 403, 404)
    } else if (error.name === "CanceledError") {
      console.log("API Client: Requisição cancelada - ", error.message);
    } else {
      // Erros de rede ou outros problemas antes da resposta ser recebida
      console.error("API Client: Erro de rede ou requisição - ", error.message);
    }
    return Promise.reject(error); // Importante repassar o erro para quem fez a chamada
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
    (response) => response, // Se a resposta for boa, apenas retorne-a
    (error) => {
      // Se a resposta for um erro 401 (não autorizado)
      if (error.response && error.response.status === 401) {
        // Chame a função de logout que recebemos como callback
        if (logoutCallback) {
          logoutCallback();
        }
      }
      return Promise.reject(error);
    }
  );
};

// 4. Exporta a instância configurada
export default apiClient;
export { axios };
// FIM: apiClient.js
