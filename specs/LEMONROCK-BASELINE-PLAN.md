# LEMONROCK → BNDY BASELINE IMPORT — PLAN v1.1 (2026-07-31)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.11+). The runbook wins on any conflict.**
Partnership context: authorised POC for **Mac (Lemonrock founder)** — bndy showing his events back to him.
Source id for provenance: **`lemonrock`**.
Status: **APPROVED TO PHASE 0 — no bndy writes have been made.** All seven rulings taken; runbook amended to v1.11. Scheduling is Jason-only (§0.1).

---

## 0. Rulings taken 2026-07-31 (Jason, supervised)

| # | Decision | Consequence |
|---|---|---|
| R1 | **Region-first pilot, then widen** | Baseline is scoped to one contiguous region, proven end-to-end, then widened letter-by-letter. National is phase 2+. |
| R2 | **Lemonrock's structured fields count as the §2A.5 inline enrichment** | New artists are created from Lemonrock's own Originals/Covers → actType, Genres, Band format, "based in" town, plus facebookUrl where Lemonrock supplies it. No name-only stubs. The FB gap is queued to the existing nightly FB-enrichment task. **Now runbook v1.11 §2A.1 item 7 — see R6 for the tightening applied.** |
| R3 | **One-off supervised bulk baseline lane, 250 creates/batch** | The §6 50-cap is untouched for the ongoing scheduled task. The baseline lane is named, time-boxed, and reports per batch. |
| R4 | **Chrome-only access — nothing asked of Mac** | Collection runs through Jason's UK Chrome against the public HTML surfaces. No CSV access key, no custom feed. **Cost: a ~3-month import horizon instead of 12 (§2.6).** |
| R5 | **Pilot region = Devon / Torbay corridor** | Exmouth, Torquay, Plymouth, Exeter, Paignton, Teignmouth, Newton Abbot. ~156 venues, ~1,555 indexed gigs, one canonical region (South West). |
| R6 | **§2A.5(b) approved WITH the visit-the-page tightening** | A source-supplied Facebook URL is a starting point, never a verdict — the page is opened and must pass §2A.1 before attaching. **WRITTEN INTO `MASTER-IMPORT-RUNBOOK.md` as §2A.1 item 7, version bumped to v1.11 (2026-07-31).** |
| R7 | **`lemonrock-baseline` lane: 250 creates/batch, per-batch sign-off** | Full run report AND Jason's explicit go/no-go between *every* batch. Region-scoped. Lane closes when the pilot region passes Phase 5. **WRITTEN INTO runbook §6 as a named baseline lane; the standing 50-cap is explicitly untouched for scheduled runs.** |

**All three Phase-0 blockers are cleared. Phase 0 can start on your word.**

---

## 1. Headline: this is not "another source"

| | bndy today | Lemonrock (current gigs only) |
|---|---|---|
| Venues | 1,491 | **2,664** |
| Artists | 1,317 | **2,640** |
| Gig listings | — | **~12,400** |
| Distinct towns | — | **1,273** |

Lemonrock is roughly **twice bndy's entire estate in a single source**, and it is national — Torquay, Exmouth, Plymouth, St Albans, Bracknell, Windsor, Southend, Newcastle. Overlap with bndy's existing Stoke/Staffs and North East footprints is close to nil (spot check: The Acre, Windsor — bndy `found: false`).

That is exactly why R1 is right. A systematic parser or identity defect that lands on 12,400 events is not a run report, it is a cleanup project on the scale of the July artist-dedup remediation.

---

## 2. What I actually verified on the source

Everything below is measured, not taken from the build spec. Where the spec was wrong I have said so.

### 2.1 A–Z venue index — `allvenues.php?_start=<L>&all=0`
Server-rendered, parses cleanly, gives exactly what §7.1 of the spec claims: name, type, gig count, area, and the venue slug on the anchor.

```
Abbey Hill Golf Club (Golf Club, 2 gigs, Two Mile Ash)
Anchor, The (Pub, 6 gigs, Walsworth)
```

**Spec + collector defect:** the numeric index is **`_start=9`**, not `_start=123`. `LETTERS = tuple(...) + ("123",)` in `lemonrock_gig_collector.py` will 404 or silently return nothing. The label is "123"; the parameter is `9`.

**Parser edge case found:** 2 venues carry 543 gigs between them under a blank area value — the metadata for those rows does not match the standard `(type, N gigs, area)` shape. Per runbook discipline these must fail loudly, not be coerced. §20.3 of the spec is correct on this and must be implemented.

