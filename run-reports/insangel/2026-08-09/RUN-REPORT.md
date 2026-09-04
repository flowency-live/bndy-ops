# insangel run report — 2026-08-09

**Outcome: PARTIAL.** The run wrote 20 records and read all of them back. It stopped on its own
time budget, not on a gate. 633 in-scope rows remain for the next run. The snapshot is written,
so the next run diffs instead of re-reading the whole page.

- runId: `insangel-2026-08-09T19-03-55Z`
- runbook read: **v2.20**. Floor in §6A: **v2.19**. Pass.
- floor asserted in the task prompt: none stated. The prompt defers to §6A, which is correct (§6A step 2a).
- claim: `data\state\claims\insangel.json`. The previous holder `insangel-2026-08-08T09-48-15Z` had `expiresAt` 2026-08-08T11:20:00Z, in the past. Acquired on expiry, not on a takeover.
- heartbeat: `data\state\heartbeat\insangel-2026-08-09T19-03-55Z.json`
- cap: 50 creates. Used 20.

---

## 1. The four-night block is cleared

`CTO-INBOX.md` carries `insangel-egress-blocked` (2026-08-08): "Network egress settings block
insangel.co.uk. No capture, no report, four nights."

**The site is reachable. The block is on the sandbox fetch path only.**

- `mcp__workspace__web_fetch` on `https://insangel.co.uk/venues` returned an empty body.
- The Chrome MCP tab loaded the same URL and returned 733,253 characters of rendered HTML,
  74 venue cards and 1,156 gig rows.

The spec says "server-rendered HTML — curl/requests is sufficient, no Chrome needed for capture".
That remains true of the site. It is not true of this environment. **The next run should capture
through Chrome and not treat a `web_fetch` failure as a source failure.** This is raised as a
`RULE` item, fingerprint `insangel-capture-via-chrome`.

## 2. Capture

| item | value |
|---|---|
| venue cards | 74 |
| gig rows | 1,156 |
| artist-gig pairs | 1,165 |
| unparseable dates | 0 |
| stale rows dropped (date < capture date) | 50 |
| rows beyond the 12-month horizon | 0 |
| declared-placeholder pairs dropped | 452 |
| skip-venue rows dropped | 0 |
| **in scope** | **663 pairs, 179 band slugs, 71 venues** |

Year inference used the rolling rule in `sources/insangel.md` FIX 1. The earliest row built to
2026-07-09, exactly 31 days before capture, so it stayed in the capture year and was then dropped
as stale. No year was hardcoded.

## 3. Snapshot

**Missing before this run.** Under §0A rule 2 that is a first run, not a held run. The run
imported under the 50-cap, oldest-dated first, and wrote the snapshot on completion.

`data\state\insangel-last-page.txt` — 71 venue lines, 663 rows, format declared in the file header.
The raw capture note is `data\raw\insangel\2026-08-09\CAPTURE.md`.

**Snapshot gate: PASSED.** The run wrote to bndy and wrote its snapshot.

## 4. Records written

**20 creates. All 20 read back (§0.10).**

### Venues created — 3

| id | name | address | place_id | insangel externalId |
|---|---|---|---|---|
| `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` | The Rattler | Sea Rd, South Shields NE33 2LD | ChIJk7OEttdufkgRbKtdNJclT7Y | `the-rattler--south-shields` |
| `04ae2f3e-382c-4cce-9275-0e32eba0314a` | The Black Horse | 68 Front St, Consett DH8 5AL | ChIJX-lG1w3VfUgRYCiXy5DMISs | `the-black-horse--consett` |
| `b5873a52-6b00-4495-9be8-517a3c978220` | The Keelman Pub & Restaurant | Grange Rd, Newburn, Newcastle upon Tyne NE15 8NL | ChIJZSoCOGXYfUgRIWMPOrXQxpA | `the-keelman--newburn` |

Postcodes checked against expected county (§0.24): NE33 South Shields, DH8 Consett, NE15 Newburn.
All three pass. Google returned the place_id itself in each case; no town was guessed.

Each of the three cleared the full §3.1 ladder before creation: `search_venue` with the source
name, `search_venue` with the distinctive word plus city, and `list_venues(city:…)` read in full.
`search_venue("Chester's","Chester Le Street")` returned nothing while the venue exists as
`14e0bb68-fb20-4caf-9d00-7ae01b8e7dea` "Chesters" — the apostrophe again, and the sixth recorded
instance. It was caught by the `list_venues` probe, not by the search.

### Artists created — 1

| id | name | type | location | page | bio |
|---|---|---|---|---|---|
| `20e12f89-e16d-47bf-9037-35c8b981fa73` | Kaitlin Lee Robson | solo | Consett (city) | **evidenced blank** | empty |

