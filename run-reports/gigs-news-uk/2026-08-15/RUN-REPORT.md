# RUN REPORT — gigs-news — 2026-08-15

**Outcome: COMPLETED. 1 event written. Validator 0 FAIL.**

| Field | Value |
|---|---|
| Task slug | `gigs-news` |
| Run id | `gigs-news-2026-08-15T06-35-48Z` |
| Fired at | 2026-08-15T06:35:48Z |
| Runbook read | `RUNBOOK.md` **v2.27**, in full |
| Floor asserted | §6A CURRENT FLOOR **v2.19**. v2.27 is at or above the floor. PASS |
| Prompt floor | The task prompt states no version number. §6A step 2a is the gate |
| Spec read | `sources/gigs-news-uk.md`, in full |
| Inbox read | `CTO-INBOX.md`, in full. All fingerprints checked before any item was considered |
| Heartbeat | `data\state\heartbeat\gigs-news-2026-08-15T06-35-48Z.json` |
| Claim | `data\state\claims\gigs-news.json`. Previous state `heldBy: null`. Acquired normally. No takeover |

---

## 1. Counts

| Metric | Count |
|---|---|
| Events created | **1** |
| Artists created | 0 |
| Venues created | 0 |
| Records enriched | **1** |
| Records created with a verified page | 0 (no artist was created) |
| Records created with an evidenced blank | 0 |
| Names sanitised under §0.6 | 0 |
| Rows skipped | 4 |
| 409 / 422 bounces | 0 |
| Deletions | 0 |
| Items raised to `CTO-INBOX.md` | 0 |

---

## 2. Steps 0 to 3 — the gates

- **Step 0.** The heartbeat was written first. `runbookVersion` was set after the H1 read, in the same file.
- **Step 1.** Today is **2026-08-15**, a Saturday (`date +%Y-%m-%d`). The week view uses relative day names. The date is required to parse it.
- **Step 2.** The runbook and the source spec were read in full.
- **Step 2a.** H1 is v2.27. The floor is v2.19. PASS.
- **Step 2b.** The claim file held `heldBy: null`. That is the released state. The claim was acquired. The TTL for this task is 90 minutes (§6G). `expiresAt` is 2026-08-15T08:05:55Z. The record names its own heartbeat file.
  ⚠ A legacy file `data\state\gigs-news.lock` is still on disk. It reads `heldBy: null` from 2026-08-07. §6A step 2b retires the `.lock` shape. The run did not honour it and did not delete it. No action is needed. It is already released, so it cannot block a run.
- **Step 3.** Chrome was connected. Both source pages rendered. The bndy MCP tools were reachable and every write was read back (§0.10).

---

## 3. Step 4 — capture

| Page | Method | Result |
|---|---|---|
| `https://www.gigs-news.uk/` | Chrome, `innerText`, plus an `a[href]` walk (§0.22) | 119 lines |
| `https://www.gigs-news.uk/branded.htm` | Chrome, `innerText` | 412 lines. The forward list is lines 19 to 45 |

Capture file: `data\raw\gigs-news-uk\2026-08-15\capture-normalised.txt`.

**Header line: "What's on This Week 12 - 16 August".** Today is inside that window. The page is current. This is not a stale week. The curator has not rolled the page since the 2026-08-14 run.

**Forward-list boundary (spec rule, ordinal).** The `gigs <year>` headers were found at lines 18, 162, 201, 268, 325 and 367. The run took lines 19 to 45 only, which is the first dated section. It rejected 366 later lines, of which 250 are archive rows.

⚠ **The spec's second safeguard did not hold again.** The spec states that the archive containers are not rendered, so `innerText` excludes them. `innerText` returned them today, as it did on 2026-08-14. The ordinal rule carried the parse alone. This is already in `CTO-INBOX.md` as `branded-archive-safeguard-stale`. The run did not raise it a second time.

⚠ **`javascript_tool` output guards.** Two of the three guards in §6B fired: output truncation near 1.4 KB, and the `=` block. The run paged the output and mapped `=` to `(eq)`. Neither is a source fault. Neither cost a row.

⚠ **`document.visibilityState` was `hidden`.** The §6B guard covers lazy-loaded lists. This source is static HTML 3.2 with no infinite scroll. The line count agrees with the snapshot. The capture is complete.

---

## 4. Step 5 — two-sided diff

**Snapshot before this run:** `data\state\gigs-news-uk-last-page.txt`, written 2026-08-14T04:48Z, 125 lines.

