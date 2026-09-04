# onthecasemusic — RUN REPORT 2026-09-03

**Run id:** `onthecasemusic-2026-09-03T03-31-02Z`
**Outcome:** COMPLETED — 2 events created, 1 artist created, 0 venues created.
**Runbook read:** `RUNBOOK.md` H1 **v2.27**. §6A CURRENT FLOOR **v2.19**. Floor passed.
**Prompt floor:** the task prompt states no numeric floor. §6A step 2a is the gate that bound this run.
**Spec read:** `sources/onthecasemusic.md` in full.
**Inbox read:** `CTO-INBOX.md`. All open `otcm` fingerprints read before any action.

---

## 1. Counts

| Measure | Count |
|---|---|
| Events created | **2** |
| Artists created | **1** |
| Venues created | **0** |
| Artists edited | 1 (provenance back-fill) |
| Events edited | 0 |
| Events deleted | 0 |
| Events hidden | 0 |
| Rows added by the source | 2 |
| Rows removed by the source | 0 |
| Rows changed | 0 |
| Rows skipped | 0 |
| Validator | `1 records · 1 clean · 0 FAIL · 0 WARN [mode=gate]`, exit 0 |

**Quality statement (§6, v2.5).**

- Records created with a **verified page**: 0.
- Records created with an **evidenced blank**: 1 — Arrowhead. Variants tried on both surfaces are listed in §4.1.
- Records **staged**: 0.
- Names **sanitised or staged as non-acts** (§0.6): 0. Neither incoming name carried promo text.
- Records **reused** instead of created: 1 artist, 1 venue.

---

## 2. Gates

| Gate | Result |
|---|---|
| §6A step 0 heartbeat | `data\state\heartbeat\onthecasemusic-2026-09-03T03-31-02Z.json` written first, before any gate |
| §6A step 1 date | `2026-09-03` from the sandbox shell |
| §6A step 2 reads | runbook in full, then spec in full, then inbox |
| §6A step 2a floor | H1 v2.27 ≥ floor v2.19. PASS |
| §6A step 2b claim | `data\state\claims\onthecasemusic.json` held `heldBy: null` (released 2026-09-02T03:35:10Z). Acquired. No takeover |
| §6A step 3 tools | bndy MCP reachable. Chrome reachable, one browser, Facebook session live |
| §5.7(a) self-diff | **0 added / 0 removed. PASS.** The delta permission was available and was not needed |
| §5.4 tombstone check | `data\state\cancellations.jsonl` read. No entry matches either new artist + venue + date |

---

## 3. Capture and diff

Captured with `curl` plus the regex parser, no browser. Parser
`data/raw/onthecasemusic/2026-09-03/run1/parse.py`, md5 `4910da5ad72576c5a50959966ca4adc3`, byte-identical
to the parsers of 2026-08-08 through 2026-09-02. Source page HTTP 200, 333,058 bytes.
Gig ids read straight out of `a[href]` per §0.22. `get_page_text` was not used for collection.

**252 rows over 103 dates, 2026-09-03 → 2027-12-26.** 252 unique gig ids. 22 rows carry no band id.

**Diff against the 2026-09-02 03:31Z snapshot (250 rows): 2 added / 0 removed.**
The row count moved 250 → 252, which is normal churn for a ~250-row feed. §"A HUGE DIFF IS A CAPTURE BUG"
did not fire.

**Re-bill check (spec §2, diff on `(date, gig_id)` first).** Both added rows carry gig ids that are absent
from the stored snapshot (`131503`, `131504`). No live gig id changed its act. No sibling event was created.

**Removed rows: none.** No future-dated row vanished, so §0.17 did not run and no tombstone was written.
The feed head is still `2026-09-03`, which is today, so no date passed out of the window either.

---

## 4. What was written

### 4.1 Artist created — Arrowhead

| Field | Value |
|---|---|
| id | `2cd482c7-7b57-4b08-979c-8ac837ff0122` |
| name | Arrowhead |
| artistType | band |
| location | `North East UK`, `locationType: regional` (§6B Kilmarnock trap) |
| genres | `["Pop", "Rock"]` — the source's own structured field `Pop / Rock` |
| actType | `["covers"]` — the source's own band page states `Mixed covers` |
| bio | **EMPTY** |
| facebookUrl | **EMPTY — evidenced blank** |
| externalIds | `{onthecasemusic, 31120}` |
| read-back | clean (`get_by_id`) |

