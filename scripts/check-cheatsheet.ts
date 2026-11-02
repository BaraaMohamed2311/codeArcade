import { PROBLEMS } from "../lib/problems";
import { PATTERNS, TWIST_DRILLS } from "../lib/cheatsheet";

// Every problem must appear in the cheat sheet, and every cheat-sheet entry
// must point at a real problem. Run with: npx tsx scripts/check-cheatsheet.ts
const used = new Set<string>();
let bad = false;
for (const pat of PATTERNS) {
  for (const u of pat.usedBy) {
    used.add(u.slug);
    if (!PROBLEMS.find((p) => p.slug === u.slug)) {
      console.log(`BAD  cheat sheet entry "${u.slug}" in "${pat.id}" has no matching problem`);
      bad = true;
    }
  }
}
for (const p of PROBLEMS) {
  if (!used.has(p.slug)) {
    console.log(`MISSING  "${p.slug}" is not in the cheat sheet`);
    bad = true;
  }
}
for (const d of TWIST_DRILLS) {
  if (!PATTERNS.find((p) => p.id === d.patternId)) {
    console.log(`BAD  twist drill "${d.twist}" points at unknown pattern "${d.patternId}"`);
    bad = true;
  }
}
console.log(bad ? "CHEAT SHEET CHECK FAILED" : `CHEAT SHEET OK: ${PROBLEMS.length} problems, ${PATTERNS.length} patterns`);
process.exit(bad ? 1 : 0);
