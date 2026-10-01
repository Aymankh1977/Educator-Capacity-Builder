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
        <p className="accreditation-link"><Link href="/accreditation">{t.accreditationLink}</Link></p>
      </section>

      <ol className="steps">
        <li><h2><Link href="/readiness">{t.step1Title}</Link></h2></li>
        <li><h2><Link href="/scenarios">{t.step2Title}</Link></h2></li>
        <li><h2><Link href="/journal">{t.step3Title}</Link></h2></li>
      </ol>
    </>
  );
}
