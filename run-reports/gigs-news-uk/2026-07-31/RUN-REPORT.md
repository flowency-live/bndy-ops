---
type: run-report
source: gigs-news
spec: sources/gigs-news-uk.md
runbook: RUNBOOK.md v2.0 (read in full)
run_date: 2026-07-31
status: imported
---

# gigs-news RUN REPORT — 2026-07-31

**Runbook**: `RUNBOOK.md` v2.0 read in full. **Spec**: `sources/gigs-news-uk.md` read in full.
Both present and readable — fail-closed gate passed.

**Run date established**: 2026-07-31 (Friday). ⚠ `date +%Y-%m-%d` unavailable — the bash
workspace failed to start ("VM service not running"). Fell back to the device clock, which
§6A.1 explicitly permits. Every relative row ("Friday 31st July") resolved against this date.

**Tools verified (§6A.3)**: bndy MCP reachable; Chrome connected AND logged into Facebook
(§2A.3 enrichment therefore viable — no fallback to web search was used or needed).

---

## 1. Headline

**Writes: 3 artists + 4 events = 7 creates. 0 venue creates. 0 deletions. 0 edits to existing
records.** Well under the §6 cap of 50.

**50 rows bounced 409 DUPLICATE_EVENT** — the source is already almost entirely imported into
bndy. See §6, which is the most important finding in this report.

Every write was read back with `get_by_id` (§0.10). All verified.

---

## 2. Capture (§6A.4)

Both required pages captured via Chrome (§ spec: "CHROME IS MANDATORY"). No `web_fetch`
fallback at any point.

| Page | URL | Result |
|---|---|---|
| Week view | `https://www.gigs-news.uk/` | Rendered fully. Edition **"What's on This Week 29 July - 2 August"**. 5 day-headers, ~85 rows. |
| Forward list | `https://www.gigs-news.uk/branded.htm` | Rendered fully. Forward block Aug–Dec 2026 (24 rows) + historic blocks 2021–Jul 2026. |

Raw captures:
- `data/raw/gigs-news-uk/2026-07-31/home.txt`
- `data/raw/gigs-news-uk/2026-07-31/branded-forward-list.txt`

**Truncation check (§ spec gotcha)**: listing count is sane vs the snapshot (85 rows vs 96 last
run, same five day-headers, all venues present). Not a half-rendered page. Proceeded.

**Horizons applied (§6E)**: week view today → +14 days; branded.htm forward list → full 12-month
runbook horizon. The branded list ends 2026-12-12, comfortably inside it.

---

## 3. Two-sided snapshot diff (§5.7)

Snapshot read: `data/state/gigs-news-uk-last-page.txt` (edition 15–19 July, fetched 2026-07-17).
Present and in the expected two-section shape — **no held-run condition**.

### Removed future-dated rows: **ZERO. No deletions made.**

| Snapshot forward row | Status in fresh capture |
|---|---|
| Sat 18 Jul — Hare & Hounds New Mills — Reserved | date passed (not a cancellation, §5.7) |
| Sat 25 Jul — Cheshire Cheese Newton — Reserved | date passed (not a cancellation, §5.7) |
| Sat 1 Aug — Arden Arms Stockport — branded | **still listed** ✓ |
| Sat 8 Aug — Stockport Town Hall Tavern — branded | **still listed** ✓ |
| Wed 19 Aug — Eagle & Child Whitefield — Reserved | **still listed** ✓ |
| Sat 22 Aug — the Crown Heaton Moor — Reserved | **still listed** ✓ |
| Fri 28 Aug — Ashton Jubilee Club — branded | **still listed** ✓ |

Every week-view row in the snapshot is dated 15–19 July and has simply passed. §5.7 is explicit
that a row disappearing because its date passed is not a cancellation. **`delete_event` was
never called.**

### Added rows
The entire 29 Jul – 2 Aug week view, plus the branded forward list from Sep–Dec 2026 (the
previous snapshot captured only the home page's short "gigs 2026" block, so the longer
`branded.htm` list reads as added). Every one was pipelined; see §5–6.

New snapshot written to `data/state/gigs-news-uk-last-page.txt` in the same two-section shape.

