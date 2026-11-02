import { NextRequest, NextResponse } from "next/server";
import { getProblem } from "../../../lib/problems";
import { buildSource } from "../../../lib/harness";

export const runtime = "nodejs";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANG_CONFIG: Record<string, { language: string; version: string; file: string }> = {
  javascript: { language: "javascript", version: "*", file: "main.js" },
  python: { language: "python", version: "*", file: "main.py" },
  go: { language: "go", version: "*", file: "main.go" },
};

export async function POST(req: NextRequest) {
  try {
    const { slug, lang, code } = await req.json();
    const problem = getProblem(slug);
    if (!problem) {
      return NextResponse.json({ ok: false, message: "Unknown problem." }, { status: 400 });
    }
    const config = LANG_CONFIG[lang];
    if (!config) {
      return NextResponse.json({ ok: false, message: "Unsupported language." }, { status: 400 });
    }

    const source = buildSource(problem, lang, code);

    const pistonRes = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [{ name: config.file, content: source }],
      }),
    });

    if (!pistonRes.ok) {
      const text = await pistonRes.text();
      return NextResponse.json(
        { ok: false, message: `Execution service error: ${text}` },
        { status: 502 }
      );
    }

    const data = await pistonRes.json();
    const run = data.run || {};
    const stdout: string = run.stdout || "";
    const stderr: string = run.stderr || "";
    const compileStderr: string = data.compile?.stderr || "";

    if (compileStderr) {
      return NextResponse.json({
        ok: true,
        compileError: compileStderr,
        stdout,
        stderr,
      });
    }

    const marker = "__RESULTS__";
    const idx = stdout.indexOf(marker);
    if (idx === -1) {
      return NextResponse.json({
        ok: true,
        message: "No results produced. Check for a runtime error.",
        stdout,
        stderr,
      });
    }

    const jsonPart = stdout.slice(idx + marker.length).trim().split("\n")[0];
    let results;
    try {
      results = JSON.parse(jsonPart);
    } catch (e) {
      return NextResponse.json({
        ok: true,
        message: "Could not parse results.",
        stdout,
        stderr,
      });
    }

    return NextResponse.json({ ok: true, results, stdout, stderr });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
