"use client";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import RealMark from "@/components/RealMark";
import CoachBox from "@/components/CoachBox";
import WhyThis from "@/components/WhyThis";
import {
  ITEMS, PILLARS, PRACTICE_INSTRUMENT,
  IC_ITEMS, IC_PILLARS, INSTITUTIONAL_INSTRUMENT, DECOUPLING_ITEM, PROFILE_ITEMS,
  pillarMeans, institutionalMeans, toPct, shortVersion,
} from "@/lib/realai";
import { addEntry } from "@/lib/journal";

const KEY = "realai_readiness";
const PROBE_COLOR = "#56676b";

// Capacity profile: two separate draft instruments (practice and institutional conditions) plus the decoupling probe.
// The two profiles are never combined into a single score.
function Item({ item, value, onChange, t, lang }) {
  return (
    <fieldset className="item">
      <legend>{item[lang]}</legend>
      <div className="scale" role="radiogroup">
        {[1, 2, 3, 4, 5].map((v) => (
          <label key={v} className={value === v ? "on" : ""} title={t.scale[v - 1]}>
            <input type="radio" name={item.id} value={v} checked={value === v} onChange={() => onChange(item.id, v)} />
            <span className="num">{v}</span>
            <span className="sr">{t.scale[v - 1]}</span>
          </label>
        ))}
      </div>
      <div className="scale-ends" aria-hidden="true">
        <span>{t.scale[0]}</span>
        <span>{t.scale[4]}</span>
      </div>
    </fieldset>
  );
}