### 2.2 Venue detail page — `/<venue-slug>`
**This is the single most valuable surface and the spec explicitly excluded it. That exclusion is wrong for bndy.**

Sample n=30 (letters C and R):

| Field | Present |
|---|---|
| Full street address | **30/30 (100%)** |
| Real UK postcode inside address | **28/30 (93%)** |
| Telephone | 26/30 |
| Website | 16/30 |
| **Facebook** | **0/30 (0%)** |

Example: `Donnelly House, Victoria Street, Windsor, Berks SL4 1EN`.

The spec's argument was "the venue MCP only needs name + area". True, but runbook §0.8 and §3.4 make venue identity the highest-risk step in any import — a wrong geocode creates a mis-named junk venue and mis-places every gig at it, and Lemonrock is full of Anchors, Crowns and Red Lions across 1,273 towns (five "Anchor, The" in the letter A alone). Resolving on **name + full address + postcode** rather than **name + area** removes essentially all of that risk for the cost of one cached-forever request per venue. Take the cost.

**Gotcha:** the venue page's gig list is **client-rendered** — a raw `fetch()` of the page returns zero `gig.php` links. Gigs must come from the feed (§2.4), not from parsing this page.

### 2.3 A–Z band index — `allbands.php?_start=<L>&all=0`
The spec never mentions this index. It should have.

```
Aaron Norton (Acoustic Rock, Solo Artist, 36 gigs, based: Dorking)
Absent Heroes (Classic Rock, 6 gigs, based: Guildford)
Ace & The Venturas (Covers 80s - present, 6 piece, 6 gigs, based: Stevenage)
```

2,640 acts with current gigs; **1,138 (43%) carry a "based:" town on the index row itself**. One request per letter gives a national artist gazetteer with genre, act format and home town — before touching a single band page.

### 2.4 Gig feed — `gigfeed.php?ref=<slug>`
Server-rendered, parses cleanly, and the gig anchors carry the stable numeric id:

```
gig.php?id=950496 :: Euphoria
Sat 8 Leon Knight 8.30pm £5
Sat 8 Redriffe 8.30pm CANCELLED
```

Default format yields **date, act, start time, price (or FREE/blank), and CANCELLED / SOLD OUT** — consistent across the four venues sampled. This is the event spine.

**Two hard limits, both verified:**
1. **Fixed ~3-month horizon.** `&all=1` and `&y=5` have **no effect** — identical output. The Acre index says 58 gigs; the feed returns 24, ending 31 October. Same pattern at Abbey Lawn (21→13), Arkley (13→9), Agaton (11→5).
2. **The format is a member setting.** All four sampled venues use the default, but a venue that has customised its feed will parse differently. The collector must validate the row shape per venue and fail that venue safely rather than mis-map (spec §20.3 discipline, applied to the feed).

Not available from the feed: end time, support acts, ticket URL, description. Those live on `gig.php?id=` (one request per gig — **out of scope for the baseline**).

### 2.5 CSV export — `csv.php?t=<slug>&y=5`
Returns 404 to cloud-side fetches; downloads as an attachment in Jason's UK Chrome, where `get_page_text` cannot read it. Whether that is geo-blocking (Lemonrock documents a non-UK access key) or just the attachment header is unresolved — and under **R4 it does not matter**, because we are not using it. Recorded here only so it isn't re-litigated.

**What we give up by not using it:** the CSV's `y=5` horizon, `Support Band?`, `End Time`, and `First Repeat?`. Sections 11, 15 and 25 of the build spec — the whole grouped-event / support-act accumulator design — are therefore **not applicable to the Chrome-only baseline**. Keep the design on file for a phase-2 CSV route; do not build it now.

### 2.6 The horizon trade-off in R4, stated plainly
Chrome-only means **~3 months of forward gigs, not 12**. For the baseline that means roughly a third of the catalogue depth for Mac's first look. It is **not** permanent data loss: the daily scheduled task rolls the window forward, so every gig enters bndy as it comes into range. If Mac later wants depth for the demo, the cheapest unlocks are (a) the CSV access key, or (b) asking him to configure one gig-feed format emitting `%a %p %t %c %s %f %G %i %x` — that single surface would carry more than the CSV does and needs no key. Both remain available; neither is being pursued now.

---

## 3. Your direct question: are Facebook URLs in the source?

**Venues: no. Never.** 0/30. But this does not matter — venue identity in bndy is `google_place_id` (§1), and Lemonrock hands us a full address and postcode, which resolves it better than a Facebook page would.