Normalisation per §5.7(a), applied identically to both sides before any comparison:

1. Every run of whitespace collapsed to one space.
2. Every line trimmed.
3. A trailing comma, full stop or slash stripped from a cell.
4. A trailing country or county suffix case-normalised.
5. HTML entities decoded once.
6. Empty lines removed.

The three metadata header lines were excluded from both sides.

### 4.1 Added rows — 5

| # | Row | Day | Date | Action |
|---|---|---|---|---|
| 1 | `the Imperials - the Stock Dove Romiley` | Friday | 2026-08-14 | **SKIP — past-dated (§0.14).** The curator named a previously blank slot after the gig |
| 2 | `Hoi Polloi band - Whittles Oldham` | Friday | 2026-08-14 | **SKIP — past-dated (§0.14)** |
| 3 | `Gumball - Society by Whittles Oldham` | Friday | 2026-08-14 | **SKIP — past-dated (§0.14)** |
| 4 | `Mambo Band - Bulls Head High Lane` | Friday | 2026-08-14 | **SKIP — past-dated (§0.14)** |
| 5 | `the Muppeteers - Whittles Oldham` | Saturday | 2026-08-15 | **IMPORTED** |

**No entity was created for rows 1 to 4.** §0.21 governs: an artist or a venue is created only when the source lists at least one importable future gig for it. Each of those four acts holds one past-dated row and nothing else in this source.

⚠ **`Society by Whittles Oldham` is a venue name this source has not published before.** It carries one past-dated row, so no venue record was created (§0.21). It is likely a second room at the Whittles address. If a future row appears, apply §0.6 as extended in v2.26: check the Google Place ID before creating a second venue.

### 4.2 Removed rows — 4 lines, 3 distinct strings

| Row | Day | Was it ever an event? | Action |
|---|---|---|---|
| `- the Stock Dove Romiley` | Friday | No | None |
| `- Bulls Head High Lane` | Friday | No | None |
| `- Whittles Oldham` | Friday | No | None |
| `- Whittles Oldham` | Saturday | No | None |

**Every removed row is a blank-act row.** The spec rejects a blank act row, so none of them was ever written to bndy. Each was replaced in place by a named act, which is the curator filling a slot, not a cancellation. **No §0.17 action was possible and none was taken.**

### 4.3 §0.29 mode

**The spec declares no mode.** §0.29 requires `delta` or `append-only` at the top of the spec. The run defaulted to **`append-only`**, as the 2026-08-12 run did. This is already in `CTO-INBOX.md` as `gigs-news-mode-undeclared`. It was not raised again. The default changed nothing today: every removed row was a blank-act row that had never been written.

### 4.4 Section 2 — the branded.htm forward list

**0 added, 0 removed.** The 27 forward rows are byte-identical to the snapshot.

⚠ One in-page annotation was observed on the home page only: `(cancelled - United match)`, printed after `Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved`. The spec rules that a row marked cancelled at source is never imported. That date holds no bndy event from this source, so nothing was written and nothing was withdrawn. The annotation is absent from `branded.htm`, so it does not enter the snapshot's section 2.

### 4.5 The §5.7(a) self-diff gate

The new snapshot was re-diffed against the capture it was written from.

**Result: 0 added / 0 removed. PASS.**

---

## 5. Step 6 — the pipeline

### 5.1 Tombstone check (§5.4, v2.19)

`data\state\cancellations.jsonl` was grepped for the artist, the venue and the date before the create. **No match.** No gig was tombstoned by another run.

`data\state\run-summary.jsonl` and `20-Daily\2026-08-15.md` were read before any create, per §5.4's coverage-gap rule. One other task has run today: `klma-stoke-gig-list`, completed, 12 events. It does not cover Greater Manchester. No cross-run conflict exists.

### 5.2 Venue resolution

Source string: `Whittles Oldham`.

`search_venue("Whittles", "Oldham")` returned **one hit at 21% `low_confidence`**.

⚠ **A 21% hit is the record, not noise.** §3 and §2.16 require a low-confidence hit in the right town to be opened before any create. It was opened. It is **`yGNojetg8AYGh9vlGPia` "Whittles@tokyo - Live Music Venue & Bar"**, 57 Roscoe St, Oldham **OL1 1EA**, `google_place_id` `ChIJUbLotn63e0gROP_aZkg1G-E`, already carrying a `gigs-news-uk` externalId. The postcode matches the `branded.htm` row `Whittles Oldham OL1 1EA` exactly (§0.24 — the postcode decides). **The venue was reused. No venue was created.**

