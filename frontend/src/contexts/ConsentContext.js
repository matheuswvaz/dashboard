// INÍCIO: ConsentContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCookieConsentValue, Cookies } from "react-cookie-consent";

export const ConsentContext = createContext();

const CONSENT_COOKIE_BASE_NAME = "grupoNepenConsent";
export const CATEGORIES = {
  ESSENTIAL: "essential",
  ANALYTICS: "analytics",
  MARKETING: "marketing",
};

// INÍCIO: Componente ConsentProvider
export const ConsentProvider = ({ children }) => {
  // INÍCIO: useState para 'consent'
  const [consent, setConsent] = useState(() => {
    const initialConsent = {};
    Object.keys(CATEGORIES).forEach((key) => {
      if (CATEGORIES[key] !== CATEGORIES.ESSENTIAL) {
        initialConsent[CATEGORIES[key]] =
          getCookieConsentValue(
            `${CONSENT_COOKIE_BASE_NAME}_${CATEGORIES[key]}`
          ) === "true";
      }
    });
    return initialConsent;
    // LÓGICA:
    // 1. Define o estado inicial de 'consent' (analytics, marketing).
    // 2. Lê os valores dos cookies específicos de cada categoria para determinar o estado inicial.
    // 3. 'ESSENTIAL' é ignorado pois geralmente não é opcional.
  });
  // FIM: useState para 'consent'

  // INÍCIO: useState para 'isConsentInteracted'
  const [isConsentInteracted, setIsConsentInteracted] = useState(
    () => !!getCookieConsentValue(CONSENT_COOKIE_BASE_NAME)
  );
  // LÓGICA:
  // 1. Define o estado que rastreia se o usuário já interagiu com o banner de consentimento principal.
  // 2. Lê um cookie geral (CONSENT_COOKIE_BASE_NAME) para determinar o estado inicial.
  // FIM: useState para 'isConsentInteracted'

  // INÍCIO: Função updateConsent com envio ao backend
  const updateConsent = useCallback(async (category, value) => {
    if (category === CATEGORIES.ESSENTIAL) return;

    // 1. Atualiza cookie de categoria
    Cookies.set(`${CONSENT_COOKIE_BASE_NAME}_${category}`, value, {
      expires: 180,
    });

    // 2. Marca consentimento geral como interagido (importante para esconder o banner)
    Cookies.set(CONSENT_COOKIE_BASE_NAME, "true", { expires: 180 });
    setIsConsentInteracted(true);

    // 3. Atualiza estado
    setConsent((prev) => {
      const updated = { ...prev, [category]: value };

      // 4. Dispara evento customizado
      window.dispatchEvent(
        new CustomEvent("consentChanged", {
          detail: updated,
        })
      );

      return updated;
    });


  }, []);

  // INÍCIO: Função handleConsentInteraction
  const handleConsentInteraction = useCallback((isAcceptingAll) => {
    const newConsents = {};
    Object.values(CATEGORIES).forEach((category) => {
      if (category !== CATEGORIES.ESSENTIAL) {
        const consentValue = isAcceptingAll;
        Cookies.set(`${CONSENT_COOKIE_BASE_NAME}_${category}`, consentValue, {
          expires: 180,
        });
        newConsents[category] = consentValue;
      }
    });

    Cookies.set(CONSENT_COOKIE_BASE_NAME, "true", { expires: 180 });

    setConsent(newConsents);
    setIsConsentInteracted(true);

    window.dispatchEvent(
      new CustomEvent("consentChanged", {
        detail: newConsents,
      })
    );
    // LÓGICA:
    // 1. Chamada quando o usuário clica em "Aceitar Todos" ou "Recusar Não Essenciais" no banner.
    // 2. Define os cookies para todas as categorias não essenciais com base na escolha (isAcceptingAll).
    // 3. Define o cookie principal para registrar que o banner foi interagido.
    // 4. Atualiza o estado 'consent' e 'isConsentInteracted' localmente no React.
    // 5. Dispara um evento 'consentChanged' com o novo conjunto de consentimentos.
    // 6. NÃO recarrega a página.
  }, []);
  // FIM: Função handleConsentInteraction

  // INÍCIO: Função acceptAll
  const acceptAll = useCallback(() => {
    handleConsentInteraction(true);
  }, [handleConsentInteraction]);
  // FIM: Função acceptAll

  // INÍCIO: Função declineAllNonEssential
  const declineAllNonEssential = useCallback(() => {
    handleConsentInteraction(false);
  }, [handleConsentInteraction]);
  // FIM: Função declineAllNonEssential

  // INÍCIO: useEffect para 'consentChangedOnInit'
  useEffect(() => {
    if (isConsentInteracted) {
      window.dispatchEvent(
        new CustomEvent("consentChangedOnInit", { detail: consent })
      );
    }
    // LÓGICA:
    // 1. Executa no carregamento da página (e quando 'isConsentInteracted' ou 'consent' mudam).
    // 2. Se o consentimento já foi interagido anteriormente, dispara um evento 'consentChangedOnInit'.
    //    Isso pode ser usado para inicializar lógicas que dependem de um consentimento pré-existente.
  }, [isConsentInteracted, consent]);
  // FIM: useEffect para 'consentChangedOnInit'

  // INÍCIO: Retorno do Provider
  return (
    <ConsentContext.Provider
      value={{
        consent,
        updateConsent,
        acceptAll,
        declineAllNonEssential,
        isConsentInteracted,
        CATEGORIES,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
  // FIM: Retorno do Provider
};
// FIM: Componente ConsentProvider
// FIM: ConsentContext.js
