"use client";

<<<<<<< HEAD
import Link from "next/link";
import { PATTERNS } from "../../lib/cheatsheet";
import { sfx } from "../../lib/sound";

export default function CheatSheetPage() {
  return (
    <main className="wrap">
      <Link className="back-link" href="/" onClick={() => sfx.click()}>
=======
import { useState } from "react";
import Link from "next/link";
import { PATTERNS, TWIST_DRILLS } from "../../lib/cheatsheet";
import { PROBLEMS } from "../../lib/problems";
import { sfx } from "../../lib/sound";

const AWS_SLUGS = new Set(PROBLEMS.filter((p) => p.tags?.includes("aws")).map((p) => p.slug));

export default function CheatSheetPage() {
  const [awsOnly, setAwsOnly] = useState(false);

  // When the AWS filter is on, keep only AWS-tagged problems, and hide any
  // pattern left with no problems at all.
  const patterns = PATTERNS.map((p) => ({
    ...p,
    usedBy: awsOnly ? p.usedBy.filter((u) => AWS_SLUGS.has(u.slug)) : p.usedBy,
  })).filter((p) => p.usedBy.length > 0);

  const patternIds = new Set(patterns.map((p) => p.id));
  const drills = awsOnly ? TWIST_DRILLS.filter((d) => patternIds.has(d.patternId)) : TWIST_DRILLS;

  return (
    <main className="wrap cheatsheet">
      <Link className="back-link no-print" href="/" onClick={() => sfx.click()}>
>>>>>>> 654a063 (cheatsheets and aws roadmap)
        ← back to topics
      </Link>

      <div className="topbar">
        <h1 style={{ fontSize: 18, color: "var(--neon-cyan)", margin: 0 }}>
          📋 PATTERN CHEAT SHEET
        </h1>
      </div>

<<<<<<< HEAD
      <p style={{ color: "var(--text-dim)", fontSize: 19, maxWidth: 760, marginBottom: 30 }}>
=======
      <p style={{ color: "var(--text-dim)", fontSize: 19, maxWidth: 760, marginBottom: 20 }}>
>>>>>>> 654a063 (cheatsheets and aws roadmap)
        {PATTERNS.length} shapes cover every problem in the arcade. Memorize the base code block
        for each one, then memorize the one-line tweak per problem — that's the whole game.
        Click any problem name to go solve it.
      </p>

<<<<<<< HEAD
      {PATTERNS.map((pattern) => (
=======
      <div className="cheat-controls no-print">
        <button
          className={`filter-chip ${awsOnly ? "active" : ""}`}
          onClick={() => {
            sfx.click();
            setAwsOnly(!awsOnly);
          }}
          aria-pressed={awsOnly}
        >
          ⭐ AWS ONLY
        </button>
        <button
          className="filter-chip"
          onClick={() => {
            sfx.click();
            window.print();
          }}
        >
          🖨 PRINT
        </button>
      </div>

      <nav className="pattern-index" aria-label="Pattern index">
        <h2>Jump to a pattern</h2>
        <ul>
          {patterns.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} onClick={() => sfx.click()}>
                {p.name}
              </a>
              <span className="index-count">{p.usedBy.length}</span>
            </li>
          ))}
          <li>
            <a href="#twist-drills" onClick={() => sfx.click()}>
              Twist Drills
            </a>
            <span className="index-count">{drills.length}</span>
          </li>
        </ul>
      </nav>

      {patterns.map((pattern) => (
>>>>>>> 654a063 (cheatsheets and aws roadmap)
        <section className="pattern-block" key={pattern.id} id={pattern.id}>
          <h2>{pattern.name}</h2>
          <p className="pattern-desc">{pattern.description}</p>
          <pre className="pattern-code">{pattern.code}</pre>
          <table className="tweak-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>How it tweaks the base pattern</th>
              </tr>
            </thead>
            <tbody>
              {pattern.usedBy.map((u) => (
                <tr key={u.slug}>
                  <td>
                    <Link href={`/problem/${u.slug}`} onClick={() => sfx.click()}>
                      {u.title}
                    </Link>
<<<<<<< HEAD
=======
                    {AWS_SLUGS.has(u.slug) && <span className="aws-badge"> ⭐</span>}
>>>>>>> 654a063 (cheatsheets and aws roadmap)
                  </td>
                  <td>{u.tweak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
<<<<<<< HEAD
=======

      <section className="pattern-block" id="twist-drills">
        <h2>Twist Drills</h2>
        <p className="pattern-desc">
          Interviewers often take a problem you know and change one small thing. Each row is a
          problem you already know, the likely twist, and the exact change to the template.
        </p>
        <table className="tweak-table">
          <thead>
            <tr>
              <th>If you know</th>
              <th>And they ask</th>
              <th>Change this</th>
            </tr>
          </thead>
          <tbody>
            {drills.map((d) => (
              <tr key={d.base + d.twist}>
                <td>{d.base}</td>
                <td>{d.twist}</td>
                <td>
                  {d.change}{" "}
                  <a href={`#${d.patternId}`} className="no-print" onClick={() => sfx.click()}>
                    (see pattern)
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
>>>>>>> 654a063 (cheatsheets and aws roadmap)
    </main>
  );
}
