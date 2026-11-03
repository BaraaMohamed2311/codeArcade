"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTopicList, AWS_FAVORITES_SLUG } from "../lib/problems";
import { totalSolves, xpForSolves, levelFromXp, getAllProgress } from "../lib/progress";
import { sfx } from "../lib/sound";

export default function Home() {
  const [xp, setXp] = useState(0);
  const [solvedSlugs, setSolvedSlugs] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);

  useEffect(() => {
    setXp(xpForSolves(totalSolves()));
    const all = getAllProgress();
    setSolvedSlugs(new Set(Object.keys(all).filter((k) => all[k].solved > 0)));
  }, []);

  const { level, into, need } = levelFromXp(xp);
  const pct = Math.min(100, Math.round((into / need) * 100));
  const topics = getTopicList();

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
          Pick a topic. Replay its handful of problems until the pattern is wired into your
          head. Every language runs for real. Every solve is counted.
        </p>
      </section>

      <div className="nav-links" style={{ marginBottom: 24, justifyContent: "center" }}>
        <Link href="/cheatsheet" className="nav-link" onClick={() => sfx.click()}>
          📋 PATTERN CHEAT SHEET
        </Link>
        <Link href="/behavioral" className="nav-link" onClick={() => sfx.click()}>
          🎤 BEHAVIORAL PREP
        </Link>
      </div>

      <div className="grid">
        {topics.map((t) => {
          const done = t.problemSlugs.filter((s) => solvedSlugs.has(s)).length;
          const donePct = t.count ? Math.round((done / t.count) * 100) : 0;
          return (
          <Link
            href={`/topic/${t.slug}`}
            key={t.slug}
            className={`topic-card ${t.slug === AWS_FAVORITES_SLUG ? "aws" : ""}`}
            onClick={() => sfx.click()}
          >
            <h3>{t.slug === AWS_FAVORITES_SLUG ? "⭐ " : ""}{t.label}</h3>
            <span className="count">{t.count} problem{t.count === 1 ? "" : "s"}</span>
            <span className="topic-progress-label">{done}/{t.count} solved</span>
            <div className="topic-progress">
              <div className="topic-progress-fill" style={{ width: `${donePct}%` }} />
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
