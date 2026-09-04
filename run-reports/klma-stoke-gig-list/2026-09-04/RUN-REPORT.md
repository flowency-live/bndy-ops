# KLMA Stoke gig list — RUN REPORT 2026-09-04

Run id: `klma-stoke-gig-list-2026-09-04T03-08-39Z`
Outcome: **completed**
Runbook read: `RUNBOOK.md` **v2.27**. Floor in §6A: **v2.19**. Assertion PASSED.
The task prompt names no numeric floor. There is no drift to report.
Spec read: `sources/klma-stoke-gig-list.md` (updated 2026-08-06) in full.
CTO-INBOX read in full before any write.
Claim: `data/state/claims/klma-stoke-gig-list.json` was released (`heldBy: null`). Acquired
03:09:00Z, TTL 2 hours, `expiresAt` 05:09:00Z. No takeover.
Heartbeat: `data/state/heartbeat/klma-stoke-gig-list-2026-09-04T03-08-39Z.json`.

## 1. Counts

| Measure | Count |
|---|---|
| Events created and read back | 2 |
| Artists created | 0 |
| Venues created | 0 |
| Artists matched | 2 |
| Venues matched | 2 |
| Artists enriched (genre top-up) | 1 |
| Events deleted | 0 |
| Rows skipped | 0 |
| Gate bounces (409/422/500) | 0 |
| Validator | 1 record, 0 clean, **0 FAIL**, 1 WARN |

## 2. Quality split (§6, v2.5 rule)

- Created **with a verified page**: 0 artists created this run.
- Created with an **evidenced blank**: 0.
- **Skipped**: 0.
- Names **sanitised or skipped as non-acts** under §0.6: 0. Neither added row carried promo copy.
- Both added rows resolved to artists that already exist in bndy, so no identity check needed
  Chrome. The outage below did not cost a record.

## 3. Tools (§6A step 3)

- bndy MCP: reachable. All calls succeeded.
- **Claude in Chrome: NOT reachable.** `tabs_context_mcp` returned "not connected" on two
  attempts and `list_connected_browsers` returned `[]`. This is the same outage the spider run
  reported earlier today (`builtin-browser-navigation-denied-unattended`).
- The run continued because neither surface it needs is Chrome. Section 1 uses container curl on
  the gviz endpoint (established 2026-08-18 and 2026-08-29, fingerprints
  `klma-curl-reproduces-gviz-live` and `klma-curl-is-a-trusted-gviz-surface`). Section 2 uses
  `web_fetch`. Chrome is needed only for a new-artist identity check (§2A.5), and no new artist
  was needed.
- `web_fetch` on the gviz endpoint was NOT used. The spec bans it — it serves a stale cache.

## 4. Capture

Section 1: container `curl` on
`https://docs.google.com/spreadsheets/d/1atEqyN-RI1smTzSaCtMUSui7oNp2dhCpiGoAfY5ySno/gviz/tq?tqx=out:html&gid=831966245`.
HTTP 200, 100,300 bytes, md5 `67d7072d357fb14102e6c2be41ea77ae`, 387 normalised rows.
Raw capture: `data/raw/klma-stoke-gig-list/2026-09-04/gviz-out-html.html`.
The md5 differs from the 2026-09-03 capture, so the sheet changed in 24 hours.

Column layout re-verified against the trailing header row and two data rows. It is unchanged:
`0 rowid/timestamp | 1 Date | 2 Artist | 3 Venue & Location | 4 Time | 5 Cost/Ticket | 6 Genre | 7 Link`.

Section 2: `web_fetch` on `https://www.thesugarmill.co.uk/gig-guide/`. 31 distinct gigs after
deduplicating the THIS MONTH / NEXT MONTH / ALL tabs on the slug. Container curl on that domain
is still HTTP 000.

## 5. Diff (§5.7, both sides normalised per §5.7(a))

### Section 1 — KLMA sheet: 2 added / 4 removed

**Added (2), both pipelined:**

1. `46268.51603 | Friday, September 4, 2026 | Mike & The Floorfillers | Sir Robert Peel Dresden | 9.30pm | Free Entry | Soul, NSoul, Motown, Pop, Ska, Reggae, Indie, Classic Rock, Country`
2. `46268.52387 | Saturday, September 5, 2026 | Eaton Park | The Auctioneer Arms Caverswall | 9pm | Free entry | Indie/rock/pop`

**Removed (4). NONE is a source-dropped future gig.** All four are past-dated rows rolling off
the top of the sheet, which §5.7 states is normal:

- `Gordie Tentrees & Kieran Poile` @ Artisan Tap, 2026-09-02 — two rows, the known VA.5(a)
  double-submission in both venue spellings.
- `Danny Brab` @ Shroppie Fly, Audlem, 2026-09-03.
- `Tomas Doncker` @ Artisan Tap, 2026-09-03.

**Mode (§0.29):** the spec declares NO mode. The run defaulted to **append-only**. Nothing was
deleted and §0.17 did not run. Already fingerprinted as `klma-no-delta-mode-declared`.

**§5.7(a) gate:** the new snapshot was re-diffed against the capture it was written from.
Result **0 added / 0 removed. PASSED.**

### Section 2 — The Sugarmill: 0 added / 0 removed

31 gigs, unchanged from the 2026-09-03 snapshot. Status markers unchanged: `arkayla` SOLD OUT,
`the-year-grunge-broke` RESCHEDULED. The three known stale ticket-link dates recur and were not
imported; the title date remains the authority (§VA.9). Nothing to pipeline.

`ELECTRIC FRIDAYS` appears in the page's promo banner, above the gig guide. It is a weekly club
night, not a `div.row2` gig-guide row, and it is a DJ night. It is not a snapshot row and is
rejected under §VA.9's classification table.