**Why the bio is empty.** The source band page carries a blurb: *"Half LN, half A New Nowhere... musicians
who are at the top of their game."* That page is the promoter's, not the act's own page. §2A.1 item 8 permits
a bio only as a quotation of the act's own page. The act has no findable page, so the bio stays empty.
This is the standing `source-band-page-as-the-acts-own-page` question, already in the inbox. Not raised twice.

**Evidenced blank — variants tried on BOTH surfaces (§2A.1 item 3b).**

- Google: `arrowhead band facebook` → pages in Boston MA, Columbus OH, Quebec, Australia, plus
  `The Arrowhead Band` and `AA Arrowhead`. None in the UK North East.
- Google: `"arrowhead" band newcastle "A New Nowhere"` → the only North East trace is the promoter's own
  On The Case Music post, which repeats the same blurb. No act-owned surface.
- Facebook page search: `Arrowhead Newcastle` → a 164-follower Arrowhead with a US line-up, a Boston
  hardcore Arrowhead, and a personal blog. No North East act.

A location was NOT asserted in the first query (§2A.1 item 3c). The second query used a qualifier only after
the bare-name query returned a wall of unrelated hits, and the qualifier came from the source's own text.

Evidence file: `data\state\enrichment-evidence-2026-09-03-onthecasemusic.jsonl`, 2 lines, written before the
bndy write and appended with the id after it. Append-only, per-run path (§6A step 8, v2.9).

### 4.2 Artist reused — The Magic Beans

The source bills `Magic Beans` (band id 1347). bndy holds **The Magic Beans**
`0e7b6ed5-3d39-4493-9d59-81e5e1b5a69b`, location `North East England`,
facebookUrl `https://www.facebook.com/Magicbeanscoversband/`.

**Reuse is evidenced, not assumed.** The bndy record's genres are `Mod, Indie, Punk`; the source's structured
genre field for band 1347 is `Mod Indie Punk` — the same three values in the same order. The record's region is
the North East and so is the gig. The spec's own rule applies: *"A same/near name already in the North East is a
prior run's record — REUSE it even at 70–89%."* Search confidence was 73%. No second record was created.

**Repair on contact (§1A.4).** The record held only `{insangel, the-magic-beans}`. The onthecase provenance
`{onthecasemusic, 1347}` was added by `edit_artist` (additive merge). Read back: both ids present.

A `nameVariants` write for the billing `Magic Beans` was NOT attempted. `edit-artist-409-namevariants`
(2026-08-12) records that `edit_artist` returns HTTP 409 when `nameVariants` is supplied. The billing is carried
in the event title instead, per §1A.5.

### 4.3 Events created

| id | title | date | time | price | externalId | source gig |
|---|---|---|---|---|---|---|
| `6a527462-dbf8-4153-adc0-33934d4a67bc` | Arrowhead @ Clousden Hill | 2026-09-05 | 21:00 | FREE | `onthecasemusic:2026-09-05-arrowhead-clousden-hill-forest-hall` | 131504 |
| `facb9b79-b8ab-4584-86ec-516e3f3bb5f8` | Magic Beans @ Clousden Hill | 2026-09-12 | 21:00 | FREE | `onthecasemusic:2026-09-12-the-magic-beans-clousden-hill-forest-hall` | 131503 |

Both are `isPublic: true`, `ticketed: false`, and both read back clean by `get_by_id`.

**externalId form.** The §6D date-slug form, with the venue segment `clousden-hill-forest-hall`. That is the
segment every existing onthecase event at this venue already uses (for example
`2027-01-30-anna-reay-clousden-hill-forest-hall`). Matching the live convention is deliberate:
`otcm-externalid-form-mixed` is already open, and a fourth form would make it worse.

**Venue.** `Clousden Hill` `a1d31424-4293-4187-83b0-5b940b853053`, place id `ChIJl79G9DxxfkgRSzbEr6OguDI`,
NE12 7BR. Resolved by `search_venue` at 100%. It already carries the `onthecasemusic` externalId
`clousden-hill-forest-hall`. No venue was created.

