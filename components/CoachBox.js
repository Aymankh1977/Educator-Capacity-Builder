"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";

// Sends a request to /api/coach and shows the reply. Asks for an access code if the server requires one.
// onResult(text) lets the page save the reply to "My record".
export default function CoachBox({ buildRequest, buttonLabel, disabled, onResult }) {
  const { lang, t } = useLang();
  const [state, setState] = useState("idle"); // idle | loading | done | code | error | limited
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setState("done");
      onResult?.(data.text);
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
          <div className="coach-reply" aria-live="polite">
            {text.split(/\n+/).filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          </div>
          <div className="coach-tools no-print">
            <button className="linkish" onClick={copyText}>{copied ? t.copied : t.copy}</button>
            {onResult && <Link href="/journal">{t.savedToRecord}</Link>}
          </div>
        </>
      )}
    </div>
  );
}
