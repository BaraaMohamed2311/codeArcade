import { execSync } from "child_process";
import { writeFileSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { PROBLEMS, Lang } from "../lib/problems";
import { buildSource } from "../lib/harness";

function runJS(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), "ca-js-"));
  const file = join(dir, "main.js");
  writeFileSync(file, source);
  return execSync(`node ${file}`, { encoding: "utf8" });
}

function runPY(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), "ca-py-"));
  const file = join(dir, "main.py");
  writeFileSync(file, source);
  return execSync(`python3 -I ${file}`, { encoding: "utf8" });
}

function runGO(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), "ca-go-"));
  const file = join(dir, "main.go");
  writeFileSync(file, source);
  return execSync(`cd ${dir} && go run main.go`, { encoding: "utf8" });
}

let anyFail = false;

for (const problem of PROBLEMS) {
  for (const lang of ["javascript", "python", "go"] as Lang[]) {
    const src = buildSource(problem, lang, problem.solution[lang]);
    let out = "";
    try {
      if (lang === "javascript") out = runJS(src);
      else if (lang === "python") out = runPY(src);
      else out = runGO(src);
    } catch (e: any) {
      console.log(`FAIL [${problem.slug}/${lang}] RUNTIME/COMPILE ERROR:`);
      console.log(e.stdout || e.message);
      console.log(e.stderr || "");
      anyFail = true;
      continue;
    }
    const marker = "__RESULTS__";
    const idx = out.indexOf(marker);
    if (idx === -1) {
      console.log(`FAIL [${problem.slug}/${lang}] no results marker. Output:\n${out}`);
      anyFail = true;
      continue;
    }
    const json = out.slice(idx + marker.length).trim().split("\n")[0];
    const results = JSON.parse(json);
    const allPass = results.every((r: any) => r.pass);
    if (!allPass) {
      console.log(`FAIL [${problem.slug}/${lang}]`, JSON.stringify(results));
      anyFail = true;
    } else {
      console.log(`OK   [${problem.slug}/${lang}]`);
    }
  }
}

if (anyFail) {
  console.log("\nSOME TESTS FAILED");
  process.exit(1);
} else {
  console.log("\nALL GOOD");
}
