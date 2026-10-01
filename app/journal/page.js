"use client";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { loadJournal, clearJournal, addEntry, updateEntry } from "@/lib/journal";
import { PILLARS, IC_PILLARS, findScenario, pillarByKey } from "@/lib/realai";

// Practice log (DP2, "enactment over documentation"): a practice change moves Planned → Enacted → Reviewed.
// No certificates, badges, completion percentages or evidence packs.
const EVIDENCE_TYPES = ["artefact", "observation", "feedback", "none"];

function Paragraphs({ text }) {
  return text.split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>);
}

const practiceStatus = (e) => (e.consequence ? "reviewed" : e.enactment ? "enacted" : "planned");
const now = () => new Date().toISOString();

function Field({ label, value, onChange, multiline = true, type = "text", required }) {
  return (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      {multiline
        ? <textarea rows={3} maxLength={1500} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input type={type} maxLength={200} value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function StepForm({ fields, initial, onSave, onCancel, t, canSave }) {
  const [data, setData] = useState(initial);
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  return (
    <div className="step-form no-print">
      {fields(data, set)}
      <div className="actions">
        <button className="btn" disabled={!canSave(data)} onClick={() => onSave(data)}>{t.save}</button>
        {onCancel && <button className="btn btn-quiet" onClick={onCancel}>{t.cancel}</button>}
      </div>
    </div>
  );
}

function PillarSelect({ value, onChange, t, lang }) {
  return (
    <label className="field">
      <span>{t.intentionPillar} *</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{t.choosePillar}</option>
        {PILLARS.map((p) => <option key={p.key} value={p.key}>{p.key} · {p.name[lang]}</option>)}
      </select>
    </label>
  );
}

function StatusTrack({ status, t }) {
  const order = ["planned", "enacted", "reviewed"];
  const reached = order.indexOf(status);
  return (
    <p className="status-track" aria-label={`${t.whyStatus}: ${t.practiceStatus[status]}`}>
      {order.map((s, i) => (
        <span key={s} className={i <= reached ? "on" : ""}>
          {t.practiceStatus[s]}{i < order.length - 1 ? <span className="arrow" aria-hidden="true"> → </span> : null}
        </span>
      ))}
    </p>
  );
}

function PracticeEntry({ e, t, lang, date, onChange }) {
  const [editing, setEditing] = useState(null);
  const status = practiceStatus(e);
  const p = pillarByKey(e.intention.pillar);
  const save = (patch) => { updateEntry(e.id, patch); setEditing(null); onChange(); };
  const dir = e.lang === "ar" ? "rtl" : "ltr";

  return (
    <article className="entry" style={{ "--c": p?.color }}>
      <header>
        <strong>{p && <span className="tag" dir="ltr">{p.key}</span>} {t.kindPractice}</strong>
        <time dateTime={e.ts}>{date(e.ts)}</time>
      </header>
      <StatusTrack status={status} t={t} />
      {status === "planned" && <p className="not-evidence">{t.planNotEvidence}</p>}

      <h3>1. {t.stepIntention}</h3>
      <div lang={e.lang} dir={dir}>
        <p>{e.intention.what}</p>
        {p && <p className="note"><strong>{t.intentionPillar}</strong> {p.name[lang]}</p>}
        {e.intention.why && <p className="note"><strong>{t.intentionWhy}</strong> {e.intention.why}</p>}
      </div>

      <h3>2. {t.stepEnactment}</h3>
      {e.enactment ? (
        <div lang={e.lang} dir={dir}>
          <p>{e.enactment.what}</p>
          {e.enactment.when && <p className="note"><strong>{t.enactWhen}</strong> <span dir="ltr">{e.enactment.when}</span></p>}
          {e.enactment.who && <p className="note"><strong>{t.enactWho}</strong> {e.enactment.who}</p>}
        </div>
      ) : editing === "enactment" ? (
        <StepForm t={t} initial={{ what: "", when: "", who: "" }} canSave={(d) => d.what.trim()}
          onCancel={() => setEditing(null)} onSave={(d) => save({ enactment: { ...d, ts: now() } })}
          fields={(d, set) => (<>
            <Field label={t.enactWhat} value={d.what} onChange={set("what")} required />
            <Field label={t.enactWhen} value={d.when} onChange={set("when")} multiline={false} type="date" />
            <Field label={t.enactWho} value={d.who} onChange={set("who")} multiline={false} />
          </>)} />
      ) : (
        <button className="linkish no-print" onClick={() => setEditing("enactment")}>{t.recordEnactment}</button>
      )}

      {e.enactment && (<>
        <h3>3. {t.stepConsequence}</h3>
        {e.consequence ? (
          <div lang={e.lang} dir={dir}>
            <p>{e.consequence.what}</p>
            {e.consequence.withoutAI && <p className="note"><strong>{t.consWithout}</strong> {e.consequence.withoutAI}</p>}
            {e.consequence.change && <p className="note"><strong>{t.consChange}</strong> {e.consequence.change}</p>}
          </div>
        ) : editing === "consequence" ? (
          <StepForm t={t} initial={{ what: "", withoutAI: "", change: "" }} canSave={(d) => d.what.trim()}
            onCancel={() => setEditing(null)} onSave={(d) => save({ consequence: { ...d, ts: now() } })}
            fields={(d, set) => (<>
              <Field label={t.consWhat} value={d.what} onChange={set("what")} required />
              <Field label={t.consWithout} value={d.withoutAI} onChange={set("withoutAI")} />
              <Field label={t.consChange} value={d.change} onChange={set("change")} />
            </>)} />
        ) : (
          <button className="linkish no-print" onClick={() => setEditing("consequence")}>{t.recordConsequence}</button>
        )}
      </>)}

      {e.consequence && (<>
        <h3>4. {t.stepEvidence}</h3>
        {e.evidence ? (
          <p>{t.evidence[e.evidence.type]}</p>
        ) : (
          <StepForm t={t} initial={{ type: "" }} canSave={(d) => d.type}
            onSave={(d) => save({ evidence: { ...d, ts: now() } })}
            fields={(d, set) => (
              <fieldset className="evidence-options">
                <legend>{t.stepEvidence}</legend>
                {EVIDENCE_TYPES.map((k) => (
                  <label key={k}>
                    <input type="radio" name={`ev-${e.id}`} checked={d.type === k} onChange={() => set("type")(k)} /> {t.evidence[k]}
                  </label>
                ))}
              </fieldset>
            )} />
        )}
      </>)}
    </article>
  );
}

function PlanEntry({ e, t, lang, date }) {
  return (
    <article className="entry">
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
      {e.institutional && (
        <dl className="entry-scores">
          {IC_PILLARS.map((p) => (
            <div key={p.id} style={{ "--c": p.color }}>
              <dt>{t.institutionalResultTitle}: {p.name[lang]}</dt>
              <dd dir="ltr">{e.institutional[p.id]?.toFixed(1)}</dd>
            </div>
          ))}
          {e.decoupling && (
            <div style={{ "--c": "#56676b" }}>
              <dt>{t.decouplingTitle}</dt>
              <dd dir="ltr">{e.decoupling}</dd>
            </div>
          )}
        </dl>
      )}
      <p className="ai-disclosure">{t.aiDisclosure(e.model || t.modelNotRecorded)}</p>
      <div className="entry-text" lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>
        <Paragraphs text={e.text} />
      </div>
      <Rating e={e} t={t} />
    </article>
  );
}

function Rating({ e, t }) {
  if (!e.rating) return null;
  return (
    <p className="note">
      <strong>{t.yourRating}:</strong> {t.ratingLabel[e.rating.value]}
      {e.rating.why ? ` — ${e.rating.why}` : ""}
    </p>
  );
}

function ReflectionEntry({ e, t, lang, date }) {
  const sc = findScenario(e.scenarioId);
  const opt = sc?.options.find((o) => o.id === e.optionId);
  if (!sc || !opt) return null;
  const p = pillarByKey(sc.pillar);
  return (
    <article className="entry" style={{ "--c": p.color }}>
      <header>
        <strong><span className="tag" dir="ltr">{p.key}</span> {sc.title[lang]}</strong>
        <time dateTime={e.ts}>{date(e.ts)}</time>
      </header>
      <h3>{t.yourChoice}</h3>
      <p>{opt.text[lang]} <em className={`fit-label fit-${opt.fit}`}>({t.fit[opt.fit]})</em></p>
      <h3>{t.yourReflection}</h3>
      {e.prompt && <p className="note" lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>{e.prompt}</p>}
      <p lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>{e.reflection}</p>
      {e.text && (
        <>
          <h3>{t.coachFeedback}</h3>
          <p className="ai-disclosure">{t.aiDisclosure(e.model || t.modelNotRecorded)}</p>
          <div className="entry-text" lang={e.lang} dir={e.lang === "ar" ? "rtl" : "ltr"}>
            <Paragraphs text={e.text} />
          </div>
          <Rating e={e} t={t} />
        </>
      )}
    </article>
  );
}

export default function Journal() {
  const { lang, t } = useLang();
  const [entries, setEntries] = useState(null);
  const [adding, setAdding] = useState(false);
  const reload = () => setEntries(loadJournal());

  useEffect(() => { reload(); }, []);

  function clearAll() {
    if (!window.confirm(t.confirmClear)) return;
    clearJournal();
    setEntries([]);
  }

  const date = (iso) =>
    new Date(iso).toLocaleString(lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB", { dateStyle: "medium", timeStyle: "short" });

  const practice = entries?.filter((e) => e.kind === "practice") || [];
  const plans = entries?.filter((e) => e.kind === "plan") || [];
  const reflections = entries?.filter((e) => e.kind === "reflection") || [];

  return (
    <section className="page">
      <p className="print-only print-header">{t.printHeader}</p>
      <h1>{t.journalTitle}</h1>
      <p className="lede">{t.journalIntro}</p>

      {entries && entries.length > 0 && (
        <div className="actions no-print">
          <button className="btn btn-quiet" onClick={() => window.print()}>{t.print}</button>
          <button className="btn btn-quiet" onClick={clearAll}>{t.clearAll}</button>
        </div>
      )}

      <h2 className="result-title">{t.practiceChanges}</h2>
      <p className="note">{t.practiceChangesIntro}</p>
      {!adding && <p className="no-print"><button className="btn" onClick={() => setAdding(true)}>{t.addPractice}</button></p>}
      {adding && (
        <div className="entry">
          <h3>1. {t.stepIntention}</h3>
          <StepForm t={t} initial={{ what: "", pillar: "", why: "" }} canSave={(d) => d.what.trim() && d.pillar}
            onCancel={() => setAdding(false)}
            onSave={(d) => { addEntry({ kind: "practice", lang, intention: { ...d, ts: now() } }); setAdding(false); reload(); }}
            fields={(d, set) => (<>
              <Field label={t.intentionWhat} value={d.what} onChange={set("what")} required />
              <PillarSelect value={d.pillar} onChange={set("pillar")} t={t} lang={lang} />
              <Field label={t.intentionWhy} value={d.why} onChange={set("why")} />
            </>)} />
        </div>
      )}
      <div className="journal">
        {practice.map((e) => <PracticeEntry key={e.id} e={e} t={t} lang={lang} date={date} onChange={reload} />)}
      </div>

      {plans.length > 0 && (<>
        <h2 className="result-title">{t.devPlans}</h2>
        <div className="journal">{plans.map((e) => <PlanEntry key={e.id} e={e} t={t} lang={lang} date={date} />)}</div>
      </>)}

      {reflections.length > 0 && (<>
        <h2 className="result-title">{t.scenarioReflections}</h2>
        <div className="journal">{reflections.map((e) => <ReflectionEntry key={e.id} e={e} t={t} lang={lang} date={date} />)}</div>
      </>)}

      {entries && plans.length === 0 && reflections.length === 0 && practice.length === 0 && !adding && (
        <p className="note">{t.journalEmpty}</p>
      )}
    </section>
  );
}