⚠ **One deliberate widening**: section 2 of the new snapshot now carries the **full `branded.htm`
forward list to 2026-12-12** (24 rows), where the previous snapshot held only the home page's
short 7-row "gigs 2026" block. Both pages are required every run per the spec, so the snapshot
must cover both for §5.7's removal check to be mechanical rather than a format artifact. Next
run's diff is like-for-like; this run's "added" set is inflated by that widening and every one of
those rows was verified against bndy individually (§6), so nothing was bulk-trusted.

---

## 4. Records created (all verified by read-back)

### Artists — 3

| id | name | location | socials | actType | evidence |
|---|---|---|---|---|---|
| `3ce99444-c624-421c-8e4f-6f1c62f528a9` | **Professor Fonque** | Stockport (`city`) | FB `facebook.com/professorfonque` + graph avatar | `["covers"]` | §2A.1 bar MET — see below |
| `1aa650fd-8368-4d6e-84f0-54dfca428b5b` | **The Scooby Dudes** | Wilmslow (`city`) | **BLANK — flagged** | `[]` — left empty per §0.18 | no UK page found |
| `bb7ede4f-5b66-462c-9f7e-05f254f0a3e3` | **Tracy Morgan** | Dukinfield (`city`) | **BLANK — flagged** | `[]` — left empty per §0.18 | no UK page found |

**Professor Fonque enrichment evidence (§2A.1):** FB Pages search returned exactly one candidate.
Page visited (§2A.3, not merely linked): name "Professor Fonque" (matches source verbatim),
category Musician/band, 635 followers, bio "put the Fun in FUNKtion band! Great for Weddings,
Birthdays, Corporate events!". **Activity is current** — created an event on 19 July 2026,
featuring "Sat, 3 Oct at 20:00 — Professor Fonque at Crompton Cric[ket Club]" (Shaw, Oldham).
UK / Greater Manchester footprint consistent with the Arden Arms Stockport gig being imported →
identification bar met. No abandoned-page problem (§2A.2). `actType: ["covers"]` is evidenced by
the act's own page (weddings/birthdays/corporate function band), not defaulted blind — §0.18
satisfied. Genres left empty (no enum-safe value evidenced). No location stated on the page, so
the gig town was used per §1A.1's city-preferred rule.

**The Scooby Dudes — blank, and why (§2A.5).** Searched FB Pages for "Scooby Dudes" and
"Scooby Dudes band Manchester". Hits: a US podcast, a "just for fun" page, a South African DJ
("Scooby Dude", Clocolan, ZA), a roller-derby community page, an Indian band. **No UK act page.**
§2A.1.1 forbids attaching a non-UK same-name page — blank beats wrong. Record created with
socials empty and flagged here.

**Tracy Morgan — blank, and why.** Searched "Tracy Morgan & Co band". The top hit is the
**verified US comedian Tracy Morgan (1.6M followers)** — precisely the failure mode §2A.1.1
names. Remaining hits are US/Zambian. **No UK act page.** Socials blank, flagged.

### Venues — 0 created

Two `create_venue` calls were made; **both returned existing records** via `google_place_id`
dedup, so nothing new was written:

- "Bulls Head High Lane" → **The Bull's Head**, 28 Buxton Rd, High Lane, Stockport SK6 8BH
  (`kDZuIhEoN0ZRyFQZgWVp`). Confirms the spec's learned mapping "Bulls Head" → "The Bull's Head".
  `search_venue` had missed it (name-form mismatch); find-or-create matched on place_id, so no
  duplicate was created.
- "Buxton Working Mens Club" → **Buxton Working Men's Club**, 15 Lightwood Rd, Buxton SK17 7BJ
  (`TdrtliunWD8ENVM9WGyg`). Same pattern — `search_venue` missed, place_id matched.

All other venues resolved from the spec's learned mappings or `search_venue`. Every match was
confirmed on **address/postcode**, never on name confidence alone (§3.4). Several matched at
low reported confidence purely because bndy appends the town to the venue name — e.g.
Eagle & Child Whitefield at 38%, Kings Arms Wilmslow at 50%, Albion Dukinfield at 12% — yet the
postcodes (M45 7EY, SK9 1PZ, SK16 4BZ) match the source exactly. **A naive ≥70 confidence gate
would have created duplicates for all three.**

