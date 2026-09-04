# RUN REPORT — gigs-news — 2026-08-07

**Status: COMPLETED.** Snapshot written (§6A step 7 fail-closed gate satisfied). Validator exit 0.

- Runbook read in full: **v2.11** (task floor v2.4 — **PASS**)
- Source spec read in full: `sources/gigs-news-uk.md`
- `OPEN-RULINGS.md` STANDING RULINGS read and applied (no stubs; report measures quality)
- Run date established via shell: **2026-08-07 (Friday)**
- Heartbeat: `data/state/heartbeat/gigs-news-2026-08-07T04-06-54Z.json` (written first, before any gate)
- Lock: `data/state/gigs-news.lock` — none existed, acquired per §6G, released at end
- Chrome connected and logged in; both pages captured by live DOM walk reading `a[href]`
  (§0.22 — `get_page_text` NOT used for extraction)
- Capture: `data/raw/gigs-news-uk/2026-08-07/capture.txt`
- Snapshot: `data/state/gigs-news-uk-last-page.txt`
- Evidence: `data/state/enrichment-evidence-2026-08-07-gigs-news.jsonl` (5 records, per-run path per v2.9)

---

## 1. HEADLINE NUMBERS

| | count |
|---|---|
| Artists created | **5** |
| Events created | **5** |
| Venues created | **0** (all resolved to existing) |
| **Total creates** | **10** / 50 cap — cap not reached |
| Artists created WITH a verified page | **0** |
| Artists created with an EVIDENCED BLANK | **5** |
| Artists STAGED, not created | **0** |
| Rows rejected by filter (non-acts / blank / time-only) | 33 |
| Rows rejected as past-dated (5–6 Aug) | 15 |
| Archive rows on `branded.htm` correctly not taken | 186 (5 archive sections) |
| Snapshot delta — week view | **ZERO added, ZERO removed** |
| Snapshot delta — branded forward list | **ZERO added, ZERO removed** |
| Event 409 bounces | **0 — see §5, this run verified before writing rather than probing the gate** |

---

## 2. QUALITY BREAKDOWN — the part that matters (§6, v2.5)

### 2a. Artists created WITH a verified page — 0

**None.** Every one of the five acts this run created went through the full two-surface
procedure (§2A.1 items 3, 3b, 3c) and no act-owned page met the §2A.1 evidence bar.
That is an honest zero, not a skipped step — the rejected candidates are itemised below and
in the evidence file, and four of the five had *plausible-looking* same-name pages that were
refused.

### 2b. Artists created with an EVIDENCED BLANK — 5

All five: `bio` EMPTY, `facebookUrl` EMPTY, `profileImageUrl` EMPTY, `genres` [], `actType` []
(§0.18 — unknown beats wrong; no act page, so nothing to copy). `artistType: solo` in each case,
taken from the act being billed under a personal name. `locationType: "regional"` passed on every
create (§6B Kilmarnock pairing) — **note `get_by_id` still does not return `locationType`, so this
could not be verified on read-back; open item already logged 2026-07-31.**

| Artist | bndy id | Surfaces tried | Candidates found and REFUSED |
|---|---|---|---|
| **Lee Ashley** | `712657fc-4418-430d-b00d-6d738cdef446` | **Google:** `lee ashley band`; `lee ashley singer facebook`. **Facebook page search:** `lee ashley` | `facebook.com/leepashleyevents` — page name is **Lee _Pashley_ Events**, different surname, category Entertainment/Performance art, comment thread places it in Derbyshire. `facebook.com/mrleekyashley` — **personal profile**, Lives in Hartlepool, Digital creator, works at GM Autos (§2A.4). |
| **Mike Jones** | `c062411f-2dae-4025-a6ec-a2f8e0ec13b4` | **Google:** `mike jones singer oldham`; `"mike jones" chadderton OR chorlton OR manchester live music facebook`. **Facebook page search:** `mike jones music` | `facebook.com/MJonesMusic` (1.4K followers) — **Tenby/Saundersfoot, Pembrokeshire**; its own posted gig diary puts Friday 7th August at Tenby Brewing Co, not the Dog Inn. `michaeljonesmusician` — RNCM operatic tenor. `MikeJonesMusicErie`, `mikejonesmusicaz` — US (§2A.1.1). |
| **Dale Murphy** | `20bc1aab-0a71-4a15-bdb6-2f6198cb93ca` | **Google:** `dale murphy singer facebook`. **Facebook page search:** `dale murphy music`; `dale murphy` | FB page search returned only Motivational speaker / Community / Website / Personal blog / Dale Murphy Designs (Woodbine MD, US) / Digital creator / a driving range in Fayetteville AR. None is the act. |
| **Paula Ann** | `a4ce8576-0eb3-4e01-9199-0a621198adec` | **Google:** `"paula ann" singer facebook`. **Facebook page search:** `paula ann singer` | `facebook.com/paula.ann.77964` — **Paula Ann Savage**, personal profile, Warwickshire footprint (Nick Drake Gathering, Tanworth-in-Arden). `groups/PaulaAnnBland` — fan group for the Grange Hill actress. FB page search returned Paula Coakley (Munster, Ireland), King Paula (Amsterdam), etc. |
| **Paul McCoy** | `da16486f-1845-4d0c-a394-f903cce49d62` | **Google:** `"paul mccoy" singer buxton`; `paul mccoy entertainer facebook north west`. **Facebook page search:** `paul mccoy vocalist` | `facebook.com/12stones` — the **US** band fronted by the American Paul McCoy (§2A.1.1). No UK act-owned page surfaced on either surface. |

