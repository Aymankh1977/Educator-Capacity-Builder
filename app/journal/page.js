"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { loadJournal, clearJournal } from "@/lib/journal";
import { PILLARS, SCENARIOS, pillarByKey } from "@/lib/realai";

function Paragraphs({ text }) {
  return text.split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>);
}

export default function Journal() {
  const { lang, t } = useLang();
  const [entries, setEntries] = useState(null);

  useEffect(() => { setEntries(loadJournal()); }, []);

  function clearAll() {
    if (!window.confirm(t.confirmClear)) return;
    clearJournal();
    setEntries([]);
  }

  const date = (iso) =>
    new Date(iso).toLocaleString(lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB", { dateStyle: "medium", timeStyle: "short" });

  return (
    <section className="page">
      <h1>{t.journalTitle}</h1>
      <p className="lede">{t.journalIntro}</p>

      {entries && entries.length > 0 && (
        <div className="actions no-print">
          <button className="btn" onClick={() => window.print()}>{t.print}</button>
          <button className="btn btn-quiet" onClick={clearAll}>{t.clearAll}</button>
        </div>
      )}

      {entries && entries.length === 0 && <p className="note">{t.journalEmpty}</p>}

      <div className="journal">
        {entries?.map((e) => {
          if (e.kind === "plan") {
            return (
              <article key={e.id} className="entry">
                <header>
                  <strong>{t.kindPlan}</strong>
                  <time dateTime={e.ts}>{date(e.ts)}</time>
                </header>
                <dl className="entry-scores">
                  {PILLARS.map((p) => (
                    <div key={p.key} style={{ "--c": p.color }}>
                      <dt>{p.name[lang]}</dt>
                      <dd dir="ltr">{e.scores?.[p.key]?.toFixed(1)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="entry-text" lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>
                  <Paragraphs text={e.text} />
                </div>
              </article>
            );
          }
          const sc = SCENARIOS.find((s) => s.id === e.scenarioId);
          const opt = sc?.options.find((o) => o.id === e.optionId);
          if (!sc || !opt) return null;
          const p = pillarByKey(sc.pillar);
          return (
            <article key={e.id} className="entry" style={{ "--c": p.color }}>
              <header>
                <strong><span className="tag" dir="ltr">{p.key}</span> {sc.title[lang]}</strong>
                <time dateTime={e.ts}>{date(e.ts)}</time>
              </header>
              <h3>{t.yourChoice}</h3>
              <p>{opt.text[lang]} <em className={`fit-label fit-${opt.fit}`}>({t.fit[opt.fit]})</em></p>
              <h3>{t.yourReflection}</h3>
              <p lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>{e.reflection}</p>
              {e.text && (
                <>
                  <h3>{t.coachFeedback}</h3>
                  <div className="entry-text" lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>
                    <Paragraphs text={e.text} />
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