### Events — 4

| id | title | date | time | externalId |
|---|---|---|---|---|
| `1cecb6bf-dd99-4960-9bd1-ebc2b8a994d8` | Professor Fonque @ Arden Arms | 2026-07-31 | 21:00 *(defaulted)* | `gigs-news:2026-07-31-professor-fonque-arden-arms-stockport` |
| `eea0c2e8-6a0b-4b9b-a87e-27d547774822` | The Scooby Dudes @ The Swan Inn | 2026-07-31 | 21:00 *(defaulted)* | `gigs-news:2026-07-31-the-scooby-dudes-the-swan-inn-wilmslow` |
| `63f47cf3-08f3-4cd3-851e-a56a113f6175` | Tracy Morgan & Co @ Albion Dukinfield | 2026-07-31 | 21:00 *(defaulted)* | `gigs-news:2026-07-31-tracy-morgan-albion-dukinfield` |
| `3bfeb5dc-1e6e-4ab2-93ed-d854cd35bcc8` | Silent Echoes @ Town Hall Tavern | 2026-08-01 | 21:00 *(defaulted)* | `gigs-news:2026-08-01-silent-echoes-stockport-town-hall-tavern` |

All four: `isPublic: true`, §6D stable slug externalIds, verified by `get_by_id`.

---

## 5. Defaulted start times (§5.6 — all flagged, all correctable)

Every event created carries a **defaulted** time; the source gave no explicit time for any of
the four. Friday & Saturday → **21:00** per §5.6. Applied to all four rows above.

Times that were *stated* in the source and would have been used verbatim had the row not already
existed: Rachel Farrow 5pm (17:00), Black Garter 4pm (16:00), Smudge duo 5pm (17:00), Alex Ashe
7pm (19:00), Marshall Gill 6pm (18:00), Paul Waldron 8pm (20:00), branded 22 Nov 4pm (16:00).

---

## 6. ⚠ PRINCIPAL FINDING — this source is already being imported by something else

**50 of the 54 pipelined rows bounced `409 DUPLICATE_EVENT`.** Per §0.9 a bounce is a match
signal, never something to work around — no retry, no name variation, no create was forced.
Existing ids were recorded and the run moved on.

This is not normal weekly-diff behaviour, and two pieces of evidence show *why*:

**(a) Bounces on our own `gigs-news` externalId.** Nine rows bounced with
`matchedExternalId: {source: "gigs-news", id: "<§6D slug>"}` — i.e. **the exact §6D slug this run
would have written already exists in bndy**, e.g.:

```
gigs-news:2026-07-31-bash-bailey-acoustic-lounge-poynton   → c6ac6c97-7267-4afd-b70d-25ce6da073a6
gigs-news:2026-07-31-jon-stevens-bulls-head-high-lane      → 2e4f9df6-d11f-4deb-a942-85a9335cf6f0
gigs-news:2026-08-01-branded-arden-arms-stockport          → 49542892-796b-4882-8860-fd5370a35512
gigs-news:2026-08-01-newman-rockets-acoustic-lounge-poynton→ 34b3e6ff-1360-4101-944f-48e83839eea9
gigs-news:2026-08-01-one-day-band-cheshire-cheese-newton   → af252159-d0ff-4361-962e-dbf550ea4da5
gigs-news:2026-08-01-rachel-farrow-windsor-castle-marple-bridge → af57792c-ee78-47e4-b054-e6a675c72831
gigs-news:2026-08-02-smudge-albion-dukinfield              → 64e84be8-6655-4924-abe2-d5471abb47f5
gigs-news:2026-08-02-alex-ashe-acoustic-lounge-poynton     → 887b06e1-9481-40ae-bc35-0a5cb384269b
gigs-news:2026-09-11-branded-acoustic-lounge-poynton       → 218ed6b7-c6dd-422d-b087-849be360cd62
gigs-news:2026-10-14-branded-eagle-child-whitefield        → e621e77c-960a-4ef8-a528-bb7a4782e594
gigs-news:2026-11-07-branded-cheshire-cheese-newton        → e2c62d93-083c-4099-b2f7-f540c11682c4
```

