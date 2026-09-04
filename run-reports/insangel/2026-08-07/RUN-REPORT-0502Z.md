# insangel — RUN REPORT — 2026-08-07 05:02–05:25 UTC

**OUTCOME: HELD SEED RUN (§6A step 5). NOTHING WAS IMPORTED. NO SNAPSHOT WAS WRITTEN.
THIS IS THE CORRECT OUTCOME, NOT A FAILURE.**

- Run type: scheduled, unattended, `bv2a-insangel`
- Fired: **2026-08-07 05:02:19 UTC**
- Runbook read **in full**: `RUNBOOK.md` **v2.11 (2026-08-06)**. Task prompt floor **≥ v2.4**;
  the file's own declared current floor is **v2.11**. **Version assertion PASSES.**
- Source spec read **in full**: `sources\insangel.md`
- `OPEN-RULINGS.md` read **in full**; the two STANDING RULINGS at the top are binding and were
  applied (no stubs; report measures quality, not error count).
- Heartbeat: `data\state\heartbeat\insangel-2026-08-07T05-02-19Z.json`, written as the **first**
  action before any gate (§6A step 0), rewritten `stopped` as the last.
- Lock (§6G): `data\state\insangel.lock` was **absent** → acquired; released by content
  (`heldBy: null`) as the last action. mtime was never consulted.

> ⚠ **SECOND RUN ON THIS DATE.** A held seed run already fired at **00:05 BST** and its report is
> `RUN-REPORT.md` in this directory. That file was **not overwritten** — §6F forbids rewriting,
> and destroying a predecessor's report is exactly the failure the concurrency section exists to
> stop. This run is reported alongside it under a timestamped filename.

---

## 1. Quality summary — stated separately, per §6 (v2.5) and the task prompt

| Class | Count |
|---|---|
| Artists created **with a verified Facebook page** | **0** |
| Artists created with an **evidenced blank** | **0** |
| Artists **STAGED** | **176** (all of them — single structural reason, §5) |
| Names **sanitised** under §0.6 | 0 needed |
| Names **staged as non-acts** under §0.6 | **0 — no contaminated names exist in this source** |
| Venues created | 0 |
| Events created / edited / deleted / hidden | 0 |
| Gate bounces (409/422) | 0 — no write was attempted |
| **bndy writes of any kind** | **0** |

**No "no page found" is claimed for any act.** Zero Facebook searches were run, because the run is
held before the artist pipeline is reached. Nothing in this report is evidence of absence for
anybody, and no blank recorded here may later be treated as an evidenced blank (§2A.1 item 3b).

## 2. Why the run held — the gate, verified live this run

`data\state\insangel-last-page.txt` **does not exist.** Verified by direct listing at 05:20 UTC.
Every other registered source has one:

```
fantastical-derby-last-page.txt   gigs-news-uk-last-page.txt
klma-stoke-gig-list-last-page.txt lemonrock-last-page.txt
onthecasemusic-last-page.txt      sceniceye-last-page.txt
insangel-last-page.txt            <- ABSENT
```

§6A step 5 is unambiguous: **a missing snapshot is a held run, not a green field.** The single
carve-out is a **named baseline lane** under §6, and `OPEN-RULINGS.md` records that lane as still
**open, awaiting Jason** (item dated 2026-07-31, restated 2026-08-07). No name, no region scope,
no cap, no per-batch go/no-go and no closing condition exist in writing. Therefore: capture,
report what a seed *would* create, stop.

**The snapshot was deliberately not written** (§6A step 5). Recording today's page as "seen" would
make every subsequent two-sided diff silently swallow all 1,140 in-horizon rows — and since
Jason's 2026-08-06 "never hide, delete and recreate" ruling, a corrupted diff is now *destructive*,
not merely lossy.

## 3. Tool and capture verification (§6A steps 1, 3, 4)

- **Date established:** sandbox `date -u` → `2026-08-07T05:02:19Z`. Used as the capture date for
  the rolling year rule.
