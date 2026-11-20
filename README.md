# number-check-bench

63 reports written by AI models, the 6 spreadsheet exports they were written from, and a record of how each number was counted. Use them to test a tool that checks the numbers in a text against the data.

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
| [`reports/first-look-2026-11-17-b/`](reports/first-look-2026-11-17-b) | 6 more with the same kind of request and new roles (an ad consultant's audit, a recruiting funnel review, an investor update, and so on), about 72 numbers each. The checker was frozen with the fixes for the set before. |
| [`reports/first-look-2026-11-17-c/`](reports/first-look-2026-11-17-c) | 6 more, again with new roles and the models swapped between files, about 69 numbers each. The checker was frozen with the fixes for set b. |
| [`reports/first-look-2026-11-18/`](reports/first-look-2026-11-18) | 6 more, new roles again (an agency's cross-client review, a hiring efficiency note to a CFO, an investor trading update, and so on), about 71 numbers each. The checker was frozen with a change meant to catch more wrong numbers. |
| [`reports/first-look-2026-11-18-b/`](reports/first-look-2026-11-18-b) | 6 more, new roles again (a freelance marketer's spend audit for a client's CMO, a monthly hiring report to leadership, a refunds deep-dive for an operations director, a delivery-risk report to a board, a weekly sign-up update to a CEO, a service-level report to a COO), about 67 numbers each. The checker was frozen with the fixes for November 18. |
| [`scores/`](scores) | The scores as JSON, including every wrong number that got through. |
| [`results/`](results) | What the public API answered for each report on November 14, 2026, with every number it did not confirm. |
| [`run.mjs`](run.mjs) | Sends the reports to a checker and tallies the verdicts. |
| [`n8n/`](n8n) | An n8n workflow that checks an AI-written report against its spreadsheet before it is sent, and stops the run if a number differs. |

Every writer could run code on the file and knew nothing about the checker. The requests were ordinary ones, such as a weekly update for a manager or highlights for a quarterly review.

Each report in `tuned`, November 12, the three November 17 sets and the two November 18 sets has a `.json` next to it. The writer filled it in for every number in the report:

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
| November 17 b, 6 reports | 432 | 175 (41%) | 7 | 11, all wrongly | 239 |
| November 17 c, 6 reports | 415 | 175 (42%) | 11 | 5, all wrongly | 224 |
| November 18, 6 reports | 426 | 147 (35%) | 19 | 11, all wrongly | 249 |
| November 18 b, 6 reports | 404 | 136 (34%) | 7 | 4, all wrongly | 257 |
| All 8 | 2,739 | 1,185 (43%) | 59 | 64, all wrongly | 1,431 |

The reports from November 16 on are longer and lean on shares inside a group, which the checker reads less often. That is why the share of matches fell from 80% over the first two sets to 43% over all eight. We add every set, not just the good ones.

For each November 17 set we scored two checkers: the one live at the time, and the one with the fixes for the set before, which we froze before the reports were written. The table shows the frozen one. The live one wrongly called 24 different on the first set ([`scores/first-look-2026-11-17-checker-of-2026-11-16.json`](scores/first-look-2026-11-17-checker-of-2026-11-16.json)), 16 on set b and 19 on set c (the `-live-checker` files), with the same matches. We did the same on November 18. There the two checkers gave the same verdict on every one of the 426 numbers. On November 18 b they did again, on all 404 numbers and on every planted one.

Of the 60 correct numbers called different up to November 18, the checker we put live after the November 18 b run calls none different. It has seen those reports by now, so that says less than the table does. The 4 of November 18 b are not fixed yet.

What went wrong:

- **2 correct numbers were called different on November 14.** The Opus summary says "Maya handled the most, 534 tickets with 473 resolved and 89.5% Good." 89.5% is right: it is Maya's share. The checker read it as the overall share, 85.2%, and said the file disagrees. It did the same with Jonah's 88.8%. A checker that tells you a correct number is wrong is worse than one that says nothing, so we fixed this the same day: when a number comes out exactly with one more condition, and that condition is named in the sentence, it is a match.
- **15 correct numbers were called different on November 16.** They had 5 causes: a word list that cut "resolved" too short to reach the Closed column; counts of what is open now ("Active: Backend 21, Support 20, …") read against the week named in the title; a rate inside a group ("refund rate" for one channel) read as the overall rate; the thing a number is compared with ("than Web") read as the number's own condition; and "its" read as the IT department. We fixed all 5 on November 17. On the same reports the fixed checker calls none of them different. Most now match. The open counts come back as not checked, because the checker cannot yet tell which stages count as active. The same day we also tried a change meant to catch more wrong numbers. On these reports it wrongly called 24 correct numbers different instead of 15, so we dropped it.
- **16 correct numbers were called different on November 17**, by the fixed checker. The sentences had a condition it did not read: several values at once ("hired out of everyone hired, rejected or withdrawn"), two conditions at once (urgent tickets that came in by chat), a group cut by date (people who applied by September 6, projects not finished yet), the median of days between two dates, a rate with another base (leads per click), a negation (sign-ups outside the US). The reading without that condition came out close, so it said different. One more, "5.5% of its orders", read "orders" as the order total column. We fixed that one after this run. The table still counts it, because it shows what the checker did before it saw the reports. After this set we changed the approach: before calling a number different, the checker now looks for a condition in the sentence that its reading did not use (another column's value, "or", a date or "before", "outside", "open", "with a final outcome"), and if there is one it says "not checked" instead.
- **11 correct numbers were called different in set b**, by the checker with that change. The conditions it still missed: "its" and "their" pointing to the sentence before ("Only 1.5% of its clicks convert"), a refund rate counted by orders where it read it by amount, "still unspent", "German" for DE, "in the first four" (weeks), "Saturday or Sunday", "the other five agents", and "CPL" read as average spend. We added these as conditions after the run.
- **5 correct numbers were called different in set c**, by the checker with the set b fixes. Three point back to the sentence before ("It brought …", "All 367 of them …", "Their refund rate …") where the group there was one the checker could not read; one has "with a final outcome" right after the number; one has "in the last nine days" earlier in the sentence. We fixed these after the run. The same change has a cost: on set c the live checker called 343 of the planted wrong numbers different and the frozen one 229. The rest came back as "not checked", not as matches.
- **11 correct numbers were called different on November 18**, by both the live checker and the frozen one. The sentences had conditions neither reads yet: "closed candidates" (no longer in the pipeline), a time word ("before it", "baseline", "over the export"), "open tickets", cancelled orders that the rest of the report leaves out, a list line that names the channel only at its start ("Web: … refund rate 2.4%"), and a group of several rows ("Two projects (…) at 92.0% of budget", "Their combined spend"). We fixed these after the run by widening one rule rather than adding a reading for each: when the sentence has a condition the checker's reading did not use, it says "not checked" instead of "different". That now also covers finished states, rows the reading left out, the name at the start of a list line, groups of several rows, time words, "X% of" a kind of row, and a status read as an empty date column. The cost: of the 7,714 planted wrong numbers below, the checker before this fix calls 1,746 different and the fixed one 1,687. The other 59 come back as "not checked". None more got through.
- **4 correct numbers were called different on November 18 b**, by both checkers: a date range written in words at the start of a list line ("Days five to eleven: … refunds at 2.8% of value"), a share of time elapsed read as the spend ratio in the same sentence ("has spent 53.0% with 48.5% of its time elapsed"), money left over for the four finished projects of the sentence before ("leaving $56,720 unspent"), and a rate inside a group read as that group's share of all rows ("US: 40.4% activated."). Not fixed yet.
- **1 of the 89 matches of November 12 was lucky.** The checker confirmed the number with a different calculation than the writer's, and the two happen to round to the same digits. 87 used the same calculation as the writer, and 1 was confirmed by arithmetic on other numbers in the text. On November 17 none of the 192 matches was lucky: 188 used the writer's calculation and 4 were arithmetic on other numbers in the text. In set b 7 of 175 look lucky, but 5 of those are values the writer rounded in the `.json`. In set c 2 of 175 were lucky: a Web cancellation rate confirmed as the overall rate, and "3" days to a deadline confirmed as 3 projects marked Red. On November 18, 5 of 147 do not agree with the writer's `.json`, but in each the checker's calculation is the writer's or very close to it: the same lead rate over the last 4 weeks instead of the whole export, the same breach rate over a different span, and two where the `.json` notes a different value than the report. On November 18 b, 3 of 136 do not agree with the writer's `.json`. One was lucky: "80 orders ended in a refund or cancellation" was confirmed as the median order total of refunded orders, about $80. In the other two the checker's reading is what the sentence says ("4 are pending" as candidates still at Offer, "0 hires" from the job board) and the `.json` notes another number.
- **1,431 of the 2,739 numbers (52%) were not checked** over all eight sets. Among them are sentences the checker cannot read yet: a condition spread over several values, a weekday, a word the file does not use, a date range inside the sentence.

### Wrong numbers planted on purpose

For the reports of November 12, 16, the three November 17 sets and the two November 18 sets (42 reports) we changed one number at a time in 4 ways (3% higher, 10% lower, last 2 digits swapped, last digit plus 1) and checked the text again. That makes 9,161 wrong numbers.

| Verdict on the wrong number | November 12 | November 16 | November 17 | November 17 b | November 17 c | November 18 | November 18 b | All |
|---|---|---|---|---|---|---|---|---|
| Called different | 176 | 201 | 291 | 230 | 229 | 353 | 218 | 1,698 |
| Counted differently | 7 | 18 | 32 | 29 | 37 | 15 | 30 | 168 |
| Not checked | 207 | 1,088 | 1,197 | 1,243 | 1,187 | 1,097 | 1,190 | 7,209 |
| Matches (got through) | 3 | 13 | 19 | 15 | 13 | 14 | 9 | 86 (0.9%) |
| Total | 393 | 1,320 | 1,539 | 1,517 | 1,466 | 1,479 | 1,447 | 9,161 |

The checker frozen for November 18 compares more numbers in busy sentences: a number in a line with several others, or one that borrows its group from the start of a list line ("Northfield Bikes: $20,820, 379 leads"), is now compared when another number in the same sentence matched with that group. On November 18 it called 353 of the planted numbers different where the live checker called 266, and let the same 14 through. On November 18 b the checker frozen with the November 18 fixes and the live one both called 218 different and let 9 through.

The 86 that got through are listed in each score file under `passed`. Each one is a number the file does give under another reading, such as a refund rate by amount where the report meant by count, or a count of projects cut a little differently.

On November 17 the fixed checker let 3 more through than the one before it. Two are refund rates: it now reads "refund rate" by amount as well as by count, and 1.4% changed to 1.5% lands on the amount reading. The third is "3.3% of orders" changed to 3.0%, the "of its orders" mistake above, which no longer gets through.

About four in five wrong numbers came back as "not checked", not as "different". So read the verdicts this way: "matches" means the number was counted again and agrees. Anything else means look at it yourself.

### The same reports after the fixes

With the checker we put live after the November 18 b run, on our machine, on the same code. The answers the public API gave on November 14 are still in [`results/`](results).

| Set | Numbers | Matches | Counted differently | Called different | Not checked |
|---|---|---|---|---|---|
| Tuned, 18 reports | 332 | 309 (93%) | 1 | 0 | 22 |
| November 12, 6 reports | 118 | 101 (86%) | 1 | 0 | 16 |
| November 14, 3 reports | 113 | 99 (88%) | 2 | 0 | 12 |
| November 16, 6 reports | 390 | 187 (48%) | 8 | 0 | 195 |
| November 17, 6 reports | 441 | 195 (44%) | 5 | 0 | 241 |
| November 17 b, 6 reports | 432 | 175 (41%) | 7 | 0 | 250 |
| November 17 c, 6 reports | 415 | 175 (42%) | 11 | 0 | 229 |
| November 18, 6 reports | 426 | 147 (35%) | 19 | 0 | 260 |
| November 18 b, 6 reports (not fixed yet) | 404 | 136 (34%) | 7 | 4 | 257 |

These are higher because the checker has now seen the reports. Do not quote them as accuracy.

## Limits

- Every report was written by a Claude model. Nothing here was written by ChatGPT, Copilot or Gemini, or by a person.
- The reports are mostly right. Models that run code on a file usually get the arithmetic right, so this set tests whether a checker confirms correct numbers without accusing them. It says less about how well a checker catches real mistakes. The planted numbers are simple edits, not the mistakes a model makes on its own.
- It is small: 63 reports, 6 files, one language.
- The scores are for one checker, measured by the people who built it.
- The files are clean compared with a real export pipeline. One sheet each, no joins.

## Run it yourself

You need Node 18 or later. No account, no key, no packages.

```bash
git clone https://github.com/309dot/number-check-bench.git
cd number-check-bench
node run.mjs reports/first-look-2026-11-14
```

That sends each report with its file to `https://everynumber.app/api/agents/check` and prints the verdicts. The API takes 10 checks every 10 minutes and 40 a day from one place, so the script waits 65 seconds between reports and tries again after 3 minutes if it is told to slow down. One folder of 6 takes about 7 minutes. All 63 are more than the daily limit, so run them over two days. The file is read to count and is not stored. The text and the result are deleted after 24 hours.

To test another checker, pass its address with `--api`. The script posts a form with two fields, `text` and `file`, and expects JSON with a `summary` object: `numbers`, `matches`, `counted_differently`, `differs`, `not_checked`. Or skip the script and read the folders directly.

You can also do it by hand: open [the check page](https://everynumber.app/check?src=github-bench), paste a report, and drop its file.

## License

Everything here is released under [CC0 1.0](LICENSE). Use it for anything, no credit needed.

Made by 309 designLab, the studio behind [Every Number](https://everynumber.app/?src=github-bench).
