"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PROBLEMS } from "../lib/problems";
import { getAllProgress, totalSolves, xpForSolves, levelFromXp, ProgressEntry } from "../lib/progress";
import { sfx } from "../lib/sound";

export default function Home() {
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [xp, setXp] = useState(0);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);

  useEffect(() => {
    setProgress(getAllProgress());
    setXp(xpForSolves(totalSolves()));
  }, []);

  const { level, into, need } = levelFromXp(xp);
  const pct = Math.min(100, Math.round((into / need) * 100));

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    sfx.click();
    setSubStatus("Sending...");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubStatus(data.message || (data.ok ? "Subscribed!" : "Something went wrong."));
      if (data.ok) sfx.pass();
    } catch {
      setSubStatus("Could not reach the server.");
      sfx.fail();
    }
  }

  return (
    <main className="wrap">
      <div className="topbar">
        <span className="logo">⟨ CODE ARCADE ⟩</span>
        <div className="xp-chip">
          LVL {level} · {into}/{need} XP
          <div
            style={{
              height: 6,
              marginTop: 4,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${pct}%`, height: "100%", background: "var(--neon-yellow)" }} />
          </div>
        </div>
      </div>

      <section className="hero">
        <h1>GRIND THE PATTERNS,<br />NOT THE PILE</h1>
        <p>
          A small set of problems, one per pattern. Replay them until the pattern is wired into
          your head. Every language runs for real. Every solve counts.
        </p>
      </section>

      <div className="grid">
        {PROBLEMS.map((p) => {
          const entry = progress[p.slug];
          return (
            <Link href={`/problem/${p.slug}`} key={p.slug} className="card" onClick={() => sfx.click()}>
              <span className="topic">{p.topic}</span>
              <h3>{p.title}</h3>
              <div className="badge-row">
                <span className={`badge ${p.difficulty}`}>{p.difficulty}</span>
                <span className="solve-count">
                  ★ {entry?.solved ?? 0}×
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="section-title">DAILY REMINDER</h2>
      <div className="panel">
        <p style={{ marginTop: 0, color: "var(--text-dim)", fontSize: 18 }}>
          Drop your email to get a daily nudge with that day's pick from the problem set.
        </p>
        <form className="subscribe-form" onSubmit={subscribe}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn yellow" type="submit">
            SUBSCRIBE
          </button>
        </form>
        {subStatus && (
          <p style={{ fontSize: 16, color: "var(--neon-cyan)", marginBottom: 0 }}>{subStatus}</p>
        )}
      </div>

      <p className="footer-note">
        Built for one player. Hosted on Vercel. Runs JS, Python &amp; Go for real via a public
        execution API.
      </p>
    </main>
  );
}
