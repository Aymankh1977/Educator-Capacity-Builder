"use client";
import { useLang } from "@/components/LangProvider";
import WhyThis from "@/components/WhyThis";
import { pillarByKey } from "@/lib/realai";
import page from "@/content/accreditation.json";

// Renders *word* as emphasis, as in the supplied text.
function Emph({ text }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part
  );
}

export default function Accreditation() {
  const { lang } = useLang();
  const arrow = lang === "ar" ? "←" : "→";
  return (
    <section className="page">
      <h1>{page.title[lang]}</h1>
      {page.intro.map((p, i) => <p key={i} className={i === 0 ? "lede" : undefined}><Emph text={p[lang]} /></p>)}
      <WhyThis objects={page} />

      <h2 className="result-title">{page.pillarsTitle[lang]}</h2>
      <ul className="theme-list">
        {page.pillarThemes.map((row) => {
          const p = pillarByKey(row.pillar);
          return (
            <li key={row.pillar} style={{ "--c": p.color }}>
              <span className="tag" dir="ltr">{p.key}</span>
              <span><strong>{p.name[lang]}</strong> {arrow} {row.text[lang]}</span>
            </li>
          );
        })}
      </ul>

      <p className="saudi"><strong>{page.saudi.label[lang]}</strong> <Emph text={page.saudi.text[lang]} /></p>

      <h2 className="result-title">{page.platformsTitle[lang]}</h2>
      <ul className="platform-list">
        {page.platforms.map((pl) => (
          <li key={pl.name.en}>
            {pl.url.startsWith("http")
              ? <a href={pl.url} target="_blank" rel="noopener noreferrer">{pl.name[lang]}</a>
              : <>{pl.name[lang]} <span className="placeholder" dir="ltr">{pl.url}</span></>}
          </li>
        ))}
      </ul>

      <aside className="caution" role="note">
        <strong>{page.caution.label[lang]}</strong> {page.caution.text[lang]}
      </aside>
    </section>
  );
}
