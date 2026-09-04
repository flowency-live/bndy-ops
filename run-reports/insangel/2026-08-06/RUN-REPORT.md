# insangel — scheduled run report — 2026-08-06

**OUTCOME: HELD SEED RUN (§6A step 5). Nothing imported. No snapshot written. This is the correct and expected result.**

| | |
|---|---|
| Source | `insangel` (insangel.co.uk/venues) |
| Runbook | `RUNBOOK.md` **v2.8** — asserted ≥ v2.4 floor ✅ |
| Spec | `sources\insangel.md` (updated 2026-05-14, canonical-overrides block 2026-07-30) |
| Standing rulings | `OPEN-RULINGS.md` read; both STANDING RULINGS applied |
| Capture date | 2026-08-06 (`date +%Y-%m-%d`) |
| Horizon | 12 months → ceiling 2027-08-06 (§6E) |
| **Writes to bndy** | **0 artists · 0 venues · 0 events · 0 edits · 0 deletions** |
| **Snapshot written** | **NO — deliberately. `data\state\insangel-last-page.txt` does not exist and no named seed lane is authorised.** |
| Cap usage | 0 / 50 |

---

## 1. Why this run held

`data\state\insangel-last-page.txt` **does not exist**. §6A step 5 is unambiguous: a missing snapshot is a **held run**, not a green field. The one carve-out is a **named baseline lane** (§6), and the insangel lane is still open and unauthorised — `OPEN-RULINGS.md` line 30, `[ ] 2026-07-31 · insangel · Authorise (or decline) a named seed lane`.

So the contract for this run was: capture, report what a seed *would* create, stop. Writing the snapshot on a held run is explicitly forbidden — it would mark today's 1,181 rows as "seen" and make tomorrow's two-sided diff silently swallow every one of them.

**This will keep happening every night until a lane exists in writing** (name · region scope · cap · per-batch go/no-go · closing condition). That is by design and is not a fault.

---

## 2. Enrichment / creation quality (§6 — the required breakdown)

| Class | Count |
|---|---|
| Artists created **with a verified Facebook page** | **0** |
| Artists created **with an evidenced blank** | **0** |
| Artists **staged** | **0 created; all 176 candidate slugs held upstream** |
| Names **sanitised or staged as non-acts** under §0.6 | 0 sanitised · **3 flagged for the lane** (§5.3 below) |
| Stubs created | **0** |

No artist reached §2/§2A this run, because the pipeline (§6A step 6) was never entered — the run stopped at step 5. **No "no page found" was recorded for any act**, so nothing in this report should be read as evidence that an insangel act is pageless. Under §2A.1 item 3b every one of the ~106 projected creates needs **both** a Facebook page search **and** a Google search before a blank may be recorded.

---

## 3. Capture (§6A step 4)

**Method.** `https://insangel.co.uk/venues`, read in Chrome via `fetch`-free DOM access inside `javascript_tool`, reading `a[href]` attributes directly. **`get_page_text` was NOT used** (§0.22) — venue and band slugs live in `href="venues/<slug>"` / `href="bands/<slug>"` and text extraction discards them. Every row in this report carries a real source slug; **nothing was synthesised**.

**Structure found (matches the spec exactly):** 76 `.band_title` venue cards · 1,181 `.venue_page_gig` rows · 1,181 `.small_gig_date` · 1,181 `.small_band_list` · 76 venue anchors · 1,190 band anchors. Page HTML 749,166 bytes. Server-rendered, no lazy-load, so the §6B hidden-Chrome trap does not apply to this source.

### ⚠ 3.1 The raw page dump could not be written to disk — this blocks the seed lane

