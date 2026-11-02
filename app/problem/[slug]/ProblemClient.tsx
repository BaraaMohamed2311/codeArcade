"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getProblem, Lang } from "../../../lib/problems";
import { getProgress, recordSolve } from "../../../lib/progress";
import { sfx } from "../../../lib/sound";
import CodeEditor from "../../../components/CodeEditor";

const LANGS: { key: Lang; label: string }[] = [
  { key: "javascript", label: "JS" },
  { key: "python", label: "PY" },
  { key: "go", label: "GO" },
];

interface RunResult {
  pass: boolean;
  output?: any;
  error?: string;
}

export default function ProblemClient({ slug }: { slug: string }) {
  const problem = getProblem(slug);
  const [lang, setLang] = useState<Lang>("javascript");
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [consoleMsg, setConsoleMsg] = useState<string>("Ready. Hit RUN to test your code.");
  const [solved, setSolved] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!problem) return;
    setCode(problem.starter[lang]);
    setResults(null);
    setConsoleMsg("Ready. Hit RUN to test your code.");
  }, [lang, problem]);

  useEffect(() => {
    if (!problem) return;
    setSolved(getProgress(problem.slug).solved);
  }, [problem]);

  if (!problem) {
    return (
      <main className="wrap">
        <p>Unknown problem.</p>
        <Link className="back-link" href="/">
          ← back
        </Link>
      </main>
    );
  }

  async function runCode() {
    sfx.run();
    setRunning(true);
    setResults(null);
    setConsoleMsg("Running...");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: problem!.slug, lang, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setConsoleMsg(data.message || "Execution failed.");
        sfx.fail();
        setRunning(false);
        return;
      }
      if (data.compileError) {
        setConsoleMsg(`COMPILE ERROR:\n${data.compileError}`);
        sfx.fail();
        setRunning(false);
        return;
      }
      if (!data.results) {
        setConsoleMsg(
          `${data.message || "No output."}\n\n${data.stdout || ""}\n${data.stderr || ""}`
        );
        sfx.fail();
        setRunning(false);
        return;
      }
      setResults(data.results);
      const allPass = data.results.every((r: RunResult) => r.pass);
      if (allPass) {
        setConsoleMsg(`All ${data.results.length} tests passed!`);
        sfx.pass();
        const entry = recordSolve(problem!.slug);
        setSolved(entry.solved);
        setToast(`+25 XP — solved ${entry.solved}×`);
        setTimeout(() => setToast(null), 2600);
        if (entry.solved % 5 === 0) sfx.levelUp();
      } else {
        const failCount = data.results.filter((r: RunResult) => !r.pass).length;
        setConsoleMsg(`${failCount} of ${data.results.length} tests failed.`);
        sfx.fail();
      }
    } catch (err: any) {
      setConsoleMsg("Could not reach the execution service: " + String(err?.message || err));
      sfx.fail();
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="wrap">
      <Link className="back-link" href="/" onClick={() => sfx.click()}>
        ← back to arcade
      </Link>

      <div className="topbar">
        <h1 style={{ fontSize: 18, color: "var(--neon-cyan)", margin: 0 }}>{problem.title}</h1>
        <span className="solve-count" style={{ marginLeft: 0 }}>
          ★ solved {solved}×
        </span>
      </div>

      <div className="badge-row" style={{ marginBottom: 14 }}>
        <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
        <span className="topic">{problem.topic}</span>
      </div>

      <div className="panel prompt-box" style={{ marginBottom: 18 }}>
        <p style={{ marginTop: 0 }}>{problem.prompt}</p>
        <p style={{ color: "var(--text-dim)", fontSize: 16, marginBottom: 0 }}>
          Pattern: {problem.pattern}
        </p>
      </div>

      <div className="cols">
        <div>
          <div className="lang-tabs">
            {LANGS.map((l) => (
              <button
                key={l.key}
                className={`lang-tab ${lang === l.key ? "active" : ""}`}
                onClick={() => {
                  sfx.click();
                  setLang(l.key);
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <CodeEditor lang={lang} value={code} onChange={setCode} />
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn" onClick={runCode} disabled={running}>
              {running ? "RUNNING..." : "▶ RUN"}
            </button>
            <button
              className="btn pink"
              onClick={() => {
                sfx.click();
                setShowSolution((s) => !s);
              }}
            >
              {showSolution ? "HIDE SOLUTION" : "SHOW SOLUTION"}
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, color: "var(--neon-yellow)", marginBottom: 8 }}>CONSOLE</h3>
          <div className="console">
            <div style={{ marginBottom: 10 }}>{consoleMsg}</div>
            {results &&
              results.map((r, i) => (
                <div className="test-row" key={i}>
                  <span className={r.pass ? "pass-pill" : "fail-pill"}>
                    {r.pass ? "PASS" : "FAIL"}
                  </span>
                  <span>
                    test {i + 1}
                    {r.error ? ` — ${r.error}` : ""}
                    {!r.error && typeof r.output !== "undefined"
                      ? ` — output: ${JSON.stringify(r.output)}`
                      : ""}
                  </span>
                </div>
              ))}
          </div>

          {showSolution && (
            <div className="panel" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 10 }}>
                <span className="complexity-chip">TIME {problem.complexity.time}</span>
                <span className="complexity-chip">SPACE {problem.complexity.space}</span>
              </div>
              <p style={{ fontSize: 18, color: "var(--text)" }}>{problem.explanation}</p>
              <pre
                style={{
                  background: "#06040f",
                  padding: 12,
                  borderRadius: 8,
                  overflowX: "auto",
                  fontSize: 15,
                  fontFamily: "monospace",
                }}
              >
                {problem.solution[lang]}
              </pre>
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
