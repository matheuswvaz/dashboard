
import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCookieConsentValue, Cookies } from "react-cookie-consent";

export const ConsentContext = createContext();

const CONSENT_COOKIE_BASE_NAME = "dashboardMatheusConsent";
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
  });

  const [isConsentInteracted, setIsConsentInteracted] = useState(
    () => !!getCookieConsentValue(CONSENT_COOKIE_BASE_NAME)
  );

  const updateConsent = useCallback(async (category, value) => {
    if (category === CATEGORIES.ESSENTIAL) return;

    Cookies.set(`${CONSENT_COOKIE_BASE_NAME}_${category}`, value, {
      expires: 180,
    });

    Cookies.set(CONSENT_COOKIE_BASE_NAME, "true", { expires: 180 });
    setIsConsentInteracted(true);

    setConsent((prev) => {
      const updated = { ...prev, [category]: value };

      window.dispatchEvent(
        new CustomEvent("consentChanged", {
          detail: updated,
        })
      );

      return updated;
    });


  }, []);

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
  }, []);
  
  const acceptAll = useCallback(() => {
    handleConsentInteraction(true);
  }, [handleConsentInteraction]);

  const declineAllNonEssential = useCallback(() => {
    handleConsentInteraction(false);
  }, [handleConsentInteraction]);

  useEffect(() => {
    if (isConsentInteracted) {
      window.dispatchEvent(
        new CustomEvent("consentChangedOnInit", { detail: consent })
      );
    }
  }, [isConsentInteracted, consent]);

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
};