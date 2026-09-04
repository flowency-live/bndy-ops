# insangel — RUN REPORT — 2026-08-07

**OUTCOME: HELD SEED RUN (§6A step 5). NOTHING WAS IMPORTED. NO SNAPSHOT WAS WRITTEN.
THIS IS THE CORRECT OUTCOME, NOT A FAILURE.**

- Run type: scheduled, unattended, `Bv2a insangel`
- Fired: 2026-08-07 00:05 BST
- Runbook read in full: `RUNBOOK.md` **v2.9 (2026-08-06)** — task prompt required ≥ v2.4, and the
  file's own current floor is v2.8. **Version assertion PASSES.**
- Source spec read in full: `sources\insangel.md`
- `OPEN-RULINGS.md` read in full; the two STANDING RULINGS at the top are binding on this run.

---

## 1. Quality summary — stated separately, per §6 (v2.5)

| Class | Count |
|---|---|
| Artists created **with a verified Facebook page** | **0** |
| Artists created with an **evidenced blank** | **0** |
| Artists **STAGED** | **176** (all of them — see §5) |
| Names sanitised or staged as **non-acts** under §0.6 | **0 contaminated names found** (see §4) |
| Venues created | 0 |
| Events created | 0 |
| Events edited / deleted / hidden | 0 |
| Gate bounces (409/422) | 0 — no write was attempted |
| bndy writes of any kind | **0** |

Every one of the 176 acts is staged for the same single reason: **no seed lane is authorised**,
so §6A step 5 holds the entire run before the pipeline is reached. This is not an enrichment
budget problem and not a data problem.

## 2. Why the run held

`data\state\insangel-last-page.txt` **does not exist.** Directory listing of `data\state\`
at 00:05 confirms it: snapshots are present for `klma-stoke-gig-list`, `onthecasemusic`,
`gigs-news-uk`, `sceniceye`, `fantastical-derby` and `lemonrock`, and **not for `insangel`.**

§6A step 5 is unambiguous: a missing snapshot is a **held run, not a green field**. The single
carve-out is a **named baseline lane** under §6, and `OPEN-RULINGS.md` records that lane as still
**open, awaiting Jason** (item dated 2026-07-31). No name, no region scope, no cap, no per-batch
go/no-go, no closing condition exists in writing. Therefore: capture, report what a seed *would*
create, stop.

Per §6A step 5, the snapshot was **deliberately not written**. Recording tonight's page as "seen"
would make every subsequent diff silently swallow all 1,140 in-horizon rows.

## 3. Tool and capture verification (§6A steps 1, 3, 4)

- **Date established:** `date` in the sandbox → `2026-08-07 00:05:14 +0100`. Used as the capture
  date for the rolling year rule.
- **bndy MCP reachable:** verified live — `get_by_external_id(venue, insangel, the-denton--newcastle)`
  returned `cdac6734-32df-4f95-b2d9-e262d4a9185a`.
- **Sandbox egress: STILL BLOCKED for this source.** `curl https://insangel.co.uk/venues` →
  **`curl: (56) Received HTTP code 403 from proxy after CONNECT`**. `web_fetch` on the same URL →
  **empty body**. Both reproduce the 2026-08-06 finding exactly.
- **Chrome: connected and used.** Captured via `javascript_tool` reading `a[href]` directly, per
  §0.22. `get_page_text` was **not** used for extraction at any point.
- **Lazy-load check:** the tab reports `document.hidden: true` (structural for MCP tabs, §6B), but
  this page is fully server-rendered — `htmlLen` 749,166 with all 1,181 rows present in the first
  render, confirmed by count parity across four independent selectors (`.venue_page_gig` 1181,
  `.small_gig_date` 1181, `.small_band_list` 1181, `.band_title` 76). §6B's IntersectionObserver
  stall applies to paginated feeds and does not apply here.

## 4. What a seed lane WOULD create, measured tonight

Full detail: `data\raw\insangel\2026-08-07\CAPTURE-derived-aggregate.md`.

| Bucket | Rows |
|---|---|
| Total gig rows | 1,181 |
| Unparseable dates | **0** |
| Past-dated, dropped as stale render | 41 |
| Beyond the 12-month horizon | **0** |
| **In horizon (2026-08-07 → 2027-08-07)** | **1,140** |
| Rows at `skip_venues` | 0 |
| Placeholder-only rows (§0.4) | **475 — 41.7% of in-horizon** |
| **Real importable rows** | **665** |
| Discrete per-artist events implied (§4) | **665** |
| Distinct acts | **176** |
| Distinct venues with a real forward gig | **73** |
| Actual date span in horizon | 2026-08-07 → 2027-07-03 |