Something already writes §6D-conformant `gigs-news` slugs. It is not this scheduled task — the
snapshot it left behind is dated **2026-07-17**, two weeks stale, while the *data* is current
through December.

**(b) A second, undocumented externalId namespace on venues.** Multiple venues carry BOTH
`{source: "gigs-news-uk"}` (the historic May namespace) and **`{source: "gigs-news-daily-import"}`**
— e.g. Arden Arms, Acoustic Lounge, Cheshire Cheese, The Billy Goat, Stock Dove, Eagle & Child,
The Moor Club. `gigs-news-daily-import` appears **nowhere** in the runbook's §6D canonical list
or in the source spec.

This is the **same pattern already logged for sceniceye** on 2026-07-31
(`sceniceye` + `sceniceye-daily-import` on every venue). It is a cross-source condition, not a
gigs-news quirk.

**Consequences, stated plainly:**
1. The snapshot at `data/state/gigs-news-uk-last-page.txt` **does not reflect bndy's actual
   state**. It is a record of what *this* task last saw, not what has been imported. §5.7
   cancellation detection is therefore unreliable for this source: a row could vanish from the
   source and this task would never look up the right event.
2. Two writers on one namespace means idempotency depends entirely on the backend sentinel
   (artist+venue+date), which held perfectly today — 39 of the 50 bounces were sentinel catches
   with `matchedExternalId: null`, i.e. **the event existed but carried no matching externalId**.
3. Several existing events have **empty `externalIds`** — confirmed directly on
   `728b2e28-ce0d-48c6-9206-a4d99565c483` (branded @ Kings Arms, 2026-09-19), which returns
   `externalIds: []`. That is §6C's named "empty externalIds" failure class, live on this source
   too.

**No action taken.** Deleting, merging or re-tagging existing records is out of scope for an
import run (§0.11). Logged to `OPEN-RULINGS.md`.

### Full bounce ledger

*Week view, Fri 2026-07-31 (10 bounces):* Bash Bailey `c6ac6c97` · House of Ska `80ab2ea0` ·
The Grey Dogs `176e8ae2` · Chilly Red `08daffdb` · Puls `296a97bb` · Storm Kings `efa50d50` ·
Northside Brothers of Soul `50ade123` · Jon Stevens `2e4f9df6` · Ska Council `165646f8` ·
Paul Waldron `35a2ce09`

*Week view, Sat 2026-08-01 (14 bounces):* branded @ Arden Arms `49542892` · Newman Rockets
`34b3e6ff` · Bet Shop Boys `ddcfad26` · One Day band `af252159` · The Rubber Souls `920df2d7` ·
Jessie `1a648fa6` · The Select Committee `c7b8e217` · Stella Vision `875f1fd3` · Sod's Law
`c5c31fd5` · the Grey Numbers `04eef094` · Charlie Whittaker `a5d19075` · Rise of Kain
`1b306571` · Rachel Farrow `af57792c` · Karl Howard `b630da15`

*Week view, Sun 2026-08-02 (5 bounces):* Black Garter `ec7b90f1` · Smudge Duo `64e84be8` ·
Alex Ashe `887b06e1` · Marshall Gill `dbfc2d06` · Max Jones `511efa62`

*branded.htm forward list (21 bounces, all artist `branded` `rwDw320gku5uQ4gzaU2N`):*
08-08 `463cb7ec` · 08-19 `9326ce51` · 08-22 `9141775e` · 08-28 `788c7a4c` · 09-05 `07a9e82b` ·
09-11 `218ed6b7` · 09-13 `93274572` · 09-19 `728b2e28` · 09-26 `0801a98f` · 10-02 `b5955538` ·
10-09 `37cb9059` · 10-14 `e621e77c` · 10-16 `a97e372e` · 10-24 `d3ad6ea6` · 10-30 `ec8dd812` ·
11-07 `e2c62d93` · 11-14 `100398e3` · 11-22 `cb6e9e52` · 11-27 `6525c0d5` · 12-04 `a328dcbd` ·
12-12 `94b97843`

---

## 7. Staged for review — 1 row

| Row | Date | Reason |
|---|---|---|
| `Danestock from 2pm - Dane Bank Denton` | 2026-08-01 | **"Danestock" is an event/mini-festival name, not an act**, and the source names no performers. §0.5 forbids inventing an artist name; §4 forbids a lumped record. Not imported. If Jason can supply the lineup it becomes per-artist child events; if it is a recurring Dane Bank festival it may warrant a Festival entity. |

