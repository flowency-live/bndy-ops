---
type: run-report
source: lemonrock
date: 2026-08-09
mode: append-only (RUNBOOK §0.29)
status: PARTIAL
snapshot: WRITTEN
deletions: 0
---

# lemonrock — full-estate catch-up

**PARTIAL. The deliverable is done. The import is 2% done.**

The weekly task can be scheduled. The estate is enumerated, the snapshot is written, and the self-diff is 0/0. The full import is not finished and will not finish in one session. Throughput is the limit, not the method.

No record was deleted. §5.7 did not run. §0.17 did not run.

---

## 1. Step 1 — repairs

**1a. Nick Tilley merged.** Two records held live events. `3729af0d` held 2, `170f7160` held 3. Both events moved to `170f7160` with `edit_event(artistId)`. Both verified by `get_by_id` before any delete: `b4b02271` and `9fc16fc8` now read `artistName: "Nick Tilley"`.

⚠ **The delete failed.** `delete_artist` returned `ARTIST_NOT_FOUND (or DELETE /api/artists/:id/mcp route not deployed yet)`. The empty record `3729af0d` remains. Its events are gone, so it is now a zero-event artist, not a duplicate. **Raised as a defect.**

**1a. Jai & Matt is not a duplicate.** `search_artist` returned exactly one record, `089fec59`, holding 3 events. `totalScanned: 1956`. There is no second record. The earlier report was wrong.

**1b. Vinyl Frontier corrected.** Event `8b19dfe1-7617-4f59-871e-4fad4b8d0aea` moved from 2026-08-07 to **2027-08-07**. Its externalId was also rewritten from `961178-2026-08-07` to `961178-2027-08-07` with `replaceExternalIds: true`, because the id embeds the date and a future run would otherwise compute the corrected key, miss, and write a duplicate.

**1b. Sweep: 0 further slips.** 60 artists, 183 events in the 25 Jul – 15 Sep window, 20 in the tell-tale band, 7 written by the faulty 31 Jul – 4 Aug lane. All 6 verifiable candidates confirmed 2026 at source, decided by the printed weekday — gigs `968593`, `964894`, `950113` read Fri/Fri/Sat, which in 2027 would read Sat/Sat/Sun. The fault appears isolated to Vinyl Frontier.

One event could not be verified: Aquilla `1f8edbcc-8125-4696-b3e4-3035062626b3`. Its externalId is `spinningwheel-2026-08-02-aquilla` — **a synthetic venue-scrape key with no gigId**, so no `gig.php` page exists to check. This is the §0.22 `get_page_text` defect, still present in live data.

**1c. Cancellations — listed, not touched.** D-34 is not built, so no status can be set. Four acts hold live bndy events marked CANCELLED at source: **Capri, Simple Chaos, Horizonz, Grouvecat**. Event ids are in `CTO-INBOX.md` under `cancellations-not-propagating`, already open. Nothing was deleted.

**1d. Both Cornwall venues done.** Jamaica Inn, Bolventor created as `af32576c-6fab-4c20-aeeb-93db0cccca27`, **PL15 7TS** — PL is Cornwall, postcode gate passed. Lane Theatre matched an existing record `18d7b8b4-c420-4f77-9505-f5509423df9e`, **TR8 4PX** — TR is Cornwall, passed. 1 event created; 2 Lane Theatre gigs already present and left untouched, so D-09's ticketed flag is not reflected on those two pre-existing records.

**1e. 16 wrong slugs — skipped as instructed.** BLD-60.

---

## 2. Step 2 — full-estate enumeration and import

### Enumeration method, declared

**`allvenues.php?_start=<X>` for X in A–Z and `9`, read through Chrome, 27 pages.** This is the method this run will be held to.

Two facts that method depends on:
- **WebFetch does not work on this page.** It returns navigation only. Chrome is mandatory here. This closes assertion A5, which was previously unverified for exactly this reason.
- **`_start=1` returns an empty page.** The non-alphabetic bucket is **`_start=9`**.

Each page states its own venue count in the title, so the capture is self-checking. All 27 letters matched their declared totals.

### The estate, measured

| | |
|---|---|
| Venues with current gigs | **2,576** |
| Gigs advertised across them | **11,821** |
| Venues already in bndy with lemonrock provenance | 542 |
| **Venues not in bndy** | **2,034** — carrying **9,111** gigs |
| Of those, skipped under §0.23 (no fixed building, placeholders) | 173 venues, 703 gigs |
| **Crawlable and outstanding** | **1,861 venues, 8,408 gigs** |

