# insangel — RUN REPORT 2026-08-29

- **runId**: `insangel-2026-08-29T19-47-03Z`
- **outcome**: **FAILED** — stopped at §6A step 3. No capture surface. Zero writes to bndy.
- **runbook**: `RUNBOOK.md` v2.27. CURRENT FLOOR in §6A is v2.19. The task prompt names no number. Pass.
- **spec**: `sources/insangel.md`, read in full.
- **claim**: `data/state/claims/insangel.json`. It read `heldBy: null` at 19:47:03Z. Acquired, TTL 90 minutes (§6G), `expiresAt` 2026-08-29T21:17:03Z. No takeover.
- **heartbeat**: `data/state/heartbeat/insangel-2026-08-29T19-47-03Z.json`
- **mode**: append-only. The spec declares no §0.29 mode. Standing item `insangel-mode-not-declared`. Nothing was written, deleted or hidden.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 0 |
| Events edited | 0 |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | 0 |
| Rows skipped | n/a — no capture |
| Gate bounces | 0 |
| Creates against the 50 cap | 0 |

## 2. What stopped the run

§6A step 3 requires the capture surface to be verified before step 4. **Four surfaces were tried. All four failed.**

| # | Surface | Result |
|---|---|---|
| 1 | Sandbox shell, `curl https://insangel.co.uk/venues` | Exit 1, HTTP `000`, 0 bytes. The egress allowlist still blocks the host. Standing item `insangel-egress-blocked`. |
| 2 | `web_fetch https://insangel.co.uk/venues` | HTTP success, **empty body**. Matches the 2026-08-19 finding exactly. |
| 3 | **Claude in Chrome** — the surface that captured this source on 2026-08-21 and every run to 2026-08-28 | `tabs_context_mcp` returns "Claude in Chrome is not connected". Retried once. Same result. |
| 4 | **In-app browser pane** (`preview_start`) — a fourth surface, not tried on this source before | Pane opened at `about:blank`. Navigation to `https://insangel.co.uk` **denied**. `navOk: false`. |

Two capture attempts is the §6B limit and it was observed: surface 3 was tried twice, surfaces 1, 2 and 4 once each.

**This is a change of state, not the standing egress item.** Surfaces 1 and 2 have been down since 2026-08-08 and 2026-08-19 and are already logged. Chrome has been the working surface for eight consecutive days — `insangel-chrome-is-a-working-surface`, raised 2026-08-21. Today Chrome is gone, and the in-app browser denies the host, so **this source now has no surface at all**. One new CTO-INBOX item records that. See §6.

## 3. Capture

None. `data/raw/insangel/2026-08-29/` was not written. Nothing was parsed, so no row was considered, filtered or dated.

## 4. Diff, snapshot and deletions

- **No diff was run.** There is no capture to diff against `data/state/insangel-last-page.txt`.
- **No snapshot was written.** This is correct and deliberate. §6A step 5 forbids recording a page as "seen" on a held run, because tomorrow's diff would then silently swallow every row. The fail-closed snapshot gate in §6A step 7 binds a run that **wrote** to bndy; this run wrote nothing.
- The on-disk snapshot stays at `insangel-2026-08-28T05-02-32Z`, 76 venue lines, 697 pairs, SHA-256 `72b63a47112ce6a215cb4aa3bde8c2f1f0d374bfcfd7c432f1a8b9a21b5db040`. Untouched.
- **No deletion, no hide, no tombstone.** Mode is append-only and there was no evidence of any kind to act on.

## 5. Validator (§6A step 8)

Not run. `scripts/enrichment_validate.py` takes a record set and an evidence file. This run created and enriched nothing, so both are empty and there is no batch to gate. `data/state/enrichment-evidence-2026-08-29-insangel.jsonl` was not created.

## 6. CTO-INBOX

The inbox was read in full and every fingerprint was checked before appending.

**Not re-raised — already open, and today adds nothing to them:**
`insangel-egress-blocked` · `insangel-no-capture-surface` · `insangel-no-surface-third-consecutive-firing` · `insangel-egress-allowlist-request` · `insangel-chrome-is-a-working-surface` · `insangel-mode-not-declared` · `insangel-snapshot-hides-backlog` · `insangel-placeholder-list-incomplete` · `insangel-weekday-proves-2027-year` · `record-run-token-missing`.

**One item appended**, because the fact is new and no open item states it:

```
| 2026-08-29 | insangel | BLOCKED | insangel-chrome-down-no-fourth-surface | Chrome captured this source for eight days and is now unreachable. The in-app browser denies the host. No surface. | `data/normalized/insangel/2026-08-29/RUN-REPORT.md` §2 |
```

The existing `insangel-no-capture-surface` item describes 2026-08-18, when Chrome had never worked here. The `insangel-chrome-is-a-working-surface` item, raised 2026-08-21, says the opposite of today's reading and would mislead the next run if left as the latest word. This item is the correction.

## 7. Consequence, stated plainly

The source publishes and the pipeline cannot read it. **The nightly diff loses one day.** That day's added rows are not lost permanently — the listing is a forward list, so tomorrow's diff against the 2026-08-28 snapshot will offer both days at once, within the 50-cap.

The standing backlog is the larger cost and it is unchanged: `insangel-snapshot-hides-backlog` measured on 2026-08-28 that the capture bills `Harlie Duo` at 11 venues while bndy holds 4 forward events for that act, and bills 4 rows at `Seatons Place to be` while bndy holds 1. A diff run cannot reach those. That needs a bounded catch-up lane, and it is already in the inbox.

## 8. Tool notes

- `record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN`. Standing item `record-run-token-missing`. Not blocking.
- `mcp__bndy-events__get_by_external_id` was called once to prove the bndy MCP is reachable — `the-denton--newcastle` returned venue `cdac6734-32df-4f95-b2d9-e262d4a9185a`. **The bndy tools are healthy. Only the capture surface is down.** That is a read, not a write.

## 9. Close-out

- `data/state/run-summary.jsonl` — one line appended, outcome `failed`, all counts zero.
- `20-Daily/2026-08-29.md` — one line appended, linking this report.
- `data/state/claims/insangel.json` — released, `heldBy: null`.
- `data/state/heartbeat/insangel-2026-08-29T19-47-03Z.json` — rewritten, `outcome: "failed"`, `reason: "6A.3 no-capture-surface"`.
