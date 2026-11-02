import { NextRequest, NextResponse } from "next/server";
import { PROBLEMS } from "../../../../lib/problems";

export const runtime = "nodejs";

// Called daily by Vercel Cron (see vercel.json). Picks "today's problem" and
// emails every subscriber via Resend. Requires RESEND_API_KEY and a verified
// sender in REMINDER_FROM. Requires Vercel KV (KV_REST_API_URL/TOKEN) for the
// subscriber list - without it, this route runs but has no one to email.
async function getSubscribers(): Promise<string[]> {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) return [];
  const res = await fetch(`${KV_URL}/smembers/subscribers`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.result || [];
}

function todaysProblem() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return PROBLEMS[dayIndex % PROBLEMS.length];
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends a secret header when CRON_SECRET is set; verify if present.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  const FROM = process.env.REMINDER_FROM;
  const problem = todaysProblem();
  const siteUrl = process.env.SITE_URL || "";

  if (!RESEND_KEY || !FROM) {
    return NextResponse.json({
      ok: true,
      sent: 0,
      message: "RESEND_API_KEY / REMINDER_FROM not set, skipping send.",
      problem: problem.slug,
    });
  }

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No subscribers yet.", problem: problem.slug });
  }

  let sent = 0;
  for (const email of subscribers) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: email,
        subject: `Today's problem: ${problem.title}`,
        html: `<p>Time for today's run.</p>
<p><strong>${problem.title}</strong> (${problem.topic}, ${problem.difficulty})</p>
<p>${problem.prompt}</p>
${siteUrl ? `<p><a href="${siteUrl}/problem/${problem.slug}">Open it</a></p>` : ""}`,
      }),
    });
    if (res.ok) sent++;
  }

  return NextResponse.json({ ok: true, sent, problem: problem.slug });
}
