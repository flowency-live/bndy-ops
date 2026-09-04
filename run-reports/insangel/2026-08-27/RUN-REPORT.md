# insangel RUN REPORT — 2026-08-27

- runId: `insangel-2026-08-27T12-44-59Z`
- Runbook read: v2.27. Floor asserted from RUNBOOK §6A: **v2.19**. The task prompt names no number. PASS.
- Claim: `data/state/claims/insangel.json`, acquired 12:52:00Z, TTL 90 min (§6G), expires 14:22:00Z. Previous holder released cleanly on 2026-08-21. No takeover.
- Heartbeat: `data/state/heartbeat/insangel-2026-08-27T12-44-59Z.json`.
- Mode: **append-only**. The spec declares no §0.29 mode. Nothing was deleted or hidden.
- Outcome: **PARTIAL**. 14 events written. 44 importable added rows were not reached inside the TTL.

## 1. Capture surface

The sandbox proxy still returns `403 X-Proxy-Error: blocked-by-allowlist` for insangel.co.uk. `web_fetch` still returns an empty body. **Chrome read the page in full**, as on 2026-08-21. Collected with `fetch()` + DOM reads of `a[href]` per §0.22; no `get_page_text`.

Raw capture: `data/raw/insangel/2026-08-27/venues-capture.txt`.

`javascript_tool` guards met (§6B): the `=` guard fired on every attribute selector, so the parser uses `getElementsByClassName`/`getElementsByTagName` and filters `href` in JS. The base64 guard fired on a bare 64-character SHA-256, so the hash was returned in four 16-character parts. Output truncates near 1.1 KB, so the 18218-character snapshot was paged out in 19 slices.

## 2. Self-diff gate (§5.7a)

The reassembled snapshot is **byte-identical** to the in-page capture: SHA-256 `06b9494dd2759744d30a9a473ee3bbe3c10fed143ca8406f14ab4128ecbe948b`, 18218 bytes, on both sides. **0 added / 0 removed. Gate passes.**

## 3. Capture counts

76 venue cards, 1127 artist-gig rows. 425 declared-placeholder rows and 6 past-dated rows are out of scope. In scope: **76 venues, 695 rows**.

## 4. Snapshot diff

Against `insangel-2026-08-21T05-02-40Z`.

- Venues added: `cottage-tavern--cleadon`, `cross-keys--hamsterley`, `the-blue-bell--usworth`, `the-fairfield--stockton`
- Venues removed: `the-highwayman--lambton`, `the-wheel-house--washington`, `yuvraaj--sunderland`
- Pairs added: **60**. Two are placeholders and are not importable (`the-raven--cleadon 2026-09-30:tbc`, `three-brass-monkeys--whitley-bay 2026-09-13:backing-tracks-solo-tbc`). **58 importable.**
- Pairs removed: **49**. 43 are rows whose date has passed. That is not a cancellation (§5.7).

Future-dated removals, logged only because the mode is append-only:

| venue | date | act | reading |
|---|---|---|---|
| `hordan---peterlee-rfc` | 2026-09-12 | jada-tia | moved to 2026-09-26 |
| `namaste--sunniside` | 2027-02-20 | jane-long | moved to 2027-03-20 |
| `rappor-lounge--hartlepool` | 2026-09-26 | dave-ridley | re-billed to jonathan-honour |
| `three-brass-monkeys--whitley-bay` | 2026-09-13 | kaitlin-lee-robson | re-billed to a placeholder |
| `the-denton--newcastle` | 2026-08-29 | danielle-lincoln | dropped |
| `the-high-crown--chester-le-street` | 2026-08-30 | the-b-bops | dropped |
| `the-high-crown--chester-le-street` | 2027-02-13 | eli | re-billed to the-b-bops |
| `the-park--newcastle` | 2026-09-12 / 09-26 / 10-10 / 10-24 / 12-05 | tom-taylor, jane-long, sam-shields, anthony-morris, george-pallas | five rows dropped from one venue |
| `the-black-horse--consett` | 2026-08-29 | backing-tracks-solo-tbc | placeholder, never imported |

## 5. Tombstone check (§5.4)

`data/state/cancellations.jsonl` read before the first create. No line matches any artist + venue + date written this run.

## 6. Events created — 14, all verified by read-back

| id | title | date | externalId |
|---|---|---|---|
| `1b61ad88-00c6-45a7-94fe-38e25b315cfd` | George Pallas @ The Library | 2026-08-29 | insangel:8f6be249439f |
| `da123b18-7142-4d2d-bfd4-9b971aab1a6e` | Gary Gibson @ The Library | 2026-09-19 | insangel:35ef7024bbff |
| `9e73bddc-649c-4ebf-a1cf-26cdec1e16bf` | Chris Wraith @ The Library | 2026-09-24 | insangel:e85adab551c6 |
| `3d0907b6-cfbe-4ac3-8858-d8b872b378a9` | Anthony Morris @ The Library | 2026-10-01 | insangel:2f4e8f7b86aa |
| `af4933cb-ecdb-464d-a3cb-11c5df343cf5` | Anthony Morris @ The George & Dragon | 2026-08-30 | insangel:b5924f458890 |
| `6d47b828-00f7-437f-9353-6e3527900d9f` | George Pallas @ The Blake Arms | 2027-02-13 | insangel:341c5b31971b |
| `819bab6e-9848-4e13-8336-8c974f50dc9e` | Jane Long @ The Blake Arms | 2027-02-27 | insangel:1fb839f2e761 |
| `03e1c63c-b8f6-4290-9d7d-5ac8ecd1591a` | George Pallas @ Namaste | 2027-02-27 | insangel:8f6cf9afd47c |
| `772c3e5b-d5a9-482b-a534-98bced8f5858` | Jane Long @ Namaste | 2027-03-20 | insangel:01ca0105cae6 |
| `7005cee8-dd03-487a-a3e2-419c3fdb190c` | Joe Devanny @ Namaste | 2027-02-06 | insangel:74db905de03a |
| `6c12f93b-95bd-4fbc-847e-9839e55ca667` | George Pallas @ Langley Park Hotel | 2027-03-20 | insangel:d83a919d9718 |
| `828b8682-804b-47fc-9bfa-55a07e5cea91` | The B Bops @ The High Crown | 2027-02-13 | insangel:78ceecb50eea |
| `6e9b496d-67b3-4043-b328-e6db6e903ea2` | Eli @ The High Crown | 2027-05-15 | insangel:5da370ca8b05 |
| `99f39fe6-0112-4e45-a0bc-023d5871e813` | Blind 90 @ The High Crown | 2027-06-19 | insangel:70f40b014759 |