- **Created with a verified page: 0.**
- **Created with an evidenced blank: 1.**
- **Skipped, to retry next run: 178 band slugs not yet reached.**
- **Names sanitised or rejected as non-acts: 2 slugs** (see §6).

Evidence for the blank, both surfaces per §2A.1 item 3b, bare-name query per item 3c:

- Facebook page search `Kaitlin Lee Robson` returned two pages, neither a music act
  ("Kaitlin Riddick Peter Robson", a clothes shop; "Peter Robson Kaitlin Riddick", a marketing agency).
- Google `"Kaitlin Lee Robson" singer` returned the insangel listing, a LinkedIn personal profile,
  and posts by two venues (The Church Mouse, The Four Ladies) about her gigs. No act-owned page.
- The insangel band page carries no social links.
- The LinkedIn profile is a personal profile and is not linked (§2A.4).

`actType` left empty (§0.18 — nothing in evidence points either way). `genres` left empty. `bio`
empty, because there is no act-owned page to quote (§2A.1 item 8). Location taken from the
majority gig town: 13 of her 29 forward gigs are at The Black Horse, Consett.

Evidence file: `data\state\enrichment-evidence-2026-08-09-insangel.jsonl`.

### Events created — 16

All for Kaitlin Lee Robson. **Every start time is the act's own published time, taken from
`insangel.co.uk/bands/kaitlin-lee-robson`. No time was defaulted under §5.6 in this run.**

| id | date | time | venue |
|---|---|---|---|
| `fafe3285-4fa3-4e46-a680-9d7ee67d5aa9` | 2026-08-14 | 20:00 | The Black Horse |
| `b8bcfb76-e7a5-4fe9-901d-0e45a5000927` | 2026-08-16 | 17:00 | The Rattler |
| `1c1be104-aca2-4d6a-891b-a2ca45e177bf` | 2026-08-21 | 20:00 | The Black Horse |
| `ca5735ac-5b2a-4251-ab4d-e0893ddb5612` | 2026-08-28 | 20:00 | The Black Horse |
| `06a5bab9-25f5-4ea8-9767-97edfd153451` | 2026-08-30 | 15:00 | Teal Farm |
| `4bf15df9-4f2d-4cd1-b4c6-513709f81d78` | 2026-08-30 | 18:00 | The Keelman |
| `c5b84321-dc76-4451-a056-83087180d9b8` | 2026-09-04 | 20:00 | The Black Horse |
| `6ce053de-1e5a-41c0-bbb8-2db49d99aee7` | 2026-10-02 | 20:00 | The Black Horse |
| `9345159c-4534-43a6-bc0e-3df0fd3b01e3` | 2026-10-30 | 20:00 | The Black Horse |
| `79e9b1d5-a62b-4fa6-abed-21aaba2768ad` | 2026-11-06 | 20:00 | The Black Horse |
| `819fa9a9-6998-4084-885a-eda0c0d2f462` | 2026-11-27 | 20:00 | The Black Horse |
| `693989bf-e0d4-44b3-9894-9d8c2afe8bfc` | 2026-12-04 | 20:00 | The Black Horse |
| `fa9de317-032d-4188-8740-a6ddb73c3ca4` | 2026-12-04 | 20:30 | The Denton |
| `daf1fe89-5644-4c7b-b0ee-ae14edb31309` | 2026-12-11 | 20:00 | The Black Horse |
| `93fe7164-cd8a-4270-8c57-add24c55a4f5` | 2026-12-18 | 20:00 | The Black Horse |
| `3590ba0b-7d93-4fe9-af16-364249950d90` | 2027-02-19 | 20:30 | The Denton |

Read back in one call: `search_event(artistId, 2026-08-09 → 2027-08-09)` returned 16 events with
the correct dates, times, venues and externalIds.

Existing venues reused, not re-created: Teal Farm `af56aeaf-a343-4974-b101-208ff4fd430d`,
The Denton `cdac6734-32df-4f95-b2d9-e262d4a9185a`, both matched on their `insangel` externalId.

**Two dates carry two gigs for this act, and both are the source's own listing.** 2026-08-30 is
Teal Farm 15:00 and The Keelman 18:00 — an afternoon and an evening booking, and consistent.
2026-12-04 is The Black Horse Consett 20:00 and The Denton Newcastle 20:30 — 30 minutes apart and
about 25 miles apart. Both are published by insangel with those times. Both were written, because
the source is the only evidence available and §0A says write what the evidence supports. **This is
flagged for the next run to check against the venues' own pages, not escalated.**

### Event externalId form used

