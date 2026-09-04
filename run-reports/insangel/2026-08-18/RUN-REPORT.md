# insangel — RUN REPORT — 2026-08-18

**OUTCOME: FAILED. No capture surface. Zero writes to bndy. No snapshot written.**

- runId: `insangel-2026-08-18T05-03-09Z`
- Heartbeat: `data\state\heartbeat\insangel-2026-08-18T05-03-09Z.json`
- Runbook read: `RUNBOOK.md` H1 **v2.27**. Floor in §6A: **v2.19**. Prompt floor: none stated. Gate PASSES.
- Spec read: `sources\insangel.md` in full.
- CTO-INBOX read in full before any append.

## 1. Steps completed

| Step | Result |
|---|---|
| 0 heartbeat | Written `05:03:09Z`, `outcome: started`. Rewritten at the end of this run. |
| 1 date | `2026-08-18` (container clock, UTC `05:03:09Z`). |
| 2 runbook + spec | Both read in full. |
| 2a floor | v2.27 >= v2.19. Pass. |
| 2b claim | `data\state\claims\insangel.json` read. It held `heldBy: null`, released `2026-08-15T07:26:00Z`. Acquired normally. No takeover. TTL 90 minutes (§6G), `expiresAt 2026-08-18T06:33:09Z`. |
| 3 tools | **FAILED HERE.** See §2. |
| 4 capture | Not reached. |
| 5 diff | Not reached. |
| 6 pipeline | Not reached. Zero creates, zero edits, zero deletions. |
| 7 report | This file. **No snapshot written** — correct, because the run wrote nothing to bndy and holds no capture. |
| 7b run-summary | One line appended, `outcome: failed`. |
| 8 validator | Not applicable. No records written, so no evidence file exists to validate. |
| 8b daily note | One line appended to `20-Daily\2026-08-18.md`. |
| 9 CTO-INBOX | One line appended. See §4. |

## 2. Why the run failed — both capture surfaces are down at once

insangel publishes server-rendered HTML. The spec says curl is sufficient. **Neither available surface can reach the host.**

**Surface A — container HTTP. BLOCKED.**

```
curl -sS --max-time 60 -A "Mozilla/5.0 ..." https://insangel.co.uk/venues
curl: (56) Received HTTP code 403 from proxy after CONNECT
HTTP:000 SIZE:0
```

The 403 comes from the egress proxy, not from insangel. This matches the standing CTO-INBOX item `insangel-egress-blocked` (2026-08-08). `insangel.co.uk` is not on the egress allowlist. Nothing in a run can change that (§6B: the allowlist is read at session start).

`web_fetch` was tried on `/venues` and on `/bands`. Both returned the bare URL and no body — an empty read, not a parse failure.

**Surface B — Chrome. UNREACHABLE.**

`tabs_context_mcp` returned "Claude in Chrome is not connected". `list_connected_browsers` returned `[]`. Two attempts, consistent, not transient.

This is the same outage that has run all night. Tonight's CTO-INBOX already carries it for enrichment (firings 22, 23, 00, 01, 02, 03, 04), spider, klma, gigs-news and sceniceye.

**The combination is what stops this source specifically.** Every insangel run since 2026-08-09 has captured through Chrome precisely because the egress proxy blocks the host — the 2026-08-15 snapshot header states this in its own provenance line. Chrome is not a preference for this source; with egress blocked it is the only surface. When both are down there is no capture, and §6A step 3 says STOP and report.

Other tasks tonight worked around Chrome by using container curl. That route does not exist here.

## 3. What was NOT done, deliberately

- **No snapshot write.** `data\state\insangel-last-page.txt` is untouched and still holds the `2026-08-15T06:48:00Z` capture. Writing a snapshot with no capture would record rows as "seen" that this run never read, and would make the next run's diff swallow them silently (§6A step 5).
- **No deletions, no cancellations.** The spec declares no §0.29 mode, so append-only is the default. There was no capture to diff in any case.
- **No bndy writes of any kind.** Nothing was created, edited, enriched or deleted.
- **No new artist creates attempted.** Even with a capture, §2A.1 item 5 forbids a bare create and Chrome is required for the identity check, so new acts would have been skipped this firing regardless.

## 4. CTO-INBOX

One line appended:

```
| 2026-08-18 | insangel | BLOCKED | insangel-no-capture-surface | Egress blocks the host and Chrome is unreachable. This source has no third surface. Zero capture. | data/normalized/insangel/2026-08-18/RUN-REPORT.md |
```

Checked against the existing fingerprints first. It is **not** a duplicate of:

- `insangel-egress-blocked` (2026-08-08) — that item is the egress fault alone. Runs after it succeeded through Chrome, so egress alone is not blocking.
- The five `*-chrome-unreachable-*` items from tonight — those are per-task, and each of those tasks has a working second surface. insangel does not.

The point of the new line is the **intersection**: this is the only source with no fallback when Chrome is down.

Not raised, because an existing item already answers it (CTO-INBOX rule 4):

- The missing §0.29 mode declaration — already open as `insangel-mode-not-declared` (2026-08-12).
- The snapshot hiding an unwritten backlog — already open as `insangel-snapshot-hides-backlog` (2026-08-12).
- `record_run` and its missing `SOURCE_RUNS_TOKEN` — already open as `record-run-token-missing`, and not blocking.

Also observed and **not** raised as a new item, because it needs no ruling and no fix from a run: `insangel` has no row in the §6D slug↔path table, though §6D prose names it as a canonical namespace and the spec states its paths explicitly. The paths used by this run are the spec's, which match the §6A path convention exactly. It is a documentation gap with no live effect. Noted here so a CTO session can close it on next touch of the runbook.

## 5. Counts

| | |
|---|---|
| Events created | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Records deleted | 0 |
| Rows skipped | 0 (no rows were read) |
| Gate bounces (409/422/500) | none — no call was made |
| Names sanitised | 0 |
| Verified-page creates | 0 |
| Evidenced blanks | 0 |

## 6. Next run

The next firing retries normally. Nothing is lost: insangel republishes its full forward listing every day, so a missed night costs nothing but the delay. The run will succeed as soon as **either** surface returns.

The durable fix is one of two things, and both need a human:

1. Add `insangel.co.uk` to the egress allowlist. That removes the Chrome dependency for this source permanently and is the stronger fix.
2. Restore the Chrome extension. That fixes tonight's outage across all six affected tasks but leaves insangel single-surfaced.