Consistent with the 2026-08-06 capture (1,142 in-horizon / 476 placeholder / 666 real) — the
two-row drift is simply rows rolling past midnight. **The year-inference rule (FIX 1) produced
0 unparsed dates and 0 out-of-horizon rows across all 1,181 rows**, which is the third clean run
of that rule.

### §0.6 / §0.20 name sanitisation — the check the task prompt demands

Every one of the 176 act names was scanned for billing contamination: `& Friends`, residency and
event-night words (`night`, `session`, `showcase`, `festival`, `presents`, `takeover`,
`residency`, `anniversary`, `Christmas`, `New Year`, `Halloween`, `Day N`), promo dashes,
exclamation/question punctuation, commas, `vs`/`w/`/`feat.`, embedded dates, and venue-type words
(`Arms`, `Inn`, `Tavern`, `Hotel`, `Club`, `Social`, `Bar`, `Lounge`, `Hall`).

**Result: 0 event-names, 0 residency names, 0 `& Friends` billings, 0 pub-as-artist candidates,
0 lineup strings.** This source publishes one act per link and does not embed promo copy — the
`Zoe Schwarz Bluez Party` / `Funky Friday with Barclay` failure class is absent here.

**9 names carry a format tail** (ADR-023 territory — qualifier belongs in the event title, not a
new record):

`Beth Browne Trio`/2 · `Harlie Duo`/12 · `Brydon Trio`/2 · `Mojave Duo`/3 · `Jo James Band`/1 ·
`The Sensational David Bowie Tribute Band`/1 · `The N.E. Street Band`/1 · `Bitters Band`/1 ·
`Storm Band`/1

**Bare-core collision check within the source: exactly 2 groups**, and both are already ruled —
`Harlie` ↔ `Harlie Duo` and `Mojave` ↔ `Mojave Duo` (OPEN-RULINGS, resolved under ADR-023).
`Beth Browne`, `Brydon`, `Jo James`, `Bitters`, `Storm` and `The N.E. Street` appear only in their
qualified form, so nothing collides. `The Sensational David Bowie Tribute Band` is already live in
bndy under that exact name (`1f01ef2e-a5d1-44f2-8064-97694b93a0a4`, carrying an `insangel`
externalId), so its name is settled.

⚠ `The Screaming 45's` carries a promo-style apostrophe → §0.20 normalisation candidate; the act's
own page decides. Not resolved, because nothing was created.

### Multi-artist rows (§4)

3 in horizon, all at The Raven, Cleadon, and all dominated by `Showcase TBC`:

- **2026-09-30** — Malcolm McElwee + Showcase TBC ×3 → 1 real act, 1 discrete event
- **2026-10-28** — Showcase TBC ×4 → **0 real acts**, row is placeholder-only
- **2026-11-25** — Showcase TBC ×4 → **0 real acts**, row is placeholder-only

### Venues a seed must NOT create (§0.21)

`the-foxcover--ashington` · `hornby-park--seaton-carew` · `hordan---peterlee-rfc` — listed, but
their entire forward listing is placeholders. `private-function--houghton` (spec `skip_venues`)
has no forward rows at all this capture.

## 5. Staging — all 176 acts, and why

**No artist was created, and none could have been**, because the run is held before the pipeline.
Recording the disposition honestly, per the task prompt's three-way split:

- **Created with a verified page: 0.**
- **Created with an evidenced blank: 0.**
- **Staged: 176.** Reason for all 176 is identical and structural: **§6A step 5 hold — no
  authorised seed lane.** No Facebook search was run for any act, so **no "no page found" is
  claimed for anybody** and nothing in this report should be read as evidence of absence.
  (v2.8 already voids the pre-2026-08-04 blanks; this run adds none.)

### Existence sampling — 14 acts checked against bndy, read-only

Done to size the lane honestly, not to import. **This produced the most important finding of the
run** (see §6 item A).

| Act | bndy state |
|---|---|
| C Collective | **EXISTS** `1f219a5a-fb8f-4709-bcc1-c723d84e31ab` — carries an `insangel` externalId |
| The Brit Pack | **EXISTS** `4c113f21-28f7-437e-8153-e1f64bd68b90` (Gateshead, UK) — `externalIds: []` |
| The EPs | **EXISTS** `b2eaae27-4af5-41d7-82c3-cd13f758b404` (Newcastle) — `externalIds: []` |
| Denny Owens | **EXISTS** `d5ed9ce3-54ad-47af-a047-c09dbfc2f79d` (Newcastle) — `externalIds: []` |
| 199X | absent |
| Ben Hannington | absent (top match `Ben Staz` 36%) |
| Kaitlin Lee Robson | absent (top match `Seventh Son` 28%) |
| Joe Devanny | absent (top match `Storm Deva` 36%) |
| Dave Ridley | absent (top match `Dave Rich` 64%) |
| Toastbloke | absent — no matches at all |
| Simply Lisa | absent (top match `Malcolm & Lisa` 43%) |
| Jane Long | absent (top match `Jane Keele` 50%) |
| Matt Bryan | absent (top match `Matt Dean` 70%) |
| Dannielle Keys | absent (top match `Dan Apsey` 36%) |
| Harlie | **absent — but see §6 item A. `search_artist` returns `Charlie` (Whitley Bay) at 86%.** |