`{source:"insangel", id:"<YYYY-MM-DD>-<insangel-band-slug>-<insangel-venue-slug>"}`, for example
`2026-12-04-kaitlin-lee-robson-the-black-horse--consett`. This is §6D's slug form built from the
site's own stable slugs, as `sources/insangel.md` requires. The double hyphen inside a venue slug
is the site's, and is kept rather than tidied.

## 5. Gate bounces

One, verbatim:

```
DUPLICATE_EVENT — Event already exists: This artist already has an event at this venue on
2026-08-09. Artists can only have one gig per venue per day.
existingEventId: f283f0cb-dbcf-41c2-abe2-3f3f7362a260
existingEventTitle: Alpha November @ Chesters
matchedExternalId: null
```

Correct behaviour by the gate. The event was created by the 2026-05-14 run. **It carries
`{source:"insangel", id:"59f5e99592f1"}` — the SHA1[:12] form the spec declares void.** Nothing
was retried and no variant was written (§0.9).

## 6. Two placeholder slugs the spec does not list

`sources/insangel.md` declares five placeholder slugs. The live page carries two more that behave
identically and would have become artist records:

- `backing-tracks-solo-tbc` — display name "Backing Tracks Solo TBC" — **10 forward rows**
- `indie-scene-proposal` — display name "Indie Scene Proposal" — **4 forward rows**

Both were rejected as non-acts under §0.4 and §0.6. Neither is in the snapshot's in-scope count,
so this run's 663 includes them; the 649 rows that are genuinely importable excludes them.
Raised as a `RULE` item so the list is corrected, because a run must not edit a rule.

## 7. What the next run should know

1. **Capture through Chrome.** `web_fetch` returns empty for this domain in this environment.
2. **`get_by_external_id` IS a valid probe for insangel VENUES.** Confirmed live: `chesters--chester-le-street`,
   `the-lamplight--coxhoe`, `the-teal-farm--washington`, `the-denton--newcastle` all resolved on it.
   The spec's warning that the probe is invalid was written about ARTISTS and holds there — but it
   is not true of venues, and treating it as universal costs three calls per venue.
3. **The band detail page carries real start times.** `insangel.co.uk/bands/<slug>` lists every
   forward gig as `<date> | HH:MM - <venue>`. One fetch per artist removes the need for §5.6
   defaults across all of that artist's gigs. The spec only claims venue pages "sometimes" carry
   times; the band pages carry them reliably. This is the single highest-value finding of the run.
4. **Coverage is thin, not absent.** Chesters holds 1 event in bndy for the next 12 months while
   insangel lists 2. The Rattler held none and lists 22. The May 2026 import is 3 months stale.
5. **Do not read a missing event as proof of a coverage gap** (§5.4, v2.19). `data\state\cancellations.jsonl`
   was checked before every create. It holds one tombstone, PULS @ Arden Arms 2026-08-08, which does
   not touch this source.

## 8. Deferred, deliberately

- **externalId back-fill on the ~669 events from 2026-05-14.** They hold the void SHA1 form.
  `edit_event(externalIds)` replaces and dedupes to one id per source (§6B), so the fix is a clean
  single pass — but it is a normalisation sweep, not an import, and it would have consumed this
  run's whole budget without adding one gig.
- **633 in-scope rows.** The next run reads the snapshot and works the diff.

## 9. Validator

**NOT RUN. The Linux shell was unavailable for the entire run** — every `bash` call returned
"Workspace unavailable. The isolated Linux environment failed to start (VM service not running)."
`scripts\enrichment_validate.py` could not be executed.

This is reported plainly rather than reported as a pass. What the validator would have checked
this run:

- bio verbatim — **no bio was written**, on the one artist created. Nothing to fail.
- evidence file present — written, before the bndy write, at `data\state\enrichment-evidence-2026-08-09-insangel.jsonl`.
- enum membership — `genres` and `actType` were left empty, not populated.
- URL form and expiring images — **no URL and no image were written**.
- evidenced blank — recorded with the variants tried on both surfaces.

So the run has no outstanding `FAIL` that a validator could have found, and it has no unverified
claim either: the one record it created has no free-text field at all. **It is still a gap, and
the run does not claim step 8 as complete.** Raised as a `BLOCKED` item.

## 10. Quality summary (§6)

| measure | count |
|---|---|
| records created with a verified page | 0 |
| records created with an evidenced blank | 1 |
| records skipped, to retry next run | 178 band slugs, 633 rows |
| names sanitised or rejected as non-acts | 2 |
| gate bounces | 1 (correct) |
| writes verified by read-back | 20 of 20 |
| times defaulted under §5.6 | 0 |
| deletions | 0 |
| tombstones written | 0 |

This run created no stubs. It created one artist, and that artist has a real location, a real act
type decision (left empty on purpose), and a documented reason for every empty field.