**Artists: only ~18%.** 7/40 sampled band pages carried a Facebook link; 0/40 carried Instagram. Examples of what is there:

```
backtothe50s      -> https://www.facebook.com/backtothe50sparty/
badbones          -> https://www.facebook.com/Bad-Bones-336886626489612/
sagalouts         -> https://www.facebook.com/groups/645246072224225/?ref=share
thesalads         -> https://www.facebook.com/share/188FzDfAhd/
```

Three things follow:

1. **The 18% is high-quality provenance.** These links are entered by the act's own member account, which satisfies §2A.1's "the source itself linking to it" hard signal. They are attachable on sight — no separate evidence hunt.
2. **They need canonicalising before storage.** The sample already contains a legacy `Name-ID` form, a `/groups/` URL and a `/share/` redirect. Per §2A.2 the stored value must be resolved and canonicalised (`/share/` must be followed to its destination; a `/groups/` URL is a group not a page — treat as the OnTheCase "Rock Doctors" precedent, usable but flagged).
3. **The other 82% is why R2 exists.** ~2,200 acts nationally, ~200–300 in the pilot region, would otherwise each need a live Chrome Facebook search.

**What Lemonrock gives us instead of Facebook, per band page (n=40):** Originals/Covers 36/40 (90%), Genres 34/40 (85%), Band format 20/40 (50%), Based-in 20/40 (50%). That is a direct, machine-readable feed into three bndy fields — see §4.3.

---

## 4. New patterns to document

These are the genuinely new things this source forces. Each needs writing into the runbook or the task file before the pilot runs.

### 4.1 ADOPTED — structured-source enrichment (R2 + R6 — now runbook v1.11 §2A.1 item 7)
Every source so far has been a bare listing (a sheet, a pipe-delimited page) where the only route to actType/genre/location was inference or Facebook. Lemonrock **publishes those fields as the act's own declared data**. Now live in the runbook. Operationally for this source:

