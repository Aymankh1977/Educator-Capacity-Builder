"use client";
import { useState } from "react";
import { useLang } from "@/components/LangProvider";
import CoachBox from "@/components/CoachBox";
import { SCENARIOS, pillarByKey } from "@/lib/realai";

export default function Scenarios() {
  const { lang, t } = useLang();
  const [activeId, setActiveId] = useState(null);
  const [choice, setChoice] = useState(null);
  const [reflection, setReflection] = useState("");

  const sc = SCENARIOS.find((s) => s.id === activeId);

  function open(id) {
    setActiveId(id);
    setChoice(null);
    setReflection("");
    window.scrollTo({ top: 0 });
  }

  if (!sc) {
    return (
      <section className="page">
        <h1>{t.chooseScenario}</h1>
        <ul className="scenario-list">
          {SCENARIOS.map((s) => {
            const p = pillarByKey(s.pillar);
            return (
              <li key={s.id} style={{ "--c": p.color }}>
                <button onClick={() => open(s.id)}>
                  <span className="tag" dir="ltr">{p.key}</span>
                  <span>
                    <strong>{s.title[lang]}</strong>
                    <small>{p.name[lang]}</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  const p = pillarByKey(sc.pillar);
  const opt = sc.options.find((o) => o.id === choice);

  return (
    <section className="page" style={{ "--c": p.color }}>
      <button className="back" onClick={() => setActiveId(null)}>{t.allScenarios}</button>
      <p className="pillar-line"><span className="tag" dir="ltr">{p.key}</span> {p.name[lang]}</p>
      <h1>{sc.title[lang]}</h1>
      <p className="context">{sc.context[lang]}</p>

      <h2>{t.whatWouldYouDo}</h2>
      <div className="options" role="radiogroup">
        {sc.options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={choice === o.id}
            className={`option ${choice === o.id ? `chosen fit-${o.fit}` : ""}`}
            onClick={() => setChoice(o.id)}
            disabled={Boolean(choice) && choice !== o.id}
          >
            {o.text[lang]}
          </button>
        ))}
      </div>

      {opt && (
        <div className={`verdict fit-${opt.fit}`} aria-live="polite">
          <strong>{t.fit[opt.fit]}</strong>
          <p>{opt.feedback[lang]}</p>
          <button className="linkish" onClick={() => setChoice(null)}>{t.tryAnother}</button>
        </div>
      )}

      {opt && (
        <div className="reflect">
          <label htmlFor="reflection">{t.reflectPrompt}</label>
          <textarea id="reflection" rows={4} maxLength={1500} value={reflection} onChange={(e) => setReflection(e.target.value)} />
          <CoachBox
            key={`${sc.id}-${opt.id}`}
            buttonLabel={t.getDebrief}
            disabled={reflection.trim().length < 10}
            buildRequest={() => ({ mode: "debrief", scenarioId: sc.id, optionId: opt.id, reflection })}
          />
        </div>
      )}
    </section>
  );
}
