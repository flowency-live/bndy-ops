# gigs-news RUN REPORT — 2026-09-03

Run id: `gigs-news-2026-09-03T04-04-49Z`
Outcome: **COMPLETED**
Runbook read: **v2.27**. Floor asserted from §6A: **v2.19**. Prompt floor: none stated (a numeric prompt floor is void, §6A step 2a).
Claim: `data/state/claims/gigs-news.json` was released (`heldBy: null`, lastRun `gigs-news-2026-09-02T04-06-56Z`). Acquired normally. No takeover.
Heartbeat: `data/state/heartbeat/gigs-news-2026-09-03T04-04-49Z.json`.

## 1. Counts

| Measure | Count |
|---|---|
| Events created | 2 |
| Artists created | 0 |
| Venues created | 0 |
| Artists matched and reused | 2 |
| Venues matched and reused | 1 |
| Rows added by the diff | 3 |
| Rows removed by the diff | 1 |
| 409 / 422 bounces | 0 |
| Records created with a verified page | 0 (no artist was created) |
| Records created with an evidenced blank | 0 (no artist was created) |
| Rows skipped or parked | 0 new — the unchanged rows were actioned by earlier runs |
| Names sanitised or rejected under §0.6 | 0 |
| Validator | 0 FAIL, 0 WARN |

## 2. Mode (§0.29)

The spec `sources/gigs-news-uk.md` declares no mode. The run used **append-only**, as every prior run of this source did. The finding is already in CTO-INBOX under `gigs-news-mode-undeclared` (2026-08-12), so no new item is raised. No deletion was made.

## 3. Capture

- `https://www.gigs-news.uk/` — HTTP 200, 114,395 bytes.
- `https://www.gigs-news.uk/branded.htm` — HTTP 200, 264,098 bytes.
- Method: container curl, then BeautifulSoup with lxml, reading `a[href]` on every row per §0.22. `get_page_text` was not used. The curl precedent for this source is CTO-INBOX `gigs-news-curl-reproduces-week-view` (2026-08-18).
- `branded.htm` is byte-identical to the 2026-09-02 capture (md5 `dd2042b7...`). The week view changed (md5 `71fd0004...` → `74417eae...`).
- Raw files: `data/raw/gigs-news-uk/2026-09-03/`.

## 4. Diff (§5.7)

Normalisation applied to both sides before the comparison: `<br>` to a line break before text extraction; whitespace runs collapsed to one space; every line trimmed; a trailing comma, full stop or slash stripped; HTML entities decoded once; empty lines removed.

**Self-diff gate (§5.7a): the new snapshot re-diffs against its own capture at 0 added / 0 removed. PASS.**

Added rows, section 1:

| Date | Row | Action |
|---|---|---|
| 2026-09-04 | `Evolution - the Swan Inn Wilmslow` | imported |
| 2026-09-05 | `Super Fly - the Swan Inn Wilmslow` | imported |
| 2026-09-05 | `Reserved - Queens Hotel Macclesfield` | already in bndy as `07a9e82b-c44e-477a-9c1f-df0d3c6ce2b1`, created from the section 2 forward list on an earlier run. No write. |

Removed row, section 1:

| Date | Row | Action |
|---|---|---|
| 2026-09-04 | `Reserved - Queens Hotel Macclesfield` | Logged only. The mode is append-only, so §0.17 did not run. No bndy event exists for branded at Queen's Hotel on 2026-09-04, so there is nothing stale. The curator moved the slot to Saturday 5 September, and the Saturday row is the added row above. |

Section 2 (`branded.htm` forward list, 21 rows) is unchanged. Two further changes were cosmetic and carry no gig data: the featured header row day-word changed from `Friday` to `Saturday`, and the Friday `- Queens Hotel Macclesfield` row is now blank-act.

## 5. Tombstone check (§5.4)

`data/state/cancellations.jsonl` was searched for the artist, venue and date of both writes. No match. Nothing was tombstoned.

## 6. Records written

