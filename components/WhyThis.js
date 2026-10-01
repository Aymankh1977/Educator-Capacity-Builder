"use client";
import { useLang } from "./LangProvider";

// "Why this?": shows where a piece of content comes from, its validation status and its version (DP4, DP6).
// Pass the content objects the panel describes; their provenance entries are merged and de-duplicated.
export function mergeProvenance(objects) {
  const seen = new Set();
  const out = [];
  for (const o of objects) {
    for (const p of o?.provenance || []) {
      const k = `${p.type}|${p.ref}|${p.note?.en ?? p.note}`;
      if (!seen.has(k)) {
        seen.add(k);
        out.push(p);
      }
    }
  }
  return out;
}

export default function WhyThis({ objects }) {
  const { lang, t } = useLang();
  const list = Array.isArray(objects) ? objects : [objects];
  const provenance = mergeProvenance(list);
  const status = list[0]?.status || "draft";
  const versions = [...new Set(list.map((o) => o?.version).filter(Boolean))];

  const refLabel = (ref) => (/^DR\d+$/.test(ref) ? `${t.designRequirement} ${ref}` : ref);

  return (
    <details className="why no-print">
      <summary>{t.whyThis}</summary>
      <div className="why-body">
        <h3>{t.whyFrom}</h3>
        <ul>
          {provenance.map((p, i) => (
            <li key={i}>
              {typeof p.note === "string" ? p.note : p.note?.[lang]}
              <small>
                {t.provType[p.type] || p.type}
                {p.ref ? ` · ${refLabel(p.ref)}` : ""}
                {p.table1Id ? ` · ${t.table1}: ${p.table1Id}` : ""}
              </small>
            </li>
          ))}
        </ul>
        <p>
          <strong>{t.whyStatus}:</strong> {t.statusLabel[status] || status}. {t.statusExplain[status]}
        </p>
        <p>
          <strong>{t.whyVersion}:</strong> <span dir="ltr">{versions.join(", ")}</span>
        </p>
      </div>
    </details>
  );
}
