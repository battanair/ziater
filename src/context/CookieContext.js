import { createContext, useContext, useState } from "react";

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [cookieConsent, setCookieConsent] = useState(localStorage.getItem("cookieConsent") || null);

  return (
    <CookieContext.Provider value={{ cookieConsent, setCookieConsent }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => useContext(CookieContext);
