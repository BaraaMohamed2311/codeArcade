"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProblemsByTopicSlug, getTopicLabel } from "../../../lib/problems";
import { getAllProgress, ProgressEntry } from "../../../lib/progress";
import { sfx } from "../../../lib/sound";
import ProblemCard from "../../../components/ProblemCard";

export default function TopicClient({ topicSlug }: { topicSlug: string }) {
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});

  useEffect(() => {
    setProgress(getAllProgress());
  }, []);

  const problems = getProblemsByTopicSlug(topicSlug);
  const label = getTopicLabel(topicSlug);

  return (
    <main className="wrap">
      <Link className="back-link" href="/" onClick={() => sfx.click()}>
        ← back to topics
      </Link>

      <div className="topbar">
        <h1 style={{ fontSize: 18, color: "var(--neon-pink)", margin: 0 }}>{label}</h1>
      </div>

      {problems.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>No problems in this topic yet.</p>
      ) : (
        <div className="grid">
          {problems.map((p) => (
            <ProblemCard key={p.slug} problem={p} solved={progress[p.slug]?.solved ?? 0} />
          ))}
        </div>
      )}
    </main>
  );
}
