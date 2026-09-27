"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { STRINGS } from "@/lib/i18n";

const LangContext = createContext({ lang: "en", t: STRINGS.en, setLang: () => {} });

function writeCookie(l) {
  document.cookie = `realai_lang=${l}; path=/; max-age=31536000; samesite=lax`;
}

// The server reads the realai_lang cookie and renders the right language and direction from the first paint.
export function LangProvider({ initialLang = "en", children }) {
  const [lang, setLangState] = useState(initialLang);

  // One-time migration for visitors who chose Arabic before the cookie existed.
  useEffect(() => {
    if (document.cookie.includes("realai_lang=")) return;
    try {
      if (localStorage.getItem("realai_lang") === "ar") setLang("ar");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    writeCookie(l);
  };

  return <LangContext.Provider value={{ lang, t: STRINGS[lang], setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
