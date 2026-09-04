# insangel — RUN REPORT 2026-09-03

- **runId**: `insangel-2026-09-03T05-02-34Z`
- **outcome**: COMPLETED. All in-scope rows were written. The 50-create cap was not reached.
- **runbook version read**: v2.27. **CURRENT FLOOR (§6A)**: v2.19. Above floor.
- **prompt floor**: the task prompt states no number. §6A step 2a is the gate.
- **claim**: `data\state\claims\insangel.json`. Previous state `heldBy: null`, released by the 2026-09-02 run. Acquired clean. No takeover.
- **heartbeat**: `data\state\heartbeat\insangel-2026-09-03T05-02-34Z.json`
- **mode**: `append-only`. The spec declares no §0.29 mode, so no removal was actioned.

## 1. Headline

| measure | count |
|---|---|
| events created and read back | 12 |
| artists created and read back | 3 |
| venues created | 0 |
| venues matched to an existing record | 9 |
| artists matched to an existing record | 6 |
| rows deferred at the cap | 0 |
| rows skipped, stated reason | 1 |
| 409 or 422 bounces | 0 |
| validator | 3 records, 3 clean, **0 FAIL, 0 WARN** |

**Creates this run: 15 of 50. The cap was not reached.**

Quality split (§6): **1** artist created with a verified page (Dannielle Keys) · **1** artist created with a verified own website and an evidenced Facebook blank (Dean Clark) · **1** artist created with an evidenced blank on both surfaces (So What) · **0** artists staged · **0** names sanitised under §0.6 · **0** rows staged as non-acts.

## 2. Capture

- The sandbox `curl` surface returns HTTP 000 for this host. The egress allowlist still blocks it. See CTO-INBOX `insangel-egress-allowlist-request`.
- Chrome was the working surface, as on 2026-08-21, 2026-09-01 and 2026-09-02. `list_connected_browsers` returned one browser.
- Collection used DOM `a[href]` reads inside `javascript_tool`, per §0.22. `get_page_text` was not used for extraction.
- Raw capture: `data\raw\insangel\2026-09-03\venues-body.txt`.

Raw page: **67 venue cards, 992 gig rows.**
In scope after filters: **67 venues, 652 artist-gig pairs.**
Out of scope: 6 rows dated before capture, 334 rows on the five declared placeholder band slugs, 0 duplicate pairs collapsed, 0 rows beyond the 12-month horizon.

`javascript_tool` output guards behaved as §6B records. The `=` guard blocked one return, which was re-issued with `=` transformed. Output truncated near 1000 characters, so the snapshot body was paged out in 17 character ranges. **Neither is a source fault.**

## 3. Self-diff gate (§5.7a)

The snapshot body was hashed in the page with `crypto.subtle.digest` before transfer, and again on disk after the 17-chunk reassembly.

```
SHA-256 c1f815c59641851c960de254c21e69db02b9705170e59b84cff2d2cea1aba840
16936 bytes, both sides. 0 added / 0 removed. GATE PASSES.
```

## 4. Diff against the stored snapshot

Previous snapshot: `insangel-2026-09-02T05-02-36Z`, captured 2026-09-02T05:05:00Z.

- venues added: **1** — `springfield-inn--darlington`
- venues removed: **0**
- pairs added: **13**
- pairs removed: **5**

## 5. Events created (12)

Every date and every time below comes from the VENUE DETAIL page, which prints the full year and a stage time. The listing-derived year agreed with the detail page on all 13 added rows. No time was defaulted.

| event id | title | date | startTime | externalId (sha1[:12]) |
|---|---|---|---|---|
| `68371c2e-5824-4bcf-bb16-cad7de025879` | Dannielle Keys @ Langley Park Hotel | 2027-02-13 | 20:30 | `aa1e9104b6f2` |
| `058a5441-771f-475d-90e2-b034dd56aab6` | Jada Tia @ Namaste Indian Restaurant & Kings Prosecco Lounge | 2027-03-13 | 20:00 | `e909e80f80d1` |
| `f8605425-f665-4a78-bee6-cba8c89c104a` | Alana @ Springfield Hotel | 2026-09-05 | 21:00 | `7fc37832509a` |
| `443c5a4c-62de-492e-b386-97d61b9e0854` | So What @ GW Horners | 2027-05-15 | 21:00 | `9c39de703878` |
| `2911782e-ea6b-4e24-9988-5367201e9f1e` | Eves Apple @ GW Horners | 2027-05-22 | 21:00 | `5f03479defc9` |
| `9905ecc5-d08e-4fe7-99fa-3c6cc7454464` | Ben Lackenby @ Endeavour | 2026-12-21 | 19:00 | `9b50887ffdea` |
| `3af99310-5a82-4689-81db-f3ac6c0f7221` | Justin @ Endeavour | 2026-12-22 | 19:00 | `fb5e12182262` |
| `7b01b954-39fe-4772-a85f-4baf5ea42e25` | Justin @ Rappor Lounge | 2026-09-26 | 19:00 | `591fbaa2cd14` |
| `8c498dd1-b9ec-48ae-832b-ba5eb455af57` | Dean Clark @ Corner House | 2026-10-02 | 20:30 | `7ad32b099175` |
| `eff3727f-5584-4628-941d-133228b7f53b` | Ben Lackenby @ Corner House | 2026-10-16 | 20:30 | `9f8799a09e52` |
| `776dd9a9-6d56-4e9a-a2ba-4f48427b2ca3` | FM @ The Blue Bell Inn | 2026-10-17 | 20:30 | `584576cadd4e` |
| `b5911bcc-c251-4d9c-a10c-cd0ad1013230` | Dannielle Keys @ The Mighty Oak and acorn bistro | 2026-12-18 | 20:00 | `5169ad3c93ea` |

