#!/usr/bin/env node
// Sends each report in a folder, with the file it was written from, to a number checker and tallies the verdicts.
// By default it calls Every Number's public check API. No account or key is needed.
//
//   node run.mjs reports/first-look-2026-11-14
//   node run.mjs reports/tuned --pace 65
//   node run.mjs reports/first-look-2026-11-12 --api https://your-checker.example/check
//
// The public API allows 10 checks every 10 minutes and 40 a day from one place, so the default pace is one
// report every 65 seconds. All 39 reports take about 45 minutes. Needs Node 18 or later, no packages.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const dir = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--")) ?? "reports/first-look-2026-11-14";
const api = opt("api", "https://everynumber.app/api/agents/check");
const pace = Number(opt("pace", "65")) * 1000;
const out = opt("out", join("results", `${basename(dir)}.json`));

// A report's name starts with the set it was written from: tickets-a.txt was written from files/tickets-…csv.
const files = readdirSync("files");
const fileFor = (report) => {
  const set = report.split("-")[0];
  const hit = { ads: "ad-performance", hiring: "candidates", orders: "orders", projects: "portfolio", signups: "signups", tickets: "tickets" }[set];
  const name = files.find((f) => f.startsWith(hit ?? set));
  if (!name) throw new Error(`No source file for ${report}`);
  return name;
};

const reports = readdirSync(dir).filter((f) => f.endsWith(".txt")).sort();
const KEYS = ["numbers", "matches", "counted_differently", "differs", "not_checked"];
const total = Object.fromEntries(KEYS.map((k) => [k, 0]));
const rows = [];
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

for (const [i, report] of reports.entries()) {
  const name = fileFor(report);
  const form = new FormData();
  form.set("text", readFileSync(join(dir, report), "utf8"));
  form.set("file", new Blob([readFileSync(join("files", name))]), name);
  // If the checker says there were too many checks from one place (429), wait 3 minutes and try again, up to 4 times.
  let res;
  let body;
  for (let attempt = 1; attempt <= 4; attempt++) {
    res = await fetch(api, { method: "POST", body: form, headers: { "User-Agent": "number-check-bench/1.0" } });
    body = await res.json().catch(() => ({}));
    if (res.status !== 429 || attempt === 4) break;
    console.error(`${report}: too many checks from one place, waiting 3 minutes (try ${attempt} of 4)`);
    await sleep(180_000);
  }
  if (!res.ok || !body.summary) {
    console.error(`${report}: ${res.status} ${body.error ?? "no summary in the answer"}`);
    rows.push({ report, file: name, error: body.error ?? String(res.status) });
  } else {
    const s = body.summary;
    for (const k of KEYS) total[k] += s[k] ?? 0;
    // Keep the numbers that were not confirmed, so you can read them next to the report.
    const open = (body.numbers ?? []).filter((n) => n.verdict !== "matches").map((n) => ({ text: n.text, verdict: n.verdict, file_says: n.file_says?.map((f) => f.value), context: n.context }));
    rows.push({ report, file: name, ...Object.fromEntries(KEYS.map((k) => [k, s[k] ?? 0])), not_confirmed: open });
    console.log(`${report.padEnd(22)} ${String(s.numbers).padStart(3)} numbers  ${String(s.matches).padStart(3)} match  ${s.counted_differently} counted differently  ${s.differs} differs  ${s.not_checked} not checked`);
  }
  if (i < reports.length - 1) await sleep(pace);
}

console.log(`${"total".padEnd(22)} ${String(total.numbers).padStart(3)} numbers  ${String(total.matches).padStart(3)} match  ${total.counted_differently} counted differently  ${total.differs} differs  ${total.not_checked} not checked`);
mkdirSync("results", { recursive: true });
writeFileSync(out, `${JSON.stringify({ dir, api: api.split("?")[0], ran: new Date().toISOString().slice(0, 10), total, reports: rows }, null, 1)}\n`);
console.log(`Saved ${out}`);
