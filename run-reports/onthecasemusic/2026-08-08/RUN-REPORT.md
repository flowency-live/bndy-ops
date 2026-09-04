# onthecasemusic — scheduled run, 2026-08-08 09:34–09:47 UTC

**OUTCOME: COMPLETED.** 5 events created · 2 stale events deleted (source re-billing) · 1 artist created (evidenced blank) · snapshot written and verified · validator exit 0.

| gate | result |
|---|---|
| Runbook H1 | **v2.18** |
| §6A.2a floor (this line, not the prompt's) | **v2.17** → PASS |
| Floor asserted in the deployed task prompt | none stated in the prompt text; the prompt defers to §6A. No drift to report. |
| §6A.2b claim `data\state\claims\onthecasemusic.json` | file **missing** → acquired. No takeover. |
| §6A.0 heartbeat | `data\state\heartbeat\onthecasemusic-2026-08-08T09-34-12Z.json` |
| §6A.3 tools | Chrome connected (tab 1176554646, FB session logged in); bndy MCP reachable (`search_venue` probe returned Crown and Cannon 100%) |
| §6A.5 snapshot | present, valid, 275 rows — **not** a first run |
| §6A.7 snapshot write | **written**, re-diffs against its own capture at 0/0 |
| §6A.8 validator | `1 records · 1 clean · 0 FAIL · 0 WARN [mode=gate]` · exit 0 |

---

## 1. Capture

`data/raw/onthecasemusic/2026-08-08/` — `gigs.html` (358,269 bytes), `parse.py`, `records.json`, `capture-normalised.txt`.

**271 rows over 114 dates, 2026-08-08 → 2027-12-18.** 271 unique gig ids, 30 rows with the `noimage_list.png` band placeholder.

Captured with `curl` in the sandbox plus a regex parse reading the gig id out of `a[href]` per §0.22 — **not** `get_page_text`. Cross-checked live in Chrome the same minute: **271 rows, 114 dates, first header "Saturday 08 August 2026", and all 5 changed/added gig ids present in the rendered DOM.** So the capture is neither stale (§6B `web_fetch` stale-cache class) nor tool-dependent.

⚠ **Finding, logged not actioned:** `sources/onthecasemusic.md` says this source is "CLIENT-RENDERED — Chrome is mandatory". For `/gigs` that is not borne out — the page is server-rendered ASP.NET, exactly as the same spec's own Overview section says, and the 2026-08-06 Chrome-DOM snapshot re-diffed against today's curl capture with **268 of 268 surviving rows matching byte-for-byte**. Two different capture tools, identical output. Raised in OPEN-RULINGS; **the spec was not edited by this run** (§6F: a run does not rewrite another artefact's structural definition unattended). Chrome remains mandatory for Facebook enrichment, and was used for it.

## 2. Two-sided diff — on `(date, gig_id)` first, then text

Snapshot `data\state\onthecasemusic-last-page.txt` (275 rows, written 2026-08-06). Both sides normalised per the snapshot's own header rules before comparison.

**3 added · 7 removed · 2 changed · 0 gig ids moved date.** A small diff on a ~275-row feed — the §"HUGE DIFF IS A CAPTURE BUG" hold condition did not fire, correctly.

### 2a. Added (3) — all imported

| date | gig id | row |
|---|---|---|
| 2026-11-13 | 131420 | The Stones Story at Bridge Hotel Durham · 8:45 PM · FREE |
| 2026-11-20 | 131419 | Justuzfor at Bridge Hotel Durham · 8:45 PM · FREE |
| 2026-12-04 | 131421 | Urban Starz at Bridge Hotel Durham · 8:45 PM · FREE |

### 2b. Removed (7) — all past-dated, **none is a cancellation**

131409 (06 Aug), and 126270 / 126854 / 131335 / 131370 / 131403 / 131405 (07 Aug). Every one has a date earlier than today. §5.7: *"A row disappearing because its date passed is NOT a cancellation."* **Nothing deleted on this account, nothing hidden, §0.17 not engaged.**

### 2c. Changed (2) — **the source re-billed two live gig ids, for the second and third time**

This is the Fossil/Face Value class the gig id was put in the snapshot to catch. Both rows kept their gig id, venue, date and start time and changed act. Both had previously passed through a `to be confirmed` placeholder state — which §0.4 skips at import, so the snapshot carried the placeholder while bndy still held the *original* act's event.

| gig id | date · venue · time | snapshot said | source now says | bndy held |
|---|---|---|---|---|
| 126926 | 2026-08-14 · Blacksmiths Arms Gosforth · 21:00 | `to be confirmed` | **Rock Doctors** | `1da1c979-ac7c-45bf-9cb7-79d6c98f0e78` *The Inmates*, created 2026-04-30, carrying `{onthecasemusic, 126926}` |
| 126313 | 2026-12-20 · Crown and Cannon Winlaton · 18:00 | `to be confirmed` | **Black Flame duo** | `a8a65a7e-43c8-4010-8ae7-4870ddfbdcbf` *We 3 Colonels*, created 2026-04-30, carrying `{onthecasemusic, 126313}` |

**Action: DELETE the stale event, CREATE the correct one** — the snapshot header's rule, and Jason's ruling of 2026-08-06 (*"NEVER HIDE. DELETE AND FIX / DELETE AND RECREATE. Act when it is obvious."*), which supersedes §5.4's hide wording.

Pre-conditions checked on both before deleting, by `get_by_id` and not by `search_event` (§6B false-negative modes):

- externalIds are **this source only** — a single `{onthecasemusic, <numeric>}` on each, no owner id, no second namespace. §0.17(a)(b) satisfied.
- Not owner-managed (§0.16).
- Both displaced acts are **still live elsewhere in the same capture** — The Inmates at White Swan Morpeth on 2026-09-19, 2027-04-17 and 2027-10-23; We 3 Colonels at Bebside Inn Blyth 2026-08-15, The Prior Doxford 2026-10-10 and Blacksmiths Arms 2026-11-06. So this is a re-billing of two specific slots, not either act being dropped.
- Both deletions confirmed by a follow-up `get_by_id` → `found: false`. **No 401 from `delete_event`.**

⚠ **The numeric ids `126926` and `126313` are retired with the deleted events.** The replacements carry the §6D date-slug, following the precedent set by the 2026-08-07 onthecase run on gig `126270` (`9b9a525d…`). §6B's one-id-per-source dedupe means a record cannot hold both; the diff runs off the snapshot, not off bndy provenance, so nothing is lost mechanically.

## 3. Writes to bndy — every one read back (§0.10)

### Created with a verified page: 0 artists
### Created with an **evidenced blank**: 1 artist

**`Black Flame` `1ff1d30a-8ee9-4e3d-8599-6631f003c23f`** — duo, `North East UK` + `locationType: regional`, `nameVariants: ["Black Flame duo"]`, `externalIds: [{onthecasemusic, black-flame-duo}]`. bio, facebookUrl, avatar, genres and actType all **EMPTY**.

Search variants tried, **both surfaces** per §2A.1 item 3b, bare-name-first per item 3c (no unverified location in any query):

- Google — `"Black Flame" band` · `"Black Flame" duo facebook`
- Facebook page search, logged in, in Chrome — `black flame duo` · `black flame band`
- The source's own `/bands` index — **no entry at all**; the gig row carries the `noimage_list.png` placeholder, so onthecase publishes no band id and no band page for this act.

Everything returned was an Italian occult black-metal band (Wikipedia, Metal Archives, `officialblackflame`) or plainly unrelated (`defjamflames`, `blackflamemalawi`, `blackflamesociety`, `blackflameentertainment`, `duoflame.acrobaticduo`). **No UK-consistent signal on any candidate → blank, flagged, not guessed** (§2A.1.1). Evidence written **before** the bndy write to `data\state\enrichment-evidence-2026-08-08-onthecasemusic.jsonl`.

**Name decision, made not staged (§0A rule 1).** Created as **`Black Flame`** with the source's billing `Black Flame duo` stored as a nameVariant and carried in the event title. Reasoning: §1/ADR-023 says an `X` / `X Duo` qualifier in one region is one artist and the qualifier belongs in the event title; the source's own lowercase `duo` reads as a format tail rather than part of the name; and no `Black Flame` record existed, so there is no rename and no duplicate risk either way. §2A.1 item 7's "a trailing Duo is part of the name, never rename on the pattern alone" governs *renaming an existing record on the pattern*, which this is not. **Reversible, and flagged in OPEN-RULINGS** — if the act's own page ever surfaces and says otherwise, the page wins (§0.20).

### Artists matched and reused: 4

| billing in source | bndy record | how resolved |
|---|---|---|
| The Stones Story | `0e0a6bcd-1e2e-4856-9593-8379d9ad0b54` (Morpeth) | 100% exact; NE footprint, Durham is same canonical region (§1A.2 step 3) |
| Justuzfor | `62d06f64-b67c-41c5-96a0-38414415c822` (Morpeth) | 100% exact, has FB avatar |
| Urban Starz | `82cb24d4-6df3-4f82-bd38-a561ab068b45` **Urban StaRz** (Teesside) | 100%; the act's own page spelling wins over the source billing (§0.20) — event titled with the record name |
| Rock Doctors | `bae7bce9-bc65-48e6-ab03-1f9c26af9c50` **The Rock Doctors** (North East) | `sources/onthecasemusic.md` alias table, Jason ruling 2026-07-29 — automatic match, never a review (§1A.5) |

All searched at `minConfidence: 25` — the low threshold, per the 2026-08-07 `Vehicle`/`The Band Vehicle` self-report. No `review` verdicts, no 409s, no 422s on any artist path.

### Venues: 3 matched, 0 created

| source venue | bndy id | postcode check (§0.24) |
|---|---|---|
| Bridge Hotel Durham | `22f62ed9-a489-4d80-8cd3-9f3aa1677f24` | DH1 4PW — Durham ✓ (surfaced at **63% `low_confidence`**, opened before use per §3) |
| Blacksmiths Arms Gosforth | `10432a06-e158-448b-a441-582b74455146` "The Blacksmiths Arms" | NE3 1HD — Newcastle/Gosforth ✓ (80% medium) |
| Crown and Cannon Winlaton | `ed1384a2-4c95-4072-8b22-1f9b25da0e0a` | NE21 6AD — Blaydon-on-Tyne ✓ (100%) |

### Events created: 5 — all `isPublic: true`, all read back by `get_by_id`

| id | title | date · time | externalId |
|---|---|---|---|
| `95744f26-316f-475e-8759-a0b518dfb837` | The Stones Story @ Bridge Hotel Durham | 2026-11-13 · 20:45 | `2026-11-13-the-stones-story-bridge-hotel-durham` |
| `fe0428aa-893b-448e-b0a8-81efa21548e6` | Justuzfor @ Bridge Hotel Durham | 2026-11-20 · 20:45 | `2026-11-20-justuzfor-bridge-hotel-durham` |
| `e2561bca-6326-4658-a3cc-dd286aad616f` | Urban StaRz @ Bridge Hotel Durham | 2026-12-04 · 20:45 | `2026-12-04-urban-starz-bridge-hotel-durham` |
| `d68d4a0a-af41-4e41-9474-933a831bdb1b` | Rock Doctors @ The Blacksmiths Arms | 2026-08-14 · 21:00 | `2026-08-14-the-rock-doctors-the-blacksmiths-arms` |
| `5917b0b2-f376-49bd-9e3b-b8a4f4db8912` | Black Flame duo @ Crown and Cannon | 2026-12-20 · 18:00 | `2026-12-20-black-flame-crown-and-cannon` |

All FREE, `ticketed: false`, each carrying its source detail-page `eventUrl`.

### Events deleted: 2

`1da1c979-ac7c-45bf-9cb7-79d6c98f0e78` (The Inmates @ Blacksmiths Arms, 2026-08-14) · `a8a65a7e-43c8-4010-8ae7-4870ddfbdcbf` (We 3 Colonels @ Crown and Cannon, 2026-12-20). Grounds in §2c above. Both confirmed gone.

### Defaulted start times: **none**

Every row published an explicit time. §5.6 was not invoked.

### Source date/detail corrections applied: none. Staged: **nothing.**

## 4. Gate bounces, verbatim

```
create_artist(name:"Black Flame", artistType:"duo", location:"North East UK",
              locationType:"regional", nameVariants:["Black Flame duo"],
              externalIds:[{source:"onthecasemusic", id:"black-flame-duo"}])
  -> {"success": false,
      "error": "HTTP 500: Internal server error",
      "message": "Failed to find-or-create artist. No artist was created (fail closed)."}
  (identical call retried once, identical 500)
```

Resolved **without varying the name** (§0.9): the same call minus `nameVariants` and `externalIds` succeeded first time, and both fields were then written by `edit_artist`, which returned `updatedFields: ["externalIds","nameVariants"]` and read back correctly. **This is a new and worse form of the open `create_artist(nameVariants)` item, which records the field as *silently dropped* — on this payload it 500s the whole create.** Raised in OPEN-RULINGS.

No other bounces. No 409s. No 422s. `delete_event` did not 401.

## 5. Enrichment top-ups considered and NOT made — stated so they are not mistaken for oversights

- **The Stones Story `0e0a6bcd…`** has a valid Facebook **group** URL (`facebook.com/groups/thestonesstory/` — a group is a legitimate act surface and is never stripped, Jason 2026-08-07), `Rock`, and a Morpeth location. It has **no avatar, and cannot have one**: `graph.facebook.com/<id>/picture` has no endpoint for a group id and the only image available is an expiring `scontent.*` URL, which §0.13 forbids. This is the same class as the open `Lazarus` item — one more instance, no new ruling requested.
- `actType` left empty on that record rather than inferring `tribute` from the name (§0.18 — unknown beats wrong; the name is a strong hint, not evidence).
- Justuzfor, Urban StaRz and The Rock Doctors all carry a page and an avatar already.

## 6. Verification summary

| check | result |
|---|---|
| Every write read back with `get_by_id` | 5 events ✓ · 1 artist ✓ · 2 deletions confirmed absent ✓ |
| Snapshot re-diffs against its own capture | 271 rows both sides, **identical: True** |
| Validator, gate mode | 1 record · 1 clean · **0 FAIL** · 0 WARN · exit 0 |
| Chrome cross-check of the curl capture | 271 rows / 114 dates / all 5 target gig ids present ✓ |
| Creates against the 50 cap | 6 (5 events + 1 artist) — well inside |

⚠ `get_by_id` still does not return `locationType`, so the §6B Kilmarnock pairing on `Black Flame` could not be confirmed on read-back — it was passed as `regional` on create. Known open item, unchanged.
