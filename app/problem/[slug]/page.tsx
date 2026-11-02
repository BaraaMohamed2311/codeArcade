import { PROBLEMS } from "../../../lib/problems";
import ProblemClient from "./ProblemClient";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ slug: p.slug }));
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  return <ProblemClient slug={params.slug} />;
}