**Corroboration gathered but NOT written to any bndy field** (§0.12 — report only):

- *Lee Ashley* — Tameside footprint from third-party venue pages: `HHLUZLEY` (The Hare & Hounds, Luzley) video 2 weeks old; `thebroadoakashton` post; `groups/TamesidePubGuide` post "Fantastic Vocal Entertainer, Lee Ashley". Consistent with the Albion Dukinfield gig.
- *Dale Murphy* — `albiondukinfield` video "what's on this week friday dale murphy live from 9pm"; `masonsarms2021` photo "this saturday night we have dale murphy singing for us from 9pm"; a Manchester Bandter video-of-the-week feature. All Tameside.
- *Paul McCoy* — **location taken from a search result, named here as §2A.1 3b requires:** SMC Entertainment's booking listing states *"Paul McCoy is a professional vocalist based in the North West"*, and A & B Entertainment Plus (abplus.co.uk) lists *"Paul McCoy vocalist 60s 70s & swing"*. That is why his `location` is **"North West UK"** and not this source's default. It is **not** from his own page, which was not found. Third-party promoter pages corroborate the footprint: `happymemoriesafternoonentertainment` (multiple posts), `LiverpoolTaxiClub`, `GreystokeCastleCumbria`.

⚠ **Honest caveat on this batch.** Five blanks out of five is a bad-looking ratio, and the runbook is
right to be suspicious of blanks. What I can say is that the procedure was the post-v2.8 one on every
record — both surfaces, bare-name-first queries — and that the failure mode v2.8 was written to catch
(Facebook-only search) did not occur here: Google was run first on all five and it is what surfaced
the rejected candidates. What I cannot rule out is that one of these acts has a page under a spelling
I did not try. `Paul McCoy` is the likeliest to be findable by a human, given two agency listings exist.

### 2c. Artists STAGED, not created — 0

No act was staged this run. **Every act in the current week view is now in bndy**; see §5.

### 2d. Names SANITISED or corrected under §0.6 / §0.20 — 0 new

No new sanitisation was required. Names taken verbatim from the source billing were all bare act
names. `Mike Jones + Smudge` was split per §4 (see §5); `branded` / `Reserved` handled per the
2026-07-29 ruling; `Songbirds`, `Strikes Twice duo`, `Amanda Jane Heywood band`, `Dan Budd is Robbie`
were all resolved by the 2026-08-06 run and were not re-touched.

### 2e. Events created — 5

All times **DEFAULTED** per §5.6 (the source publishes no time on any of these rows) — flagged so
they are correctable. Fri 7 Aug and Sat 8 Aug → 21:00.