Read-back method (§0.10): `get_by_id` on `1b61ad88`; `search_event` by venue on The Library (4 of 4), Namaste (3 of 3) and The High Crown (3 of 3); `edit_event` read-back on `af4933cb`. The three remaining ids (`6d47b828`, `819bab6e`, `6c12f93b`) were read back from the create response only. That is a shortfall against §0.10 and is stated rather than hidden.

**All 14 start times are DEFAULTED** under §5.6. The listing page publishes no time. The server applied the rule and returned `startTimeDefaulted: true` on every write.

## 7. Correction made in-run

`af4933cb-ecdb-464d-a3cb-11c5df343cf5` was created with the title `Anthony Morris @ The George &amp; Dragon`. That breaks §6B: never HTML-escape `&` in a tool argument. Corrected by `edit_event` to `Anthony Morris @ The George & Dragon` and read back. No other write carries an entity. Own error, not a tool defect.

## 8. Quality measures (§6, v2.5)

- Records created with a verified page: **0 artists were created**, so this measure has no subject.
- Records created with an evidenced blank: **0**.
- Artists created: **0**. Venues created: **0**.
- Names sanitised or skipped as non-acts: 2 placeholder rows skipped (`tbc`, `backing-tracks-solo-tbc`).
- No stub was written. Every event attaches to an artist and a venue that already existed and already matched on normalised name equality.

## 9. Artists resolved

Linked on normalised name EQUALITY only, per the spec's match ladder. No score-based link was made.

George Pallas `3c10e5f8-52e0-422d-9e25-c2afd517395a` · Anthony Morris `e83a7b5f-1a5f-4b57-b389-6d9eb402a9a5` · Chris Wraith `cc53e048-3161-4aa7-8949-add1401986f6` · Gary Gibson `d63a9194-fe74-4b65-a020-804356f3232c` · Jane Long `0b8e3c3e-81cb-4027-889f-143e59091c28` · Joe Devanny `9437042a-721c-41f8-92d7-d04a8493b65f` · The B Bops `bf4cb5cf-3383-4dc9-a028-233091550b0b` · Eli `5a00f621-559b-45b7-ba6b-f433071f45cc` · Blind 90 `fd1aea7d-5840-40a6-a920-6e1c25dc1445`

Absent from bndy and NOT created this run, because §2A.5 forbids a bare create and the enrichment work did not fit the TTL: **Dan Curry** (6 rows), **Dave Ridley** (1 row here, prolific at source), **Val Bilton** (3 rows), **Lynsey Elliott** (1 row), **Hot Rocks** (2 rows). These are the highest-yield items for the next run.

## 10. Not reached — 44 importable added rows

The whole of `cottage-tavern--cleadon` (15 rows, a new venue with no address on the listing page), `cross-keys--hamsterley`, `the-blue-bell--usworth` and `the-fairfield--stockton` (3 new venues), and the added rows at 14 venues whose bndy record was not resolved inside the TTL. The snapshot has been advanced to today's capture, so **the next run's diff will not re-offer them**. That is the standing `insangel-snapshot-hides-backlog` defect, unchanged.

## 11. Weekday-vs-date disagreement — 15 rows

15 rows print a weekday that does not match the date the §FIX-1 year rule derives. Every one of the 15 matches the SAME day+month in **2027**. Examples: `the-seaton-lane-inn--seaton` "Fri 27th Aug" (2026-08-27 is a Thursday, 2027-08-27 is a Friday); `the-peregrine--chapel-house` "Sun 19th Sep" (2026-09-19 is a Saturday, 2027-09-19 is a Sunday); `annitsford-welfare-club` "Sat 4th Sep", "Sat 2nd Oct", "Sat 6th Nov", "Sat 4th Dec" — all Fridays in 2026, all Saturdays in 2027.

This is hard evidence for the standing `insangel-year-rule-underdates-13mo` item: the rule cannot reach 2027 for a row 12 to 13 months out, and the printed weekday resolves it deterministically. No row was re-dated this run and no affected row was written. The snapshot keeps the listing-derived date so the diff stays stable.

## 12. Validator (§6A step 8)

`scripts/enrichment_validate.py --records /tmp/ins/records.json --evidence data/state/enrichment-evidence-2026-08-27-insangel.jsonl`

`0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]` — exit 0. The run enriched no artist and no venue, so the record set is empty and the evidence file is empty.

## 13. Snapshot

Written to `data/state/insangel-last-page.txt`. Fail-closed gate (§6A step 7) satisfied.

## 14. Raised to CTO-INBOX

- `insangel-jane-long-namaste-stale-duplicate` (DATA)
- `insangel-weekday-proves-2027-year` (RULE)
