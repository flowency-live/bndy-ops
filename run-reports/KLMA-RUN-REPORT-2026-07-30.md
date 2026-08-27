# KLMA DAILY RUN — 2026-07-30 (unattended, runbook v1.9 rules / KLMA-TASK v2.1)

Source: `klma-stoke-gig-list`, gviz `out:html` capture via Chrome. Capture complete and format-matched to snapshot (first clean diff under the v2.1 same-format snapshot regime — open item 7 from 2026-07-29 now closed).

**Diff vs 2026-07-29 snapshot: 5 added rows / 2 removed rows.** No format noise.

## Totals
- **Creates: 13** (cap 50) — 6 artists, 0 venues, 7 events. All flagged `aiCreated` / `needsReview`.
- **Matched existing: 1 artist** (The Dirt), **2 venues** (The Rigger, Swan Inn Stone). Zero venue twins created.
- **Staged for Jason: 1** (NU CALL — location unresolvable, see below).
- **Gate bounces: 0.** No 409/422 this run. No resolver `review` outcomes.
- **Deletions: 0.**

---

## ⚠ PRECONDITION DISCREPANCY — needs Jason's attention

`MASTER-IMPORT-RUNBOOK.md` has an **inconsistent version marker**: the H1 reads **"v1.8 (2026-07-29)"** but the file carries the full v1.9 rule set (§0.17 "REVISED v1.9", §5.7 "(v1.9)", §2A.1.3 "TIGHTENED v1.9", §2A.5 "(v1.9)") and its changelog's newest entry is **v1.9 (2026-07-29)**.

The task's fail-closed gate requires v1.9+. Determination: the **content is v1.9** — only the title line was not bumped — so the run proceeded under v1.9 rules. **Action for Jason: bump the H1 to v1.9** so future unattended runs don't have to make this call. If the intent was that this file is genuinely still v1.8, this run should be reviewed.

---

## Added rows → pipeline

### Row 1 — Andrea Harvey Solo, The Swan Stone, 14/08/2026
`46232.58445 Friday, August 14, 2026 Andrea Harvey Solo Absolute Rockfest The Swan, Stone free Rock from 60s - 20's`