| Event | bndy id | Date / time | Venue | externalId |
|---|---|---|---|---|
| Lee Ashley @ Albion Dukinfield | `2f0b8cb2-ed1c-4597-992b-04d82944e661` | 2026-08-07 21:00 *(defaulted)* | Albion Dukinfield `06c8fb91-59f6-4180-b97b-fbc2acd4322a` | `2026-08-07-lee-ashley-albion-dukinfield` |
| Mike Jones @ The Dog Inn | `5e304824-e419-445f-98cd-9f41814fafc0` | 2026-08-07 21:00 *(defaulted)* | The Dog Inn `q2zJ4l8YAdshgCuXhseR` | `2026-08-07-mike-jones-dog-inn-chadderton` |
| Dale Murphy @ The White House | `349140c1-bca2-40f4-aa4f-56b68cb14419` | 2026-08-07 21:00 *(defaulted)* | The White House, Stalybridge `CwMkRsUa9JJDTjBgUSCu` | `2026-08-07-dale-murphy-whitehouse-stalybridge` |
| Paula Ann @ Cheshire Cheese | `f6c24f5c-995a-4719-8ff3-a7db3a27c231` | 2026-08-08 21:00 *(defaulted)* | Cheshire Cheese, Hyde `18a2916a-59d1-4375-ad4d-1fa99e3a9dd8` | `2026-08-08-paula-ann-cheshire-cheese-newton` |
| Paul McCoy @ Buxton Working Men's Club | `973bc587-8678-48d3-99bf-8d98ce62f573` | 2026-08-08 21:00 *(defaulted)* | Buxton Working Men's Club `TdrtliunWD8ENVM9WGyg` | `2026-08-08-paul-mccoy-buxton-working-mens-club` |

All ten writes (5 artists + 5 events) verified by `get_by_id` (§0.10). `isPublic: true` on every
event. Every event carries a §6D slug externalId.

---

## 3. TWO-SIDED SNAPSHOT DIFF (§5.7)

**Section 1 — week view: the page has NOT rolled. Byte-identical to the 2026-08-06 snapshot.**
89 rows on both sides, same order, **zero added and zero removed** (verified programmatically by
multiset comparison in the page context, not by eye). The curator's header still reads
*"What's on This Week 5 - 9 August"*, and today is Friday **7** August — so this is a **current**
week, not a stale one. This is NOT the §6C "page-not-rolled" failure class: the listing is live and
three of its five days are still ahead.

**Section 2 — branded/Reserved forward list: zero delta.** All 24 rows present, unchanged,
same order, 1 Aug → 12 Dec.

**Removed future-dated rows: NONE.** Nothing to action under §0.17 / §5.4. No deletions, no hides.

---

## 4. ⚠ THE `branded.htm` YEAR TRAP — mechanism now understood precisely

The 2026-08-06 run flagged that `branded.htm` continues below its forward list into past-gig
archives, and rejected 38 rows on that basis. This run confirms the structure and can state it
more exactly, which makes the stop condition cheaper to apply:

- The **forward list** sits under a **lowercase** `gigs 2026` header — 24 rows, Aug → Dec 2026.
- The **archives** sit under **capitalised** `Gigs 2026` (Jan–Jul 2026, past), then `Gigs 2025`,
  `Gigs 2024`, `Gigs 2023`, `Gigs 2022`. Row counts found by a `textContent` walk: 16 / 65 / 55 /
  41 / 9 = **186 archive rows**.
- **The archive containers are present in the DOM but are NOT RENDERED**, so `innerText` excludes
  them automatically. A `textContent`-based parse WOULD pull all 186 in. This run captured from
  `innerText` and additionally applied the spec's explicit stop condition, so nothing below the
  capitalised header was taken.
- The day-name cross-check was applied to all 24 forward rows and all 24 are consistent with 2026.

**Suggested spec refinement (not applied — a run does not rewrite its own spec's structure
unattended):** the stop condition currently reads *"the forward list ENDS at the `Gigs 2026`
section header"*, which is ambiguous because the forward list's OWN header is also `gigs 2026`.
The distinguishing feature is the **capitalisation**, and the safer mechanical rule is *"the forward
list is the FIRST dated section; every subsequent `Gigs <year>` header opens an archive"*.

---

## 5. COVERAGE — what was already in bndy, and how it was confirmed

The 2026-08-06 run's report §2c listed **10 acts as "staged, not created"**. Checking each against
bndy directly, **six of those ten were in fact created and evented by that same run after its report
section was drafted** — the report is stale on this point, not bndy:

