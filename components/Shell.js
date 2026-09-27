"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LangProvider";

export default function Shell({ children }) {
  const { lang, t, setLang } = useLang();
  const path = usePathname();
  const nav = [
    ["/", t.navHome],
    ["/readiness", t.navReadiness],
    ["/scenarios", t.navScenarios],
    ["/journal", t.navJournal],
  ];
  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link href="/" className="brand">{t.brand}</Link>
          <nav aria-label="Main">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
            ))}
          </nav>
          <button className="lang" onClick={() => setLang(lang === "en" ? "ar" : "en")} lang={lang === "en" ? "ar" : "en"}>
            {t.langSwitch}
          </button>
        </div>
      </header>
      <main className="wrap">{children}</main>
      <footer className="wrap footer">
        <p>{t.disclaimer}</p>
        <p dir="ltr">{t.footer}</p>
      </footer>
    </>
  );
}
