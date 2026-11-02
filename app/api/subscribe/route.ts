import { NextRequest, NextResponse } from "next/server";

// Minimal "subscribe" endpoint: stores the email as a Vercel KV entry if KV is
// configured, otherwise just echoes success so the UI flow works. Wire up
// Vercel KV (or any store) by filling in storeEmail() below.
async function storeEmail(email: string) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (KV_URL && KV_TOKEN) {
    await fetch(`${KV_URL}/sadd/subscribers/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    return true;
  }
  // No KV configured: nothing persisted. See README for setup.
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, message: "Enter a valid email." }, { status: 400 });
    }
    const persisted = await storeEmail(email);
    return NextResponse.json({
      ok: true,
      persisted,
      message: persisted
        ? "Subscribed! You'll get a daily reminder."
        : "Saved for this session. Set up Vercel KV to persist subscribers (see README).",
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message || err) }, { status: 500 });
  }
}