| Act named as staged on 2026-08-06 | Actual state in bndy | Evidence |
|---|---|---|
| Songbirds | **present** — `Song Birds` `786c7f32-94e6-4861-ae3e-99eb24322b70`, event `d9f54a4c-16bd-405a-9cd3-e0b6b3a5dd51` created 2026-08-06T23:08Z with a correct `gigs-news` slug | `get_by_id` |
| Nazma | **present** — `Nazma Dawn Desai` `bf8a8379-ed0e-48b6-913d-4588b408d03c`, event `c5188a28-e92a-4781-beef-13ef86980b8f` 09 Aug 17:00 | `search_event` |
| Lazarus | **present** — `2c11088f-4af2-4ab9-9785-0ea397975d43`, event `d396e27d-8786-47e5-a9d1-c01d25abaf56` 09 Aug 19:00 | `search_event` |
| Undercover | **present** — `cc5866fa-57f7-42a4-8786-624fa31d0d0e`, event `af860700-cfeb-4402-9aee-588614ef7859` 08 Aug 21:30. Its location now reads `North West UK`, **not** the literal string `Test` the previous report flagged — that defect appears to have been repaired | `search_event` + `records.json` of the previous run |
| Vehicle | **present** as `The Band Vehicle` `ada252ae-e81c-477d-961d-ae715a90fa5f`, event `c2f00c42-cb6e-4dff-9102-20e698489610` 08 Aug 20:00 at The Wellington | `search_event` |
| Mike Jones's bill-partner Smudge | **present** — `b4cbf739-b352-4985-bc91-222ec42a61fe`, event `f739cb54-a4dd-4f60-81b0-cfbd03a1325a` 07 Aug 21:00 at The Dog Inn | `search_event` |
| Lee Ashley · Mike Jones · Dale Murphy · Paula Ann · Paul McCoy | **genuinely absent** | this run created all five |

**§4 split-bill note.** `Mike Jones + Smudge - the Dog Inn Chadderton` is one billing, two acts. Smudge
already had its own discrete event at that venue/date; this run added Mike Jones's. Both are per-artist
discrete events at the same venue+date, which is what §4's interim rule prescribes. **Sibling event ids
for a future parent-event attachment: `5e304824-e419-445f-98cd-9f41814fafc0` (Mike Jones) and
`f739cb54-a4dd-4f60-81b0-cfbd03a1325a` (Smudge).**

**Why there are zero 409s.** The task prompt expected many. This run resolved each row against bndy by
`search_artist` / `search_event` / `get_by_id` **before** attempting a write, and only wrote where the
record was genuinely absent — so the gate was never asked a question whose answer was already known.
That is cheaper and, more importantly, it distinguishes *"already imported"* from *"blocked"*, which a
409 count alone does not.

**Branded forward list — verified, not re-probed.** `search_event(artistId: rwDw320gku5uQ4gzaU2N)` over
2026-08-07 → 2026-12-31 returns **21 events**, which reconciles exactly with the 24-row source list:
24 − 1 past (Sat 1 Aug) − 1 non-gig (`Friday/Saturday 14/15 August - looking for a venue / cancellation`)
− 1 cancelled (`Sunday 20th September … (cancelled - United match)`) = **21**. Complete and correct;
nothing to do.

