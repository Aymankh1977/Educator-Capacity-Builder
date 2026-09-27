"use client";
import { useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import CoachBox from "@/components/CoachBox";
import { SCENARIOS, pillarByKey } from "@/lib/realai";
import { addEntry, updateEntry } from "@/lib/journal";

// Flow: choose a response → write a reflection → then see the REAL-AI fit rating and optional coaching.
// The rating stays hidden until the reflection is submitted, so the reflection records the educator's own reasoning.
export default function Scenarios() {
  const { lang, t } = useLang();
  const [activeId, setActiveId] = useState(null);
  const [choice, setChoice] = useState(null);
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const entryId = useRef(null);

  const sc = SCENARIOS.find((s) => s.id === activeId);

  function reset() {
    setChoice(null);
    setReflection("");
    setSubmitted(false);
    entryId.current = null;
  }

  function open(id) {
    setActiveId(id);
    reset();
    window.scrollTo({ top: 0 });
  }

  function submit() {
    entryId.current = addEntry({ kind: "reflection", scenarioId: sc.id, optionId: choice, reflection: reflection.trim(), lang });
    setSubmitted(true);
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
            className={`option ${choice === o.id ? "chosen" : ""} ${submitted && choice === o.id ? `fit-${o.fit}` : ""}`}
            onClick={() => setChoice(o.id)}
            disabled={submitted && choice !== o.id}
          >
            {o.text[lang]}
          </button>
        ))}
      </div>

      {opt && !submitted && (
        <div className="reflect">
          <label htmlFor="reflection">{t.reflectPrompt}</label>
          <textarea id="reflection" rows={4} maxLength={1500} value={reflection} onChange={(e) => setReflection(e.target.value)} />
          <p className="note">{t.revealNote}</p>
          <div>
            <button className="btn" onClick={submit} disabled={reflection.trim().length < 10}>{t.submitReflection}</button>
          </div>
        </div>
      )}

      {opt && submitted && (
        <>
          <div className="my-reflection">
            <span>{t.yourReflection}</span>
            <p>{reflection.trim()}</p>
          </div>

          <div className={`verdict fit-${opt.fit}`} aria-live="polite">
            <strong>{t.fit[opt.fit]}</strong>
            <p>{opt.feedback[lang]}</p>
          </div>

          <CoachBox
            key={`${sc.id}-${opt.id}-${entryId.current}`}
            buttonLabel={t.getDebrief}
            buildRequest={() => ({ mode: "debrief", scenarioId: sc.id, optionId: opt.id, reflection })}
            onResult={(text) => entryId.current && updateEntry(entryId.current, { text })}
          />

          <button className="linkish" onClick={reset}>{t.tryAnother}</button>
        </>
      )}
    </section>
  );
}
