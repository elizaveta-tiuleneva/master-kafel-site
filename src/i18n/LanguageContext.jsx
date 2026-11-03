import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "tile-works-lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "ko" || saved === "ru" ? saved : "ru";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "ko" ? "ko" : "ru";
  }, [lang]);

  const value = useMemo(() => {
    const t = translations[lang];
    return { lang, setLang, t };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
