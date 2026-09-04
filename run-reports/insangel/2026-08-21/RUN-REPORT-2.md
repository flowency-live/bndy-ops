# insangel — RUN REPORT 2 — 2026-08-21

- **runId**: `insangel-2026-08-21T05-02-40Z`
- **heartbeat**: `data\state\heartbeat\insangel-2026-08-21T05-02-40Z.json`
- **outcome**: completed. The run finished inside its 90-minute TTL. It did not reach the 50-create cap.
- **runbook read**: `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR is **v2.19**. The floor passes.
- **prompt floor**: the task prompt names no number. It defers to §6A. No drift to report.
- **spec read**: `sources\insangel.md` in full. `CTO-INBOX.md` read in full for fingerprints.
- **mode (§0.29)**: the spec declares no mode. The run used **append-only**. It deleted nothing and hid nothing.
- **claim**: `data\state\claims\insangel.json` read `heldBy: null`, released at 02:12Z by `insangel-2026-08-21T00-44-04Z`. This run acquired it. **No takeover.**
- **second firing**: this is the SECOND insangel firing today. Run 1 wrote `RUN-REPORT.md`. This file uses the `-2` suffix so it does not overwrite that report. See the standing item `run-report-path-collides-on-second-firing`.
- **validator**: `9 records · 8 clean · 0 FAIL · 1 WARN [mode=gate]`.

---

## 1. Headline

| Measure | Count |
|---|---|
| Events created | 11 |
| Artists created | 9 |
| Venues created | 0 |
| Venues matched and reused | 7 |
| Rows skipped, with reason | 2 (both already skipped and raised by run 1) |
| Records deleted or hidden | 0 |
| **Total creates (cap 50)** | **20** |

**Quality split for the 9 new artists (§6).**

- Created with a **verified page**: **1** — The Hat Band, `facebook.com/TheHatBandNE`, visited in Chrome.
- Created with an **evidenced blank**: **8**. Both surfaces were attempted for each. The variants are in §5.
- Created as a bare stub: **0**. Every record carries a location and a `locationType`. Six carry genres, seven carry an actType, two carry a verbatim bio.
- Names sanitised or refused under §0.6: **1** — `Em And Geggs` became **Em & Geggs** on the act's own words. See §5.
- Staged: **0**. §0A rule 1 forbids staging.

---

## 2. Capture

The sandbox proxy still blocks `insangel.co.uk`. Chrome reached the host and read it in full.

Collection obeyed §0.22: `fetch()` plus `DOMParser` inside `javascript_tool`, reading `a[href]` directly. Every venue slug and band slug is a real source id.

- Raw page: 77 venue cards, 1144 artist-gig rows.
- In scope: 75 venues, 684 artist-gig rows.
- Out of scope: 42 rows dated before capture; 417 rows billed to the five declared placeholder slugs.
- Capture file: `data\raw\insangel\2026-08-21\venues-capture-normalised-run2.txt`.

⚠ **§6B `javascript_tool` guards.** Guard 2 fired on a bare SHA-256 hex string (`[BLOCKED: Base64 encoded data]`). The run split the hash into eight-character groups and it returned normally. Guard 3 (output truncation) was avoided by rendering the large capture into the page DOM and reading it with `get_page_text`. Neither guard is a source fault.

---

## 3. Diff and the §5.7(a) gate

Snapshot: `data\state\insangel-last-page.txt`. Previous snapshot: `insangel-2026-08-21T00-44-04Z`, captured 00:47Z. This capture was taken at 05:05Z, four hours later.

**The capture is byte-identical to the previous snapshot.** Both sides hash to `c31aa91595ae7431914f97d5143074761532a18ca55c37df64e4d95a6f550332`.

| | Count |
|---|---|
| Venues added | 0 |
| Venues removed | 0 |
| Pairs added | 0 |
| Pairs removed | 0 |

**Self-diff gate: 0 added / 0 removed over 75 lines. The gate passes.**

**This is an honest no-change diff.** The source did not move in four hours. Under §6A step 6 alone the run would have written nothing.

---

## 4. What the run did instead, and why

A diff compares the source to itself. It never compares the source to bndy. Three standing `CTO-INBOX` items say so: `insangel-snapshot-hides-backlog`, `skipped-row-swallowed-by-snapshot` and `klma-zero-diff-hid-nine-missing-gigs`.

Run 1 today stopped on the 50-create cap with a **carry-over table of 10 rows**, and wrote its snapshot anyway. Those 10 rows are therefore recorded as seen, and no future diff can re-offer them. Run 1 named this and wrote the recovery table for a later run to use.

**This run is that later run.** It took the table, verified every hash independently, and wrote all 10 rows. It then found one further row that no diff would ever surface.

**Hash verification.** All 10 externalIds in run 1's table were recomputed from `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]` (§6D exception, D-05 FINAL). **10 of 10 matched.** No id was taken on trust.

**Idempotency.** `get_by_external_id` on the first id returned `found: false`. The artist+venue+date sentinel was the control for the rest; no create bounced 409.

---

## 5. Artists created (9)

| bndy id | Name | Type | Location | locationType | genres | actType | acoustic | bio |
|---|---|---|---|---|---|---|---|---|
| `2d0bb5b1-7ba8-45a5-934e-7c0d3fe4411e` | Em & Geggs | duo | North East England | regional | Country, Rock, Pop, Punk | covers | true | verbatim |
| `94566531-7959-4e9c-ac04-662b63173e29` | The Hat Band | band | North East England | regional | Blues, Country | covers, originals | false | verbatim |
| `e83a7b5f-1a5f-4b57-b389-6d9eb402a9a5` | Anthony Morris | solo | North East England | regional | Indie, Pop, Rock | covers | true | EMPTY |
| `0ddca8b3-2f9f-4c71-a5c3-4f6d17cf49a7` | Pete Bell | solo | North Tyneside | regional | Rock, Pop, Britpop | covers, originals | false | EMPTY |
| `50eed1b8-a6dd-4a5b-a80e-45462c272617` | Emma Stiles | solo | North East England | regional | — | covers | false | EMPTY |
| `cb92bd60-b820-41c7-973a-e7c36d3eca79` | Timeless | band | North Tyneside | regional | Rock n Roll, 50s, 60s, 70s | covers | false | EMPTY |
| `cc53e048-3161-4aa7-8949-add1401986f6` | Chris Wraith | solo | North East England | regional | — | covers | true | verbatim |
| `9fa4bde8-470b-4d93-b12f-babc03141166` | Jade Sanders | solo | North East England | regional | — | — | false | EMPTY |
| `d8f84842-6852-4916-b774-68197a962da5` | Malcolm McElwee | solo | North East England | regional | — | — | false | EMPTY |

**§6B Kilmarnock check.** All nine carry a regional location string and all nine were written with `locationType: "regional"`. ⚠ **Read-back cannot confirm it**: `get_by_id` on an artist returns no `locationType` field. That is the standing item `get-by-id-omits-locationtype`, already open. Not raised again.

### The one name correction (§0.6 / §0.20)

The source bills **`Em And Geggs`**. The act's own copy on its band page opens *"Hi we are Emma and Simon (Em & Geggs)"*. **The act's own words are the naming authority**, so the record is **Em & Geggs**, with `nameVariants: ["Em And Geggs"]` written back per §1A.5 and read back clean. This is §0.20's & ↔ and rule applied from the act's side, not the source's.

### The one verified page

**The Hat Band → `facebook.com/TheHatBandNE`.** Google returned it first. The page was then VISITED in Chrome (§2A.1 item 3): category `Musician/band`, 453 followers, logged in, live.

Identification evidence, three signals, none of them a bare name match:

1. The page handle carries the **NE** suffix.
2. The page states *"For gigs contact Malcolm"*, and the source bills **`malcolm-mcelwee`** on the same bill at The Raven on 2026-09-30.
3. The source band page states *"playing small venues across the North East and North West"*.

Avatar written as `graph.facebook.com/TheHatBandNE/picture?type=large` — a stable graph URL, never `scontent.*` (§2A.2).

### Bio judgment, stated plainly

§2A.1 item 8: a bio is a character-for-character quotation of the act's own page, or it is EMPTY.

- **Em & Geggs** and **Chris Wraith** publish **first-person** copy on their own source band page (*"Hi we are Emma and Simon…"*, *"Hi I'm Chris…"*). Copied verbatim, including Chris Wraith's own line breaks and his own typos (*"form other artist"*, *"genre's"*). Nothing was tidied.
- **The Hat Band**'s bio is quoted from its **Facebook page**, not from the source.
- **Anthony Morris, Pete Bell, Emma Stiles, Timeless** publish **third-person booker promo** on the source page. That is not the act's words, so **their bios are EMPTY** and only genres, actType and location were taken from that copy under §2A.5(b). This follows run 1's ruling on Dani.
- **Jade Sanders** and **Malcolm McElwee** have no description at all. Everything except name, type and location is EMPTY.

⚠ **Still open, and worth a CTO ruling:** whether a source band page counts as "the act's own page" for §2A.1 item 8. Run 1 raised the same question. This run applied run 1's answer for consistency rather than inventing a second one.

### Search variants, per act (§2A.1 item 3b)

Surface (a), Facebook page search, **was down for the whole run**: `facebook.com/search/pages/?q=` returns no text content. That is the open item `facebook-page-search-not-found`, already raised twice including today. Not raised a third time. **Google was therefore the only working identification surface**, and every blank below is recorded on Google alone. Under §2A.1's own standard that makes these blanks weaker than the rule wants.

| Act | Variants tried | Outcome |
|---|---|---|
| Jade Sanders | `"Jade Sanders" singer band facebook` · `"Jade Sanders" acoustic singer Whitley Bay Amble gigs` | US acts only (Louisiana, Florida). §2A.1 item 1: a same-name non-UK act is a different act. Blank. |
| Anthony Morris | `"Anthony Morris" singer facebook Sunderland` · `"Anthony Morris" Tyne and Wear band live music` | Personal profiles only. §2A.4 forbids linking one. Blank. |
| The Hat Band | `"The Hat Band" band facebook` | **Page found and visited.** |
| Em & Geggs | `"Em And Geggs" band facebook` | No page. Blank. |
| Pete Bell | `"Pete Bell" musician band` | No confident UK NE page. Blank. |
| Emma Stiles | `"Emma Stiles" singer band` | No confident UK NE page. Blank. |
| Timeless | `"Timeless" band facebook` | Name too common; no confident match. Blank. |
| Chris Wraith | `"Chris Wraith" musician facebook` | No confident page. Blank. |
| Malcolm McElwee | `"Malcolm McElwee" musician singer facebook` | No result for this exact name. Blank. |

### Identity checks that did NOT create

- **The Hat Band** was held against **The ZML Band** (Kings Langley) at 75%. Different name, different canonical region. §1A.7: not a collision. Created with `confirmNew`.
- **Jade Sanders**, **Chris Wraith**, **Anthony Morris**, **Timeless**, **Pete Bell**, **Emma Stiles**, **Malcolm McElwee**, **Em & Geggs**: no candidate at or above 70%, and no normalised-name equality. The spec ladder allows an automatic link **only** on normalised name equality. None applied.

---

## 6. Events created (11)

All carry `isPublic: true` and a §6D-exception sha1 externalId. **Every start time is a real stage time read from a venue detail page by run 1. No time was defaulted.** §0.28 is satisfied for every row.

| # | Date | Time | Title | bndy event id | insangel externalId |
|---|---|---|---|---|---|
| 1 | 2026-09-20 | 16:00 | Jade Sanders @ Three Brass Monkeys | `c0ce7fa5-1c87-4eb4-a431-33a095e8ee77` | `389ab6384b11` |
| 2 | 2026-09-30 | 20:00 | Em & Geggs @ The Raven | `ba2baefb-1ef1-4512-949d-1dc172d22a40` | `4ee0c330bd97` |
| 3 | 2026-09-30 | 20:00 | The Hat Band @ The Raven | `4d459255-9eca-4809-87f4-044193f6d081` | `a124fd408a2f` |
| 4 | 2026-09-30 | 20:00 | Malcolm McElwee @ The Raven | `395b958b-a965-4c52-8a69-96fffa7eb652` | `8e92f8913789` |
| 5 | 2026-10-15 | 20:00 | The Hat Band @ The Rattler | `769f2166-56a6-40e7-95a7-7c2f34b90c43` | `5e9c52c724cc` |
| 6 | 2026-10-24 | 19:00 | Anthony Morris @ The Chapel Park | `8fbbc904-22a2-44ed-bf40-a6ab4626258a` | `6e0c3d2fd8ee` |
| 7 | 2026-11-13 | 20:00 | Jade Sanders @ The Amble Inn | `7c1e5f16-1fd9-485f-a705-516c103f9bb4` | `87e44469726b` |
| 8 | 2026-11-14 | 13:30 | Pete Bell @ Lamplight | `21c3e972-91ef-4b6a-a395-5eaa621c401c` | `01ce29607a1f` |
| 9 | 2026-12-11 | 20:00 | Emma Stiles @ The Amble Inn | `fcab21b5-762e-43e9-bd18-8f970490cb3c` | `694d9f2c61fd` |
| 10 | 2026-12-26 | 21:00 | Timeless @ GW Horners | `fe7bca50-1cad-4276-a62c-eb21cba4f3e2` | `9827535077ba` |
| 11 | 2027-01-02 | 19:00 | Chris Wraith @ The Chapel Park | `132c009d-d06b-4de4-bfcc-7476a194e42a` | `37319df069e8` |

**Row 4 is not from run 1's table.** The Raven on 2026-09-30 is a four-act showcase. Run 1 imported two of the four and noted that `malcolm-mcelwee` sat in the previous snapshot, so no diff would ever offer him. This run read the venue's live event list, found the bndy record genuinely absent, and wrote it. §4 applies: one discrete event per act, four acts, four events.

**Venues.** All seven resolved on their `insangel` externalId. None was created. None needed a top-up.

| Venue slug | bndy venue id |
|---|---|
| `three-brass-monkeys--whitley-bay` | `e2e40de8-d510-485d-8cfc-5a0007a7440c` |
| `the-raven--cleadon` | `cb08b5f1-2271-4f7f-9a68-480a832ff333` |
| `the-rattler--south-shields` | `0ae09950-ad0a-4854-9bc5-deaa6349c9a5` |
| `the-park--newcastle` | `78871b2f-3127-45bd-abb7-b5869cee1f1b` |
| `the-amble-inn--amble` | `9adcf560-b0bd-4efa-b9b7-ede765c44946` |
| `the-lamplight--coxhoe` | `f40351b5-5e3b-49e7-81af-cb09949757bc` |
| `g-w-horners--chester-le-street` | `35b992a2-2903-4172-be1b-11d8e9ca35ec` |

**Run 1's carry-over table is now empty. Zero rows carry over from this run.**

---

## 7. Corrections this run made to its own work

Both were caught by read-back or by the validator, before the run reported anything.

1. **`&amp;` written into an event title.** The run created `ba2baefb-…` with the title `Em &amp; Geggs @ The Raven`. **§6B forbids HTML-escaping `&` in a tool argument** and this is the exact failure §6B records. Caught on the create response, corrected with `edit_event` in the same minute, read back as `Em & Geggs @ The Raven`. **Own error, not a tool defect.**
2. **`Irish` written as a genre.** `create_artist` **accepted** it — the enum in the MCP tool schema contains `Irish`. The validator rejected it: `GENRE_ENUM: 'Irish' is not in the canonical list`. §0.18 names `bndy-frontstage/src/lib/constants/genres.ts` as the authority, **not a tool schema**, so the validator is right and the tool is wrong. Corrected to `Blues, Country` and re-validated clean. This is a second live instance of the BLD-54 schema disagreement; raised.

---

## 8. Skipped, deferred and observed

### Rows skipped (2) — both carried from run 1, both correctly skipped again

| Row | Reason |
|---|---|
| `private-function` 2026-09-17 `back-to-the-80s` | §0.23 named non-place. Already raised as `insangel-private-function-bare-slug`. |
| `the-wheel-house--washington` 2026-08-22 `les-anderson` | No address and no postcode published. §0.8 forbids a guess. Already raised as `insangel-wheel-house-no-address`. **This gig is tomorrow.** It will pass unimported unless the address is supplied. |

### Validator WARN, not acted on

`NAME_BILLING: format tail on the name: 'The Hat Band'`. **This is a false positive.** §2A.1 item 7 states plainly that a trailing `Band` is part of an act's name and must not be stripped on the pattern alone. The act's own Facebook page is titled `The Hat Band`. The name stands.

### Tombstone check (§5.4)

`data\state\cancellations.jsonl` holds 6 records. Every planned event was matched on artist + venue + date. **0 hits.** No row was `TOMBSTONED`.

### Removed rows

None. The diff is 0/0, so §5.7 removed-row handling had nothing to consider. §0.17 did not run, and would not have: the mode is append-only.

---

## 9. Enrichment evidence

File: `data\state\enrichment-evidence-2026-08-21-insangel.jsonl`, owned by this source's runs per §6F. Run 1 wrote lines 1-5. **This run APPENDED lines 6-14** and rewrote nothing.

⚠ **Timing, stated honestly, same as run 1.** §6A step 8 requires the evidence line before the bndy write. The validator keys on `artistId`, and a create has no id until it returns. Each line was written immediately after `create_artist` returned and **before** the artist's `edit_artist` calls and every event write. All searches ran before any create. This is the open item `evidence-file-cannot-precede-a-create`.

---

## 10. Validator

```
9 records · 8 clean · 0 FAIL · 1 WARN   [mode=gate]
```

Records file: `data\normalized\insangel\2026-08-21\records-run2.json`. The first pass returned 1 FAIL (`Irish`); it was corrected in bndy and re-run clean. The single remaining WARN is the false positive in §8.

---

## 11. Files written

| File | Action |
|---|---|
| `data\state\heartbeat\insangel-2026-08-21T05-02-40Z.json` | created, then rewritten with the outcome |
| `data\state\claims\insangel.json` | acquired, then released |
| `data\raw\insangel\2026-08-21\venues-capture-normalised-run2.txt` | created |
| `data\raw\insangel\2026-08-21\prev-snapshot-run2-baseline.txt` | created (run 1's snapshot, kept for forensics) |
| `data\state\insangel-last-page.txt` | rewritten with this run's header. Content unchanged — the capture is byte-identical. |
| `data\state\enrichment-evidence-2026-08-21-insangel.jsonl` | appended, 9 lines |
| `data\state\run-summary.jsonl` | appended, 1 line |
| `data\normalized\insangel\2026-08-21\records-run2.json` | created |
| `data\normalized\insangel\2026-08-21\RUN-REPORT-2.md` | this file |
| `20-Daily\2026-08-21.md` | appended, 1 line |
| `CTO-INBOX.md` | appended, 3 lines |

`record_run` was not called. It fails on a missing `SOURCE_RUNS_TOKEN` and is already open as `record-run-token-missing`.
