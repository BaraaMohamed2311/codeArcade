"use client";

import Link from "next/link";
import { PATTERNS } from "../../lib/cheatsheet";
import { sfx } from "../../lib/sound";

export default function CheatSheetPage() {
  return (
    <main className="wrap">
      <Link className="back-link" href="/" onClick={() => sfx.click()}>
        ← back to topics
      </Link>

      <div className="topbar">
        <h1 style={{ fontSize: 18, color: "var(--neon-cyan)", margin: 0 }}>
          📋 PATTERN CHEAT SHEET
        </h1>
      </div>

      <p style={{ color: "var(--text-dim)", fontSize: 19, maxWidth: 760, marginBottom: 30 }}>
        {PATTERNS.length} shapes cover every problem in the arcade. Memorize the base code block
        for each one, then memorize the one-line tweak per problem — that's the whole game.
        Click any problem name to go solve it.
      </p>

      {PATTERNS.map((pattern) => (
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
                  </td>
                  <td>{u.tweak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