- **bndy MCP reachable — verified live:** `get_by_external_id(venue, insangel,
  the-denton--newcastle)` → `cdac6734-32df-4f95-b2d9-e262d4a9185a` ("The Denton", Newcastle,
  place_id `ChIJGZze9aV3fkgRPNAZ9BXaaIk`).
- **Sandbox egress: STILL BLOCKED — third consecutive confirmation.**
  `curl https://insangel.co.uk/venues` → **`curl: (56) Received HTTP code 403 from proxy after
  CONNECT`**, 0 bytes. Reproduces 2026-08-06 and 2026-08-07 00:05 exactly. §6B records that the
  allowlist is read at **session start**, so this cannot be fixed mid-run.
- **Chrome: connected and used** as the only viable surface. Capture via `javascript_tool` reading
  `a[href]` directly, per §0.22. **`get_page_text` was not used for extraction at any point.**
- **Render integrity:** four independent selectors agree at 1,180 rows / 76 venues, `htmlLen`
  748,581. The page is fully server-rendered, so §6B's hidden-tab IntersectionObserver stall does
  not apply (that class is paginated feeds only). 0 rows had a null venue slug; 0 had no band link.

Full capture detail: `data\raw\insangel\2026-08-07\CAPTURE-derived-aggregate-0502Z.md`,
banner-marked **NOT A SNAPSHOT**.

## 4. What a seed lane WOULD create, measured this run

| Bucket | Rows |
|---|---|
| Total gig rows | 1,180 |
| Unparseable dates | **0** |
| Past-dated, dropped as stale render | 40 |
| Beyond the 12-month horizon | **0** |
| **In horizon (2026-08-07 → 2027-08-07)** | **1,140** |
| Rows at `skip_venues` | 0 |
| Placeholder-only rows (§0.4) | **475 — 41.7%** |
| **Real importable rows** | **665** |
| Discrete per-artist events implied (§4) | **665** |
| Distinct acts | **176** |
| Distinct venues with a real forward gig | **73** |
| Span | 2026-08-07 → 2027-07-03 |

**Two independent captures five hours apart agree on every downstream figure** (00:05 vs 05:02:
1,140 / 475 / 665 / 176 / 73, identical). The only delta is one total row rolling past midnight.
The rolling year rule (FIX 1) is now on its **fourth consecutive clean run** — 0 unparsed, 0
out-of-horizon, no year hardcoded.

### §0.6 / §0.20 name sanitisation — re-run independently, not inherited

All 176 act names scanned for event/residency words, venue-type words, `& Friends`, lineup
separators, promo dashes, `!`/`?`, and embedded dates. **Zero hits on every pattern.**

The source publishes one act per `bands/<slug>` link and does not embed promo copy in the act
line, so the `Zoe Schwarz Bluez Party` / `Funky Friday with Barclay` failure class is absent.
**9 names carry a format tail** (ADR-023 — the qualifier belongs in the event title): Beth Browne
Trio · Harlie Duo · Brydon Trio · Mojave Duo · Jo James Band · The Sensational David Bowie Tribute
Band · The N.E. Street Band · Bitters Band · Storm Band. In-source bare-core collisions: **exactly
2**, both already ruled (`Harlie`↔`Harlie Duo`, `Mojave`↔`Mojave Duo`).

⚠ `The Screaming 45's` remains a §0.20 normalisation candidate — the act's own page decides.
Unresolved, because nothing was created.

### Multi-artist rows (§4) — 3, all at The Raven, Cleadon

`2026-09-30` Malcolm McElwee + Showcase TBC ×3 → **1** real act, 1 discrete event ·
`2026-10-28` Showcase TBC ×4 → **0** · `2026-11-25` Showcase TBC ×4 → **0**.
No lineup string would become an artist record.

## 5. Staging — all 176 acts, and why

- **Created with a verified page: 0**
- **Created with an evidenced blank: 0**
- **Staged: 176.** The reason for all 176 is identical and structural: **§6A step 5 hold, no
  authorised seed lane.** This is *not* an enrichment-budget decision and *not* a data problem.