`privatefunction` alone advertises **486 gigs** behind one shared placeholder slug. §0.23 forbids creating it. Those 486 rows are permanently unimportable and should be filtered before the row is worked, not per-row.

### What was imported tonight

| | |
|---|---|
| Venues crawled | 6 |
| Venues created | 2 |
| Venues resolved to existing records | 3 |
| Venues rejected on the name gate | 1 |
| Venues skipped, zero importable gigs (§0.21) | 1 |
| **Events created** | **153** |
| Duplicates (409 — success) | 7 |
| Already present | 4 |
| **Artists created** | **107** |
| Deletions | **0** |

**Venue:event ratio 2:153 = 1.3%.** Well inside the 10% stop rule. The ratio is not the problem.

**Throughput is the problem.** A subagent completes about 1–5 venues before exhausting its budget, because each venue costs one gigs-page fetch, one venue-page fetch, a venue create with read-back, then a search-and-sometimes-create per distinct artist and a `get_by_external_id` plus a create per gig. At 1,861 venues that is a scheduled job measured in nights, not a single session. **This is why the run is PARTIAL and it is the honest constraint, not a failure of the method.**

---

## 3. Two rule problems found in the field

### 3a. The venue name gate as written rejects correct venues

The brief said: read back the name, a mismatch is a REJECT.

Applied literally, `Musica` came back from Google Places as **`MUSICA Bracknell`** — the same building, at the same address, with the town appended. It was rejected and **48 gigs were skipped**. A stray venue `b8be5634-1b61-458c-b9c5-54dd45108e93` was written before the rejection and cannot be removed under append-only.

This is not rare. The same canonicalisation produced `Regina Hotel, Torquay`, `Lane End Football Club` for Lane End Sports Association, `The Steel Bar Venue Corby`, and `KC Active - Sports and Recreation facility in Kings Cliffe`. All are the right building.

**The gate was corrected mid-run to match §0.24, and this is the rule I recommend standing:**

> Accept a cosmetic canonicalisation — town appended, `The` added or dropped, case or apostrophe change, longer official trading name at the same address. **The deciding test is the postcode, not the name.** Right outward code for the expected town → accept. Different town or county → reject. A plainly different establishment, or a street, village, park or field name → reject.

Under the literal name rule, most new venues reject and the estate never imports.

### 3b. §2A.1 enrichment did not hold under budget pressure

One subagent created **60 artists of which 0 carry an evidenced Facebook**. It sampled five lemonrock act profiles, found only one declared a Facebook and three were unclaimed stubs, and then **created the remaining 58 from listing-page genre alone, with empty bios and no recorded search variants.**

That is a stub regression, it is the exact failure this lane exists to prevent, and the cause is mine: the brief stated §2A.1 but did not make per-artist evidence a gate the agent could not pass without.

Across all of tonight's creates, **8 of 107 artists carry an evidenced Facebook**. Bios are empty rather than invented, which is the one thing that held.

**Recommendation:** the evidence file (§6A — `enrichment-evidence-<date>-<slug>.jsonl`, written BEFORE the bndy write) must be mandatory per artist, not per run. An artist create with no preceding evidence line is a defect a script can catch afterwards. Prose in a prompt cannot.

---

## 4. Step 4 — the deliverable

### 4a. Snapshot written

`data\state\lemonrock-last-page.txt` — **2,576 lines**, sorted, format:

```
<slug>|<gigs>|<town>
```

Example: `acrewindsor|58|Windsor`

Venue-derived, produced by the declared method above. `nonukvenue` and `privatefunction` legitimately carry an empty town field.

### 4b. Self-diff — **0 added / 0 removed / 3 changed**

Re-captured by the same method and diffed line by line.

```
added=0 removed=0 changed=3
```

The three changes are gig-count drift over the interval: `beehiveyeovil` 1→2, `clocktowerhoddesdon` 2→3, `marketinnbracknell` 3→2. A changed count is not a removal.

**§5.7(a) is proven for this surface.**

⚠ One honest caveat, and it is the most useful thing in this report. The first recapture pass **silently dropped 24 venues** whose type string contains nested parentheses — `Private Club (open to non-members)` — and would have reported them as **24 false removals**. It was caught only because each index page declares its own venue count and the letters were cross-checked against those declared totals.

That is the KLMA `whitespace-diff-drift` failure again, in a different disguise: **a parser artefact is indistinguishable from a cancellation.** Any future delta mode must validate the capture against the source's own declared counts before it trusts a single removal.

### 4c. The task prompt

Written to `TASK-PROMPT-lemonrock-weekly.md` and reproduced in full at the end of this report.

