# onthecasemusic — RUN REPORT 2026-08-15

**Outcome: COMPLETED.** 4 events created, 1 event edited. Snapshot written. Validator 0 FAIL.

| field | value |
|---|---|
| runId | `onthecasemusic-2026-08-15T06-41-37Z` |
| fired (UTC) | 2026-08-15T06:41:37Z |
| local date (§6A step 1) | 2026-08-15 (`date +%Y-%m-%d`) |
| runbook read | `RUNBOOK.md` H1 **v2.27**, in full |
| floor asserted (§6A step 2a) | **v2.19**. 2.27 ≥ 2.19, so the run proceeded. |
| floor named in the task prompt | **none**. The prompt states no version and defers to §6A. No drift to report. |
| spec read | `sources/onthecasemusic.md`, in full |
| CTO-INBOX read | yes. Fingerprints checked before any append. |
| heartbeat | `data/state/heartbeat/onthecasemusic-2026-08-15T06-41-37Z.json` |
| claim (§6A step 2b, §6G) | `data/state/claims/onthecasemusic.json` was `heldBy: null`. Acquired. TTL 90 minutes. No takeover. |
| caps | 50 creates. Used 4. |

## 1. Counts

| measure | count |
|---|---|
| events created | 4 |
| events edited | 1 |
| artists created | 0 |
| artists enriched | 0 |
| venues created | 0 |
| events deleted | 0 |
| rows skipped | 1 (past-dated drop, see §5) |
| gate bounces (409/422/500) | 0 |

## 2. Capture (§6A step 4)

`curl` of `https://onthecasemusic.co.uk/gigs`, HTTP 200, 385,634 bytes.
Parsed by `data/raw/onthecasemusic/2026-08-15/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3` —
byte-identical to the parser used on 2026-08-08, 2026-08-12 and 2026-08-14.

```
rows 297   dates 113   2026-08-14 -> 2027-12-26
gigIds unique 297
no bandId 28
```

Raw artefacts: `data/raw/onthecasemusic/2026-08-15/{gigs.html,parse.py,diff.py,capture-normalised.txt,records.json}`.

**Chrome was not used for the capture.** The spec says `/gigs` is client-rendered and Chrome is mandatory.
That is not borne out: a server-rendered `curl` reproduced the whole feed. Already on file as
`otcm-chrome-not-mandatory`. The spec was NOT edited by this run.

## 3. Mode (§0.29)

The spec declares no mode. §0.29 names onthecase as qualifying for `delta` on evidence, and this run
reproduced the 0/0 self-diff. **The question did not become load-bearing: the one removed row was
past-dated, so no deletion decision arose.** Already on file as `otcm-mode-not-declared`. Not raised twice.

## 4. Diff (§6A step 5, §5.7)

Diffed on `(date, gigId)` first, then on the row text, per the spec's DIFF SAFETY item 2.

| result | count |
|---|---|
| added | 4 |
| removed | 1 |
| changed | 1 |

Snapshot rows 294 → capture rows 297. This is a small, ordinary movement, not the
"hundreds of rows" capture-bug signature the spec's DIFF SAFETY item 1 warns about.

### §5.7(a) self-diff gate

The new snapshot re-diffed against the capture it was written from:

```
OLD rows 297 NEW rows 297
ADDED 0 REMOVED 0 CHANGED 0
```

**0 added / 0 removed. The gate passes.** Deletion was therefore permitted. Nothing was deleted.

Normalisation applied to both sides, and recorded in the snapshot header: whitespace collapse,
curly-to-straight apostrophes, HTML entity decode, and removal of empty `/`-separated address segments.

## 5. The removed row — NO ACTION

```
2026-08-13 | 131410 | Buskers night at Old Fat Ox Holywell | 8:00 PM / FREE
```

**Past-dated.** Today is 2026-08-15. §5.7 states that a row that drops off because its date passed is
not a cancellation. The row is also a skip-list placeholder ("Buskers night", §0.4 / spec skip list) and
has never had a bndy event. No deletion, no tombstone, no inbox item.

## 6. The changed row — EDITED, not re-created

The source re-billed a retained gig id. This is the fault the gig id sits in the snapshot to catch.

| field | before | after |
|---|---|---|
| gig id | `131454` | `131454` (unchanged) |
| date | 2026-12-04 | 2026-12-04 (unchanged) |
| venue | Ivy House Sunderland | unchanged |
| time | 8:00 PM | unchanged |
| act | Undercover Band | **Hard Wired** |

**Action: EDIT `c5a2d970-4820-478d-8a83-05ff9e5acdc8`** — `artistId`, `title` and `externalIds`.
§0.17: "time/detail changes on a source = EDIT the existing event (found via externalId), never create
a sibling". No sibling event was created. Nothing was hidden and nothing was deleted.

The externalId moved from `2026-12-04-undercover-band-ivy-house` to `2026-12-04-hard-wired-ivy-house`,
because the §6D form derives from the act. `replaceExternalIds: true`, so the source holds exactly one id
(§6B — `edit_event` dedupes to one id per source).

Read back with `get_by_id`: artist `Hard Wired`, title `Hard Wired @ Ivy House`, one externalId,
`isPublic: true`, `updatedAt` 2026-08-15T06:44:28.598Z.

## 7. Events created (§6A step 6, §0.10 verified)