All 12 were read back with `get_by_id` (§0.10). All hold `isPublic: true` and the single `insangel` sha1 externalId ruled final by D-05.

## 6. Row skipped (1)

| row | reason |
|---|---|
| `hornby-park--seaton-carew` 2026-12-11 Justin | The venue is not in bndy. The source publishes no address and no postcode for it. §0.8 forbids a guessed geocode. Already raised: CTO-INBOX `insangel-hornby-park-no-address`, 2026-09-01. Not re-raised. |

## 7. Artists created (3)

**Dannielle Keys** — `6c3036eb-7388-4c03-b9e6-64ccae46e243`
- Verified page: `https://www.facebook.com/heartshapedmusic`, 408 followers, activity within one month.
- Evidence bar (§2A.1): the page states "Newcastle upon Tyne" and "available all around NE England". That matches the NE gig footprint of this source. A Chronicle Live article of 2022-11-12 names the same act as a professional singer from Blyth, Northumberland.
- Location taken from the act's own page, not from a gig town: `Newcastle upon Tyne`, `locationType: city`.
- Bio quoted character for character from the page: "A full time Pro solo acoustic artist available all around NE England, performing hit after hit".
- Avatar: `graph.facebook.com/heartshapedmusic/picture?type=large`. No `scontent` URL.
- actType `covers`, from her own page video caption "Cover artist from Northumberland". Genres left EMPTY — the page states none.

**Dean Clark** — `2147aca9-5b8e-49c5-b729-b2ed0df4030e`
- No Facebook act page exists. Facebook page search returned only unrelated "Dean Shields" pages. Both surfaces were searched. This is an evidenced blank on Facebook, not an unchecked one.
- His OWN website was found and used: `https://guitardean3.wixsite.com/website-1`.
- Bio quoted from that site, cut at a sentence boundary: "Professional musician hailing from and based in South Shields in the North East of England."
- Location `South Shields`, stated on his own site.
- actType `covers`, genres `Rock` and `Pop`. Genre is the only inferred field (§2A.1 item 8).

**So What** — `6475d4cd-848b-4ff8-a163-f50f8207d4e8`
- Evidenced blank on BOTH surfaces. Variants tried are in the evidence file.
- The name is two common words, so a page search cannot separate the act from ordinary language. Blank beats wrong (§2A.1).
- Location `Chester-le-Street`, the town of both venues that book it (GW Horners and The High Crown).
- Genres `Rock`, inferred from the insangel venue-page descriptor "Long Established North East Rock Cover Band". actType `covers`.
- Bio EMPTY. The insangel band page carries an About text, but whether a source band page counts as the act's own page is an OPEN DECISION (CTO-INBOX `source-band-page-as-the-acts-own-page`). Until it is ruled, this run does not quote one.

## 8. Artists matched (6)

`Justin` `ceb01f90-a54d-48f7-81b3-9cffb093d0cf` · `Alana` `46f706e4-4f21-4693-8d88-27aeb83649ec` · `Jada Tia` `6f5e1a7e-f153-43a4-b651-c5b674ebb5bc` · `Eves Apple` `ee1a0e4f-27f8-4d0f-b373-63188b368cde` · `Ben Lackenby` `c1ee004c-2a08-4587-bf61-b772beaa7fd8` · `FM` `baa46764-ab58-4f04-8b6c-6aa126debb47`

All six matched on normalised name EQUALITY, which is the only automatic link the spec's ladder allows. No link was made on a similarity score.

## 9. Venue matched, and one duplicate avoided

`springfield-inn--darlington` is a NEW slug for this source. It is NOT a new venue.

