# LEMONROCK IMPORT — TASK DEFINITION v2.0 (2026-07-31)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.13+).** Source id: `lemonrock`. Partnership POC with founder Mac. Scheduling is Jason-only (§0.1).
**v2 change: `gigfeed.php` is ABANDONED as the collection surface. Use `<venue-slug>?page=gigs`.**

---

## 1. COLLECTION SURFACE — `<venue-slug>?page=gigs`

Plain server-rendered HTML. A direct `fetch()` returns it complete — **no API exists** (verified: zero XHR/JSON on the page; it is a jQuery-era PHP site), **no Chrome rendering needed**, no access key, no CSV.

Carries per gig: `gig.php?id=<n>` anchor (the source id), date, act name with genre/format in brackets, price (`FREE!`, `£5`, `non-memb £4`), start **and end** times, and `CANCELLED` with a dated reason.

**Why gigfeed.php was abandoned:** it is capped at a rolling ~3 months (`all=` and `y=` params provably do nothing). The 2026-07-31 re-crawl created 138 events the feed had never shown, **109 of them beyond the feed's horizon**. Spinning Wheel Inn: 101 gigs on `?page=gigs` vs 33 via the feed.

Secondary surfaces:
- `allvenues.php?_start=<L>&all=0` — venue index; name, type, gig count, area, slug. **Numeric index is `_start=9`, NOT `123`.**
- `allbands.php?_start=<L>&all=0` — band index; genre, format, gig count, `based:` town.
- `/<band-slug>` — Band formats, Genres, Originals/Covers, Based in, Tel, Web, sometimes Facebook (~18%).
- `/<venue-slug>` (no query) — address (100%), postcode (93%), tel, web. **No Facebook, ever.** Carries NO gigs.
- `newestgigs.php` / `cancellations.php` — incremental deltas, see §2.

---

## 2. SCHEDULED-RUN STRATEGY

The problem: 2,664 venues nationally. Crawling every `?page=gigs` nightly is ~900MB against a partner's server. Unacceptable. So the run is tiered.

### Tier 1 — DAILY: incremental deltas (cheap, ~4 requests per region)
```
newestgigs.php?cityId=<region centre>&maxMilesGig=<radius>&listingPeriodNewest=<period>
cancellations.php?cityId=<region centre>&maxMilesFestival=<radius>&gigfromdate=<today>&obCanc=1
```
⚠ **These pages are location-scoped by COOKIE by default** (they will silently answer for whatever town the browser last used — observed defaulting to Disley, Cheshire). **ALWAYS pass `cityId` and radius explicitly**; never trust an unparameterised call. Build-spec §7.5's warning about geographic pages applies — with explicit params they are deterministic, without them they are not.

- New gigs → normal pipeline (§3).
- Cancellations → find the event by externalId, set cancelled. **Never delete on this signal alone.**
- `cityId` per region must be captured once and recorded in §6 below.

### Tier 2 — WEEKLY: venue index diff (27 requests)
Fetch all 27 `allvenues.php` indexes, diff against the stored snapshot:
- **New slug in region** → new venue → resolve (§3) and crawl its `?page=gigs`.
- **Gig count changed** → crawl that venue's `?page=gigs`.
- **Slug disappeared** → venue has no current gigs. **Do NOT delete its events on this signal** — see §5.
- Unchanged → skip entirely. This is what keeps the crawl proportionate.

### Tier 3 — MONTHLY: full re-crawl of bndy-known Lemonrock venues
Every venue in bndy carrying a `lemonrock` externalId gets its `?page=gigs` re-read. Catches silent edits — time changes, price changes, act swaps — that neither the deltas nor the count-diff surface.

**Answering the ordering question directly:** bndy-known venues are the priority path (Tiers 2 and 3 both key off records we already hold). New-venue discovery is a by-product of the Tier 2 index diff, which is cheap enough to run weekly and is the only place a venue we have never seen can enter.

### Ordering within any run
1. Load ignore list (§0.19) and learned rules — **before the first fetch**.
2. Tier work as above.
3. Venue → artist → event, in that order. Never create an event against an unresolved party.

---

## 3. PER-GIG PIPELINE
Unchanged from the runbook: sanitize billing (§0.6) → split lineups (§4) → venue (§3, postcode-led) → artist (§1A/§2A, enrich inline per §2A.5(b)) → one discrete event per act (§5) → verify every write with `get_by_id` (§0.10).

**Event externalId is `<gigId>-<YYYY-MM-DD>`.** ⚠ Repeating residencies reuse ONE gig id across every date — Abbey Lawn returns `932920` for all 13 Simon Gee Sundays. A bare gig id collapses them. Multi-act bill on one id → `<gigId>-<date>-<artist-slug>`.

⚠ **`create_event` silently drops `endTime`, `price` and `ticketed`** (found 2026-07-31, confirmed by read-back). Every event create MUST be followed by an `edit_event` setting those fields, and verified. Logged in CTO-BACKLOG as a defect.

---

## 4. IGNORE LIST (§0.19 — consulted BEFORE any fetch)

### Venues
| Slug | Venue | Ruling |
|---|---|---|
| `arenatorquay` | Arena Torquay | **Not grassroots** — big room, national/international touring bills at £18+. Jason 2026-07-31. Imported in error then removed (13 events, 11 artists). ⚠ Revisit if CTO-DECISION-01 introduces `venueTier`. |
| `molloysstmarychurch` | Molloy's St Marychurch | Feed verified 100% "Target Audience Promotions" (DJ promoter) across 47 rows. Venue record exists in bndy with zero events. |

