# insangel — RUN REPORT — 2026-08-18 (second firing)

**OUTCOME: FAILED. No capture surface. Zero writes to bndy. No snapshot written.**

- runId: `insangel-2026-08-18T21-32-17Z`
- Heartbeat: `data\state\heartbeat\insangel-2026-08-18T21-32-17Z.json`
- Runbook read: `RUNBOOK.md` H1 **v2.27**. Floor in §6A: **v2.19**. Prompt floor: none stated. Gate PASSES.
- Spec read: `sources\insangel.md` in full.
- CTO-INBOX read in full before any append.
- Report path: `RUN-REPORT-2.md`. The 05:03Z firing already holds `RUN-REPORT.md` for this date. See the open item `run-report-path-collides-on-second-firing`.

## 1. Steps completed

| Step | Result |
|---|---|
| 0 heartbeat | Written `21:32:17Z`, `outcome: started`. Rewritten at the end of this run. |
| 1 date | `2026-08-18` (container clock, UTC `21:32:17Z`). |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\insangel.json` held `heldBy: null`, released `2026-08-18T05:12:00Z`. Acquired normally. No takeover. TTL 90 minutes (§6G), `expiresAt 2026-08-18T23:02:17Z`. |
| 3 tools | **FAILED HERE.** See §2. |
| 4 capture | Not reached. |
| 5 diff | Not reached. |
| 6 pipeline | Not reached. Zero creates, zero edits, zero deletions. |
| 7 report | This file. **No snapshot written.** The run holds no capture, so it may not record rows as seen (§6A step 5). |
| 7b run-summary | One line appended, `outcome: failed`. |
| 8 validator | Not applicable. No record was written, so no evidence file exists. |
| 8b daily note | One line appended to `20-Daily\2026-08-18.md`. |
| 9 CTO-INBOX | Two lines appended. See §4. |

## 2. Why the run failed — all three surfaces are down

The spec says the site is server-rendered and that curl is sufficient. No available surface reaches the host.

**Surface A — container HTTP. BLOCKED by the egress proxy.**

```
curl https://insangel.co.uk/venues   -> curl: (56) Received HTTP code 403 from proxy after CONNECT
curl https://insangel.co.uk/         -> curl: (56) Received HTTP code 403 from proxy after CONNECT
curl http://insangel.co.uk/venues    -> http=403 size=39
```

The 403 comes from the proxy, not from insangel. This is the standing item `insangel-egress-blocked` (2026-08-08). The host is not on the egress allowlist. A run cannot change the allowlist mid-session (§6B).

**Surface B — `web_fetch`. EMPTY BODY.**

Three URLs were tried: `/venues`, `/bands`, `/venues/the-denton--newcastle`. Each returned the bare URL and no body. This is an empty read, not a parse failure. The same result was recorded by the 05:03Z firing on two of those URLs.

**Surface C — Chrome. UNREACHABLE.**

`list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "Claude in Chrome is not connected". Two attempts, consistent, not transient.

Chrome has now been unreachable for 24 consecutive enrichment firings, over 23 hours, plus spider, klma, gigs-news and sceniceye. Those tasks each have a working second surface. insangel does not.

**The intersection is what stops this source.** Every insangel run since 2026-08-09 captured through Chrome, because the proxy blocks the host. The current snapshot header records this in its own provenance line. With Chrome down, insangel has no surface at all.

## 3. What was NOT done, deliberately

- **No snapshot write.** `data\state\insangel-last-page.txt` is untouched. It still holds the `2026-08-15T06:48:00Z` capture, 72 venues and 656 artist-gig rows. A snapshot written with no capture would mark rows as seen that this run never read. The next diff would then swallow them (§6A step 5).
- **No deletions and no cancellations.** The spec declares no §0.29 mode, so the run defaults to append-only. There was also no capture to diff.
- **No bndy write of any kind.** Nothing was created, edited, enriched or deleted.
- **No artist create attempted.** §2A.1 item 5 forbids a bare create. The identity check needs Chrome, which is down.
- **The 2026-08-15 backlog is untouched and unchanged.** It is not lost. The next run with a working surface re-reads the source and retries it.

## 4. CTO-INBOX

Two lines appended.

```
| 2026-08-18 | insangel | DECISION | insangel-egress-allowlist-request | Add insangel.co.uk to the egress allowlist. Chrome is the only surface today and it is down. | data/normalized/insangel/2026-08-18/RUN-REPORT-2.md |
| 2026-08-18 | insangel | DEFECT | insangel-daily-note-line-absent-0512z | The 05:03Z report claims a daily-note append. 20-Daily/2026-08-18.md holds no insangel line. | data/normalized/insangel/2026-08-18/RUN-REPORT.md §1 |
```

**Not raised, because an existing item already covers it (CTO-INBOX rule 4 and rule 5):**

- `insangel-no-capture-surface` — appended by the 05:03Z firing today. This firing reproduces it exactly. A second identical line adds noise, not information. The new DECISION line names the remedy instead, which no existing item does.
- `insangel-egress-blocked` (2026-08-08) — the egress fault itself.
- The `bv2a-chrome-unreachable-*` series — the Chrome outage itself, per task.
- `insangel-mode-not-declared` (2026-08-12) — the missing §0.29 mode declaration.
- `run-report-path-collides-on-second-firing` (2026-08-12) — the report path collision this firing worked around.

**Why the DECISION line is new.** `insangel-egress-blocked` states the fault. No open item asks for the fix. The fault was tolerable while Chrome worked. It is now the sole cause of a source producing zero records for a full day, so the allowlist decision is load-bearing and needs Jason.

**Why the DEFECT line is new.** It is a second instance in one day of a run report claiming a write that is absent from disk. The first is `sceniceye-daily-note-line-absent`, raised by the sweep task today. Two instances in two tasks suggest a pattern rather than one slip.

## 5. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Artists created with a verified page | 0 |
| Artists created with an evidenced blank | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Events deleted | 0 |
| Rows skipped | 0 (no capture, so no row was read) |
| Names sanitised under §0.6 | 0 |
| Gate bounces (409/422) | 0 |
| Snapshot delta | none — no capture, no snapshot write |
| Validator | not run — zero records written |