- Column split taken as Artist = `Andrea Harvey Solo`, Venue = `Absolute Rockfest The Swan, Stone` (matches the sheet's habitual "«fest name» «venue»" pattern — cf. "Bushfest at The Bush Brown Edge", "Auctioneers arms, cider festival, caverswall").
- Artist name → **Andrea Harvey** (ADR-023: "Solo" is a qualifier, belongs in the event title, not the record).
- Venue → matched existing **Swan Inn, Stone** `74BjwiHSxHDxdUghRVB9` (learned mapping; name-similarity score was only 13 because of "The Swan" vs "Swan Inn" — city + prior-run confirmation carried it, §3.4).

### Rows 2–5 — four new form submissions, all The Rigger, Newcastle-under-Lyme
These arrived below the sheet's second header block in the form-submission column layout `[timestamp] [DD/MM/YYYY] [artist] [venue] [cost] [genre] [link]`. Mapping verified against the header row `Artist | Venue & Location | Cost | Genre | Link to Event`.

Venue → matched existing **The Rigger** `YOMsEVdj9Y7OMMy88HFV` (100%, already carries a `klma-stoke-gig-list` externalId).

---

## 🚩 DATE CORRECTION APPLIED — sheet said 31/07, gig is 01/08

The `American Fear, The Other Things, Flutter` row is dated **31/07/2026** in the sheet. Two independent sources say otherwise:

1. The row's **own linked FB event** (`3076877249187966`) — header "Saturday at 20:00", body "Saturday 1st August / Doors 8pm / £6 Entry OTD".
2. **The Other Things' own FB page** post: *"Next gig at la Rigger - 1st August, bit of a shoegaze/nu-gaze/alt-rock night"*.

31/07/2026 is a Friday; 01/08/2026 is a Saturday. Events created on **2026-08-01** per §2A.1.3 (band/venue pages carry gig corrections — apply them). **Flagged here because a date is part of the event UID.** If Jason disagrees, the three events below need re-dating.

---

## Artists created (6)

| Name | id | Location | Enrichment | Evidence |
|---|---|---|---|---|
| The Other Things | `b5c23dd6-4cbf-4f77-9c89-706ffc433300` | Newcastle-under-Lyme (inferred from gig venue) | FB `facebook.com/theotherthingsmusic` + graph avatar; actType `originals` | **Page posted about this very gig** ("Next gig at la Rigger - 1st August") — §2A.1 hard signal. Active page, 421 followers, own releases ('Snakeskin Ladders'), bio "indie/alternative rock". |
| Light of Eternity | `1eb139f9-8df2-419d-956a-32187858bbc2` | **London** | FB `facebook.com/profile.php?id=61558141493455` + graph avatar; instagram `lightofeternity2024`; website `lightofeternity.com`; actType `originals` | **Act's own page co-hosts the FB event** being imported. Page 2.7K followers, active (post dated 30/07/26). Location from own site: "a rock group from London". Members: Big Paul Ferguson (Killing Joke), Fred Schreck, Pauly Williams. |
| Inner Terrestrials | `95513c20-4a44-4540-8b3f-72485bce3449` | **London** | FB `facebook.com/innerterrestrials` + graph avatar; actType `originals` | Verified page, 16K followers, bio: "On the road for 30 years, London's legendary Inner Terrestrials are pioneers of the UK dub punk sound". |
| American Fear | `1bd4b3ab-6bcc-4513-8d18-f50e0cfc6ef7` | Newcastle-under-Lyme (inferred from gig venue) | **socials BLANK — flagged** | 🚩 FB searched via Chrome (logged in) with variants "American Fear", "American Fear band", "American Fear shoegaze". Only same-name/near-name US pages returned (FEAR – LA punk band; Average american Fear; American Fear Files/Stories). **Blank beats wrong (§2A.1.1)** — no UK-consistent page exists that clears the bar. |
| Flutter | `00c8e79b-9add-455c-8d51-09542a629030` | Newcastle-under-Lyme (inferred from gig venue) | **socials BLANK — flagged** | 🚩 Candidate found and **rejected**: `facebook.com/profile.php?id=61573289953927` "Flutter Band — Shoegaze/Alt Rock 5 Piece". Genre fits the bill, but the page has 9 followers, **zero posts, no location, no gig mentions** — name+genre only, which §2A.1 says is never sufficient. Left blank. **Worth 30 seconds of Jason's eyes** — it may well be them. |
| Andrea Harvey | `d9f184e8-9fec-4917-88d7-67a355b83b82` | Stone (inferred from gig venue) | **socials BLANK — flagged**; actType `covers` | 🚩 FB searched ("Andrea Harvey music", "Andrea Harvey singer", "Andrea Harvey Stoke music") — no act page. Likely a personal-profile-only act (§2A.4) → stays blank, flagged for the upload-image path. actType `covers` from the billing "Rock from 60s - 20's". |

**Genres left empty on all six** — §0.18 (enum-only, unknown = leave empty). No free-text genre was written to any record.

**actType left empty on American Fear and Flutter.** §2A.2's default is `["covers"]`, but both sit on an originals-band shoegaze/psych bill; writing "covers" would be a public-facing guess against the evidence, and §0.18 says unknown = leave empty. Flagging rather than defaulting — **Jason may want to rule on which clause wins here**, since §2A.2 and §0.18 point different ways when the default itself is probably wrong.

## Artists matched (1) + repair-on-contact

**The Dirt** → existing `bbf9861b-d6c4-492e-83e2-c1f6360602a1` (Manchester).
- §1A.2 Step 0 run first: the Inner Terrestrials FB event's co-host page is "The Dirt", and `facebook.com/thedirtpsychzone` carries the byte-identical bio to the existing record's bio ("sonic psych punk duo blending guitar loops…"). **Exact facebook_key match = SAME artist, reused immediately.** No second record created despite Manchester vs Newcastle-under-Lyme gig town.
- Top-up applied (§2A.2): empty `actType` → `["originals"]`; added externalId `klma-stoke-gig-list / klma-artist-the-dirt` alongside the existing poster-import id.

## Events created (7)

| id | Title | Date | Time | Price |
|---|---|---|---|---|
| `62220000-14bc-4771-96af-fe3ce2029e90` | American Fear @ The Rigger | 2026-08-01 | 20:00 | £6 |
| `17b0df1f-9470-4c7c-a454-769d3a3c6d4b` | The Other Things @ The Rigger | 2026-08-01 | 20:00 | £6 |
| `9de754b2-3f3b-4283-8dd1-4b2f0e1ebc08` | Flutter @ The Rigger | 2026-08-01 | 20:00 | £6 |
| `069ef658-7c08-42f8-94e5-4f57a878914c` | Light of Eternity @ The Rigger | 2026-08-07 | 19:30 | £20 (ticketed) |
| `416e058f-eb43-474a-bae8-3b240345924b` | Inner Terrestrials @ The Rigger | 2026-09-25 | 19:30 | £15 (ticketed) |
| `a75a9dc7-eefd-42f7-829c-f0f1fb3713ad` | The Dirt @ The Rigger | 2026-09-25 | 19:30 | £15 (ticketed) |
| `d30498a3-dd73-4da8-92f8-9e2b92b36284` | Andrea Harvey Solo @ Swan Inn | 2026-08-14 | 21:00 | Free |

All `isPublic: true`, all source-tagged `klma-stoke-gig-list` with stable slugs, all verified by `get_by_id` read-back (§0.10).

**Multi-act sibling groups (for retroactive parent attachment, §4 interim):**
- 2026-08-01 @ The Rigger "Shoegaze/Psychedelia" — `62220000` + `17b0df1f` + `9de754b2`
- 2026-09-25 @ The Rigger "Both Eyes Open Presents: INNER TERRESTRIALS" — `416e058f` + `a75a9dc7`

**Times:** 6 of 7 taken from the venue's own FB event pages (not defaulted). **1 defaulted (§5.6):** Andrea Harvey 14/08 Friday → **21:00** — correctable.

---

## STAGED — 1 item

### NU CALL - Nu-Metal Tribute Band @ The Rigger, 2026-08-21, 20:00, £10
Row: `29/07/2026 22:13:25 21/08/2026 Nu Call - Nu Metal Tribute Band The Rigger Venue... £10 Nu Metal <fb event>`

Everything resolved **except location**, and §0.7 forbids creating an artist without a resolvable one. Staged rather than guessed.

- **Identity is certain**: the act's own page `facebook.com/lastcallswindon` co-hosts the FB event. Page name **"NU CALL - Nu-Metal Tribute Band"**, 1.1K followers, 71 past events.
- **§2A.5 verified-source-name exception applies** — the act's own page name IS the full billing string, exactly like the Tanky case. So the record should be created as **"NU CALL - Nu-Metal Tribute Band"** verbatim, not stripped to "Nu Call".
- **The location conflict**: the page states no location anywhere (About tab is empty beyond the bio). The vanity handle says **Swindon** (South West) — evidently a repurposed page from an earlier band "Last Call". The mechanical fallback in §2 would put them at the gig town **Newcastle-under-Lyme**, which is almost certainly wrong for a touring tribute act. Two signals, both weak, pointing different ways → §6 STAGE.
- **Jason: one word from you unblocks this** — Swindon or Newcastle-under-Lyme. Then the artist + event create in a single pass next run, and the name goes in the KLMA alias table so it never gets stripped or re-reviewed.
- Ready-made values: artistType `band`, actType `["tribute"]`, FB `https://www.facebook.com/lastcallswindon`, avatar `https://graph.facebook.com/lastcallswindon/picture?type=large`, event 2026-08-21 20:00 £10 ticketed `gigantic.com/nu-call-tickets/newcastle-under-lyme-the-rigger/2026-08-21-20-00`.

---

## Removed rows (§5.7 two-sided diff) → 0 deletions, both logged

Two future-dated rows disappeared. **Neither is a cancellation** — both were the duplicate half of a known noise pair, and the gig itself is still listed in the full capture via its surviving twin. §0.17(c) requires absence confirmed against the full capture; absence is *not* confirmed in either case. **No deletion, log only.**

| Removed row | Surviving twin in today's capture | Verdict |
|---|---|---|
| `Friday, July 31, 2026 Crosshair The Furlong` (bare, no row-id) | `46184.6297 Friday, July 31, 2026 Crosshair The Furlong 9:00 pm Rock` | Sheet tidy-up of a duplicate row. Gig stands. |
| `Friday, July 31, 2026 Front Page News Post Office, Burslem` (bare, no row-id) | `46179.52102 Friday, July 31, 2026 Front Page News Old Post Office, Burslem 9:00 pm Rhythm and Blues, Rock and Soul` | Sheet tidy-up of a duplicate row (also fixes "Post Office" → "Old Post Office"). Gig stands. |

Junk rows skipped as usual: `1/1/0125`, `1/4/0202`, monthly `You Can Add Your Own Gigs…` form links, the Dec-2027 placeholder block, the 2040 notice block.

---

## Snapshot
`klma-last-page.txt` rewritten in the same `out:html` page-text format: 2 lines removed, 1 line inserted in place (Andrea Harvey), 4 lines appended (the new form submissions). Format regime held — the v2.1 change did what it was meant to do.

## OPEN ITEMS
1. **Bump `MASTER-IMPORT-RUNBOOK.md` H1 from v1.8 to v1.9** (see precondition discrepancy above).
2. **Rule needed: §2A.2 default `["covers"]` vs §0.18 "unknown = leave empty"** when the default is evidentially wrong. Left empty for American Fear + Flutter this run.
3. **NU CALL location ruling** (Swindon vs Newcastle-under-Lyme) — then add "NU CALL - Nu-Metal Tribute Band" to the KLMA alias table under §2A.5.
4. **Confirm the 31/07 → 01/08 date correction** on the three Shoegaze/Psychedelia events.
5. **Flutter**: check `facebook.com/profile.php?id=61573289953927` ("Flutter Band — Shoegaze/Alt Rock 5 Piece") — rejected on evidence, but plausibly correct.
6. American Fear + Andrea Harvey: no findable act page. Andrea Harvey is likely personal-profile-only → upload-image path.
7. Artist review queue: all 6 new artists.
8. Carried from 2026-07-29: Day 3 split ruling (`aa58b95c`); Trilogy Rock Band location fix (`XJ2gV4N1qIe6vK2R562Q`); Sooasis display name; enrichment owed on the 6 un-FB'd artists from that run.
9. Sandbox shell was unavailable this session (VM failed to start) — all file work done through the device bridge. No impact on the run.
