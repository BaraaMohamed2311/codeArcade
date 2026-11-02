# CODE ARCADE

A personal, arcade-styled LeetCode/NeetCode-style practice site. 30 problems
across 14 core patterns (hashing, sliding window, two pointers, binary
search, intervals/greedy, stacks, linked lists, trees, graphs, DP,
backtracking, heaps, LRU design). The idea is repetition, not volume — solve
the same scenario until the pattern is automatic. Every solve is counted and
turns into XP/levels.

Write code in **JavaScript, Python, or Go**, run it for real against test
cases, and see pass/fail output in an in-page console. Reveal the solution
any time to see the time/space complexity plus a plain, child-level
explanation (no analogies) and the annotated reference code.

## Browsing

- The home page is a **topic picker** — click a topic to see just that
  topic's problems. One of the "topics" is **⭐ AWS Interview Favorites**: a
  tag-based bucket (`tags: ["aws"]` in `lib/problems.ts`) pulling together
  the problems most likely to come up in an AWS interview — heavy on trees
  and graphs, plus twisted variants of common ones (right-side view instead
  of plain depth, invert instead of just traverse, etc.), per interview
  feedback, alongside AWS staples like LRU Cache and Kth Largest Element.
- **`/cheatsheet`** is a single page listing the ~14 underlying patterns,
  each with one canonical code block, plus a one-line note per problem on
  exactly what was tweaked to turn that base pattern into that specific
  problem. Built for memorizing the shape instead of grinding every problem
  individually — see `lib/cheatsheet.ts`.

## How it works

- **Code execution**: routed through the free public [Piston API](https://github.com/engineer-man/piston)
  (`emkc.org/api/v2/piston/execute`) — no API key, no sandboxing to manage
  yourself. `app/api/run/route.ts` builds a small test harness around your
  code (see `lib/harness.ts` and each problem's `goHarness` in
  `lib/problems.ts`) and sends it off, then parses pass/fail per test case
  from stdout.
- **Progress**: solve counts live in the browser's `localStorage`
  (`lib/progress.ts`) — this is a single-player tool, so no backend database
  is needed for that part.
- **Sound effects**: synthesized on the fly with the Web Audio API
  (`lib/sound.ts`) — no audio files to ship.
- **Daily email reminder**: `app/api/subscribe/route.ts` collects an email,
  and `app/api/cron/remind/route.ts` is hit once a day by Vercel Cron
  (configured in `vercel.json`) to email a "today's problem" pick to every
  subscriber. This needs two things wired up (both free-tier friendly):

  1. **Storage for subscriber emails** — [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
     (Upstash Redis under the hood). Add the integration in your Vercel
     project, which sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`
     automatically.
  2. **Sending the email** — [Resend](https://resend.com) (free tier is
     generous for personal use). Set:
     - `RESEND_API_KEY` — your Resend API key
     - `REMINDER_FROM` — a sender address on a domain verified in Resend
       (e.g. `CodeArcade <reminders@yourdomain.com>`)
     - `SITE_URL` — your deployed site URL, so the email can link straight
       to the problem (optional but nice)
     - `CRON_SECRET` — optional; if set, Vercel Cron's `Authorization`
       header is checked against it

  Without KV + Resend configured, the subscribe form still "works" (it just
  tells you nothing is being persisted), and the cron route runs on schedule
  but sends nothing. The whole rest of the site works with **zero
  environment variables**.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repo (or run `vercel` directly from here with
   the Vercel CLI).
2. Import the repo in Vercel. Framework preset: Next.js (auto-detected).
3. No environment variables are required for the core site to work. Add the
   KV + Resend variables above if you want the daily reminder emails.
4. The cron job in `vercel.json` runs daily at 17:00 UTC (19:00 Cairo time).
   Edit the `schedule` field to change it — crons are only picked up on
   Vercel's Hobby/Pro plans, and Hobby limits you to one run per day per
   cron, which matches this setup.

## Adding more problems

Each entry in `lib/problems.ts` needs:

- `prompt`, `topic`, `difficulty`, `pattern`
- `starter` and `solution` code per language (function names must match
  `fnName`, snake_case in Python)
- `tests` (array of `{ input: [...], expected: ... }`) for JS/Python — these
  feed the generic harness in `lib/harness.ts`
- `goHarness(code)` — Go needs real types, so each problem hand-writes its
  own `main.go` test driver (see existing problems for the pattern); copy
  the closest existing one and adjust the types/test values
- `complexity` and a plain-language `explanation`

Run `npx tsx scripts/test-harness.ts` (after `npm i -D tsx`, not included by
default) locally with Node/Python/Go installed to sanity-check a new
problem's harness against its own reference solution before shipping it.
