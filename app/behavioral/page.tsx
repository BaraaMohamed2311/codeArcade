"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRINCIPLES, STAR_STEPS } from "../../lib/behavioral";
import { sfx } from "../../lib/sound";

const KEY = "codearcade-stories-v1";

export default function BehavioralPage() {
  const [stories, setStories] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setStories(JSON.parse(raw));
    } catch {
      // storage unavailable: start empty
    }
  }, []);

  function updateStory(id: string, text: string) {
    const next = { ...stories, [id]: text };
    setStories(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore write failures
    }
  }

  const filled = PRINCIPLES.filter((p) => (stories[p.id] || "").trim().length > 0).length;

  return (
    <main className="wrap cheatsheet">
      <Link className="back-link no-print" href="/" onClick={() => sfx.click()}>
        ← back to topics
      </Link>

      <div className="topbar">
        <h1 style={{ fontSize: 18, color: "var(--neon-cyan)", margin: 0 }}>🎤 BEHAVIORAL PREP</h1>
      </div>

      <p style={{ color: "var(--text-dim)", fontSize: 19, maxWidth: 760, marginBottom: 24 }}>
        Interviewers rarely name a principle. They ask for a story, and your story should show one.
        Prepare a few real stories, tell each one with STAR, and map each story to the
        principles it proves. One good story can cover several principles.
      </p>

      <section className="pattern-block" id="star">
        <h2>The STAR Method</h2>
        <table className="tweak-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>What to say</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            {STAR_STEPS.map((s) => (
              <tr key={s.letter}>
                <td>
                  <strong>
                    {s.letter} · {s.name}
                  </strong>
                </td>
                <td>{s.hint}</td>
                <td>{s.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="pattern-desc" style={{ marginBottom: 12 }}>
        Story bank: {filled}/{PRINCIPLES.length} principles have a story. Notes save in this
        browser only.
      </p>

      {PRINCIPLES.map((p) => (
        <section className="pattern-block" key={p.id} id={p.id}>
          <h2>{p.name}</h2>
          <p className="pattern-desc">{p.meaning}</p>
          <ul className="question-list">
            {p.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <textarea
            className="story-box no-print"
            placeholder="Your story in STAR form: situation, task, action, result"
            value={stories[p.id] || ""}
            onChange={(e) => updateStory(p.id, e.target.value)}
            rows={4}
          />
        </section>
      ))}
    </main>
  );
}
