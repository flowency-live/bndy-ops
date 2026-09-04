# KLMA Stoke gig list — RUN REPORT 2026-09-03

Run id: `klma-stoke-gig-list-2026-09-03T03-08-37Z`
Outcome: **completed**
Runbook read: `RUNBOOK.md` **v2.27**. Floor in §6A: **v2.19**. Assertion PASSED.
Task prompt names no numeric floor, so there is no drift to report this run.
Spec read: `sources/klma-stoke-gig-list.md` (updated 2026-08-06) in full.
Claim: `data/state/claims/klma-stoke-gig-list.json` was released (`heldBy: null`). Acquired at
03:08:37Z, TTL 2 hours, `expiresAt` 05:08:37Z. No takeover.
Heartbeat: `data/state/heartbeat/klma-stoke-gig-list-2026-09-03T03-08-37Z.json`.

## 1. Counts

| Measure | Count |
|---|---|
| Events created and read back | 4 |
| Artists created and read back | 2 |
| Venues created | 0 |
| Venues matched | 2 |
| Artists matched | 2 |
| Events deleted | 0 |
| Rows skipped | 0 |
| Gate bounces (409/422/500) | 0 |
| Validator | 2 records, 2 clean, **0 FAIL**, 0 WARN |

## 2. Quality split (§6, v2.5 rule)

- Created **with a verified page**: 1 — Dorothy Bird.
- Created with an **evidenced blank**: 1 — Heidi.
- **Staged**: 0.
- Names **sanitised or skipped as non-acts** under §0.6: 0.

## 3. Capture

Section 1 surface: container `curl` on
`https://docs.google.com/spreadsheets/d/1atEqyN-RI1smTzSaCtMUSui7oNp2dhCpiGoAfY5ySno/gviz/tq?tqx=out:html&gid=831966245`.
HTTP 200, 100,758 bytes, md5 `4653e178b3e34fbc002ded49c8a5c7f5`, 389 normalised rows.
Raw capture: `data/raw/klma-stoke-gig-list/2026-09-03/gviz-out-html.html`.
The md5 differs from the 2026-09-02 capture, so the sheet changed in 24 hours.
`web_fetch` on the gviz endpoint was NOT used (spec: it serves a stale cache).
Chrome was reachable this run: one connected browser, `7ad060c3-b3e0-41c9-9dd4-a8097db94bfa`.

Column layout re-verified against three known rows. It is unchanged:
`0 rowid/timestamp | 1 Date | 2 Artist | 3 Venue & Location | 4 Time | 5 Cost/Ticket | 6 Genre | 7 Link`.

Section 2 surface: `web_fetch` on `https://www.thesugarmill.co.uk/gig-guide/`. 31 distinct gigs,
deduplicated on the slug. Container curl on that domain is still HTTP 000.

## 4. Diff (§5.7, both sides normalised per §5.7(a))

### Section 1 — KLMA sheet: 3 added / 10 removed

**Added (3):**

1. `Saturday, September 5, 2026 | Southbound | Clough Hall Kidsgrove | 7:30 | £0.00 | Rock`
2. `Thursday, September 17, 2026 | Arliston + Dorothy Bird + Heidi | Artisan Tap Hartshill | Doors at 19:00 | £6 | Indie, Folk, Rock`
3. `29/12/2026 | Joy Diversion (the Joy Division tribute) | Artisan Tap, Hartshill | 8pm | £12 | Post Punk | <seetickets url>`

**Removed (10). NONE is a source-dropped future gig:**

- 5 rows rolled off the top because their date passed or is today (Ant Clowes Duo, C&c Duo,
  Danny Brab, Walking Alone — all 2026-08-31; Gillespie Blues Band 2026-09-01; Tomas Doncker
  2026-09-03 is today).
- 1 form-metadata banner row. The curator rolled its date from `1/9/2026` to `1/5/2026`.
- 3 Arliston 2026-09-17 rows the curator **merged into one row**, plus 1 seetickets duplicate of
  the same gig. Added row 2 above IS those four rows. The gig did not vanish.

**Mode (§0.29):** the spec declares NO mode. The run defaulted to **append-only**. Nothing was
deleted and §0.17 did not run. Already fingerprinted as `klma-no-delta-mode-declared`.

**§5.7(a) gate:** the new snapshot was re-diffed against the capture it was written from.
Result **0 added / 0 removed. PASSED.**

