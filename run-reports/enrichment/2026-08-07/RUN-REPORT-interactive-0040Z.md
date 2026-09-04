# RUN REPORT — Bv2a Enrichment (interactive correction pass, Jason-directed)

**Fired:** ~2026-08-08T00:10Z. **Finished:** 2026-08-08T00:40:00Z. **Outcome: COMPLETED**, one item left open (see below).
Not run under the hourly scheduled claim — interactive, off-schedule, at Jason's direction, correcting misses from the preceding 23:44–00:02 UTC interactive artist pass.

## Trigger

Jason supplied four Facebook URLs my prior pass had missed (Axiom, The Scoundrels, Mixology, The Excuses Band), said he'd deleted `Soulswitch and Sleazy Money` `a8da1ee9…` because it was two acts billed as one, and asked for two new records from two more URLs (Sleazy Money, SoulSwitch).

## Corrections to the four missed matches (4)

All four found and verified by visiting Jason's URLs directly in Chrome — not by re-trusting a search snippet.

| Artist | id | Field(s) | What changed and why |
|---|---|---|---|
| Axiom | `9c20e1bf-60e8-428c-9a8f-85074f493c0e` | facebookUrl, websiteUrl, bio, genres, actType, **location** | Own page (1.1K followers, Musician/band) states *"Birmingham based progressive rock/metal band created by 3 buddies."* — quoted verbatim. Genres `Rock`/`Metal`, actType `originals` (the page is all original singles/EP releases, not covers). **Location corrected Worksop → Birmingham** — the page states it directly, and per this project's own rule a page-stated location beats a gig-town guess; a Birmingham band playing a Worksop gig is an ordinary touring pattern. |
| Mixology | `b1a0ad07-b260-47df-a916-551ffe843f81` | facebookUrl, bio, genres, actType, **location** | Own page (190 followers, Musician) states *"Mixology is a five piece function band, that performs an eclectic mix of pop and rock covers in North East England."* — quoted verbatim. Genres `Pop`/`Rock`, actType `covers`. **Location corrected Greater Manchester UK → North East** (regional) — page-stated, overriding the stored region. |
| The Excuses Band | `fbb8997b-5b8e-4ffb-93ac-9037ad4a96e1` | facebookUrl, bio, actType, **location** | Own page (496 followers, Band) states *"Lively London-based band playing original songs that may raise a few eyebrows."* — quoted verbatim. actType `originals`. No genre stated on the visible page text, so none was guessed. **Location corrected Derby → London** — the largest of the four location jumps; flagged below for a second look since it's a bigger gap than the other three. |
| The Scoundrels | `e8089d50-947d-4141-9847-a39ac245622d` | websiteUrl, bio, genres, actType | Jason's Facebook link (`facebook.com/thescoundrelsuk`) turned out to be a **personal profile** ("Personal details", "Lives in London, United Kingdom") — not attachable as an act page under this project's rule (§2A.4). Followed the profile's own linked website instead: **thescoundrelsuk.com**, which states *"The Scoundrels deliver an electrifying fusion of pop, rock and funk, bringing infectious energy, tight grooves and irresistible hooks to every performance"* and explicitly lists "Crowd-pleasing live covers" — quoted verbatim, genres `Pop`/`Rock`/`Funk`, actType `covers`. facebookUrl left **blank** rather than attaching the personal profile; a thin, near-empty `facebook.com/thescoundrelsband` page (6 followers, no posts) was also found and rejected as too weak to be worth attaching over the own-website evidence. Location left unchanged (`Staffordshire UK`) — the own site's own testimonials name London and Brighton customers, not a home base, so there's nothing stronger than what's already stored. |

## Soulswitch/Sleazy Money split (1 deleted, 2 created)

- **`Soulswitch and Sleazy Money`** `a8da1ee9-589f-4452-9443-d5d7aa9a001b` — confirmed deleted by Jason (`get_by_id` now returns not-found). Checked `search_event(artistId, dateFrom, dateTo)` across all of 2026–2027 for any event still referencing it: **none found**. No event was orphaned, split, or re-created this pass — see "Open items" below.

- **Sleazy Money** — created `c79c1ae1-6d8e-47dd-82b6-ea8813fc313e`. facebookUrl `facebook.com/p/Sleazy-Money-61555988456842/` (Musician/band, 1.2K followers), bio quoted verbatim: *"Your mother's favorite rock'n'roll band 💋 FAST AND FILTHY 💋"* Location **South Wales** (regional) — confirmed via the page's own linked Linktree: *"Fast and Filthy 4-Piece from South Wales."* Genre `Rock n Roll`, actType `originals` (the page promotes an original single, "IT AIN'T EZ," on all major platforms).