Recorded explicitly because of Jason's 2026-08-07 challenge on the gigs-news run — *"why haven't
you just followed the create or enrich path?"* — which correctly identified staging-as-effort-budget
dressed up as a rules decision. **That challenge does not apply here, and the distinction matters:**
on gigs-news the acts were importable and the run chose not to spend the effort. Here **no act is
importable at all**, because the run is held by the snapshot gate before the artist pipeline is
reached. Creating any artist tonight would require overriding §6A step 5, which only Jason can do
by authorising the lane.

## 6. Findings

**NEW — the short-name scorer hazard is now quantified, not just asserted.** The 00:05 run raised
that `search_artist`'s confidence is unsafe on short names (`Harlie` → `Charlie` at **86%**, two
different NE acts), and that the spec's own ladder auto-links at ≥80. Measured across this
source's 176 acts:

- **88 of 176 acts (50%) have names of ≤10 characters.**
- **30 of 176 (17%) are ≤7 characters.**

Confidence is `(1 − edit_distance/max_length) × 100`, so on a 7-character name **a single
character costs 14 points and any one-character difference scores 86%** — above the spec's
auto-link line. **Half this source's catalogue sits in the band where the scorer is systematically
unsafe.** This converts the existing open item from an anecdote into a sized risk: a lane
following the spec's ladder literally would be making ≥80 auto-link decisions on ~88 acts.

Re-raised, unchanged and still blocking — **none actioned, all still awaiting Jason**:

1. **The named seed lane itself** (2026-07-31) — needs name, region scope, cap, per-batch go/no-go
   and closing condition, in writing.
2. **Egress allowlist + the `javascript_tool` transfer ceiling** (2026-08-06, 2026-08-07) — jointly
   make a §6A-compliant snapshot impossible from Cowork. Re-confirmed live this run (403 proxy).
3. **The event externalId form** — live sha1 hashes vs the mandated §6D slug. A **one-way door**,
   because `edit_event(externalIds)` dedupes to one id per source.
4. **`backing-tracks-solo-tbc` missing from the spec's `placeholder_artists`** — the site publishes
   six placeholders, the spec lists five. Placeholders are **475 of 1,140 in-horizon rows (41.7%)**.
5. **`get_by_external_id` is the wrong existence probe for this source** — 3 of 4 acts confirmed
   present carry `externalIds: []`.
6. **`The Cottage Inn, Haxby`** (YO32, York — ~70 miles south of the Tyne) is unacknowledged by the
   spec. §0.24 applies.

**`sources\insangel.md` was NOT edited by this run.** Items 3, 4 and 6 are structural changes to
another artefact's definition, and a scheduled import does not make those unattended — the same
restraint the klma run applied to its off-by-one column mapping.

## 7. Compliance checklist

- §0.1 — no scheduled task created, modified or re-enabled. **Confirmed.**
- §6A step 0 — heartbeat written first, rewritten `stopped` last. **Done.**
- §6A step 5 — snapshot **deliberately not written**; `insangel-last-page.txt` still absent.
- §6A step 7 — the fail-closed snapshot gate binds runs **that wrote to bndy**. This run wrote
  nothing, so the gate is satisfied by writing nothing, which is why this is `stopped`, not
  `failed`.
- §6A step 8 — validator **not run**: it validates records written, and zero were written.
  Evidence file **not written**: zero enrichment performed, so there is no evidence to record,
  and no blank is claimed.
- §6G — lock acquired (file absent), released by content. mtime never consulted.
- §6F — this run wrote only its own ownership lane (`data/raw/insangel/…`,
  `data/normalized/insangel/…`, `data/state/insangel.lock`, its own heartbeat) plus an **append**
  to `OPEN-RULINGS.md` and an **append** to the daily note. The 00:05 predecessor's report was
  **not overwritten**. Nothing shared was rewritten.
- Cap of 50 creates — **not approached. 0 creates.**

**Nothing in bndy changed this run.**
