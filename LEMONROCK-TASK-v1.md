# LEMONROCK IMPORT — TASK DEFINITION v1.0 (2026-07-31)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.12+). The runbook wins on any conflict.** Source id: `lemonrock`. Partnership POC with founder Mac. Scheduling is Jason-only (§0.1).

## IGNORE LIST (§0.19 — consulted BEFORE any fetch)

### Venues — never fetch, never import
| Slug | Venue | Ruling |
|---|---|---|
| `arenatorquay` | Arena Torquay | **Not grassroots** — 1,500-cap room booking national/international touring bills (The Lemonheads, Belphegor, The Slackers, Sex Pistols Expose). Jason 2026-07-31. Imported in error then removed: 13 events + 11 artists deleted. |

### Artists — never create, skip their rows
Reject on Lemonrock's OWN genre field — no name-guessing needed:
`DJ` · `Karaoke` · `Disco` · `Non-Music Event` · `Quiz` · `Bingo` · `Charity Event` · `Festival` · `Drag/Comedy`

Named entries confirmed to date: Target Audience Promotions (promoter, ~46 gigs) · Karaoke & Disco · Quiz Night · Vinyl Avengers (DJ) · Metal Monday (DJ) · Open Mic Night · Rad Entertainment DJ · Ibiza House & Trance Classics (After Dark) · Red Entertainment · Djr · Cassie Cosmic (drag/comedy) · The Last Word: Torbay Literary Festival Party · Dick and Dom DnB Rave · Wings N Riffs 2026 (festival bill).

### Verified source names — keep VERBATIM, never strip, never review (§2A.5)
| Name | Evidence |
|---|---|
| `Ooshka, Baby!!` | Act's own page `facebook.com/p/ooshka-baby-61574033337629`. Jason 2026-07-31. ⚠ Backend validator currently REJECTS this with `data_quality_validation_failed` — same unimplemented §2A.5 exception as the Tanky/Aquilla class. Open NU call; do not work around it (§0.9), raise it. |

## Source surfaces (all verified 2026-07-31)
- **Venue index** `allvenues.php?_start=<L>&all=0` — name, type, gig count, area, slug. ⚠ Numeric index is **`_start=9`**, NOT `123`.
- **Band index** `allbands.php?_start=<L>&all=0` — name, genre, format, gig count, `based:` town. 43% carry a town.
- **Venue page** `/<slug>` — full address (100%), postcode (93%), tel, web. **No Facebook, ever.** Gig list is client-rendered — a raw fetch returns zero gig links, so gigs come from the feed.
- **Gig feed** `gigfeed.php?ref=<slug>` — the event spine. Server-rendered: gig id in the anchor, date, act, start time, price, CANCELLED / SOLD OUT. **Fixed ~3-month horizon; `all=` and `y=` do nothing.** Format is a per-member setting — validate the row shape per venue and fail that venue safely rather than mis-map.
- **Band page** `/<band-slug>` — Band formats, Genres, Originals/Covers, Based in, Tel, Web, sometimes Facebook (~18%). Instagram ~0%.
- **CSV** `csv.php` — 404s from non-UK hosts, downloads unreadably in Chrome. NOT used.

## Hard-won parsing rules
1. **⚠ REPEATING RESIDENCIES REUSE ONE GIG ID across every date.** Abbey Lawn returns gigId `932920` for all 13 Simon Gee Sundays. Event externalId is **`<gigId>-<YYYY-MM-DD>`** — never the bare gig id. Multi-act bill on one gig id → `<gigId>-<date>-<artist-slug>`.
2. Venue resolution is **postcode-led**: pass name + full address + postcode to `create_venue`. This produced a 100% Google Place ID match rate across 34 venues. Name disagreement with postcode agreement is fine (Google's fuller name); town disagreement is a reject (§3.4).
3. ~24 of 2,664 index rows don't match `(type, N gigs, area)` — fail loudly, never coerce.
4. Never HTML-escape tool parameters. `&` passed as `&amp;` stored literally ("Guy &amp; The Upbeats").

## Enrichment (§2A.5(b) applies — Lemonrock is a structured source)
Lemonrock's declared fields ARE the inline enrichment: `Originals/Covers` → actType · `Genres` → bndy enum (drop anything not a real genre: "Covers - various", "Acoustic Covers", "Open Jam Night", "No genres set") · `Band formats` → artistType · `based in` → location. `actType` needs an `edit_artist` follow-up — `create_artist` has no such field.

A Lemonrock-supplied **Facebook URL is a starting point, never a verdict** — open it, judge on page CONTENTS not the handle. Real case: `facebook.com/brixhamlivemusic` looked like a venue page and genuinely was the band's own page (Southern Comfort). Canonicalise; the page's own name and stated location win.

## Cross-source
`abandcalledhorse` and other NE acts link to **onthecasemusic.co.uk**. Expect `matched`/`DUPLICATE_EVENT` in the North East — success signals. **Never §0.17-delete an event carrying both `lemonrock` and another source's externalId.**

## ⚠ Sliding-window trap (highest severity, still unhandled)
The feed is a 3-month ROLLING window. §5.7/§0.17 removed-row logic must only consider rows **inside the previous capture's date range** — otherwise real future gigs get deleted as the window slides. The snapshot must record each venue's date range. **Do not schedule this task until that is implemented.**

## Open rulings for Jason
- **Foreign touring acts** at UK venues (The Lemonheads/São Paulo, The Slackers/NYC, Belphegor/Austria). Moot at Arena Torquay now it's ignored, but the pattern will recur. bndy has no location model for it.
- **Ambiguous artists** staged, not created: Oas-is · Rhythm & Shoes · Double Helix · Bad Knees Blues Band.
- **Validator defect**: `Ooshka, Baby!!` and `Aquilla - The Dna of Rock` both bounce `data_quality_validation_failed` — the unimplemented §2A.5 verified-source-name exception.
