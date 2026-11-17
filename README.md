# number-check-bench

39 reports written by AI models, the 6 spreadsheet exports they were written from, and a record of how each number was counted. Use them to test a tool that checks the numbers in a text against the data.

We made this to measure [Every Number's check page](https://everynumber.app/check?src=github-bench), which counts every number in a text again from the file. The scores below are that checker's, including the parts it got wrong. The data is free to use on any other checker.

All values in the files are made up. There are no real people, customers or companies in them.

## What is in here

| Folder | What it holds |
|---|---|
| [`files/`](files) | 6 exports: ad results, job candidates, orders, a project portfolio, sign-ups, support tickets. They are messy on purpose (title rows, totals rows, test accounts, spam, duplicates). The same files are in [every-number-sample-exports](https://github.com/309dot/every-number-sample-exports). |
| [`reports/tuned/`](reports/tuned) | 18 reports. Claude Sonnet got each file and the same request 3 times. We used these to improve the checker, so its score on them says little. |
| [`reports/first-look-2026-11-12/`](reports/first-look-2026-11-12) | 6 reports, one per file, with different questions. Written by Claude (the model version was not recorded). The checker had never seen them when we scored it. |
| [`reports/first-look-2026-11-14/`](reports/first-look-2026-11-14) | 3 summaries of the tickets file, by Claude Haiku, Sonnet and Opus, each with a differently worded request. Also scored before the checker had seen them. |
| [`reports/first-look-2026-11-16/`](reports/first-look-2026-11-16) | 6 reports, one per file, by Claude Haiku, Sonnet and Opus (two each), each with its own request: a client email from an ad agency, a weekly recruiting update, a month-to-date note to founders, and so on. Longer than the earlier ones, about 65 numbers each. Scored before the checker had seen them. |
| [`reports/first-look-2026-11-17/`](reports/first-look-2026-11-17) | 6 more, again two per model and a new request each. These asked for many shares inside a group (one region's refund rate, one team's breach rate), about 74 numbers each. The checker was frozen before they were written. |
| [`scores/`](scores) | The scores as JSON, including every wrong number that got through. |
| [`results/`](results) | What the public API answered for each report on November 14, 2026, with every number it did not confirm. |
| [`run.mjs`](run.mjs) | Sends the reports to a checker and tallies the verdicts. |

Every writer could run code on the file and knew nothing about the checker. The requests were ordinary ones, such as a weekly update for a manager or highlights for a quarterly review.

Each report in `tuned`, November 12 and November 17 has a `.json` next to it. The writer filled it in for every number in the report:

```json
{ "quote": "54.81", "value": 54.81189000774593, "definition": "Total spend divided by total leads, all non-test rows, whole period.", "left_out": "56 rows flagged Test campaign = Yes" }
```

`value` is the number before rounding. That lets you tell a real match (the same calculation) from a lucky one (a different calculation that rounds to the same digits). The reports of November 14 and 16 have no such file.

## Scores so far

The checker gives each number one of 4 verdicts: it matches the file, it is in the file but counted differently from the rest of the text, it differs from the file, or the checker could not check it.

### First look

This is the only score worth quoting: one run over reports the checker had never seen, before any fix.

| Set | Numbers | Matches | Counted differently | Called different | Not checked |
|---|---|---|---|---|---|
| November 12, 6 reports | 118 | 89 (75%) | 1 | 0 | 28 |
| November 14, 3 reports | 113 | 96 (85%) | 2 | 2, both wrongly | 13 |
| November 16, 6 reports | 390 | 175 (45%) | 7 | 15, all wrongly | 193 |
| November 17, 6 reports | 441 | 192 (44%) | 5 | 16, all wrongly | 228 |
| All 4 | 1,062 | 552 (52%) | 15 | 33, all wrongly | 462 |

The November 16 and 17 reports are longer and lean on shares inside a group, which the checker reads less often. That is why the share of matches fell from 80% over the first two sets to 52% over all four. We add every set, not just the good ones.

For November 17 we scored two checkers: the one live at the time, and the one with the fixes for November 16's mistakes, which we froze before the reports were written. The table shows the frozen one. The one before it matched 173 (39%) and wrongly called 24 different ([`scores/first-look-2026-11-17-checker-of-2026-11-16.json`](scores/first-look-2026-11-17-checker-of-2026-11-16.json)).

Of the 33 correct numbers called different, the checker live today no longer calls 18 different. The other 15 are from November 17 and are not fixed yet.

What went wrong:

- **2 correct numbers were called different on November 14.** The Opus summary says "Maya handled the most, 534 tickets with 473 resolved and 89.5% Good." 89.5% is right: it is Maya's share. The checker read it as the overall share, 85.2%, and said the file disagrees. It did the same with Jonah's 88.8%. A checker that tells you a correct number is wrong is worse than one that says nothing, so we fixed this the same day: when a number comes out exactly with one more condition, and that condition is named in the sentence, it is a match.
- **15 correct numbers were called different on November 16.** They had 5 causes: a word list that cut "resolved" too short to reach the Closed column; counts of what is open now ("Active: Backend 21, Support 20, …") read against the week named in the title; a rate inside a group ("refund rate" for one channel) read as the overall rate; the thing a number is compared with ("than Web") read as the number's own condition; and "its" read as the IT department. We fixed all 5 on November 17. On the same reports the fixed checker calls none of them different. Most now match. The open counts come back as not checked, because the checker cannot yet tell which stages count as active. The same day we also tried a change meant to catch more wrong numbers. On these reports it wrongly called 24 correct numbers different instead of 15, so we dropped it.
- **16 correct numbers were called different on November 17**, by the fixed checker. The sentences had a condition it did not read: several values at once ("hired out of everyone hired, rejected or withdrawn"), two conditions at once (urgent tickets that came in by chat), a group cut by date (people who applied by September 6, projects not finished yet), the median of days between two dates, a rate with another base (leads per click), a negation (sign-ups outside the US). The reading without that condition came out close, so it said different. One more, "5.5% of its orders", read "orders" as the order total column. We fixed that one after this run. The table still counts it, because it shows what the checker did before it saw the reports. Next we will stop calling a number different when its sentence has a condition the checker did not use, and measure that on reports it has not seen.
- **1 of the 89 matches of November 12 was lucky.** The checker confirmed the number with a different calculation than the writer's, and the two happen to round to the same digits. 87 used the same calculation as the writer, and 1 was confirmed by arithmetic on other numbers in the text. On November 17 none of the 192 matches was lucky: 188 used the writer's calculation and 4 were arithmetic on other numbers in the text.
- **462 of the 1,062 numbers (43%) were not checked** over all four sets. Among them are sentences the checker cannot read yet: a condition spread over several values, a weekday, a word the file does not use, a date range inside the sentence.

### Wrong numbers planted on purpose

For the reports of November 12, 16 and 17 (18 reports) we changed one number at a time in 4 ways (3% higher, 10% lower, last 2 digits swapped, last digit plus 1) and checked the text again. That makes 3,252 wrong numbers.

| Verdict on the wrong number | November 12 | November 16 | November 17 | All |
|---|---|---|---|---|
| Called different | 176 | 201 | 291 | 668 |
| Counted differently | 7 | 18 | 32 | 57 |
| Not checked | 207 | 1,088 | 1,197 | 2,492 |
| Matches (got through) | 3 | 13 | 19 | 35 (1.1%) |
| Total | 393 | 1,320 | 1,539 | 3,252 |

The 35 that got through are listed in each score file under `passed`. Each one is a number the file does give under another reading, such as a refund rate by amount where the report meant by count, or a count of projects cut a little differently.

On November 17 the fixed checker let 3 more through than the one before it. Two are refund rates: it now reads "refund rate" by amount as well as by count, and 1.4% changed to 1.5% lands on the amount reading. The third is "3.3% of orders" changed to 3.0%, the "of its orders" mistake above, which no longer gets through.

Three in four wrong numbers came back as "not checked", not as "different". So read the verdicts this way: "matches" means the number was counted again and agrees. Anything else means look at it yourself.

### The same reports after the fixes

With the checker as of November 17, run on our machine on the same code we put live that day. The answers the public API gave on November 14 are still in [`results/`](results).

| Set | Numbers | Matches | Counted differently | Called different | Not checked |
|---|---|---|---|---|---|
| Tuned, 18 reports | 332 | 309 (93%) | 1 | 0 | 22 |
| November 12, 6 reports | 118 | 101 (86%) | 1 | 0 | 16 |
| November 14, 3 reports | 113 | 99 (88%) | 2 | 0 | 12 |
| November 16, 6 reports | 390 | 187 (48%) | 8 | 0 | 195 |
| November 17, 6 reports | 441 | 192 (44%) | 5 | 15 | 229 |

These are higher because the checker has now seen the reports. Do not quote them as accuracy.

## Limits

- Every report was written by a Claude model. Nothing here was written by ChatGPT, Copilot or Gemini, or by a person.
- The reports are mostly right. Models that run code on a file usually get the arithmetic right, so this set tests whether a checker confirms correct numbers without accusing them. It says less about how well a checker catches real mistakes. The planted numbers are simple edits, not the mistakes a model makes on its own.
- It is small: 39 reports, 6 files, one language.
- The scores are for one checker, measured by the people who built it.
- The files are clean compared with a real export pipeline. One sheet each, no joins.

## Run it yourself

You need Node 18 or later. No account, no key, no packages.

```bash
git clone https://github.com/309dot/number-check-bench.git
cd number-check-bench
node run.mjs reports/first-look-2026-11-14
```

That sends each report with its file to `https://everynumber.app/api/agents/check` and prints the verdicts. The API takes 10 checks every 10 minutes and 40 a day from one place, so the script waits 65 seconds between reports and tries again after 3 minutes if it is told to slow down. All 39 take about 45 minutes, which is just under the daily limit. The file is read to count and is not stored. The text and the result are deleted after 24 hours.

To test another checker, pass its address with `--api`. The script posts a form with two fields, `text` and `file`, and expects JSON with a `summary` object: `numbers`, `matches`, `counted_differently`, `differs`, `not_checked`. Or skip the script and read the folders directly.

You can also do it by hand: open [the check page](https://everynumber.app/check?src=github-bench), paste a report, and drop its file.

## License

Everything here is released under [CC0 1.0](LICENSE). Use it for anything, no credit needed.

Made by 309 designLab, the studio behind [Every Number](https://everynumber.app/?src=github-bench).