The confidence is low because the bndy record carries the trading-name tail `@tokyo - Live Music Venue & Bar` while the source publishes `Whittles Oldham`. This is the same class as `search-venue-apostrophe` in `CTO-INBOX.md` and §2.16 already rules it. **No new item was raised.**

### 5.3 Artist resolution

Source string: `the Muppeteers`. No §0.6 stripping was needed. No promo tail, no lineup separator, no placeholder.

`search_artist("Muppeteers", minConfidence 25)` scanned 2,205 records and returned one: **`The Muppeteers`**, `a36cf808-4551-49e2-8dec-bb489513ec4d`, location `Greater Manchester UK`.

§1A: the normalised name key is identical and the region is identical. **Same name, same region is the same act, always.** The record was reused. `create_artist` was not called.

The record already carried `facebookUrl` `https://www.facebook.com/themuppeteers/`, an Instagram URL and a `graph.facebook.com` avatar, so the §1A.2 Step 0 Facebook key check resolved on the first read.

⚠ **The record was created at 2026-08-15T05:37:13Z by another run and held zero events.** This run's event is its first. §0.21 is a creation-time rule and is explicitly not retroactive, so no item is raised.

### 5.4 Event created

| Field | Value |
|---|---|
| Event id | **`dee419dc-794e-452b-84a2-021181b72e88`** |
| Title | `The Muppeteers @ Whittles` |
| Date | 2026-08-15 |
| startTime | **21:00 — DEFAULTED** |
| endTime | 00:00 |
| artistId | `a36cf808-4551-49e2-8dec-bb489513ec4d` |
| venueId | `yGNojetg8AYGh9vlGPia` |
| isPublic | true |
| externalIds | `{source: "gigs-news", id: "2026-08-15-the-muppeteers-whittles"}` |

**Defaulted time.** The source publishes no time for this row. `startTime` was **omitted** from the call and the server applied §5.6 (Saturday → 21:00), returning `startTimeDefaulted: true`. No time was invented and no human was asked (§5.6, enforced in code 2026-08-14).

**Idempotency.** `get_by_external_id(event, "gigs-news", "2026-08-15-the-muppeteers-whittles")` was called before the create and returned `found: false`. `search_event(artistId, dateFrom, dateTo)` was called with an explicit date range per §6B and returned no events.

**externalId form.** `<YYYY-MM-DD>-<artist-slug>-<venue-slug>` per §6D, with `whittles` as the venue slug. This matches the three live `gigs-news` ids already on this venue (`2026-08-07-ideal-forgery-whittles`, `2026-08-08-dan-budd-as-robbie-williams-whittles`, `2026-08-09-lazarus-whittles`). §6B requires matching the existing convention rather than adding a second form. The title `... @ Whittles` matches the same three records.

**Verification (§0.10).** `get_by_id(event, dee419dc-794e-452b-84a2-021181b72e88)` returned the record with every field as written. Verified, not assumed.

---

## 6. Enrichment — 1 record topped up

§2A.2: a matched existing artist that lacks enrichment is topped up under the same evidence bar.

| Field | Before | After |
|---|---|---|
| `bio` | empty | quoted from the act's own Facebook page |
| `locationType` | not returned on read | `regional` |
| `genres` | empty | **left empty** |
| `actType` | `["covers"]` | unchanged |
| `facebookUrl` | already set | unchanged |
| `profileImageUrl` | already set (`graph.facebook.com`) | unchanged |

**The page.** `https://www.facebook.com/themuppeteers/`, visited directly in Chrome. The stored `profileImageUrl` already pointed at this exact page handle, so identity was established by the record itself, not by a search. The page shows 422 followers, the category `Band`, and a contact address `themuppeteers@yahoo.co.uk`.

⚠ **The page needed a 4-second wait.** The first `innerText` read returned 4 lines of Facebook chrome only. A second read after a wait returned 134 lines. This is a render delay, not the `facebook-page-search-not-found` outage in `CTO-INBOX.md` — no search surface was used. No item was raised.

**The bio is a quotation (§2A.1 item 8).** Two lines, character for character, with the act's own line break preserved:

```
A covers band with a set for any occasion!
Including songs from the 60s through to modern day.
```

Nothing was reworded, re-punctuated, trimmed or stitched. The exclamation mark is theirs.

