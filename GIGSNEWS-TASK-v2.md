# GIGS-NEWS DAILY IMPORT — TASK DEFINITION v2.2 (2026-07-30 — v2.1 rules PLUS everything ported from the original scheduled-task prompt)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.10+). The runbook wins on any conflict. This file holds ONLY gigs-news-specific procedure and quirks.** Replaces every previous gigs-news task file. Scheduling is Jason-only.

**OUTPUT CONTRACT:** Every run MUST also comply with `RUN-CONTRACT.md` v2.0+ and emit a valid append-only record under `run-ledger/`, including enrichment and canonical read-back evidence.

## Source — TWO pages, both required
1. **gigs-news.uk** (NOT .co.uk) — the weekly "What's on This Week" listing. **Client-rendered**: plain fetch returns a shell, read via Chrome after render.
2. **gigs-news.uk/branded.htm** — the site owner's own band page, carrying a forward gig list ~12 months out. **This is where most future-dated rows live** — the week view alone is a 5-day window. Read both every run.

Source id: `gigs-news`. Coverage: Stockport / Greater Manchester / East Cheshire / Derbyshire fringe.

**FIRST ACTION EVERY RUN: establish today's date** (`date +%Y-%m-%d`, or the device clock if no shell) — the week view is written in relative terms ("Tomorrow", "This Friday") and cannot be parsed without it.

**IMPORT HORIZON — SOURCE-SPECIFIC (ported from original prompt, narrower than runbook §5.5):** week-view rows: **today → +14 days only**, focusing the coming Thu–Sun. Ignore anything beyond ~2 weeks in the week view — it re-renders weekly and later rows arrive in their own week. **The branded.htm forward list is EXEMPT** — take it to the full 12-month runbook horizon, since it is a stable published list, not a rolling window.

**CHROME IS MANDATORY.** Load tools first via ToolSearch (`select:mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__tabs_context_mcp`), then navigate + get_page_text. **If Chrome is not connected: STOP and report the blocker. Do NOT fall back to web fetch** — it returns an unrendered shell — and do not touch bndy.

## Snapshot & diff (runbook §5.7, TWO-SIDED)
`Projects/bndy/gigs-news-last-page.txt` — **two-section format**: `=== SECTION 1: WEEK VIEW ===` (day headers + `act - venue` rows verbatim) then `=== SECTION 2: BRANDED/RESERVED FORWARD LIST ===` (`date - venue postcode - label` rows). Normalise the fresh capture to the same shape before diffing. Added future rows → pipeline. Removed future rows → §0.17 v1.9. Changed rows → edit via externalId.
- externalIds: `{source: "gigs-news", id: "<date>-<artist-slug>-<venue-slug>"}` (no stable row ids on site).
- Week-view rows are relative ("This Friday") — resolve against run date.

## branded / Reserved — ONE artist (Jason ruling 2026-07-29)
**"Reserved" is NOT a separate act.** It is the dep line-up that plays when branded are short 2–3 members (their own page says so). Both map to the single artist **branded** `rwDw320gku5uQ4gzaU2N`.
- Rows labelled `Reserved` → artist branded, event title **"branded (Reserved) @ «Venue»"**.
- Rows labelled `branded` / `Branded` → artist branded, normal title.
- Rows reading "looking for a venue / cancellation" → NOT a gig, skip + log.
- Rows marked cancelled in the source (e.g. "(cancelled - United match)") → never import.

## Reject filter (apply before the pipeline)
Reject and log, never import: open mics, jams, karaoke, quiz/bingo, **DJ-only nights**, discos, **"to be confirmed"/TBC**, "live bands" with no named act, blank act rows (`- the Swan Inn Wilmslow`), theme nights with no performer ("Jazz Night", "Rocking 60s"), and time-only rows (`10pm - Mash Guru`).
- **"Jazz at the Railway"** — recurring jazz night, not a single gig → always skip.
- ⚠ **"branded" IS A REAL BAND NAME, not a stray word or a formatting artifact.** Never skip a row because the act name is lowercase "branded". (Carried from the original prompt — this has tripped runs before.)

