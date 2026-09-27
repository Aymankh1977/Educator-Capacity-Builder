"use client";
import { PILLARS } from "@/lib/realai";

// The four letters of REAL, each filled from the base in proportion to its pillar score (0–100).
export default function RealMark({ fills, size = "lg", label }) {
  return (
    <div className={`realmark realmark-${size}`} dir="ltr" role="img" aria-label={label}>
      {PILLARS.map((p) => (
        <span
          key={p.key}
          className="rm-letter"
          style={{ "--c": p.color, "--fill": `${fills?.[p.key] ?? 0}%` }}
          aria-hidden="true"
        >
          {p.key}
        </span>
      ))}
    </div>
  );
}