### Section 2 — The Sugarmill: 0 added / 0 removed

31 gigs, unchanged from the 2026-09-02 snapshot. Status markers unchanged: `arkayla` SOLD OUT,
`the-year-grunge-broke` RESCHEDULED. The three known stale ticket-link dates recur and were not
imported; the title date remains the authority (§VA.9). Nothing to pipeline.

## 5. Rows pipelined

Ordering (spec, CTO ruling 2026-08-08): the added rows were grouped by artist. Every group held
one gig, so no group had a budget advantage. The rows were worked cheapest-and-most-certain first.

### 5.1 Southbound @ The Clough Hall — 2026-09-05

- Venue **matched**: `The Clough Hall`, Clough Hall Rd, Kidsgrove, ST7 1AN —
  `D2PWaHeWP2tUUGrv5lX4`, place_id `ChIJSR3TnsVcekgRUHdVErViVSk`. Confidence 73.
  Postcode ST7 is Staffordshire, so §0.24 passes.
- Artist **matched**: `Southbound`, Stoke-on-Trent — `T3vyQPs3qY3XvWInPKhX`, confidence 100.
- Event **created**: `bffcbbd2-82c2-4362-b292-01d4a966d3f2`, 19:30, `isPublic: true`.
- §CT: `£0.00` maps to `ticketed: false`, `price: Free`. The table already carries `£0.00`.
- externalId `{klma-stoke-gig-list, 2026-09-05-southbound-the-clough-hall}`.

### 5.2 Arliston + Dorothy Bird + Heidi @ Artisan Tap — 2026-09-17

The headline event already existed: `f3b08b4b-2e37-4f91-b3c3-057c1c3832eb` (Arliston
`ec8eb0bd-8f60-47a5-b62e-2ba8437515cf`), created 2026-09-01, carrying price £6, `Doors 19:00` and
the seetickets link. **The 2026-09-01 run did not perform the §4 split**, so the two support acts
held no record and no event. This run created both.

- Artist **created**: `Dorothy Bird` — `01cff68a-2135-43ee-bfd6-103e6b00b816`.
  Verified page `facebook.com/dorothybirdmusic` (1K followers, page type Musician/band).
  Bio quoted character for character: *"DOROTHY BIRD - Art Pop Singer-Songwriter living and
  creating between Liverpool and Berlin."* Location **Liverpool** taken from the act's own page,
  not from the gig town — Artisan Tap is a national-act venue and §0.7's fallback is forbidden
  there. `actType: originals` (own albums on Bandcamp). `genres: [Pop]` — the page says "Art Pop",
  which is not an enum value; `Pop` is the §0.18 mapping and the only inferred field.
  Avatar is the stable graph URL.
- Artist **created**: `Heidi` — `4447a846-4954-4da0-a8a5-e85ab6bdc52c`. **Evidenced blank.**
  Searched, per §2A.1 item 3b, on BOTH surfaces:
  Google — `Arliston Dorothy Bird Heidi Artisan Tap`, `"Heidi" band Arliston support tour 2026`,
  `"Heidi" Liverpool indie band Facebook Dorothy Bird support`.
  Facebook page search — `heidi band arliston`, which returned exactly one page: `Heidi`,
  Performing arts, 133K followers, `instagram: djheidi`. That is a house DJ with no link to this
  bill, so it fails the §2A.1 evidence bar and was NOT attached. Blank beats wrong.
  The name is not invented: the promoter's own ticket slug is `arliston-dorothy-bird-heidi`.
  Location `UK wide` with `locationType: regional` (§0.7 national-act-venue exception, §6B
  Kilmarnock trap). Read-back shows no coordinates, so no Kilmarnock geocode occurred.
  `artistType: band` is the schema's required field and is the least specific value available;
  the source states no format.
- Events **created**, one per act (§4 steps 1–3, no parent container built yet):
  - `79018db3-49cb-4922-8d6e-2ba7c9893211` — Dorothy Bird @ Artisan Tap
  - `3b02f752-bebb-4263-ae72-d68bc596244a` — Heidi @ Artisan Tap
  - **Sibling ids for a future parent event**: `f3b08b4b-2e37-4f91-b3c3-057c1c3832eb`,
    `79018db3-49cb-4922-8d6e-2ba7c9893211`, `3b02f752-bebb-4263-ae72-d68bc596244a`.