### Event `e82470c5-3f92-4e83-b64b-414fbd38ef70`
- Title: `Evolution @ The Swan Inn`
- Date: 2026-09-04. Start time **21:00, DEFAULTED** by the server under §5.6 (Friday). The source published no time.
- Artist: `eJ3aDOC7ByrKZ36foVL9` Evolution (Stockport) — matched at 100%, reused.
- Venue: `pq6Rk3XQeVXCU5nxcvd9` The Swan Inn, 2 Swan St, Wilmslow SK9 1HE.
- externalIds: `{"source":"gigs-news","id":"2026-09-04-evolution-swan-inn-wilmslow"}`
- `isPublic: true`. Read back with `get_by_id`. Verified.

### Event `84491b3d-c67c-4dc0-985d-0ceebd62f665`
- Title: `Super Fly @ The Swan Inn`
- Date: 2026-09-05. Start time **21:00, DEFAULTED** by the server under §5.6 (Saturday). The source published no time.
- Artist: `e3e00435-6d23-4292-a8ac-1cb678cc1168` Super Fly (North West UK) — matched at 100%, reused.
- Venue: `pq6Rk3XQeVXCU5nxcvd9` The Swan Inn, 2 Swan St, Wilmslow SK9 1HE.
- externalIds: `{"source":"gigs-news","id":"2026-09-05-super-fly-swan-inn-wilmslow"}`
- `isPublic: true`. Read back with `get_by_id`. Verified.

## 7. Identity reasoning (§1A)

- **Evolution.** One exact-name record exists, `eJ3aDOC7ByrKZ36foVL9`, location Stockport. Wilmslow is adjacent to Stockport and both sit in the same canonical region. §1A.2 rule 3 applies: the new gig's venue is inside the existing footprint, so this is the same act. Reused. No second record.
- **Super Fly.** One exact-name record exists, `e3e00435-6d23-4292-a8ac-1cb678cc1168`, location `North West UK`, with a Facebook avatar on `originalsuperfly`. Same region as the gig. Reused.
- No `review` verdict was returned. No `confirmNew` and no `resolveTo` was needed.

## 8. Venue resolution (§3)

`search_venue("Swan Inn", "Wilmslow")` returned one record at 67% `low_confidence`. Per §3 item 1 the low-confidence hit was opened, not dismissed: the record is The Swan Inn, SK9 1HE, and it already carries the `gigs-news-uk` externalId `venue-theswaninnsk9`. The postcode agrees with the section 2 forward list (`the Swan Inn Wilmslow SK9 1HE`). §0.24 postcode check passes. No venue was created.

## 9. externalId form

The form written is the §6D date-slug, matching the convention already live on this venue (`2026-10-02-branded-swan-inn-wilmslow`, event `b5955538-96ac-4a84-a5b2-2321e6594f9a`) — the short venue slug, not the full bndy record name. The known form drift on this source is CTO-INBOX `externalid-slug-drift`, already open.

## 10. Enrichment

No artist and no venue was created, so §2A did not run. The evidence file `data/state/enrichment-evidence-2026-09-03-gigs-news-uk.jsonl` was created and is empty, which is the correct state for a run with no enrichment write. Chrome was not needed and was not called.

Noted, not raised: the matched record Evolution `eJ3aDOC7ByrKZ36foVL9` holds no profile image and no Facebook URL. It is a top-up candidate for the enrichment task. It is not a defect and it did not block this run.

## 11. Validator (§6A step 8)

```
0 records · 0 clean · 0 FAIL · 0 WARN   [mode=gate]
```
Exit code 0. Input: `data/normalized/gigs-news-uk/2026-09-03/validator-records.json` (empty list, no artist or venue was written) and `data/state/enrichment-evidence-2026-09-03-gigs-news-uk.jsonl`.

## 12. Snapshot (§6A step 7)

Written to `data/state/gigs-news-uk-last-page.txt`. 125 lines: a 6-line header carrying the normalisation rules and the capture method, then 119 body lines (98 section 1, 21 section 2). The fail-closed snapshot gate is satisfied.

## 13. Caps

50 creates per run. 2 used. No cap was reached.

## 14. Open items

Nothing appended to `CTO-INBOX.md`. Every finding this run met is already there under an existing fingerprint (`gigs-news-mode-undeclared`, `externalid-slug-drift`, `record-run-token-missing`).

`record_run` was not called. `SOURCE_RUNS_TOKEN` is still absent and the failure is known and not blocking.
