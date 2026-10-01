// Minimal Markdown renderer for the research documents shown on /rationale:
// headings, bullet lists, paragraphs, **bold**, *italic* and `code`. Top-level "# " headings are skipped,
// because the page supplies its own section heading.
function inline(text, keyBase) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/).map((part, i) => {
    const k = `${keyBase}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={k}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={k}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={k}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function Markdown({ source }) {
  const blocks = [];
  let list = null;
  let para = [];
  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "ul", items: list });
    list = null;
  };
  for (const raw of source.split("\n")) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara(); flushList();
      blocks.push({ type: "h", level: h[1].length, text: h[2] });
    } else if (/^-\s+/.test(line)) {
      flushPara();
      (list ||= []).push(line.replace(/^-\s+/, ""));
    } else if (line.trim() === "") {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara(); flushList();

  return blocks.map((b, i) => {
    if (b.type === "h") {
      if (b.level === 1) return null;
      const Tag = b.level === 2 ? "h3" : "h4";
      return <Tag key={i}>{inline(b.text, i)}</Tag>;
    }
    if (b.type === "ul") return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it, `${i}-${j}`)}</li>)}</ul>;
    return <p key={i}>{inline(b.text, i)}</p>;
  });
}