---

## 8. Rejected rows (logged, never imported)

**Cancelled in source — never import (§ spec rule):**
- `Sunday 20th September - Cheshire Cheese Newton SK14 4BH 5pm - Reserved` — the home page
  carries **"(cancelled - United match)"** directly beneath it. Confirmed **absent from bndy**
  (`get_by_external_id` returned not-found, and `search_event` for artist `branded` across
  18–22 Sep returned only the 19 Sep Kings Arms gig). Nothing to cancel or delete.
- `Friday/Saturday 14/15 August - looking for a venue / cancellation` — not a gig (§ spec rule).

**Past-dated — §0.14, never imported as events.** All Wed 29 Jul and Thu 30 Jul rows.
Per §5.5 these remain valid *discovery leads*: **Razor Holler** (Eagle & Child Whitefield) and
**Higgi's Band** (Welcome Inn Whitefield) are acts this source has now billed but bndy may not
hold — worth spidering for future gigs. Not imported here.

**Theme night / no named performer:** `5th Aug Rocking 60s - Stockport Rock & Roll Society`.
The future-date prefix parsed cleanly to **2026-08-05** (in horizon), but "Rocking 60s" is named
verbatim in the spec's reject filter as a theme night with no performer. Rejected on content,
not on date.

**Open mic / karaoke / quiz / jam (`non_artist_event`):** Open Mic Jam · Karl Magee's Open Mic ·
Open Mic (Blossoms) · Open Mic 7pm · Open Mic 7:30pm · Open Mic (Kings Arms) · Jam + Open Mic ·
karaoke ×4 · karaoke/disco · Open Mic/karaoke · Dave's karaoke 5pm · Between the Vines Open Mic
7pm · Blues Jam 4pm · Backwater Blues Jam · Tony Auton band Jam · Jazz Night · **Jazz at the
Railway** (spec: always skip).

**Multi-act, no names (`multi_act`):** `live bands - Spinning Top` ×3.

**Blank act rows:** 18 rows of the form `- the Stock Dove Romiley`, `- Whittles Oldham`,
`- Crown Bredbury`, `- the Railway Handforth`, `- Hare & Hounds New Mills`, `- Queens Arms Old
Glossop`, `- Rising Sun Hazel Grove`, `- the Wellington pub Stockport`, `- Poynton Workmens
Club`, `- Prince of Wales Glossop`, `- the Dog Inn Chadderton`, `- the Swan Inn Wilmslow`, etc.

**Time-only rows:** `10pm - Mash Guru Macclesfield` ×2 · `8pm - Dog & Partridge Great Moor` ·
`8pm - the Steelworks Bredbury` · `4pm - Cheshire Cheese Newton` · `4pm - the Steelworks
Bredbury` · `6pm - the Dog Inn Chadderton`.

**Sponsorship meta:** the duplicated `branded - the Arden Arms Stockport` featured row at the top
of the page, and the trailing un-labelled Reserved recap block. The 1 Aug branded gig itself was
pipelined once from the forward list (correctly deduped).

⚠ Per the spec's explicit warning, **"branded" was NOT skipped as a stray lowercase word** — it is
the curator's own band and was pipelined as artist `branded` throughout.

---

## 9. Aliases applied and learned

**Applied (already in the spec, no review needed — §1A.5):**
- `Bash Bailey & friends` → **Bash Bailey** (`ef5992b2`), billing kept in the event title
- `Charlie Whittaker Back-Up band` → **Charlie Whittaker** (`596ee534`)
- `Smudge duo` → **Smudge** (`b4cbf739`), ADR-023
- `Reserved` → artist **branded**, title form "branded (Reserved) @ «Venue»"
- `Bulls Head` → **The Bull's Head**; `Ashton Jubilee Club` → Jubilee Club, Ashton-in-Makerfield;
  `the Crown Heaton Moor` vs `The Crown Inn Stockport` kept correctly distinct

