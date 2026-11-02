"use client";

import Link from "next/link";
import { Problem } from "../lib/problems";
import { sfx } from "../lib/sound";

export default function ProblemCard({ problem, solved }: { problem: Problem; solved: number }) {
  return (
    <Link href={`/problem/${problem.slug}`} className="card" onClick={() => sfx.click()}>
      <span className="topic">{problem.topic}</span>
      <h3>{problem.title}</h3>
      <div className="badge-row">
        <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
        {problem.tags?.includes("aws") && <span className="badge aws-badge">AWS</span>}
        <span className="solve-count">★ {solved}×</span>
      </div>
    </Link>
  );
}
