# number-check-bench

27 reports written by AI models, the 6 spreadsheet exports they were written from, and a record of how each number was counted. Use them to test a tool that checks the numbers in a text against the data.

We made this to measure [Every Number's check page](https://everynumber.app/check?src=github-bench), which counts every number in a text again from the file. The scores below are that checker's, including the parts it got wrong. The data is free to use on any other checker.

All values in the files are made up. There are no real people, customers or companies in them.

## What is in here

| Folder | What it holds |
|---|---|
| [`files/`](files) | 6 exports: ad results, job candidates, orders, a project portfolio, sign-ups, support tickets. They are messy on purpose (title rows, totals rows, test accounts, spam, duplicates). The same files are in [every-number-sample-exports](https://github.com/309dot/every-number-sample-exports). |
| [`reports/tuned/`](reports/tuned) | 18 reports. Claude Sonnet got each file and the same request 3 times. We used these to improve the checker, so its score on them says little. |
| [`reports/first-look-2026-11-12/`](reports/first-look-2026-11-12) | 6 reports, one per file, with different questions. Written by Claude (the model version was not recorded). The checker had never seen them when we scored it. |
| [`reports/first-look-2026-11-14/`](reports/first-look-2026-11-14) | 3 summaries of the tickets file, by Claude Haiku, Sonnet and Opus, each with a differently worded request. Also scored before the checker had seen them. |
| [`scores/`](scores) | The scores as JSON, including every wrong number that got through. |
| [`results/`](results) | What the public API answered for each report on November 14, 2026, with every number it did not confirm. |
| [`run.mjs`](run.mjs) | Sends the reports to a checker and tallies the verdicts. |

Every writer could run code on the file and knew nothing about the checker. The requests were ordinary ones, such as a weekly update for a manager or highlights for a quarterly review.

Each report in the first two folders has a `.json` next to it. The writer filled it in for every number in the report:

```json
{ "quote": "54.81", "value": 54.81189000774593, "definition": "Total spend divided by total leads, all non-test rows, whole period.", "left_out": "56 rows flagged Test campaign = Yes" }
```

`value` is the number before rounding. That lets you tell a real match (the same calculation) from a lucky one (a different calculation that rounds to the same digits). The 3 summaries of November 14 have no such file.

## Scores so far

The checker gives each number one of 4 verdicts: it matches the file, it is in the file but counted differently from the rest of the text, it differs from the file, or the checker could not check it.

### First look

This is the only score worth quoting: one run over reports the checker had never seen, before any fix.

| Set | Numbers | Matches | Counted differently | Called different | Not checked |
|---|---|---|---|---|---|
| November 12, 6 reports | 118 | 89 (75%) | 1 | 0 | 28 |
| November 14, 3 reports | 113 | 96 (85%) | 2 | 2, both wrongly | 13 |
| Both | 231 | 185 (80%) | 3 | 2 | 41 |

What went wrong:

- **2 correct numbers were called different.** The Opus summary says "Maya handled the most, 534 tickets with 473 resolved and 89.5% Good." 89.5% is right: it is Maya's share. The checker read it as the overall share, 85.2%, and said the file disagrees. It did the same with Jonah's 88.8%. A checker that tells you a correct number is wrong is worse than one that says nothing, so we fixed this the same day: when a number comes out exactly with one more condition, and that condition is named in the sentence, it is a match.
- **1 of the 89 matches of November 12 was lucky.** The checker confirmed the number with a different calculation than the writer's, and the two happen to round to the same digits. 87 used the same calculation as the writer, and 1 was confirmed by arithmetic on other numbers in the text.
- **1 in 4 numbers was not checked** on November 12. Among them are sentences the checker cannot read yet: a condition spread over several values, a weekday, a word the file does not use.

### Wrong numbers planted on purpose

For the 6 reports of November 12 we changed one number at a time in 4 ways (3% higher, 10% lower, last 2 digits swapped, last digit plus 1) and checked the text again. That makes 393 wrong numbers.

| Verdict on the wrong number | Count |
|---|---|
| Called different | 176 |
| Counted differently | 7 |
| Not checked | 207 |
| Matches (got through) | 3 |

The 3 that got through are listed in [`scores/first-look-2026-11-12.json`](scores/first-look-2026-11-12.json) under `passed`. Each one is a number the file does give under a nearby reading: twice the average where the report meant the median, and once the busiest day's count where the report meant one named day.

More than half of the wrong numbers came back as "not checked", not as "different". So read the verdicts this way: "matches" means the number was counted again and agrees. Anything else means look at it yourself.

### The same reports today

After the fixes, run through the public API on November 14, 2026 with `run.mjs`:

| Set | Numbers | Matches | Counted differently | Called different | Not checked |
|---|---|---|---|---|---|
| Tuned, 18 reports | 332 | 309 (93%) | 1 | 0 | 22 |
| November 12, 6 reports | 118 | 101 (86%) | 1 | 0 | 16 |
| November 14, 3 reports | 113 | 98 (87%) | 2 | 0 | 13 |

These are higher because the checker has now seen the reports. Do not quote them as accuracy.

## Limits

- Every report was written by a Claude model. Nothing here was written by ChatGPT, Copilot or Gemini, or by a person.
- The reports are mostly right. Models that run code on a file usually get the arithmetic right, so this set tests whether a checker confirms correct numbers without accusing them. It says less about how well a checker catches real mistakes. The planted numbers are simple edits, not the mistakes a model makes on its own.
- It is small: 27 reports, 6 files, one language.
- The scores are for one checker, measured by the people who built it.
- The files are clean compared with a real export pipeline. One sheet each, no joins.

## Run it yourself

You need Node 18 or later. No account, no key, no packages.

```bash
git clone https://github.com/309dot/number-check-bench.git
cd number-check-bench
node run.mjs reports/first-look-2026-11-14
```

That sends each report with its file to `https://everynumber.app/api/agents/check` and prints the verdicts. The API takes 10 checks every 10 minutes and 40 a day from one place, so the script waits 65 seconds between reports and tries again after 3 minutes if it is told to slow down. All 27 take about half an hour. The file is read to count and is not stored. The text and the result are deleted after 24 hours.

To test another checker, pass its address with `--api`. The script posts a form with two fields, `text` and `file`, and expects JSON with a `summary` object: `numbers`, `matches`, `counted_differently`, `differs`, `not_checked`. Or skip the script and read the folders directly.

You can also do it by hand: open [the check page](https://everynumber.app/check?src=github-bench), paste a report, and drop its file.

## License

Everything here is released under [CC0 1.0](LICENSE). Use it for anything, no credit needed.

Made by 309 designLab, the studio behind [Every Number](https://everynumber.app/?src=github-bench).