**Genres were left empty, deliberately.** The page says "songs from the 60s through to modern day". That is a span of decades, not a declared genre. §0.18 rules that unknown is left empty and never guessed. `60s` is an enum value, but writing it here would assert a genre the act did not claim.

**Location was not changed.** The page states no location. The stored value `Greater Manchester UK` is the source default and it is consistent with the gig town. `locationType: "regional"` was written explicitly, because §6B's Kilmarnock trap needs it and `get_by_id` does not return the field, so it could not be confirmed by read-back.

⚠ **`get_by_id` on an artist does not return `locationType`.** The field cannot be verified under §0.10. The run wrote it explicitly rather than assume. This is a read-projection gap, not a defect that changes a write, so no inbox item was raised.

**Evidence file.** `data\state\enrichment-evidence-2026-08-15-gigs-news.jsonl`, one line, written **before** the bndy write. It carries `capturedFrom`, `capturedAt` and the raw `capturedText`.

---

## 7. Rows rejected by the source filter

The two importable days hold these non-gig rows. Each was rejected before the pipeline, per the spec's reject filter. None is new and none is an error.

**Saturday 2026-08-15:** `branded - looking for a venue/cancellation`; `karaoke - the Albion Dukinfield`; `karaoke/disco - the Dog Inn Chadderton`; `live bands - Spinning Top`; and five blank-act rows (`- Kings Arms Hotel Wilmslow`, `- Queens Arms Old Glossop`, `- Dane Bank Denton`) and two time-only rows (`8pm - Dog & Partridge Great Moor`, `8pm - the Steelworks Bredbury`).

**Sunday 2026-08-16:** `5pm - the Albion Dukinfield`; `4pm - Spinning Top`; `- Prince of Wales Glossop`; `Dave's karaoke 5pm - the Club Romiley`; `Between the Vines Open Mic 7pm - Fox & Pine Oldham`; `private party 7pm - Acoustic Lounge Poynton`; `Jazz at the Railway - the Moor Club`.

⚠ `Elvis show 6pm - Coach & Horses Oldham` was rejected under **§0.5**. "Elvis show" is a description, not an act name. The source names no performer. A name may never be invented.

**None of these rows changed since the last snapshot,** so none is an added row and none needed a decision today. They are listed for completeness.

---

## 8. Step 8 — the validator

```
python3 scripts/enrichment_validate.py \
  --records data/state/validator-input-2026-08-15T06-45-00Z-gigs-news.json \
  --evidence data/state/enrichment-evidence-2026-08-15-gigs-news.jsonl
```

```
[ ok ] The Muppeteers  a36cf808-4551-49e2-8dec-bb489513ec4d

1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]
```

**Exit code 0. 0 FAIL. The batch ships.**

---

## 9. `record_run`

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN` on every scheduled run. This is already in `CTO-INBOX.md` as `record-run-token-missing` and the task prompt states it is not blocking. `data\state\run-summary.jsonl` is the dashboard's real input and it was appended normally.

---

## 10. Items raised to `CTO-INBOX.md`

**None.**

Four candidates were considered and each was rejected against inbox rule 4 — an existing rule or an existing fingerprint already answers it.

| Candidate | Why it was not raised |
|---|---|
| `innerText` returned the archive rows | Already logged as `branded-archive-safeguard-stale` |
| The spec declares no §0.29 mode | Already logged as `gigs-news-mode-undeclared` |
| `search_venue` returned the right venue at 21% | §2.16 and §3 already rule it. Same class as `search-venue-apostrophe` |
| `get_by_id` omits `locationType` | A read-projection gap. It changes no write. The value was written explicitly |

---

## 11. Files written

- `data\raw\gigs-news-uk\2026-08-15\capture-normalised.txt`
- `data\state\gigs-news-uk-last-page.txt` (new snapshot, 126 lines)
- `data\state\enrichment-evidence-2026-08-15-gigs-news.jsonl` (1 line appended)
- `data\state\validator-input-2026-08-15T06-45-00Z-gigs-news.json`
- `data\state\heartbeat\gigs-news-2026-08-15T06-35-48Z.json`
- `data\state\claims\gigs-news.json` (acquired, then released)
- `data\state\run-summary.jsonl` (1 line appended)
- `data\normalized\gigs-news-uk\2026-08-15\RUN-REPORT.md` (this file)
- `20-Daily\2026-08-15.md` (1 entry appended)
