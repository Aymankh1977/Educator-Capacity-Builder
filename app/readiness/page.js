"use client";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import RealMark from "@/components/RealMark";
import CoachBox from "@/components/CoachBox";
import { ITEMS, PILLARS, pillarMeans, toPct } from "@/lib/realai";
import { addEntry } from "@/lib/journal";

const KEY = "realai_readiness";

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

  const answered = Object.keys(answers).length;
  const complete = answered === ITEMS.length;
  const means = useMemo(() => pillarMeans(answers), [answers]);

  useEffect(() => {
    if (!showProfile) return;
    setFills(null);
    const id = setTimeout(() => setFills(Object.fromEntries(PILLARS.map((p) => [p.key, toPct(means[p.key])]))), 120);
    return () => clearTimeout(id);
  }, [showProfile, means]);

  const roundedMeans = () => Object.fromEntries(PILLARS.map((p) => [p.key, Number(means[p.key].toFixed(2))]));

  function downloadCsv() {
    const header = ["participant", "timestamp", "lang", ...PILLARS.map((p) => `mean_${p.key}`), ...ITEMS.map((i) => i.id)];
    const row = [
      participant.replace(/[",\n]/g, " "),
      new Date().toISOString(),
      lang,
      ...PILLARS.map((p) => means[p.key].toFixed(2)),
      ...ITEMS.map((i) => answers[i.id]),
    ];
    const blob = new Blob([header.join(",") + "\n" + row.join(",") + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `realai-readiness-${participant || "anon"}-${new Date().toISOString().slice(0, 10)}.csv`;
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
        <RealMark fills={fills} label={t.profileTitle} />
        <dl className="scores">
          {PILLARS.map((p) => (
            <div key={p.key} style={{ "--c": p.color }}>
              <dt>{p.name[lang]}</dt>
              <dd><strong dir="ltr">{means[p.key].toFixed(1)}</strong> {t.outOf5}</dd>
            </div>
          ))}
        </dl>

        <CoachBox
          buttonLabel={t.getPlan}
          buildRequest={() => ({ mode: "plan", scores: roundedMeans() })}
          onResult={(text) => addEntry({ kind: "plan", scores: roundedMeans(), text, lang })}
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

      {PILLARS.map((p) => (
        <div key={p.key} className="item-group" style={{ "--c": p.color }}>
          <h2><span dir="ltr" className="tag">{p.key}</span> {p.name[lang]}</h2>
          {ITEMS.filter((i) => i.pillar === p.key).map((item) => (
            <fieldset key={item.id} className="item">
              <legend>{item[lang]}</legend>
              <div className="scale" role="radiogroup">
                {[1, 2, 3, 4, 5].map((v) => (
                  <label key={v} className={answers[item.id] === v ? "on" : ""} title={t.scale[v - 1]}>
                    <input
                      type="radio"
                      name={item.id}
                      value={v}
                      checked={answers[item.id] === v}
                      onChange={() => setAnswers((a) => ({ ...a, [item.id]: v }))}
                    />
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
          ))}
        </div>
      ))}

      <div className="submitbar">
        <span>{t.progress(answered, ITEMS.length)}</span>
        <button className="btn" disabled={!complete} onClick={() => { setShowProfile(true); window.scrollTo({ top: 0 }); }}>
          {t.seeProfile}
        </button>
      </div>
    </section>
  );
}