## 6. Rows pipelined (ordered per the spec's gigs-per-artist rule)

Two rows, one gig per artist. The ordering rule had nothing to order.

### Row 1 — Mike & The Floorfillers @ Sir Robert Peel, 2026-09-04

- Artist: matched **100%** to `3eg14QpWlx1NTnLoJ5y1` "Mike & The Floorfillers",
  Stoke-on-Trent. Same name, same region, so §1A gives SAME act. Reused.
- Venue: `search_venue("Sir Robert Peel", "Stoke-on-Trent")` matched **100%**
  `5002a5d9-cb02-4f55-9770-e2438da5e6ca`, 58 Peel St, Dresden, ST3 4PF. Postcode prefix ST3 is
  Stoke, as expected (§0.24). It already carries the `klma-stoke-gig-list` externalId.
- Time: `9.30pm` → **21:30** (spec `H.MMpm` pattern). Not defaulted.
- `Cost/Ticket` = `Free Entry` → `ticketed: false`, `price: "Free"` (§CT, matched
  case-insensitively). Already in the §CT table. No new spelling.
- Event **created**: `21570bed-8f79-4d32-b60f-1810b3a8aec1`. Read back (§0.10): date, time,
  price, `isPublic: true` and the externalId all correct.
- externalId: `{source: "klma-stoke-gig-list", id: "2026-09-04-mike-the-floorfillers-sir-robert-peel"}`.

### Row 2 — Eaton Park @ The Auctioneers Arms, 2026-09-05

- Artist: matched **100%** to `HOifh16xNRfedOMgSkG1` "Eaton Park", Stoke-on-Trent. Reused.
- Venue: `search_venue("The Auctioneers Arms", "Caverswall")` matched **100%**
  `S4OJgiii3JAGHVRd0iQq`, 1A The Grn, Caverswall, ST11 9EQ. The sheet's singular spelling
  "Auctioneer Arms" is a source variant of the bndy record. Postcode ST11 is Staffordshire.
- Time: `9pm` → **21:00**. Not defaulted.
- `Cost/Ticket` = `Free entry` → `ticketed: false`, `price: "Free"`.
- Event **created**: `347983b9-5a65-4536-be82-a48961984db3`. Read back: all fields correct.
- externalId: `{source: "klma-stoke-gig-list", id: "2026-09-05-eaton-park-the-auctioneers-arms"}`.

### Tombstone check (§5.4, v2.19)

`data/state/cancellations.jsonl` was searched for both artist + venue + date pairs before either
create. No match. Neither gig has been ruled on by another run.

## 7. Enrichment

No artist was created, so §2A.5's create-time enrichment bar did not apply.

One top-up under §1A.4 / §2A.2, from the sheet's own structured genre cell (§2A.5(b)):

- `3eg14QpWlx1NTnLoJ5y1` Mike & The Floorfillers — genres went from
  `[Indie, Britpop, Ska, Rock, Soul, Motown]` to
  `[Indie, Britpop, Ska, Rock, Soul, Motown, Pop, Reggae, Country]`. Read back and confirmed.
  The sheet cell also held `NSoul`, which is not an enum value and matches nothing in the §0.18
  table. It was left out, not guessed. `Classic Rock` maps to `Rock` (§0.18), already present.
- Eaton Park needed nothing: the sheet's `Indie/rock/pop` is already fully covered by its stored
  `[Indie, Britpop, Rock, Pop]`.
- No bio was written. No socials were touched. Chrome was down, so no page was visited, and
  §2A.1 item 8 forbids writing a bio from anything else.

## 8. Venue-authoritative checks (§VA.7)

| Venue | Status this run |
|---|---|
| Cosey Club | **Not checked.** No added row was at Cosey, so there was no name to settle. |
| Eleven | **Not checked.** No added row was at Eleven. |
| The Rigger | **Not checked.** No added row was at The Rigger. |
| Artisan Tap | **Not checked.** Its only diff rows were past-dated removals. Its surface is still unproven (§VA.1). |
| The Sugarmill | **Checked.** `web_fetch` returned the full gig guide. 0 added, 0 removed. |

No name was corrected, because no added row was at a §VA venue. No contradiction was found.

## 9. Validator (§6A step 8)

Evidence file: `data/state/enrichment-evidence-2026-09-04-klma-stoke-gig-list.jsonl` (one record,
the genre top-up; `capturedText` is empty because no bio was written and no page was visited).

```
1 records · 0 clean · 0 FAIL · 1 WARN   [mode=gate]
WARN STUB_NO_BIO: verified page attached but bio empty — did the page have one?
```

Exit code 0. **0 FAIL.** The WARN is correct and is not actionable tonight: the record holds a
verified Facebook page and an empty bio, and the only lawful way to fill it is to quote the page,
which needs Chrome.

## 10. Caps and budget

50-create cap: 2 used. The source produced only 2 added rows, so nothing was deferred and nothing
competes on budget next run. This is a genuinely quiet day, not a truncated one.

## 11. Raised to CTO-INBOX

One line, `klma-chrome-unreachable-no-artist-cost-2026-09-04`. It records that Chrome was down and
that it cost nothing this run — the corroborating half of today's spider report, so a reader can
see the outage is account-wide and not source-specific.

Nothing else was raised. The four standing KLMA items (`klma-no-delta-mode-declared`,
`prompt-runbook-floor-drift`, `record-run-token-missing`,
`edit-event-copies-price-into-ticketinformation`) all recurred as expected and are already
fingerprinted. §5 of the inbox rules forbids a second line.

## 12. record_run

Not called. It fails on a missing `SOURCE_RUNS_TOKEN` and is already fingerprinted
(`record-run-token-missing`). `data/state/run-summary.jsonl` carries the run, as the runbook says
it should.