`totalScanned` reported by `search_artist` is now **1,906** artists (1,565 on 2026-07-31).

**Projection:** 4 of 14 already exist ⇒ roughly **~50 reuse / ~126 create** across the 176.
That is in the same territory as the July estimate (~110 creates of 170) and is the number the
lane should be sized against. **It is a sample, not a census** — a census costs 176 lookups and
belongs to the lane, not to a held run.

### Venue sampling — 4 checked, read-only

| Venue | bndy state |
|---|---|
| `the-denton--newcastle` | **EXISTS** `cdac6734-32df-4f95-b2d9-e262d4a9185a` — `insangel` id present |
| `the-singing-chocker--castleford` | **EXISTS** `fd3fd7b8-91d6-4dfe-8721-f23b9c1dc993` — `insangel` id present |
| `qmg-hq--tynemouth` | no `insangel` externalId |
| `the-cottage-inn--haxby` | no `insangel` externalId |

## 6. Findings raised to `OPEN-RULINGS.md` this run

**A. `search_artist` returns 86% for `Harlie` → `Charlie`, and the spec's ladder says auto-link
at ≥80.** Harlie (14 forward insangel gigs) and Charlie (Whitley Bay, image hosted on
onthecasemusic) are two different NE acts one character apart. The insangel spec's own match
ladder — *"Top-1 bndy confidence ≥ 80 with name divergence → auto-link"* — would merge them.
Levenshtein confidence is unsafe on short names, and this source is full of them.
**A lane following the spec literally would corrupt these two records on its first pass.**

**B. `get_by_external_id` is the wrong existence probe for this source.** 3 of the 4 acts found to
exist carry **no externalIds at all**, despite the 2026-05-14 run reporting 140 creates + 31 links.
An `insangel`-keyed lookup therefore reports "absent" for records that are live in bndy, and a lane
trusting it would create duplicates of `The Brit Pack`, `The EPs` and `Denny Owens`. Use
`search_artist` plus the §1A footprint check.

**C. The capture cannot be transferred out of the browser tab in bulk.** `javascript_tool`
responses truncate at roughly 800–900 characters of content. The parsed row set is ~54 KB, so a
full dump needs ~60+ round trips; the 749 KB page HTML needs ~900. Combined with the egress block,
this means the **only** data that leaves the tab is a derived aggregate — which §6A step 5
explicitly forbids as a seed lane's snapshot. This sharpens the 2026-08-06 item: the blocker is not
just the allowlist, it is the allowlist *and* the transfer ceiling.

**D. `The Cottage Inn, Haxby` is a North Yorkshire venue the spec does not acknowledge.** Haxby
(YO32, York) is not in the spec's `cities_normalisation` list, and the spec names only four North
Yorkshire venues plus one West Yorkshire. §0.24 says trust the postcode, not the town name — this
one needs confirming before creation, and there may be more like it.

Re-raised, unchanged and still blocking: the **seed lane authorisation** (2026-07-31), the
**egress allowlist** (2026-08-06), the **event externalId form — hash vs §6D slug, a one-way
door** (2026-08-06), and **`backing-tracks-solo-tbc` missing from the spec's placeholder list**
(2026-08-06). `sources\insangel.md` was **not edited by this run**.

## 7. Compliance checklist

- §0.1 no scheduled task created, modified or re-enabled — **confirmed**
- §6A step 5 snapshot **deliberately not written**; `data\state\insangel-last-page.txt` still absent
- §6A step 8 validator **not run** — it validates records written; zero were written
- §6A step 8 evidence file **not written** — zero enrichment was performed, so there is no evidence
  to record. No blank is claimed for any act.
- §6F: this run wrote only files in its own ownership lane (`data/raw/insangel/…`,
  `data/normalized/insangel/…`) plus an **append** to `OPEN-RULINGS.md` and a **new** daily note.
  Nothing shared was rewritten. Concurrent activity was visible in `data\state\` (onthecasemusic
  and enrichment ledger files written 00:00–00:01); none of those paths were touched.
- Cap of 50 creates: **not approached — 0 creates.**

**Nothing in bndy changed tonight.**