**The 2026-09-05 slot.** The 2026-09-02 run deleted gig 126323, Diablo at this venue on this date, and
tombstoned it. Today the source bills **Arrowhead** in that slot under a **new gig id**, `131504`. The tombstone
is keyed on artist + venue + date and does not match Arrowhead. This is a replacement booking, not a
re-creation of the deleted gig.

---

## 5. Chrome

Reachable. `list_connected_browsers` returned one local browser. Facebook page search returned results, so
`facebook-page-search-not-found` (2026-08-14) did not recur this firing. No lazy-load capture was attempted,
so §6B's hidden-tab trap did not apply.

---

## 6. Defaulted times, corrections, gate bounces

- **Defaulted times:** none. Both events carry the source's published 9:00 PM. `startTimeDefaulted: false`
  on both. §0.28: the source publishes one time and no doors time, so it is written as the stage time.
- **Date corrections (§5.6b):** none.
- **Gate bounces (409 / 422 / 500):** none. Every write succeeded first time.
- **Skipped rows:** none. Neither new row is a Buskers night, an open mic, a DJ set or a placeholder.
- **Caps:** 3 creates against a 50 cap. Not reached.
- **Horizon:** both events are inside 12 months. 2027 rows stay in the snapshot and enter via later diffs.

---

## 7. Outputs

| Artefact | Path |
|---|---|
| Raw capture | `data/raw/onthecasemusic/2026-09-03/run1/gigs.html` |
| Parser | `data/raw/onthecasemusic/2026-09-03/run1/parse.py` |
| Normalised capture | `data/raw/onthecasemusic/2026-09-03/run1/capture-normalised.txt` |
| Records | `data/normalized/onthecasemusic/2026-09-03/records.json` |
| Snapshot | `data/state/onthecasemusic-last-page.txt` (written — §6A step 7 fail-closed gate satisfied) |
| Evidence file | `data/state/enrichment-evidence-2026-09-03-onthecasemusic.jsonl` |
| Daily summary | one line appended to `data/state/run-summary.jsonl` |
| Daily note | one line appended to `20-Daily/2026-09-03.md` |
| Heartbeat | `data/state/heartbeat/onthecasemusic-2026-09-03T03-31-02Z.json`, rewritten `completed` |
| Claim | `data/state/claims/onthecasemusic.json`, released `heldBy: null` |

`record_run` was not called. `record-run-token-missing` (2026-08-08) records that it fails on every scheduled
run because `SOURCE_RUNS_TOKEN` is not set. `run-summary.jsonl` is the dashboard's input and it was appended.

---

## 8. Validator (§6A step 8)

```
python3 scripts/enrichment_validate.py \
  --records data/normalized/onthecasemusic/2026-09-03/records.json \
  --evidence data/state/enrichment-evidence-2026-09-03-onthecasemusic.jsonl
1 records · 1 clean · 0 FAIL · 0 WARN   [mode=gate]     EXIT=0
```

**0 FAIL, 0 WARN.** The one record checked is Arrowhead. The evidenced blank satisfied the blank rule, so the
run shipped clean.

**Judgment sample (§6A step 8, the rules a script cannot check).** Two of the two records written were checked
against source by hand: the Magic Beans reuse, on the three-genre agreement described in §4.2; and the
Arrowhead identity, on the source band page and the three searches in §4.1.

---

## 9. CTO-INBOX

**Nothing appended.** Inbox rule 4 and rule 5 both apply to everything this run met:

- `otcm-mode-not-declared` (2026-08-14) — the spec still declares no §0.29 mode. Already open.
- `otcm-externalid-form-mixed` (2026-08-14) — three id forms are still live. Already open.
- `source-band-page-as-the-acts-own-page` — the bio question in §4.1. Already open.
- `edit-artist-409-namevariants` (2026-08-12) — the reason no nameVariant was written. Already open.
- `search-event-daterange-ignored` — `search_event` returned events past the `dateTo` given. Already open.
- `record-run-token-missing` (2026-08-08) — already open.

No new defect, no new rule question, and nothing that needs Jason.