- §0.28: the sheet publishes `Doors at 19:00` and no stage time. Rule 2 applies — `startTime`
  19:00 and `Doors 19:00` in `ticketInformation`, matching the existing sibling.
- `allowDistantVenue: true` on the Dorothy Bird event. Liverpool to Hartshill exceeds the 40-mile
  guard and this is a legitimate tour date.

### 5.3 Joy Diversion @ Artisan Tap — 2026-12-29

- Artist **matched**: `Joy Diversion`, Cheshire — `74e8a756-ea08-4b51-9364-d66cf0137711`,
  confidence 100. No new record.
- Event **created**: `2581913f-6ff9-480b-8493-443088de9aed`, 20:00, `isPublic: true`.
- §CT: `£12` maps to `ticketed: true`, `price: £12`.
- The seetickets URL carried 12 tracking parameters. Everything after `?` was stripped for
  `eventUrl` and `ticketUrl`, per the spec's URL-cleanup rule. The snapshot keeps the raw string.
- The billing `Joy Diversion (the Joy Division tribute)` is kept in the EVENT TITLE only. The
  artist name stays `Joy Diversion` (§0.6).
- Genre `Post Punk` is not in the 36-value enum. No genre was written. The event has no genre
  field and the artist record was not touched. Logged here so the §0.18 table can grow.

## 6. Venue-authoritative checks (§VA.7)

| Venue | State this run |
|---|---|
| Cosey Club | **Not checked.** No added or removed row referenced it, so there was no name to settle. |
| Eleven | **Not checked.** Same reason. |
| The Rigger | **Not checked.** Same reason. |
| Artisan Tap | **Unreachable, as it has been since 2026-08-01.** `artisantap.com/shows` still has no proven surface. Names for both Artisan Tap rows came from the sheet, corroborated by the promoter's seetickets slug and by visitstoke.co.uk. |
| The Sugarmill | **Checked.** Page fetched complete, 31 gigs, 0 added / 0 removed. |

⚠ The four merge venues were not fetched because none appeared in the diff. §VA.6 places the
venue check between capture and pipeline, and a venue with no changed row has nothing to merge.
This is stated rather than reported as "checked".

⚠ visitstoke.co.uk's listing for the Arliston Artisan Tap show names the support as
*"Hannah Sophie…"*, not Dorothy Bird or Heidi. It is a third-party listing and is very likely
stale or describes the earlier 2025 Arliston date at the same room. The promoter's own ticket
slug and the sheet both say Dorothy Bird and Heidi, so those won. Recorded here verbatim.

## 7. Defaults, corrections and gate bounces

- Defaulted start times: **none.** Every row published a time.
- Corrections applied: **none.** No act or venue page contradicted the sheet.
- 409 / 422 / 500 bounces: **none.**
- Tombstone check (§5.4): `data/state/cancellations.jsonl` grepped for southbound, arliston,
  dorothy bird, heidi and joy diversion. No match. No create was blocked.
- Today's other run reports and `run-summary.jsonl` were read before treating any absence as a
  gap (§5.4 v2.19). No event created this run was missing-because-deleted.
- `record_run` was NOT called. It fails on a missing `SOURCE_RUNS_TOKEN` and is already
  fingerprinted as `record-run-token-missing`. `run-summary.jsonl` is the dashboard's input and
  was appended.

## 8. Validator (§6A step 8)

Evidence file, written BEFORE the bndy writes:
`data/state/enrichment-evidence-2026-09-03-klma-stoke-gig-list.jsonl` (2 lines).

```
2 records · 2 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0.

## 9. Snapshot

`data/state/klma-stoke-gig-list-last-page.txt` rewritten, both sections, 389 section-1 rows and
31 section-2 rows. The normalisation rules are in the file's own header. Fail-closed gate
satisfied.

## 10. Raised to CTO-INBOX

One new item. Everything else this run met was already fingerprinted.

- `klma-multiact-split-not-applied` — DATA.

## 11. Open, carried forward

- The spec still declares no §0.29 mode (`klma-no-delta-mode-declared`).
- Artisan Tap still has no venue-authoritative surface (§VA.1, open since 2026-08-01).
- `Heidi` holds no page, no bio and no image. It is an evidenced blank, not a stub by neglect.
  A later enrichment pass should retry it once the act plays a second dated gig.
