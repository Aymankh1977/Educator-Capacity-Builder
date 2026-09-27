"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { STRINGS } from "@/lib/i18n";

const LangContext = createContext({ lang: "en", t: STRINGS.en, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("realai_lang");
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("realai_lang", l); } catch {}
  };

  return <LangContext.Provider value={{ lang, t: STRINGS[lang], setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