**Not stripped, deliberately:** `One Day band` — bndy already holds a record named exactly
**"One Day band"** (`a07c7d51`) whose own FB page is `theonedayband`. The act's own page name wins
(§2A.5 / §0.6), so "band" is part of the name here, not a qualifier to strip. Reused, not
re-created.

**Not split:** `Northside Brothers of Soul` — one act, per the spec's explicit
don't-false-positive note. Matched existing `zOUHlg6ULcjhBWWZXtJ1`.

**NEW alias, needs Jason's confirmation:** `Tracy Morgan & Co` → artist **Tracy Morgan**, billing
in the event title. Reasoned by analogy to the confirmed `& friends` pattern on this same source;
there is no FB evidence either way. If the act's real name is "Tracy Morgan & Co" in full, rename
`bb7ede4f-5b66-462c-9f7e-05f254f0a3e3` and record it as a verified-source-name (§2A.5).

---

## 10. Same-name / footprint checks (§1A.2)

No new artist triggered a same/near-name collision — "Professor Fonque", "The Scooby Dudes" and
"Tracy Morgan" all returned zero same-name records in bndy (1,297 artists scanned). No §1A.4
repair-on-contact obligations arose.

Cross-region checks the spec flags as mandatory were run on the reused records:
- **Grey Dogs** (`f6a91ee3`, Manchester) vs the distinct **the Grey Numbers** (`0107f0f5`,
  North West UK) — different acts, both billed this week at different venues. Kept separate.
- **PULS** (`ee69bf0a`, Stockport) playing Leigh — same canonical region, footprint adjacent
  (§1A.2.3). Reused, not duplicated.
- **The Rubber Souls** (`101dc4f7`, Liverpool) playing Wilmslow — North West, adjacent. Reused.
- **House of Ska** (`7d5e2573`, Lancashire) playing Macclesfield — adjacent. Reused.
- `Trilogy Rock Band` and `Lee Michaels`, which the spec flags for cross-source footprint checks,
  **did not appear** in this week's capture.

---

## 11. Open items for Jason

1. **Who else is writing `gigs-news` events?** §6 above. Until this is known, this task's
   snapshot is decorative and §5.7 cancellation detection cannot be trusted for this source.
2. **`gigs-news-daily-import` is not a §6D canonical namespace** — same condition as
   `sceniceye-daily-import`. Ratify it, retire it, or consolidate.
3. **Empty `externalIds` on existing gigs-news events** (confirmed on `728b2e28`) — §6C failure
   class. Needs a §6D slug back-fill before cancellation detection can work.
4. **Confirm the `Tracy Morgan & Co` → `Tracy Morgan` alias** (§9).
5. **Rule on `Danestock`** (§7) — lineup, or Festival entity, or permanent skip.
6. **Supply FB pages for The Scooby Dudes and Tracy Morgan** if known — both created bare after
   an exhaustive Chrome search, per §2A.5's blank-beats-wrong rule.
7. **`artistType` on the three new artists is inferred** ("band" from the billing), not evidenced.
8. **Workspace shell was down this run** — `date` and any file-based parsing had to be done
   without bash. It did not block anything here, but a source needing local parsing would have
   held.

---

## 12. Compliance checklist

| Rule | Status |
|---|---|
| §0.1 no scheduled task created/modified | ✓ none touched |
| §0.9 no bounce worked around | ✓ 50 bounces, zero retries, zero name variation |
| §0.10 every write read back | ✓ 3 artists + 4 events verified by `get_by_id` |
| §0.11 no deletes/merges | ✓ none |
| §0.12 no commentary in bndy fields | ✓ all flags live in this report only |
| §0.14 no past-dated imports | ✓ 29–30 Jul rows rejected |
| §0.18 no invented genres/actType | ✓ two artists left with `actType: []` rather than defaulted |
| §2A.5 enrich-inline, no bare stubs by default | ✓ Chrome FB search run for all 3; 1 enriched, 2 evidenced-blank |
| §5.2 isPublic true + §6D slug externalIds | ✓ all 4 events |
| §6 cap of 50 creates | ✓ 7 used |
| §6B Kilmarnock trap | ✓ n/a — all three new artists got `locationType: "city"`, no regional strings written |
| §6A.5 snapshot present, not a held run | ✓ snapshot existed and diffed cleanly; new snapshot written |
