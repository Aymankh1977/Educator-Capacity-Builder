import fs from "node:fs";
import path from "node:path";
import Markdown from "@/components/Markdown";
import rationale from "@/content/rationale.json";
import requirements from "@/content/design-requirements.json";
import conjectures from "@/content/conjecture-map.json";
import principles from "@/content/design-principles.json";
import register from "@/content/citation-register.json";

// Design rationale (v3 brief, A8): English only, for supervisors, examiners and research collaborators.
// Linked from the footer, not the main navigation.
export const metadata = { title: "Design rationale · REAL-AI Educator Studio" };

function readIterationLog() {
  return fs.readFileSync(path.join(process.cwd(), "research", "iteration-log.md"), "utf8");
}

const SECTIONS = [
  ["purpose", "Purpose and the causal chain"],
  ["commitments", "Philosophical commitments"],
  ["requirements", "Design requirements"],
  ["conjecture-map", "Conjecture map"],
  ["principles", "Design principles"],
  ["iteration-log", "Iteration log"],
  ["limitations", "Limitations"],
  ["references", "References"],
];

export default function Rationale() {
  const log = readIterationLog();
  // References: only register sources actually cited somewhere on this page.
  const pageText = JSON.stringify([rationale, requirements, conjectures, principles]) + log;
  const cited = register.sources
    .filter((s) => pageText.includes(s.match))
    .sort((a, b) => a.short.localeCompare(b.short));
  const p = rationale.purpose;

  return (
    <article className="page rationale" lang="en" dir="ltr">
      <h1>Design rationale</h1>
      <p className="lede">
        For supervisors, examiners and research collaborators. Thesis: <em>{rationale.thesis}</em>.
        This is Iteration 0 (content version {rationale.version}); every element is a draft for review.
      </p>
      <nav className="toc" aria-label="Contents">
        <ol>{SECTIONS.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol>
      </nav>

      <section id="purpose">
        <h2>1. Purpose and the causal chain</h2>
        <p>{p.intro}</p>
        <ol className="chain">
          {p.chain.map((c) => <li key={c.label}><strong>{c.label}.</strong> {c.text}</li>)}
        </ol>
        <p className="callout"><strong>Consequence for design:</strong> {p.consequence}</p>
        <h3>Unit of analysis</h3>
        <p>{p.unitOfAnalysis.intro}</p>
        <ul>{p.unitOfAnalysis.levels.map((l) => <li key={l.label}><strong>{l.label}:</strong> {l.text}</li>)}</ul>
        <p>{p.unitOfAnalysis.closing}</p>
        <h3>Place in the design-based research programme</h3>
        <ul>{p.placement.map((l) => <li key={l.label}><strong>{l.label}:</strong> {l.text}</li>)}</ul>
      </section>

      <section id="commitments">
        <h2>2. Philosophical commitments</h2>
        <p className="note">{rationale.stepLegend}</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Commitment</th><th>Source</th><th>Design consequence in the platform</th></tr></thead>
            <tbody>
              {rationale.commitments.map((c) => (
                <tr key={c.commitment}><td>{c.commitment}</td><td>{c.source}</td><td>{c.consequence}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="requirements">
        <h2>3. Design requirements</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Finding</th><th>Source</th><th>Design requirement</th></tr></thead>
            <tbody>
              {requirements.requirements.map((r) => (
                <tr key={r.id}><td>{r.id}</td><td>{r.finding}</td><td>{r.source}</td><td>{r.requirement}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="conjecture-map">
        <h2>4. Conjecture map ({conjectures.iteration})</h2>
        <p className="note">{conjectures.note}</p>
        <div className="cmap" role="group" aria-label="Conjecture map">
          <div className="cmap-col">
            <h3>High-level conjecture</h3>
            <p>{conjectures.highLevel}</p>
          </div>
          <div className="cmap-arrow" aria-hidden="true">→</div>
          <div className="cmap-col">
            <h3>Embodiment</h3>
            <ul>{conjectures.embodiment.map((e) => <li key={e.id}><strong>{e.id}</strong> {e.text}</li>)}</ul>
          </div>
          <div className="cmap-arrow" aria-hidden="true">→</div>
          <div className="cmap-col">
            <h3>Mediating processes</h3>
            <ul>{conjectures.mediating.map((e) => <li key={e.id}><strong>{e.id}</strong> {e.text}</li>)}</ul>
          </div>
          <div className="cmap-arrow" aria-hidden="true">→</div>
          <div className="cmap-col">
            <h3>Outcomes</h3>
            <ul>{conjectures.outcomes.map((e) => <li key={e.id}><strong>{e.id}</strong> {e.text}</li>)}</ul>
            <p className="note">{conjectures.outcomesNote}</p>
          </div>
        </div>
        <p><strong>Conjectures to test.</strong> {conjectures.conjectures}</p>
      </section>

      <section id="principles">
        <h2>5. Design principles</h2>
        <p className="note">{principles.note}</p>
        <ol className="dp-list">
          {principles.principles.map((d) => (
            <li key={d.id}>
              <h3>{d.id} {d.title}</h3>
              <p>{d.statement}</p>
              <p className="note">{d.rationale}</p>
              <p className="dp-meta">
                Provenance: {d.provenance.map((pr) => pr.ref).join("; ")} · Status: {d.statusNote} · Version {d.version}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="iteration-log" className="md">
        <h2>6. Iteration log</h2>
        <Markdown source={log} />
      </section>

      <section id="limitations">
        <h2>7. Limitations</h2>
        <ul>{rationale.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
      </section>

      <section id="references">
        <h2>8. References</h2>
        <p className="note">
          Sources from the citation register that are cited on this page, author–date (Manchester-Harvard).
          Sources marked V were added in the v3 brief and must be verified before any thesis use. {register.fullReferences}
        </p>
        <ul className="refs">
          {cited.map((s) => (
            <li key={s.short}>
              {s.short}{s.detail ? `: ${s.detail}` : ""}.
              {s.status === "V" && <span className="verify"> [V: verify before thesis use]</span>}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