### Artists — reject on Lemonrock's OWN genre field
`DJ` · `Karaoke` · `Disco` · `Non-Music Event` · `Quiz` · `Bingo` · `Charity Event` · `Festival` · `Drag/Comedy`

Named: Target Audience Promotions · Karaoke & Disco · Quiz Night · Vinyl Avengers · Metal Monday · Open Mic Night (+ Duo) · Rad Entertainment DJ · Ibiza House & Trance Classics · Red Entertainment · Djr · Cassie Cosmic · The Last Word (literary) · Dick and Dom DnB Rave · Wings N Riffs (festival bill).

### Billing → name normalisations (§0.20 — RESOLVED 2026-07-31)
| Lemonrock billing | bndy artist | Evidence |
|---|---|---|
| `Ooshka, Baby!!` | **Ooshka Baby** | `facebook.com/profile.php?id=61574033337629` — the act's own page. Jason ruling. |
| `Aquilla - The Dna of Rock` | **Aquilla** | `facebook.com/aquillathednaofrock`. "The Dna of Rock" is a strapline (§0.6). |

✅ **Both created first time once normalised.** This was never a validator defect — the source's BILLING was mistaken for the act's NAME. A `data_quality_validation_failed` bounce on punctuation means: strip promo (§0.6), normalise punctuation, and let the act's own page settle the spelling (§0.20). ⚠ Do NOT over-apply: `Oas-is` genuinely contains a hyphen (it's a pun) — normalisation is for promo punctuation, not for names.

---

## 5. ⚠ SLIDING-WINDOW / DELETION SAFETY

The v1 blocker is **substantially reduced** by moving to `?page=gigs`, because that page shows the full forward listing rather than a rolling window — a gig no longer vanishes merely because time passed.

Residual rules, still mandatory before scheduling:
1. §5.7 removed-row logic compares **like for like**: `?page=gigs` capture vs `?page=gigs` snapshot. Never diff across surfaces.
2. A venue dropping out of the A–Z index means "no current gigs", **not** "gigs cancelled". Never delete on that signal.
3. §0.17 deletion still requires: this-source-only externalIds, non-owner, and absence confirmed against a **complete successful** capture. A failed fetch for a venue blocks deletion for that venue.
4. Cancellations come from the explicit `CANCELLED` marker or `cancellations.php` — a preferable, positive signal. Prefer it over absence-inference.

---

## 6. TO CAPTURE BEFORE SCHEDULING
- [ ] `cityId` values for each target region (Torbay, Exeter, Plymouth…). Observed format: `cityId=14580` = Disley, Cheshire.
- [ ] Confirm whether the A–Z index gig count includes past gigs (CJ's Bar showed 10 in the index, 1 upcoming) — determines how noisy the Tier 2 count-diff is.
- [ ] Snapshot format + location for `?page=gigs` captures, per §5.1.
- [ ] `create_event` field-drop defect fixed, or the compensating `edit_event` step made mandatory in code.

---

## 7. CROSS-SOURCE
NE acts link to **onthecasemusic.co.uk**. Expect `matched` / `DUPLICATE_EVENT` there — success signals. **Never §0.17-delete an event carrying both `lemonrock` and another source's externalId.** Arena Torquay also carried a `poster-import-2026-05-03` id; its removal took that source's Sex Pistols Expose date with it.

## 7A. HELD / NEEDS ATTENTION (as at 2026-07-31)

| Item | State | Needs |
|---|---|---|
| **The Beehive, Honiton** | Venue stub in bndy, **zero events, 26 gigs held**. Fairport Convention £36 + tributes £18–28. | PARKED by Jason pending the ticketed-venue feature. See CTO-DECISION-01. Do NOT ignore-list, do NOT import, until that ships. |
| **Ocean, Exmouth** | Venue created but geocoded to *"Bowling & Amusements - at Ocean Exmouth"* — wrong building (§3.3). **11 gigs unattached.** | Manual Google place_id, then attach the 11 events. |
| Pinhoe Parish Church · Castle Street · Budleigh Literary Festival Marquee · Topsham Charter Day | Venues created, bad geocodes, **11 gigs staged, unattached**. | Manual place_id each. |
| **Mad Dog Mcrea** | Nationally-touring folk act; Lemonrock declares no "Based in", so it sits on a Dawlish gig-town fallback. | Real location backfill (§0.7 — arguably should be "UK wide"). |
| Phoenix, Exmouth | 39 gigs, **all cancelled 11 Jul 2026**. Venue correctly NOT created (§0.21). | Nothing — recheck on a later run. |
| Malt House (Seaton) · Sola Bar & Kitchen (Dawlish Warren) · Feathers Hotel (Budleigh) | Venue stubs created before their listings were read; all are 100% karaoke/DJ, so zero importable gigs (§0.21 breach). | Jason's ruling 2026-07-31: **do not sweep empty records** — leave them. |
| Take A Chance On Us ×2 · Mad Dog Mcrea events | Ticketed, price genuinely unstated on source ("tickets on sale soon"). | Left blank, not guessed. |

⚠ **Process lesson:** three venues above were created BEFORE their `?page=gigs` listing was read. §0.21 requires the listing to be checked FIRST — venue creation is the last step, not the first.

## 8. OPEN RULINGS
- Foreign touring acts at UK venues — no location model (moot while Arena is ignored; will recur).
- Staged ambiguous artists: Oas-is · Rhythm & Shoes · Double Helix · Bad Knees Blues Band.
- CTO-DECISION-01 (`venueTier` / ticketed) determines whether ignore lists or tiering handle big rooms.