All four are at one venue, **Ivy House, Sunderland** `705142b8-bdc6-41ae-b022-5b0fa3b5e7b7`,
google_place_id `ChIJHQU5ToRmfkgRxtDmCPa_Ll8`, Worcester Terrace, Sunderland **SR2 7AW**.
The SR postcode prefix agrees with Sunderland (§0.24). The venue already carried the
`onthecasemusic` externalId `ivy-house-sunderland`. No venue was created.

| event id | act | date | time | gig id | externalId |
|---|---|---|---|---|---|
| `89eae607-f94e-463a-93f8-8367d260520b` | The Stones Story | 2026-09-04 | 20:00 | 131460 | `2026-09-04-the-stones-story-ivy-house` |
| `eec6ff1b-dbd3-41c3-aecf-e2cee74d72b5` | A Band Called Horse | 2026-10-09 | 20:00 | 131462 | `2026-10-09-a-band-called-horse-ivy-house` |
| `6ead6bf9-9130-463a-ba35-082cfe0ef13c` | Brydon Trio | 2026-10-30 | 20:00 | 131459 | `2026-10-30-brydon-trio-ivy-house` |
| `c24729f8-e609-430d-be82-f609c5dc4e49` | Undercover Band | 2026-12-11 | 20:00 | 131461 | `2026-12-11-undercover-band-ivy-house` |

All four: `isPublic: true`, `price: FREE`, `ticketed: false`, title `«Artist» @ Ivy House`.

**Times are source times, not defaults.** The listing publishes 8:00 PM for every row.
§0.28: `startTime` is stage time and the source published one, so it is used verbatim.
`startTimeDefaulted: false` on all four. No §5.6 default was applied this run.

**Verification (§0.10).** `search_event(venueId, 2026-08-15 → 2027-12-31)` returned **8 events before
the writes and 12 after** — the four new ids, each carrying the intended externalId, plus the edited
2026-12-04 row now reading `Hard Wired @ Ivy House`.

## 8. Identity work (§1A, §2)

**Zero artists created. All five acts already existed and were resolved by the source's own band id**,
which is the strongest mechanical key available for this source. Each was confirmed with `get_by_id`
against its stored `onthecasemusic` externalId — not by name matching.

| act | bndy id | source band id | confirmed |
|---|---|---|---|
| The Stones Story | `0e0a6bcd-1e2e-4856-9593-8379d9ad0b54` | 28891 | externalId matches |
| A Band Called Horse | `a72ac58a-5bb9-4d99-819c-d9443e4e0144` | 29979 | externalId matches |
| Brydon Trio | `9638e2c5-74e7-44c8-8fe3-3f54117a8ca5` | 50 | externalId matches |
| Undercover Band | `8573e476-7041-48c4-975b-e8651e01f9f0` | 30023 | externalId matches |
| Hard Wired | `64c6117f-3dd7-49e7-b2ad-7f61f1c64dde` | 30021 | externalId matches |

No §1A.2 footprint check was needed, because no create decision arose.
No name required sanitisation under §0.6. No row was a lineup (§0.3) or a placeholder (§0.4).

**Quality statement (§6 report rule).**
- Records created with a verified page: 0 — no artist was created.
- Records created with an evidenced blank: 0 — no artist was created.
- Records staged: 0.
- Names sanitised or skipped as non-acts: 1 skip, "Buskers night", and it was a removed past row.

All five artists already hold a `facebookUrl`. All five hold an empty `bio` and `needsReview: true`.
**This run did not top them up.** That is enrichment-queue work under §2A.2, it needs Chrome and a
Facebook session, and the 2026-08-14 inbox item `bv2a-facebook-not-logged-in` records that surface as
recently down. Nothing was written to a public field on trust.

## 9. Tombstone check (§5.4, v2.19)

`data/state/cancellations.jsonl` searched for the artist + venue + date of every row before any create.
Two lines in the file. **No match** on Ivy House, The Stones Story, A Band Called Horse, Brydon Trio,
Undercover Band or Hard Wired. No `TOMBSTONED-` row this run.

## 10. Horizon (§6E)

12 months, to 2027-08-15. All four added rows fall inside it (2026-09-04 → 2026-12-11).
The capture reaches 2027-12-26. Beyond-horizon rows stay in the snapshot and enter via later diffs.

## 11. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-08-15/records.json \
  --evidence data/state/enrichment-evidence-2026-08-15-onthecasemusic.jsonl --mode gate

0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```

Exit code 0. **Validator 0 FAIL.** The run created and enriched no artists, so the record set is empty
and the evidence file has no lines. `records.json` is the empty validator input; the five bndy writes are
listed in `events-written.json` in this directory.

## 12. Snapshot (§6A step 7)

Written to `data/state/onthecasemusic-last-page.txt`. 297 rows, 113 dates, 2026-08-14 → 2027-12-26.
The header carries the normalisation rules, the capture method, the parser md5 and the 0/0 gate result,
so the next run reproduces them exactly.

## 13. CTO-INBOX

**Nothing appended.** Every observation this run could raise is already on file with a fingerprint:

| observation | existing fingerprint |
|---|---|
| The spec declares no §0.29 mode | `otcm-mode-not-declared` |
| The spec says Chrome is mandatory for `/gigs`; curl reproduces the feed | `otcm-chrome-not-mandatory` |
| Mixed externalId forms are live on this source | `otcm-externalid-form-mixed` |
| `record_run` fails on a missing token | `record-run-token-missing` |

## 14. Open items

**None.** No row was staged. No decision was blocked. Nothing was escalated.

`record_run` was not called. `SOURCE_RUNS_TOKEN` is absent and the task prompt states this is not
blocking. `data/state/run-summary.jsonl` is the dashboard input and was appended.