**Sampled verification of the rest of the week view** (§6A step 8's judgment-rule sampling):

- The Acoustic Lounge `Ha5zokxmGzIi6miASzO0`, 7–9 Aug: The Still (07th 21:00), Trip Hazzard (08th 21:00), Jess Kemp (09th **19:00** — correct Sunday default). 3/3.
- Whittles `yGNojetg8AYGh9vlGPia`, 7–9 Aug: Ideal Forgery (07th), Dan Budd as Robbie Williams (08th), Lazarus (09th 19:00). 3/3.
- The Select Committee `PNJ6TclgY1pH26h2orEa`: both gigs present — Cock & Pheasant 07th, The Swan Inn 08th.

---

## 6. ROWS REJECTED (event side) — 33

Venue side is unaffected; all venues in these rows already exist in bndy (§ row-import policy:
skip the event, keep the venue).

- **Open mic (8):** `Open Mic Jam` Dog Inn · `Karl Magee's Open Mic` Cheshire Cheese · `Open Mic` Blossoms · `Open Mic 7pm` Dog & Partridge · `Open Mic 7:30pm` Acoustic Lounge · `Open Mic` Kings Arms · `Jam + Open Mic` Mash Guru · `Open Mic` Railway Greenfield · `Between the Vines Open Mic 7pm` Fox & Pine
- **Karaoke / disco (5):** Coach & Horses · Cheshire Cheese · the Albion · `karaoke/disco` Dog Inn · `Dave's karaoke 5pm` the Club Romiley
- **Themed night, no named performer (3):** `Jazz Night` the Moor Club · `Rocking 60s` Stockport Rock & Roll Society · **`Jazz at the Railway` the Moor Club** (spec: always skip — recurring jazz night, not a single gig)
- **Generic multi-act, no names (4):** `live bands - Spinning Top` ×3 (Thu/Fri/Sat) · `4pm - Spinning Top` (Sun)
- **Blank act rows (12):** Stock Dove Romiley · Railway Handforth ×2 · Crown Bredbury ×2 · Hare & Hounds New Mills · The Crown Inn Stockport ×2 · Kings Arms Hotel Wilmslow · the Musketeer Leigh · the Billy Goat Mossley · Queens Arms Old Glossop · Marple Con & Social Club · Dane Bank Denton · Rising Sun Hazel Grove · Prince of Wales Glossop
- **Time-only rows, no act (5):** `10pm - Mash Guru` · `8pm - Dog & Partridge` · `5pm - Windsor Castle` · `8pm - the Steelworks` · `4pm - Cheshire Cheese`

**Rejected as past-dated (§0.14):** all 15 rows under Wednesday 5th and Thursday 6th August.
Note the 6 Aug rows include real acts (After Hours Band, Adrian Gautrey band, Roy Pimmy,
Tony Auton band Jam) — they were imported by the 2026-08-06 run while still future and are
untouched here.

---

## 7. GATE BOUNCES, TOOL FINDINGS AND CORRECTIONS

- **No gate bounces.** Zero 409, zero 422, zero `review` verdicts. All five `create_artist` calls
  returned `action: "created"` first time.
- ⚠ **`search_venue` false negative — THIRD instance of the same defect, and it would have created a
  duplicate.** `search_venue(name: "Buxton Working Mens Club", city: "Buxton")` returned
  **"No venues found"**; `search_venue(name: "Working Mens Club", city: "Buxton")` also returned
  **"No venues found"** after scanning 22 rows. The venue exists as
  **`TdrtliunWD8ENVM9WGyg` "Buxton Working Men's Club", 15 Lightwood Rd, Buxton SK17 7BJ**, already
  carrying **two** `gigs-news` externalIds. It was found only by a deliberately loose
  `search_venue(name: "Buxton", city: "Buxton")` — where it ranked **2nd at 24% `low_confidence`**,
  below the 50% "create new" threshold in every source spec's match ladder. The **apostrophe in
  "Men's"** is the defeating character, exactly as in `Grumpy's-GB Motorcycles` (2026-08-06 morning)
  and the full stop in `Steels. Sunderland` (2026-08-06 evening). Appended to `OPEN-RULINGS.md`.
- **`get_by_id` still omits `locationType`** — the §6B Kilmarnock pairing cannot be verified on
  read-back. Already open (2026-07-31); noted again because it applies to all 5 creates here.
- **`search_event` reports `externalIds: []` regardless of stored value** — reconfirmed. Every
  externalId in this report was verified with `get_by_id`, never with `search_event`.
- **One non-conforming event title observed, not touched:** `ae2ae9ae-ea90-40ef-b366-c76a1f47b323`
  is titled `The Swan, Wilmslow` rather than the §5.2 form `«Artist» @ «Venue»` (it is The Select
  Committee at The Swan Inn, 08 Aug). Same class as the Cosey Club title defects already logged on
  2026-08-06; repair-lane work, not an import decision, and no new ruling opened for it.
- **No date corrections applied** (§5.6b). Nothing on an act's or venue's own page contradicted the
  listing for any row this run touched.

---

## 8. VALIDATOR (§6A step 8)

```
5 records · 5 clean · 0 FAIL · 0 WARN   [mode=gate]
EXIT=0
```

Run as:
`python3 scripts/enrichment_validate.py --records data/normalized/gigs-news-uk/2026-08-07/records.json --evidence data/state/enrichment-evidence-2026-08-07-gigs-news.jsonl`

Evidence file is the **per-run** path (`-gigs-news` suffix, v2.9). The legacy per-date
`enrichment-evidence-2026-08-07*.jsonl` files belonging to other sources were not touched.

---

## 9. OPEN ITEMS RAISED

Appended to `OPEN-RULINGS.md` (append-only, §6F):

1. `search_venue` apostrophe/punctuation false negative — third confirmed instance, with the
   near-miss described.
2. The `branded.htm` stop condition's capitalisation ambiguity (`gigs 2026` forward vs
   `Gigs 2026` archive) — spec wording, not touched by this run.
3. The stale "staged" list in the 2026-08-06 report vs bndy reality — a reporting-integrity
   observation, since a subsequent run that trusted that list would have re-done six acts.
