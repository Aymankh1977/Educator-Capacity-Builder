"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { updateEntry } from "@/lib/journal";

const RATINGS = ["useful", "partly", "not_useful"];

// Sends a request to /api/coach and shows the reply. Asks for an access code if the server requires one.
// onResult(text, model) lets the page save the reply to the practice log; it returns the entry id,
// which is where the "How useful was this?" rating is stored (future research data on mediating process M3).
export default function CoachBox({ buildRequest, buttonLabel, disabled, onResult }) {
  const { lang, t } = useLang();
  const [state, setState] = useState("idle"); // idle | loading | done | code | error | limited
  const [text, setText] = useState("");
  const [model, setModel] = useState("");
  const [entryId, setEntryId] = useState(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState("");
  const [why, setWhy] = useState("");
  const [rated, setRated] = useState(false);

  async function run(codeOverride) {
    setState("loading");
    let stored = "";
    try { stored = localStorage.getItem("realai_code") || ""; } catch {}
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-access-code": codeOverride ?? stored },
        body: JSON.stringify({ ...buildRequest(), lang }),
      });
      if (res.status === 401) {
        setCodeError(Boolean(codeOverride));
        setState("code");
        return;
      }
      if (res.status === 429) {
        setState("limited");
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || "error");
      setText(data.text);
      setModel(data.model || "");
      setState("done");
      const id = onResult?.(data.text, data.model || "");
      if (id) setEntryId(id);
    } catch {
      setState("error");
    }
  }

  function saveCode(e) {
    e.preventDefault();
    const c = code.trim();
    if (!c) return;
    try { localStorage.setItem("realai_code", c); } catch {}
    run(c);
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function saveRating() {
    if (!rating || !entryId) return;
    updateEntry(entryId, { rating: { value: rating, why: why.trim().slice(0, 140), ts: new Date().toISOString() } });
    setRated(true);
  }

  return (
    <div className="coach">
      {state !== "code" && state !== "done" && (
        <button className="btn" onClick={() => run()} disabled={disabled || state === "loading"}>
          {state === "loading" ? t.coachLoading : buttonLabel}
        </button>
      )}

      {state === "code" && (
        <form className="codeform" onSubmit={saveCode}>
          <p>{t.codeNeeded}</p>
          <label>
            <span>{t.codeLabel}</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} dir="ltr" autoComplete="off" />
          </label>
          {codeError && <p className="err" role="alert">{t.badCode}</p>}
          <button className="btn" type="submit">{t.saveCode}</button>
        </form>
      )}

      {state === "error" && <p className="err" role="alert">{t.coachError}</p>}
      {state === "limited" && <p className="err" role="alert">{t.rateLimited}</p>}

      {state === "done" && (
        <>
          <p className="ai-disclosure">{t.aiDisclosure(model || t.modelNotRecorded)}</p>
          <div className="coach-reply" aria-live="polite">
            {text.split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="coach-tools no-print">
            <button className="linkish" onClick={copyText}>{copied ? t.copied : t.copy}</button>
            {onResult && <Link href="/journal">{t.savedToRecord}</Link>}
          </div>
          {entryId && (rated ? (
            <p className="note no-print">{t.ratingSaved}</p>
          ) : (
            <fieldset className="rating no-print">
              <legend>{t.usefulQ}</legend>
              <div className="rating-options">
                {RATINGS.map((r) => (
                  <label key={r} className={rating === r ? "on" : ""}>
                    <input type="radio" name={`rating-${entryId}`} checked={rating === r} onChange={() => setRating(r)} />
                    {t.ratingLabel[r]}
                  </label>
                ))}
              </div>
              <label className="field">
                <span>{t.ratingWhy}</span>
                <input value={why} onChange={(e) => setWhy(e.target.value)} maxLength={140} />
              </label>
              <div>
                <button className="btn btn-quiet" disabled={!rating} onClick={saveRating}>{t.saveRating}</button>
              </div>
            </fieldset>
          ))}
        </>
      )}
    </div>
  );
}
