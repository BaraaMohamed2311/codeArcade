export interface ProgressEntry {
  solved: number;
  lastSolved?: string; // ISO date
}

const KEY = "codearcade-progress-v1";

export function getAllProgress(): Record<string, ProgressEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getProgress(slug: string): ProgressEntry {
  const all = getAllProgress();
  return all[slug] || { solved: 0 };
}

export function recordSolve(slug: string): ProgressEntry {
  const all = getAllProgress();
  const entry = all[slug] || { solved: 0 };
  entry.solved += 1;
  entry.lastSolved = new Date().toISOString();
  all[slug] = entry;
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return entry;
}

export function totalSolves(): number {
  const all = getAllProgress();
  return Object.values(all).reduce((sum, e) => sum + e.solved, 0);
}

export function xpForSolves(solves: number): number {
  return solves * 25;
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  // simple curve: level n needs n*100 xp cumulative
  let level = 1;
  let remaining = xp;
  let need = 100;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = level * 100;
  }
  return { level, into: remaining, need };
}
