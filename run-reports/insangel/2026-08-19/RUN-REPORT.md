# insangel — RUN REPORT — 2026-08-19

**OUTCOME: FAILED. No capture surface. Zero rows captured. Zero writes to bndy.**

| Field | Value |
|---|---|
| Run id | `insangel-2026-08-19T05-03-14Z` |
| Fired at | 2026-08-19T05:03:14Z |
| Today's date (§6A step 1) | 2026-08-19 |
| Runbook read | `RUNBOOK.md` H1 **v2.27** |
| Floor asserted (§6A step 2a) | §6A CURRENT FLOOR **v2.19**. v2.27 is at or above the floor. PASS. |
| Floor named in the task prompt | none. The prompt defers to §6A. No drift to report. |
| Spec read | `sources/insangel.md` (full) |
| Inbox read | `CTO-INBOX.md` (full, 331 lines) |
| Claim | acquired, `data/state/claims/insangel.json`, no live holder |
| Heartbeat | `data/state/heartbeat/insangel-2026-08-19T05-03-14Z.json` |

---

## 1. Where the run stopped

The run stopped at **§6A step 3 — verify the tools you need**. §6A step 3 says to stop and
report when a required surface is missing. The run made no capture and no write.

Counts: **0 events, 0 artists, 0 venues, 0 enrichments, 0 deletions, 0 stages.**

## 2. The three surfaces, each tried

| # | Surface | Result | Evidence |
|---|---|---|---|
| 1 | container `curl` | **HTTP 000.** The egress proxy refuses the CONNECT. | `HTTP/1.1 403 Forbidden` with header `X-Proxy-Error: blocked-by-allowlist` on `CONNECT insangel.co.uk:443`. DNS also returns no result inside the container. |
| 2 | `web_fetch` | **Empty body.** The tool returns the URL and no content. | Tried `/venues`, `/bands`, `/`, and one venue detail page `/venues/the-denton--newcastle`. All four returned an empty body. |
| 3 | Claude in Chrome | **Not connected.** | `list_connected_browsers` returned `[]`. `tabs_context_mcp` returned "not connected" on two attempts. Not transient. |

⚠ The `curl` control probe also failed (`https://www.google.com/` returned HTTP 000), so the
container proxy allowlist is narrow for this session generally. The insangel refusal is
nevertheless explicit and host-named in the proxy header quoted above.

⚠ Surface 2 was tried because three tasks logged on 2026-08-18 and 2026-08-19 that a fetch
surface reached a host their spec called blocked — `klma-curl-reproduces-gviz-live`,
`gigs-news-curl-reproduces-week-view`, `sceniceye-curl-reproduces-live-week` and
`cosey-rigger-webfetch-reachable`. **That finding does not extend to this host.** insangel
returns an empty body to `web_fetch`, not a page. This is now measured, not assumed.

⚠ Chrome is the surface that historically worked for this source. The 2026-08-09 run recorded
`egress block was sandbox-only, Chrome reached site`. Chrome has been unreachable for 31
consecutive enrichment firings since 2026-08-17T22:17Z, and for every insangel firing since
2026-08-18T05:03Z.

## 3. Run history of this outage

| Firing | Outcome | Reason |
|---|---|---|
| 2026-08-15T06:42Z | completed | 10 events, 4 artists. Diff 4 added / 13 removed, all removals date-passed. |
| 2026-08-18T05:03Z | failed | no capture surface |
| 2026-08-18T21:32Z | failed | no capture surface |
| 2026-08-19T05:03Z (this run) | **failed** | no capture surface |

This is the **third consecutive failed firing** and the **fourth day** with no insangel capture.

## 4. Snapshot (§6A step 7)

**No snapshot was written, and that is correct.**

- The fail-closed snapshot gate binds a run that WROTE to bndy. This run wrote nothing.
- §6A step 5 forbids writing a snapshot on a held run. A snapshot written from no capture
  would record every live row as "seen" and would make the next diff swallow the whole page.
- `data/state/insangel-last-page.txt` is unchanged. It holds the 2026-08-15 capture, 84 rows.

⚠ The stored snapshot is now four days old. When a surface returns, the diff will present a
large added set. That is the correct behaviour and needs no action.

## 5. Validator (§6A step 8)

Not run. The validator takes the records a run wrote. This run wrote no record, so it has no
input. No evidence file was created, for the same reason.

## 6. Mode declaration (§0.29)

`sources/insangel.md` declares neither `delta` nor `append-only`. The run would have defaulted
to append-only. Already raised as `insangel-mode-not-declared` on 2026-08-12. Not raised again.

## 7. Items raised to CTO-INBOX.md

One line, fingerprint `insangel-no-surface-third-consecutive-firing`.

**Not raised again — already open in the inbox:**

- `insangel-no-capture-surface` (2026-08-18) — the same outage, first night.
- `insangel-egress-allowlist-request` (2026-08-18, DECISION) — the fix this source needs.
- `insangel-egress-blocked` (2026-08-08) — the original egress finding.
- `insangel-mode-not-declared`, `insangel-snapshot-hides-backlog` (2026-08-12).
- `insangel-year-rule-underdates-13mo` (2026-08-12), `insangel-slug-form-externalid` (2026-08-14).
- `insangel-houghton-golf-club-no-address`, `insangel-placeholder-list-incomplete` (2026-08-15).
- Every open `bv2a-chrome-unreachable-*` line. The Chrome outage is well evidenced elsewhere.

## 8. What is waiting behind this outage

`insangel-snapshot-hides-backlog` records that the 2026-08-09 run left **633 rows unwritten**
and still wrote a full snapshot. Later firings reduced that backlog, but the diff cannot
re-offer a row the snapshot already records. A run that never captures cannot reduce it either.

## 9. Steps 7b and 8

- `data/state/run-summary.jsonl` — one line appended, outcome `failed`, all counts zero.
- `20-Daily/2026-08-19.md` — one line appended, linking this report.

## 10. Corrections applied

None. The run made no decision about any record.