- Acts are created from Lemonrock's declared fields — no name-only stubs, no live FB search required at create time.
- **The ~18% of acts that carry a Lemonrock Facebook link get the page VISITED before it is attached (R6).** Confirm §2A.1's bar, take the act's own page name (it wins over Lemonrock's), the avatar as a graph URL, and the page's own stated location — which **overrides** Lemonrock's "based in". Fails the bar → blank + flag, exactly as if Lemonrock had supplied nothing.
- Canonicalise before storing: `/share/` redirects resolved, `/groups/` flagged as a group not a page, legacy `Name-ID` forms normalised.
- The other ~82% are created FB-blank, flagged `fb-pending`, and queued to the nightly FB-enrichment task.
- §0.7 is **not** relaxed: an act with no "based in" town and no derivable location still stages.

Practical effect on the pilot: the visit-the-page condition costs roughly 1 in 6 acts a page load. Cheap, and it stops Lemonrock's member-entered links propagating a stale or wrong page into bndy unchecked.

### 4.2 NEW — venue resolution from a supplied postcode
First source to hand us a full address. Worth its own task-file rule: **pass name + full address + postcode to `create_venue`; if the returned venue's name or town disagrees with Lemonrock's, reject and stage (§3.3/§3.4) — do not accept the geocode.** With a postcode in hand, a disagreement is a real signal, not noise.

### 4.3 NEW — Lemonrock field → bndy field mapping
Both sides are controlled vocabularies, so this is mechanical, not judgment (§0.2 safe):

| Lemonrock | bndy | Rule |
|---|---|---|
| `Originals/Covers: All covers` | `actType: ["covers"]` | direct |
| `Originals/Covers: All originals` | `actType: ["originals"]` | direct |
| `Originals/Covers` mixed/both | `actType: ["covers","originals"]` | direct |
| Genre containing `Tribute` / `... Tribute Band` | `actType: ["tribute"]` | direct |
| `Band formats: Solo` | `artistType: solo` | direct |
| `Band formats: Duo` | `artistType: duo` | direct |
| `Band formats: N piece` | `artistType: band` | direct |
| `Genres: Rock, Pop` | bndy genre enum | **map only; anything not in the bndy enum is DROPPED, never invented (§0.18)** |
| `Genres: No genres set` | leave empty | never default |
| `Based in: Dorking, Surrey` | `location` (city) | §1A.1 city-preferred |
| no "based in" | — | §0.7 → derive from gig town, or STAGE |

Genre needs a written crosswalk table before the pilot — Lemonrock's genre strings are long-tail ("50s, 60s, 70s and 80s Covers", "Acoustic / Electric Rock & Pop", "World"). Unmapped → empty, per §0.18.

### 4.4 NEW — act-format qualifier collision with ADR-023
Lemonrock separates the act name from the format (`Aaron Norton` + `Solo`), which is exactly the model ADR-023 wants — but it also carries acts *named* with the qualifier (`Alix Anthony` and `Alix Anthony Band` both appear in the A index, both with current gigs). §1A.2 footprint check applies as normal; the task file must carry these as they are resolved.

### 4.5 NEW — non-music rows at scale
The A index alone contains `The Admiral Quiz Night with Paul Spittle (Non-Music Event, Solo Artist, 23 gigs)`, `Auxiliary Sound System (DJ)`, `Abstract disco (Disco)`, `Amplified Jam Session with Di`, festivals and beer festivals as *bands*. Lemonrock's own genre field labels most of them (`Non-Music Event`, `DJ`, `Disco`, `Charity Event - music`, `Festival`) — so the §6 accept/reject filter can run **off the source's own genre value** rather than name-guessing. That is a cleaner reject filter than any previous source has had. Festivals route to the Festival entity (`festival-spec.md`), not to artists.

### 4.6 NEW — two-sided diff against a 3-month rolling window
§5.7's removed-row check assumes a stable capture. Here the window slides: a gig leaving the far end of the feed because the window moved is **not** a cancellation, and a gig 4 months out was never in the snapshot at all. The snapshot must therefore record the feed's date range per venue, and §0.17 deletion may only be considered for rows **inside** the previous capture's date range. Getting this wrong deletes real future gigs — treat it as the highest-severity item in the task file.

### 4.7 Cross-source overlap already exists
`abandcalledhorse` (Newcastle upon Tyne) links to **onthecasemusic.co.uk** — a source bndy already imports. Newcastle acts appear throughout the Lemonrock A index (A Band Called Horse, Andy Rayner Band, Anna Reay, Assassin, Audio Jacks). Expect `DUPLICATE_EVENT` and `matched` outcomes in the North East from day one — those are success signals (§0.9), and they make §0.17 deletion **unsafe** for any event carrying both `lemonrock` and `onthecasemusic` external ids.

---

## 5. The plan

### Phase 0 — Pilot region + ground truth (no bndy writes)
**Pilot region CONFIRMED (R5): the Devon / Torbay corridor.** Measured density:

| Town | Venues | Gigs |
|---|---|---|
| Exmouth | 20 | 342 |
| Torquay | 27 | 318 |
| Plymouth | 34 | 265 |
| Exeter | 27 | 246 |
| Paignton | 18 | 198 |
| Teignmouth | 14 | 95 |
| Newton Abbot | 16 | 91 |
| **Total** | **~156** | **~1,555** |

Why this one: densest contiguous cluster in the country; one canonical bndy region (South West); bndy currently has essentially nothing there so the map lights up cleanly for Mac; acts are predominantly local, which makes §1A.2 footprint checks meaningful rather than guesswork. (Hertfordshire — ~90 venues / ~991 gigs — is the natural second region when widening begins.)

Note the ~1,555 figure is the **index** gig count. The 3-month feed horizon (§2.6) means the first import lands a subset of it; the rest arrives as the window rolls.

Work: crawl the 27 venue and 27 band indexes into a local gazetteer; filter to the pilot towns; fetch the venue and band pages for that set; produce `lemonrock-pilot-gazetteer.json` and a written genre crosswalk. Deliverable is a reviewable file, not a bndy write.

### Phase 1 — Dry run, zero writes
Run the full pipeline in report-only mode over the pilot set: resolve every venue against bndy (`search_venue`, no create), resolve every act (`search_artist` at minConfidence 25 + bare-core variant, §6), build every event payload, and produce the exact create/match/review/reject counts. Output: `LEMONROCK-DRYRUN-REPORT.md`. **Gate: Jason reads it before anything is written.** This is where a systematic defect gets caught for free.

### Phase 2 — Venues first, in isolation
Create the pilot venues only — nothing else. ~156 records, within one 250-batch (R3). Verify every one with `get_by_id` (§0.10), confirm each geocode against Lemonrock's postcode, stage every name/town disagreement (§3.3). Venues are the highest-blast-radius entity; do them alone so a defect is visible and reversible.

### Phase 3 — Artists
Create pilot acts under R2 field mapping. Acts with a Lemonrock Facebook link get it attached (canonicalised) at create; the rest are created enriched-but-FB-blank and listed `fb-pending`. Every same/near-name candidate runs §1A.2 enrich-before-decide with a footprint check. Batches of 250 with a report each.

### Phase 4 — Events
One discrete event per act (§4 interim model — no parent containers until they ship). `externalIds: [{source: "lemonrock", id: "<numeric gig id>"}]`, `isPublic: true`, title `«Artist» @ «Venue»`, price from the feed, CANCELLED rows → status, never deleted (§14.2/§0.17). Expect `DUPLICATE_EVENT` bounces in the North East (§4.7).

### Phase 5 — Idempotency + reconciliation proof
Re-run Phases 2–4 unchanged. **Acceptance: zero new venues, zero new artists, zero new events.** Then re-run after a real source change and prove: a moved time edits rather than duplicates; a CANCELLED row updates status; a row that has simply slid out of the 3-month window is **not** treated as a deletion (§4.6). Nothing is scheduled until this passes.

### Phase 6 — Widen, then schedule
Widen region by region with a report per batch. Only once the national baseline is in and stable does the ongoing task get written — **and only Jason creates it** (§0.1), named per convention **"Bndy V2 Lemonrock Events"**, back at the standard §6 50-create cap, slotted clear of the 4:00am KLMA and 4:30am OnTheCase runs (suggest **5:00am**).

---

## 6. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Scale swamps bndy** | Lemonrock becomes 2/3 of the platform's data and its quirks become bndy's | R1 region-first; venues in isolation (Phase 2); dry run gate |
| **Sliding-window false deletions** (§4.6) | Real future gigs deleted under §0.17 | Snapshot records per-venue date range; deletion only inside prior range; highest-severity task-file rule |
| Customised gig-feed formats | Silent mis-mapping of act/time/price | Per-venue row-shape validation; fail that venue safely, never coerce |
| Venue-name collisions across 1,273 towns | Gigs mis-placed at the wrong Anchor | Postcode-led resolution (§4.2); name/town disagreement = reject + stage |
| Genre long tail | Invented enum values (§0.18 breach) | Written crosswalk; unmapped → empty |
| Non-music rows (quiz, DJ, disco, beer festivals) | Junk artists | Reject off Lemonrock's own genre field (§4.5) |
| Cross-source duplicates with OnTheCase | Duplicate NE events; unsafe deletions | Expect and welcome `DUPLICATE_EVENT`; never §0.17-delete a multi-source event |
| `_start=123` collector bug | Numeric-index venues silently missing | Use `_start=9` |
| 3-month horizon (R4) | Shallower demo for Mac | Daily task rolls the window; CSV key or custom feed remain available |
| Request volume on Mac's server | Strains a partner's site | ≥350ms between requests, sequential, no bursts, descriptive UA — and tell Mac the volume before the widening phase |

---

## 7. Gate status — CLEARED 2026-07-31

| Was blocking | Status |
|---|---|
| Pilot region | ✅ **Devon / Torbay corridor** (R5) |
| §2A.5(b) structured-source exception | ✅ **Written into `MASTER-IMPORT-RUNBOOK.md` v1.11**, §2A.1 item 7, with the visit-the-page tightening (R6) |
| Named baseline lane + cap | ✅ **`lemonrock-baseline`, 250/batch, per-batch sign-off**, in runbook §6 (R7) |

**Nothing is blocked. Phase 0 is read-only and starts on your word.** The first thing that will come back to you for a decision is the Phase 1 dry-run report — no bndy record is created before you have read it.

Standing constraints that do not change: §0.1 scheduling is Jason-only · §0.2 no identity judgment · §0.9 every bounce obeyed · §0.10 every write verified by `get_by_id` · §0.16 owner-managed records untouchable.

---

## 8. What the collector needs (if we keep the Python route)

`lemonrock_gig_collector.py` is a CSV-route bootstrap and does **not** fit R4. If it is kept, the changes are: `_start=9` not `123` (§2.1); venue area/type/gig-count parsed from the index row (spec §24.1, still valid); gigfeed HTML replacing `csv.php` as the event surface, with per-venue row-shape validation; venue and band detail pages added as first-class fetches; and the whole grouped-event / support-act accumulator (spec §§11, 25) **dropped**, because the feed carries no support-band field. Given it must run inside Jason's Chrome anyway, the pragmatic route for the pilot is in-page collection to JSON — and only build a standalone collector if the national widening justifies it.