`data\raw\insangel\2026-08-06\` holds the **derived inventories** (venues, artists, counts), not the full 1,181-row dump.

The sandbox cannot reach `insangel.co.uk`: `curl` returns **`HTTP 403 from proxy after CONNECT`** and `web_fetch` returns an empty body. The domain is not on the egress allowlist, and §6B records that the allowlist is read at **session start**, so it cannot be added mid-run. The capture therefore lives in the browser tab, and only aggregate/derived slices could be transferred out.

**Why this matters more than it looks.** §6A step 5's carve-out says a seed lane's snapshot **must be a reproducible page dump in the source's declared format** — explicitly *not* a derived aggregate. On today's tooling a Cowork session **cannot produce that artefact for insangel at all**. Raised in `OPEN-RULINGS.md`.

### 3.2 Row disposition

| | Rows |
|---|---|
| Captured | **1,181** |
| Date parsed successfully | **1,181 / 1,181 (100%, 0 failures)** |
| Dropped — past-dated (stale render) | 39 |
| Dropped — beyond the 12-month horizon | **0** |
| Dropped — placeholder acts (§0.4) | 476 |
| Dropped — skip-listed venue `private-function--houghton` | 0 (not listed today) |
| **Importable** | **666** |

Year inference used the spec's **rolling** rule (FIX 1): build with the capture year, add one year if the result is >31 days before capture, then drop anything still before capture. No year was hardcoded. 1,181/1,181 parsed cleanly, and the resulting range (2026-08-06 → 2027-07-03) sits wholly inside the horizon with nothing beyond it — consistent with the 1181/1181 verification already recorded in `OPEN-RULINGS.md`.

**Placeholder breakdown (in-horizon rows):** `covers-solo-duo-tbc` 275 · `cover-band-tbc` 147 · `acoustic-covers-tbc` 41 · **`backing-tracks-solo-tbc` 10** · `showcase-tbc` 2 · `tribute-tbc` 1.

> ⚠ **`backing-tracks-solo-tbc` is NOT in the spec's `placeholder_artists` list.** It is already ruled a skip (`OPEN-RULINGS.md` → "Closed against rules that already existed": *`backing-tracks-solo-tbc` (§0.4)*), but the ruling never reached `sources\insangel.md`. It is excluded here. **The spec was NOT edited by this run** — 10 rows is small, the run wrote nothing, and quietly amending a spec's skip list unattended is the same class of act the 2026-08-06 klma run declined. One line for the lane to add. Note the scale: **41.7% of in-horizon rows are placeholders** — this source publishes "a covers act, TBC" far more often than it names one, so a seed lane's row count will look much smaller than the page does.

---

## 4. What a seed lane WOULD create

**Scope: 666 events · 73 venues · 176 artist slugs (174 distinct acts).**

Date spread: 2026-08 160 · 09 108 · 10 118 · 11 84 · 12 68 · 2027-01 49 · 02 23 · 03 25 · 04 15 · 05 8 · 06 6 · 07 2.

### 4.1 Existing vs new — measured on a systematic sample, not assumed

Neither figure below is a guess, and neither is exact. Both come from an **every-Nth systematic sample** of the sorted slug list, resolved live against bndy.

**Artists — sample n = 15 (every 12th of 176):**

| Outcome | n | Examples |
|---|---|---|
| Resolves by `insangel` externalId → **reuse** | 5 | Borderline `81936781-f6f4-4160-b151-ff4a1e47366a` · Eves Apple `ee1a0e4f-27f8-4d0f-b373-63188b368cde` · Hard River `6dffcb83-d8de-4f51-8757-68526a772b50` · Rhythm Revival `7990fc78-ba94-4a06-a648-501d406082d9` · The N.E. Street Band `caa1e8bd-f1e0-492c-94f0-96df96738d3f` |
| Exists but **no `insangel` externalId** — found only by name | 1 | **The White Line `8d58852e-9eb7-4631-be8f-e889c738faf0`** — 100% confidence, location "North East", FB page attached, `externalIds: []` |
| Confirmed **absent** (externalId miss *and* name search miss) | 9 | 199X · Anne Marie Orr · Danielle Lincoln · Soul Street · Mountain Man · Jane Long · Julia Robinson · Lily Rose · Terry Gorman |

→ **40% exist / 60% new. Projected: ~70 reused, ~106 to create.** This independently reproduces the "~110 of the artists need creating" figure recorded on 2026-07-31, from a fresh capture and a different method.

> ⚠ **An `insangel` externalId miss is NOT proof of absence.** The White Line proves it: the act is in bndy, correctly located, with a Facebook page — and a lane that trusted the externalId lookup would have created a duplicate. **Every miss must be followed by a §1A.2 name + footprint check.** This is the same defect already open for onthecase / gigs-news / klma / lemonrock, showing up again here.

**Venues — sample n = 9 (every 9th of 73):**

| Outcome | n | Detail |
|---|---|---|
| Resolves by `insangel` externalId → reuse | 7 | Annitsford Welfare Club `4082b952-…` · GW Horners `35b992a2-…` · The Peregrine `d9602bfa-…` · The Seaton Lane Inn Seaham `29feef76-…` · Namaste `a1b40977-…` · Dirty Bottles `d6276d3a-…` · The High Crown `fb1faaca-…` |
| Exists under **another source's** id — reuse + ADD `insangel` id | 1 | **`Steels. Sunderland` → "Steels Social Club" `8f6b3a46-4f3e-4d9e-8058-b9d715741515`**, carrying `onthecasemusic:steels-social-club-sunderland` |
| Confirmed absent → create | 1 | **Washington Arms, Washington** — 34 gigs, the 4th-busiest room on the source |

→ **~89% exist. Projected: ~65 reused, ~8 to create.**

> ⚠ **`search_venue` surfaced Steels Social Club at only 33% confidence, labelled `low_confidence`** — below every threshold in the spec's match ladder, and it would have been discarded by a rule-following run. This is a second live instance of the `search_venue` false-negative raised this morning by the klma run (`Grumpy's-GB Motorcycles`). The proposed §3.1 amendment — *"a `search_venue` negative is not proof of absence"* — should be widened: **a low-confidence positive is not proof of difference either.** The full stop in `Steels. Sunderland` is what defeats the matcher, exactly as the apostrophe did in `Grumpy's`.

### 4.2 Start times — all 666 would be defaulted

The venues listing page carries **no start times at all**. Under §5.6 every event would take a defaulted time:

| | Rows | Default |
|---|---|---|
| Saturday | 336 | 21:00 |
| Friday | 244 | 21:00 |
| Sunday | 64 | 19:00 |
| Thursday | 13 | 20:00 |
| Wednesday | 7 | 20:00 |
| Monday | 2 | 20:00 |

**100% defaulted is a poor outcome for a 666-event seed.** The spec already names the fix: venue detail pages (`/venues/<slug>`) sometimes carry real times, and *"prefer them when scraping detail pages"*. 73 venue pages is a cheap fetch against 666 events. **Recommendation: a seed lane scrapes `/venues/<slug>` for times before creating events.** Note also the klma finding logged this morning — a venue's established pattern can contradict the mechanical default (Little Vic's Sunday sessions run at 16:00, not 19:00), and this source's 64 Sundays are exposed to exactly that.

### 4.3 Event provenance — a trap the lane must not walk into

Existing insangel events carry the **v1 sha1 externalId** `sha1("<venue_slug>|<date_iso>|<artist_slug>")[:12]`, pipe-delimited (verified live, `OPEN-RULINGS.md`). §6D mandates the slug form `<YYYY-MM-DD>-<artist-slug>-<venue-slug>` for this source.

**These cannot coexist.** §6B: `edit_event(externalIds)` **replaces** and **dedupes to one id per source**. So writing a §6D slug onto an event that already holds a sha1 hash **destroys the old provenance in the same call** — and any earlier record keyed on the hash becomes unmatchable.

A lane must therefore decide up front, and Jason should rule: **either** back-fill every existing insangel event to the slug form in one deliberate sweep and accept the hashes are gone, **or** keep the hash as this source's id (the §6D-bis / lemonrock reasoning — where a source-derived stable id already exists in live data, the incumbent wins). **Doing neither, and letting new rows write slugs alongside old rows holding hashes, reproduces the three-convention mess that suspended provenance writes on `fantasticallibrary`.** No third convention should be introduced.

---

## 5. Name and venue review — §0.6 / §0.23 / §0.24

### 5.1 Name hygiene: this source is unusually clean

All 176 act names were pattern-checked for the §0.6 failure modes — lineup separators, ` - ` straplines, promo punctuation (`!!`, `?`), `& Friends`, `feat.`, `vs`, `with`, `Night`, `Show`, `+`. **Zero hits.** No `Zoe Schwarz Bluez Party` class contamination is visible in this feed. That is a property of the source (it publishes an act field, not a billing line), **not** a reason to relax the identity check — §2A.5(b) as narrowed is explicit that a structured source cannot self-correct a name it supplied, and the check is on the **name**, which structured fields never satisfy.

### 5.2 ADR-023 qualifier pairs — 2 collapses, not 2 new records

`Harlie` + `Harlie Duo` and `Mojave` + `Mojave Duo` are both present. Both are **already ruled** (`OPEN-RULINGS.md` → closed: *`harlie-duo`↔`harlie` and `mojave-duo`↔`mojave` (ADR-023)*): same act, the qualifier belongs in the **event title**, never a second artist record. This is why 176 slugs are **174 distinct acts**. Both mappings should be written to the records as `nameVariants` — and per this morning's klma verification, **`edit_artist(nameVariants)` now works**, so §1A.5's "learn once, never re-ask" is finally executable and these two should not reach a review queue again.

### 5.3 Three names the lane must settle from the act's own page — STAGE candidates

- **`Indie Scene Proposal`** (4 gigs) — reads like a promotion or a night, not a band. §0.6: *a source listing an event or residency as if it were a band does not make it one.* **Stage unless the act's own page carries the name.**
- **`Coldplay Live In Techicolour`** (2 gigs) — "Techicolour" is a misspelling of Technicolour, and the string reads as a **show title** rather than an act name. §0.20 applies: enrich first and let the act's own page settle the spelling and the name. Do not create from the source string.
- **`Abba ca Deborah`** (3 gigs) — probably `ABBA ca Deborah` or similar; casing and form need the act's page.

Low-signal names that will make the §2A.1 identification bar hard, and which must **not** be resolved by settling for a same-name page: `199X` · `AJ` · `FM` · `GPS` · `Eli` · `Fuse` · `Niche` · `Parrk` · `Chester` · `Justin` · `Alana` · `Audios`. **Blank beats wrong** (§2A.1.1) — several of these have obvious non-UK same-name acts.

Known fuzzy-review magnets already documented: **`Oasism`** (§1A.7 — held against Oas-is / Oasish / So Oasis; *none are the same act*) and **`Midnight Rose`** (§6B — one of the candidates that blocked Midnight Shift). Both resolve via `confirmNew` / `resolveTo` after enrichment; neither is a duplicate.

### 5.4 Venues outside the North East — check the postcode, not the town (§0.24)

Six listed venues sit outside the source's declared NE footprint. The spec acknowledges them; the lane must still confirm each by **postcode prefix**, not by the source's area tag:

| Venue | Real county | Note |
|---|---|---|
| The Tan Hill Inn, Richmond | North Yorkshire (DL11) | **Already ruled** — kept under the §0.7 precedent. ⚠ "Richmond" is a live §0.24 trap: Richmond **London** TW9. |
| The Green Dragon, Hardraw | North Yorkshire (DL8) | |
| The Queens Head, Stokesley | North Yorkshire (TS9) | |
| The Bay Horse, Catterick | North Yorkshire (DL10) | |
| The Cottage Inn, Haxby | North Yorkshire (YO32, York) | |
| The Singing Chocker, Castleford | **West** Yorkshire (WF10) | Furthest out; worth an explicit accept/reject. |

Other §0.24 exposure in this feed: **`The George And Dragon, Norton`** — Norton **Stockton-on-Tees TS20** vs Norton in Sheffield / Worcestershire, 31 gigs riding on it. **`Seaton`** is a named trap (geocodes to Cornwall) — the existing record resolved correctly to SR7 Seaham, County Durham ✅, and `Place To Be, Seaton Carew` must be confirmed to TS25. **`Chester Le Street`** appears five times and must never substring-match Chester, Cheshire.

### 5.5 §0.23 fixed-building check — two to verify before creating

- **`Great Isle Farm, Ferryhill`** (1 gig) — a farm may be a barn/event field rather than a fixed public building. §0.23: no correct Google Place ID exists for a field, and **there is no tool to null a wrong `google_place_id`**. Verify or skip.
- **`QMG HQ, Tynemouth`** (1 gig) — confirm it is a real, publicly attendable fixed venue.

Club-type venues in the list (Annitsford Welfare Club, Tow Law Football Club, Red Star FC Seaham, Houghton Rugby Club, RAFA Spitfire Club, Steels Social Club) are fixed buildings and are **not** caught by §0.23.

### 5.6 Ignore list (§0.19) — checked BEFORE the fetch

The spec's skip list (`private-function--houghton`, five placeholder acts) was applied before collection, not as cleanup. No ignore-listed venue's feed was fetched. No 1,500-capacity/national room appears in this feed — every venue is a pub, club or small independent, so no §0.19 addition is proposed.

---

## 6. Two-sided diff (§5.7 / §6A step 5)

**Not performed — no snapshot exists.** Neither added rows nor removed rows can be computed, so **cancellation detection is unavailable for this source and has never run.** Nothing was deleted and nothing was hidden. Note that even once a snapshot exists, §5.7(b) needs the bndy event lookup by this source's externalId to work — see §4.3.

---

## 7. Validator (§6A step 8)

**Not run — correctly.** `scripts\enrichment_validate.py` validates records written and the evidence JSONL captured while working. **This run wrote no records and captured no page text, so there is nothing to validate.** No evidence file was created, because no bio, avatar or page was taken from anywhere. Reporting a validator pass here would be meaningless.

## 8. Concurrency (§6F)

`OPEN-RULINGS.md` (24,348 bytes) and `20-Daily\2026-08-06.md` were both written at ~23:35 tonight by the **klma scheduled run**. Both were re-checked immediately before append and were **unchanged** since this run read them, so appends proceeded per §6F rule 3. bndy's artist count moved from **1,876 → 1,882** during this run, so another writer is or was recently active — this run wrote nothing to bndy, so no collision was possible. No shared file was rewritten; only appends. `sources\insangel.md` was **not** modified.

---

## 9. Open items for Jason

1. **Authorise or decline the insangel seed lane.** Already open since 2026-07-31 and unchanged. Today's numbers, freshly measured: **666 events · 73 venues · 176 slugs / 174 acts · ~106 artists to create · ~8 venues to create.** At the standing 50-cap this is 3+ nights of held runs; the lane needs a name, a region scope, a cap, per-batch go/no-go and a closing condition. **The real cost is ~106 enrich-inline passes** (Facebook **and** Google, per §2A.1 item 3b), not data entry.
2. **The seed lane cannot write a valid snapshot from a Cowork session** — `insangel.co.uk` is off the sandbox egress allowlist (403 at the proxy), and §6A step 5 requires a reproducible page dump, not a derived aggregate. Needs the domain allowlisted, or a sanctioned alternative capture route.
3. **Rule the event externalId question before the lane runs** — sha1 hashes (incumbent, live) vs §6D slugs (mandated). `edit_event` dedupes to one id per source, so this is a one-way door.
4. **`backing-tracks-solo-tbc`** — already ruled a skip, still missing from the spec's `placeholder_artists`. 10 rows. Confirm and let it be written in.
5. **Six Yorkshire venues** — confirm all six stay in remit, or name the ones to drop.

---

*Run executed under `RUNBOOK.md` v2.8. 0 bounces, 0 gate errors — because **0 writes were attempted**. That is not a clean run; it is a held one, and it will repeat nightly until item 1 is answered.*