- `search_venue("Springfield Inn", "Darlington")` returned **no venues found**.
- The §3 fallback probe `search_venue("Springfield", "Darlington")` returned **Springfield Hotel**, `b31b6abf-23a9-4b5c-8862-a8a7ceced4cb`, at the SAME address `Salters Ln S, Darlington DL1 2RB`, at **65% low_confidence** — below the 50%-plus create-new threshold read as noise.
- The record already carried `{source: onthecasemusic, id: 6123}`. This is the documented cross-source overlap (spec FIX 3). The place_id is the identity (§1).
- Action: reused the record, ADDED `{source: insangel, id: springfield-inn--darlington}`, and stored `Springfield Inn` as a `nameVariant` per §0.6 as extended in v2.26. No second venue was created.
- This is the sixth recorded instance of the §2.16 class: the exact name misses and the loose probe finds the record. No new inbox item — `search-venue-apostrophe` already covers it.

Other venues matched by `insangel` externalId: Langley Park Hotel `6ec6ffdc-bf8d-45b3-ae08-36f60f4085dc` · Namaste Indian Restaurant & Kings Prosecco Lounge `e4c0d6a8-68e7-4c93-976a-2461d43b7e36` · GW Horners `35b992a2-2903-4172-be1b-11d8e9ca35ec` · Endeavour `36c35f24-a878-4bbf-ae60-6ba1ec82dbec` · Rappor Lounge `fed8b953-08f1-4221-b59b-784777e91ff5` · Corner House `4fda02f7-fa4a-4ef1-a88f-fdc33c64311f` · The Blue Bell Inn `a418a870-4b03-472d-bff3-96ac7a54b37d` · The Mighty Oak and acorn bistro `50f5fc25-1b00-4a4e-a2c9-a64059e68682`.

Postcode check (§0.24): DL1 2RB is Darlington, County Durham. It agrees with the source's area tag.

## 10. Removed rows — logged, not actioned (§0.29 append-only)

Five future-dated pairs vanished from the source. The mode is `append-only`, so §5.7 removed-row handling and §0.17 deletion DID NOT RUN. Nothing was deleted and nothing was hidden.

| removed pair | bndy event | state |
|---|---|---|
| `the-raven--cleadon` 2026-09-30 Em & Geggs | `ba2baefb-1ef1-4512-949d-1dc172d22a40` | live, sole-source |
| `the-raven--cleadon` 2026-09-30 The Hat Band | `4d459255-9eca-4809-87f4-044193f6d081` | live, sole-source |
| `the-raven--cleadon` 2026-09-30 Lauren Gibson | not in bndy | nothing to action |
| `the-raven--cleadon` 2026-09-30 TBC | not in bndy | placeholder, never imported |
| `g-w-horners--chester-le-street` 2026-09-12 Eves Apple | `f3fff8e2-e03e-47cc-98a7-4261a0350b01` | live, sole-source |

The Raven now bills only Malcolm McElwee on 2026-09-30, where the source previously billed four acts. That is a re-bill, not a cancellation. Three live bndy events now disagree with the source. Raised as one dated DATA item.

## 11. Tombstone check (§5.4)

`data\state\cancellations.jsonl` holds 17 lines. None matches any artist + venue + date created this run. No create was withheld.

## 12. Year rule

187 of 992 listing rows print a weekday that does not match the year the spec's rolling rule derives. That is the standing finding `insangel-weekday-proves-2027-year` and `insangel-detail-page-carries-year-and-time`, both already in the inbox. Not re-raised.

**None of the 13 added rows was affected.** Each was confirmed against the venue detail page, which prints the full year, and every detail-page year agreed with the listing-derived year.

## 13. Gate bounces

None. Zero 409, zero 422, zero 500.

## 14. Files written

- `data\raw\insangel\2026-09-03\venues-body.txt`
- `data\state\insangel-last-page.txt` (snapshot, header records the normalisation and the 0/0 gate)
- `data\state\enrichment-evidence-2026-09-03-insangel.jsonl` (3 records)
- `data\state\heartbeat\insangel-2026-09-03T05-02-34Z.json`
- `data\state\run-summary.jsonl` (one appended line)
- `20-Daily\2026-09-03.md` (one appended line)
- this report

**Note on evidence-file ordering.** §6A step 8 requires the evidence file before the bndy write. The captured text and the search variants were written before any create. The `artistId` field could not be, because the id does not exist until the create returns. The file was rewritten once after the creates to fill the three ids. No captured text changed. This is a two-phase write of the same evidence, not a post-hoc reconstruction.

## 15. `record_run`

Not called. It fails on a missing `SOURCE_RUNS_TOKEN` and that is already in the inbox as `record-run-token-missing`. `run-summary.jsonl` carries the run.