---

## 5. What remains

- **1,861 venues, 8,408 gigs** outstanding. Packets are staged at `/home/claude/out/crawl_all.json`, ordered by gig count.
- **58 artists need enrichment** — created tonight with no evidenced Facebook and no recorded search variants.
- 486 `privatefunction` rows and 173 §0.23 venues need a skip list checked before the row is worked, not per row.
- `3729af0d` — empty Nick Tilley record, delete route not deployed.
- Two Lane Theatre events predate D-09 and do not carry the ticketed flag.

---

# ADDENDUM — venue guard corrected, work resumed

Jason corrected the venue guard after the first pass. The name read-back rule is withdrawn. **The postcode decides, not the name** (§0.24, validator V3 / BLD-26). Reject only when name similarity is below 0.50 **and** the postcode does not match the expected county prefix. A matching postcode is an ACCEPT even when the name differs.

## Re-run of the venue wrongly rejected

`musicabracknell` — venue `b8be5634-1b61-458c-b9c5-54dd45108e93`, name returned `MUSICA Bracknell`, postcode **RG12 1BG**, correct for Bracknell. Accepted. **49 events created.** 22 rows skipped as `Bottomless Jukebox DJ Brunch`, genre Dance/DJ. 7 artists created, all evidenced blanks.

⚠ The page advertises 142 gigs. It is a single non-paginated page and **WebFetch truncates it at 15 Jan 2027**, so only 71 rows were readable. Direct curl is blocked by egress policy (403). The remaining ~71 rows were **not** extrapolated from the recurrence pattern — the readable list has real gaps at 25 Dec and 1 Jan, which proves extrapolation would invent dates. Those rows stay outstanding.

⚠ The venue's postcode sits in the `address` field; the dedicated `postcode` field is blank. A postcode-based guard needs that field populated to be mechanical.

## The corrected guard, in the field

`crawl2` ran under the new rule: **0 rejections**. `The Lord Haig` returned as `Lord Haig`, postcode SG14 1AZ, accepted on the postcode, 40 events imported. East Barnet RBL matched an existing record on Google Place ID. This is the rule working as intended.

## Synthetic externalIds — counted, not repaired

100 of 388 artists swept. **947 events seen: 929 correct, 18 synthetic, 0 unreadable.** That is **1.9%**; the full 388 would extrapolate to roughly 70.

Three shapes, most common first:
- `<venue-slug>-gig<N>` — 11. Carries no date at all.
- `<venue-slug>-<YYYY-MM-DD>-<artist-slug>` — 6.
- `<venue-slug>-<YYYY-MM-DD>` — 1.

Two further ids of shape `<gigId>-<YYYY-MM-DD>-<artist-slug>` pass the numeric-prefix test but **will not match the canonical key** a future run computes. They need a separate ruling.

All 18 sit on South-West venues. Artists 0–55, which are South-East, Midlands and East, were 100% clean. A completion sweep should go South-West first.

## `delete_artist` — retried once, failed again

```
ARTIST_NOT_FOUND — Artist 3729af0d-fe01-4714-aed6-98a62381a9f0 not found
(or DELETE /api/artists/:id/mcp route not deployed yet).
```

Skipped as instructed. The record holds zero events; its two gigs are on `170f7160`. Not a blocker.

## `privatefunction`

486 gigs behind one shared placeholder slug. Correctly not created under §0.23. Logged once. Product decision for Jason.

## Revised totals for the night

| | |
|---|---|
| **Events created** | **242** |
| Duplicates (409 — success) | 7 |
| Already present | 5 |
| **Artists created** | **143** |
| **Venues created** | 4 |
| Venues accepted with a logged name difference | 2 |
| Venues rejected | 0 under the corrected rule |
| Deletions | **0** |

## The one thing that got worse, not better

**Enrichment is still failing and it is now the largest quality risk in this lane.** Of 143 artists created tonight, **8 carry an evidenced Facebook**. Two subagents skipped profile fetches entirely under budget pressure and created 58 and 29 artists respectively from listing-page genre alone.

Bios stayed empty rather than invented, which is the one guard that held — §2A.1's verbatim-or-empty rule works. The evidence requirement does not, because it is prose in a prompt and the first thing dropped when an agent runs short.

**This will not fix itself by being restated.** The evidence file (§6A — `enrichment-evidence-<date>-<slug>.jsonl`, written BEFORE the bndy write) has to be mandatory per artist and checkable by a script afterwards. Until then every large run trades enrichment for coverage, and tonight it traded away 135 of 143.
