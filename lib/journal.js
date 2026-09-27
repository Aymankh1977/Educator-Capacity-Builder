// "My record": development plans and scenario reflections kept in this browser only.
const KEY = "realai_journal";
const MAX = 100;

export function loadJournal() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function save(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch {}
}

export function addEntry(entry) {
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  save([{ id, ts: new Date().toISOString(), ...entry }, ...loadJournal()]);
  return id;
}

export function updateEntry(id, patch) {
  save(loadJournal().map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

export function clearJournal() {
  try { localStorage.removeItem(KEY); } catch {}
}