export default function Readiness() {
  const { lang, t } = useLang();
  const [answers, setAnswers] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [participant, setParticipant] = useState("");
  const [fills, setFills] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved.answers) setAnswers(saved.answers);
      if (saved.participant) setParticipant(saved.participant);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ answers, participant })); } catch {}
  }, [answers, participant]);

  const answered = PROFILE_ITEMS.filter((i) => answers[i.id]).length;
  const complete = answered === PROFILE_ITEMS.length;
  const means = useMemo(() => pillarMeans(answers), [answers]);
  const icMeans = useMemo(() => institutionalMeans(answers), [answers]);
  const decoupling = answers[DECOUPLING_ITEM.id];

  useEffect(() => {
    if (!showProfile) return;
    setFills(null);
    const id = setTimeout(() => setFills(Object.fromEntries(PILLARS.map((p) => [p.key, toPct(means[p.key])]))), 120);
    return () => clearTimeout(id);
  }, [showProfile, means]);

  const setAnswer = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));
  const round2 = (n) => Number(n.toFixed(2));
  const practiceMeans = () => Object.fromEntries(PILLARS.map((p) => [p.key, round2(means[p.key])]));
  const instMeans = () => Object.fromEntries(IC_PILLARS.map((p) => [p.id, round2(icMeans[p.id])]));

  function downloadCsv() {
    const reversed = IC_ITEMS.filter((i) => i.reverse).map((i) => i.id);
    const header = [
      "participant", "timestamp", "lang",
      "practice_instrument_version", "institutional_instrument_version",
      ...PILLARS.map((p) => `mean_${p.key}`),
      ...IC_PILLARS.map((p) => `mean_IC_${p.id.replace("-", "_")}`),
      "reverse_scored_items",
      ...PROFILE_ITEMS.map((i) => i.id),
    ];
    const row = [
      participant.replace(/[",\n]/g, " "),
      new Date().toISOString(),
      lang,
      PRACTICE_INSTRUMENT.version,
      INSTITUTIONAL_INSTRUMENT.version,
      ...PILLARS.map((p) => means[p.key].toFixed(2)),
      ...IC_PILLARS.map((p) => icMeans[p.id].toFixed(2)),
      reversed.join(";"),
      ...PROFILE_ITEMS.map((i) => answers[i.id]),
    ];
    const blob = new Blob([header.join(",") + "\n" + row.join(",") + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `realai-capacity-profile-${participant || "anon"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function retake() {
    setAnswers({});
    setShowProfile(false);
    window.scrollTo({ top: 0 });
  }

  if (showProfile && complete) {
    return (
      <section className="page">
        <h1>{t.profileTitle}</h1>

        <aside className="howto">
          <h2>{t.howToReadTitle}</h2>
          <p>{t.howToReadBody}</p>
        </aside>

        <h2 className="result-title">{t.practiceResultTitle}</h2>
        <p className="draft-label">{t.draftInstrument(shortVersion(PRACTICE_INSTRUMENT.version))}</p>
        <RealMark fills={fills} label={t.practiceResultTitle} />
        <dl className="scores">
          {PILLARS.map((p) => (
            <div key={p.key} style={{ "--c": p.color }}>
              <dt>{p.name[lang]}</dt>
              <dd><strong dir="ltr">{means[p.key].toFixed(1)}</strong> {t.outOf5}</dd>
            </div>
          ))}
        </dl>

        <h2 className="result-title">{t.institutionalResultTitle}</h2>
        <p className="draft-label">{t.draftInstrument(shortVersion(INSTITUTIONAL_INSTRUMENT.version))}</p>
        <div className="bars">
          {IC_PILLARS.map((p) => (
            <div key={p.id} className="bar-row" style={{ "--c": p.color }}>
              <span className="bar-label">{p.name[lang]}</span>
              <span className="bar" aria-hidden="true"><span style={{ width: `${toPct(icMeans[p.id])}%` }} /></span>
              <span className="bar-value"><strong dir="ltr">{icMeans[p.id].toFixed(1)}</strong> {t.outOf5}</span>
            </div>
          ))}
        </div>

        <h2 className="result-title">{t.decouplingTitle}</h2>
        <div className="probe">
          <p className="probe-item">{DECOUPLING_ITEM[lang]}</p>
          <p><strong dir="ltr">{decoupling}</strong> {t.outOf5}</p>
          <p className="note">{DECOUPLING_ITEM.resultsText[lang]}</p>
        </div>

        <CoachBox
          buttonLabel={t.getPlan}
          buildRequest={() => ({ mode: "plan", practice: practiceMeans(), institutional: instMeans(), decoupling })}
          onResult={(text) => addEntry({
            kind: "plan", scores: practiceMeans(), institutional: instMeans(), decoupling, text, lang,
            instrumentVersions: { practice: PRACTICE_INSTRUMENT.version, institutional: INSTITUTIONAL_INSTRUMENT.version },
          })}
        />

        <div className="research">
          <label>
            <span>{t.participant}</span>
            <input value={participant} onChange={(e) => setParticipant(e.target.value)} dir="ltr" maxLength={40} />
          </label>
          <div className="actions">
            <button className="btn btn-quiet" onClick={downloadCsv}>{t.downloadCsv}</button>
            <button className="btn btn-quiet" onClick={retake}>{t.retake}</button>
          </div>
          <p className="note">{t.privacy}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>{t.navReadiness}</h1>
      <p className="lede">{t.readinessIntro}</p>

      <h2 className="part-title">{t.part1Title}</h2>
      <p className="draft-label">{t.draftInstrument(shortVersion(PRACTICE_INSTRUMENT.version))}</p>
      {PILLARS.map((p) => (
        <div key={p.key} className="item-group" style={{ "--c": p.color }}>
          <h3><span dir="ltr" className="tag">{p.key}</span> {p.name[lang]}</h3>
          <WhyThis objects={ITEMS.filter((i) => i.pillar === p.key)} />
          {ITEMS.filter((i) => i.pillar === p.key).map((item) => (
            <Item key={item.id} item={item} value={answers[item.id]} onChange={setAnswer} t={t} lang={lang} />
          ))}
        </div>
      ))}

      <h2 className="part-title">{t.part2Title}</h2>
      <p className="draft-label">{t.draftInstrument(shortVersion(INSTITUTIONAL_INSTRUMENT.version))}</p>
      <p className="note">{t.part2Intro}</p>
      {IC_PILLARS.map((p) => (
        <div key={p.id} className="item-group" style={{ "--c": p.color }}>
          <h3>{p.name[lang]}</h3>
          <WhyThis objects={[INSTITUTIONAL_INSTRUMENT, p]} />
          {IC_ITEMS.filter((i) => i.pillar === p.id).map((item) => (
            <Item key={item.id} item={item} value={answers[item.id]} onChange={setAnswer} t={t} lang={lang} />
          ))}
        </div>
      ))}
      <div className="item-group" style={{ "--c": PROBE_COLOR }}>
        <h3>{t.decouplingTitle}</h3>
        <WhyThis objects={DECOUPLING_ITEM} />
        <Item item={DECOUPLING_ITEM} value={answers[DECOUPLING_ITEM.id]} onChange={setAnswer} t={t} lang={lang} />
      </div>

      <div className="submitbar">
        <span>{t.progress(answered, PROFILE_ITEMS.length)}</span>
        <button className="btn" disabled={!complete} onClick={() => { setShowProfile(true); window.scrollTo({ top: 0 }); }}>
          {t.seeProfile}
        </button>
      </div>
    </section>
  );
}