- **SoulSwitch** — created `da2636b1-3015-42d7-88a9-a124440181e3`. **Flagged before creating, then resolved by Jason.** Visiting `facebook.com/SoulSwitch/` directly (not just trusting the earlier search summary) showed contact email `jkwong218@gmail.com`, which independently matches guitarist Jimmy Kwong of a 5-piece modern rock/melodic metal band from **Orlando, Florida** (has opened for Korn, Five Finger Death Punch, Kid Rock — confirmed via allmusicmagazine.com, concertarchives.org, mvkmusicgroup.com). This project has a hard rule against attaching a same-name foreign act's page, so I stopped and asked rather than creating it. **Jason supplied two screenshots of the page's own posts** — 30 Jul: *"Throwback to @nightrainbradford !! One of our new favorite places to ROCK in the UK‼️"*; 29 Jul: *"Happy Humpday at @theflapper in Birmingham‼️"* — both real UK venues (Night Train, Bradford; The Flapper, Birmingham), and confirmed: *"They're touring. Add them its fine. But location is UK."* This is a genuinely different situation from the failure mode the hard rule exists to prevent: it's not a name-match error, it's the same real band currently on a UK tour, evidenced by their own posts. Created with bio quoted verbatim from the page's own About field (*"THE OFFICIAL SOULSWITCH PAGE!"* — thin, but genuine), genres `Rock`/`Metal` (inferred from the independently-corroborated "modern rock/melodic metal" description — genres is the one field this project's rules allow inferring), actType `originals`, **location `UK wide`** (regional) — following this project's existing convention for a touring act with no single fixed town.

## Names corrected under §0.6

None. No record names were changed this pass (see the NAME_BILLING WARN on The Excuses Band, below — flagged, not acted on).

## Validator

First pass: **2 FAIL** (`BIO_SOURCE` on both newly-created artists) — caused by a known tooling gap already logged in `OPEN-RULINGS.md` (2026-08-06): the evidence file can only be keyed by `artistId`, but that id doesn't exist until `create_artist` returns, so the two evidence entries were initially keyed by `artistName` instead. Back-filled `artistId` onto both lines in `data/state/enrichment-evidence-2026-08-07-interactive-artists.jsonl` once the real ids were known (a same-file edit, not a rewrite of anyone else's data — this file has been exclusively this session's own since it was created). Re-ran:

```
6 records · 1 clean · 0 FAIL · 6 WARN   [mode=gate]
```
Exit code 0. WARNs: `STUB_NO_IMAGE` on 5 (no avatar extraction attempted this pass), `NAME_BILLING` on The Excuses Band (the page's own display name is "The Excuses", without "Band" — flagged for a human call, not renamed unattended; §0.20 explicitly protects `Duo`/`Trio`/`Acoustic`/`Solo` tails but doesn't name `Band`, so this isn't a clean-cut case either way).

## Budget used

6 artist records touched (4 corrected, 2 created), 1 deleted (by Jason, confirmed). All read back via `get_by_id`.

## Ledger / snapshot / dashboards

- 8 lines appended to `data/state/enrichment-ledger.jsonl`: 4 artist `verified` (corrections), 1 artist `delete`, 2 artist `verified`/`created`, 1 snapshot line.
- Snapshot counts (post-run): artists 1,939 total (1,938 → 1,939: −1 delete, +2 create) / 720 missing socials (725 → 720) / 655 missing genres (660 → 655); venues unchanged.
- 1 line appended to `data/state/run-summary.jsonl`.
- Both dashboards regenerated: `data/normalized/enrichment/DASHBOARD.html` (577 records, 24 snapshots) and `data/normalized/DASHBOARD.html`.

## Open items for a human

1. **No event found for the old combined billing.** `search_event` across 2026–2027 returned nothing for the deleted artist id. If there's a specific gig (venue/date) Sleazy Money and SoulSwitch were originally booked for, it still needs creating as two discrete events (§4) — asked Jason, not yet answered.
2. **The Excuses Band's own page just says "The Excuses."** Not renamed unattended (`NAME_BILLING` WARN) — worth a human call on whether to drop "Band" from the stored name.
3. **The Excuses Band's location jump is the largest of the four** (Derby → London, ~130 miles) — the other three (Axiom, Mixology, Sleazy Money/SoulSwitch touring) all have a clear explanation on the page itself; this one is taken on the page's word alone with no corroborating detail. Worth a second glance if there's any doubt.
4. **Process note, logged to `OPEN-RULINGS.md`:** the original SoulSwitch miss happened because a `WebSearch` call's own AI-generated summary asserted "based in Orlando, Florida" — which turned out to be true for identity, but the tool's summary conflated the band's origin with its current UK tour, and I nearly treated "not based here" as "don't attach" without checking the page myself. Visiting the actual page first, and treating the search engine's prose summary as a lead rather than a fact, is what caught this in time — worth keeping as the standing discipline.
