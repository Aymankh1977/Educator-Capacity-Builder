"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import RealMark from "@/components/RealMark";
import { PILLARS } from "@/lib/realai";

// Illustrative fill for the hero only, not anyone's score.
const DEMO = { R: 72, E: 48, A: 86, L: 38 };

export default function Home() {
  const { lang, t } = useLang();
  const [fills, setFills] = useState(null);
  useEffect(() => { const id = setTimeout(() => setFills(DEMO), 150); return () => clearTimeout(id); }, []);

  return (
    <>
      <section className="hero">
        <RealMark fills={fills} label="REAL-AI" />
        <p className="caption">{t.heroCaption}</p>
        <h1>{t.heroTitle}</h1>
        <p className="lede">{t.heroSub}</p>
        <div className="actions">
          <Link className="btn" href="/readiness">{t.startCheck}</Link>
          <Link className="btn btn-quiet" href="/scenarios">{t.tryScenarios}</Link>
        </div>
      </section>

      <section className="pillars" aria-label="REAL-AI">
        {PILLARS.map((p) => (
          <div key={p.key} className="pillar" style={{ "--c": p.color }}>
            <span className="pillar-key" dir="ltr">{p.key}</span>
            <div>
              <h2>{p.name[lang]}</h2>
              <p>{p.desc[lang]}</p>
              {p.definitionStatus === "working" && <p className="working-def">{t.workingDefinition}</p>}
            </div>
          </div>
        ))}
      </section>

      <ol className="steps">
        <li>
          <h2>{t.step1Title}</h2>
          <p>{t.step1Body}</p>
        </li>
        <li>
          <h2>{t.step2Title}</h2>
          <p>{t.step2Body}</p>
        </li>
      </ol>
    </>
  );
}