## Known mappings — reuse, never review, never create twins
**Venues:** "Railway", Greenfield → `NwEtqexKQqLHyBcPVgJF` (dup history — never create another) · "Mash Guru" → bndy **Mash** · "Ashton Jubilee Club" → **Jubilee Club, Ashton-in-Makerfield** `49bc4606-97d7-45a5-a693-a887ac2f0810` (WN4 9SL confirmed 2026-07-29 — the old "wrong Ashton" warning is RESOLVED, it genuinely is the Wigan-side club) · "the Crown Heaton Moor" → **The Crown**, 98 Heaton Moor Rd `xyERKljjDSlCFaYKMWPH` · "The Crown Inn Stockport" → **The Crown Inn**, 154 Heaton Ln `f54d4cbe-e6f1-4bb0-9c9d-03c6c9d78470` (DIFFERENT PUB — do not conflate) · "Kings Arms Hotel Wilmslow" → `qBVuL2CvXckaG1hbzzEH` · "Stockport Town Hall Tavern" → **Town Hall Tavern** `BmQg5orKKV613HpsCjge` · "the Welcome Inn Whitefield" → **Welcome Inn**, Prestwich `FXQKvDaexNQj53yl4icf` · "Hare & Hounds New Mills" → `i0ZMEN0agqL6JOTMhSEm` · "Marple Con & Social Club" → `bbzzpFPYsOVE4bcHU60s`.
**Artist billing/name aliases:** "Bash Bailey & friends" → **Bash Bailey** · "Charlie Whittaker Back-Up band" → **Charlie Whittaker** · "Smudge duo" → **Smudge** (ADR-023) · "Live Jukebox" is West O' the Moon's show format, not an act — artist = **West O' the Moon**, format stays in the title. Cross-source alias tables apply (Danny Brab et al. in KLMA-TASK-v2).
**More venue aliases (ported from original prompt):** "Bulls Head" → **The Bull's Head** · "Marple Con & Social Club" → **Marple Con Club**.
**Cross-region:** "Trilogy Rock Band" and "Lee Michaels" also appear in NE/Stoke sources — mandatory §1A footprint check before matching or creating.

## Source defaults (ported from original prompt)
- **No artist-location default.** Greater Manchester, East Cheshire or any gig/venue town is source-footprint evidence only. Set canonical artist location only when an official or first-party source states it; otherwise leave it blank and preserve the footprint in the run ledger. Do not use "UK wide" as a substitute for unknown.
- **Search discipline before accepting "new"**: the server resolver decides, but when pre-checking, search at minConfidence 25–80 AND the bare-core variant (strip Band/Duo/Trio/Live/Acoustic/Music) AND a spelling-normalised form for short/odd names. A same/near name already sitting in Greater Manchester / North West is a prior run's record — reuse it (§1A), don't create a twin.
- **Start times**: runbook §5.6 day-based defaults apply (Fri/Sat 21:00, Sun 19:00, afternoon 14:00, other weekdays 20:00) — this SUPERSEDES the original prompt's flat 20:00. Flag every defaulted time in the report.

## Source gotchas
- Client-render means partial loads happen — verify the listing count looks sane vs the snapshot before diffing; a half-rendered page is not "everything got cancelled" (§0.17). Fail closed if it looks truncated.
- The week view and the branded list describe the same gigs at different granularity — resolve aliases FIRST so the event gate catches the overlap as a bounce.
- Venue town labels can be wrong-side-of-border (Barge Inn Long Eaton shows "Nottingham") — trust place_id, not the label.

## Caps + report
Max 50 creates/run (§6). Enrich-inline mandatory (§2A.3 tightened: FB search in Chrome + page VISIT — act's own page name wins, graph avatars only, page-stated location beats gig-town inference). Mandatory run report: counts, ids, staged items, every 409/422 verbatim, defaulted times, snapshot delta.

## Hard reminders
No identity judgment (§0.2) · obey every bounce (§0.9) · owner-managed untouchable (§0.16) · blank beats wrong, and empty beats a wrong default (§0.18 outranks the actType default) · never create/re-enable schedules (§0.1).
