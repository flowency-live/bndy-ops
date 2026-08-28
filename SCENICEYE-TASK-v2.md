# SCENIC EYE WEEKLY IMPORT — TASK DEFINITION v2.1 (2026-07-30 — v2.0 plus everything ported from the original scheduled-task prompt)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.10+). The runbook wins on any conflict. This file holds ONLY Scenic Eye-specific procedure and quirks.** Replaces every previous sceniceye task file. Scheduling is Jason-only.

**OUTPUT CONTRACT:** Every run MUST also comply with `RUN-CONTRACT.md` v2.0+ and emit a valid append-only record under `run-ledger/`, including enrichment and canonical read-back evidence.

## Source
- **sceniceye.co.uk is a FRAMESET with no readable content** — the real guide lives at **scenicmind.co.uk/sceniceye**; navigate there directly.
- Weekly Thu–Sun guide. Region: Hampshire — Havant / Waterlooville / Emsworth / Hayling Island / Rowlands Castle / Westbourne. Source id: `sceniceye`.
- Listings carry **full addresses and explicit times — use them** (geocoding is reliable here; "no town" is rare).
- Snapshot diff (§5.7 two-sided): `Projects/bndy/sceniceye-last-page.txt`, pipe rows `date | act | venue | time`; write the new snapshot every run.

**FIRST ACTION EVERY RUN: establish today's date** (`date +%Y-%m-%d`, or the device clock if no shell). Everything below depends on it.

**IMPORT HORIZON — SOURCE-SPECIFIC (ported, narrower than runbook §5.5): today → +14 days**, focusing the coming Thu–Sun. This is a rolling weekly guide, not a forward listing — later gigs arrive in their own week.

⚠ **STALE-WEEK TRAP: the page frequently shows a PAST week's guide.** Verify the listed dates are the upcoming Thu–Sun BEFORE processing. Past-dated → import NOTHING (§0.14), report "stale source week" and stop cleanly. (Fired correctly on 2026-07-29: the 23–29 Jul edition was still live at 23:50 — zero imports, correct behaviour.)

**CHROME IS MANDATORY.** Load tools first via ToolSearch (`select:mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__tabs_context_mcp`), then navigate + get_page_text. **If Chrome is not connected: STOP and report the blocker. Do NOT fall back to web fetch, and do not touch bndy.**

## Skip list
Open-mic / jam / karaoke, DJ-only, "to be confirmed", and every past-dated entry (this guide repeats past weeks — see stale-week trap).

## Per-listing pipeline
Identical to KLMA-TASK-v2 (sanitize billing → split lineups → venue §3 → artist §1A/§2A enrich-before-decide → one discrete event per artist §4/§5 → verify §0.10). Source specifics:
- **Venues**: full address given → `create_venue(name, full address)` geocodes reliably. No town → skip + flag (rare).
- **Artists**: search at minConfidence 80 AND the bare-core variant (strip Band/Duo/Trio/Live/Acoustic/Music) AND a spelling-normalised form for short/odd names (**"Pheonix" ≈ "Phoenix"**). **A same/near name already sitting in Hampshire/Portsmouth is a prior run's record — REUSE it even at 70–89%, even when the gig town differs.** This region has a documented duplicate history.
- **No artist-location default.** A Hampshire or Portsmouth gig is source-footprint evidence only. Set canonical location only when an official or first-party source states it; otherwise leave it blank and preserve the footprint in the run ledger.
- **Ticket markers**: strip any "🎫Ticket" marker out of the artist/title text and set `ticketed: true` instead — never let the marker reach a name field (§0.6).
- **Times**: explicit in this source; `startTime` is required. Defaults (§5.6) should almost never be needed — flag if used.
- externalIds: `{source: "sceniceye", id: "<date>-<artist-slug>-<venue-slug>"}`.

## Rule conflict — RESOLVED IN FAVOUR OF THE RUNBOOK
The original prompt said multi-artist specials (e.g. an "80s Garden Party") should be ONE event with `artistIds: [all acts]`. **Runbook §4 supersedes this: one DISCRETE event per artist**, with the special's own title carried on each child and sibling ids listed in the run report for retroactive parent attachment. Do not create lumped multi-artist events.

## Source history — read before running (this source caused the 2026-07-12 incident)
The old task created duplicate artists AND duplicate PUBLIC events (Emily Martine / Peludo "Puludo" Beach / The Shadders ×2, Golden Lion Havant venue ×2) — precisely what the gates now bounce. Expect 409s on re-listed gigs: they are SUCCESS signals; use the existing ids and top-up (§0.9).
- **"Puludo" is a known source typo for Peludo Beach** — same act (alias class).
- **Venue "Golden Lion" exists in many towns (§3.4)** — Havant's is the local one; always confirm city/place_id.

## OPEN — needs Jason's ruling before the next run
**Hi Fest (Hayling Island, multi-venue weekender)** appeared across the 25–26 Jul edition — ~40 named acts in 45-minute slots across 6 venues. Jason's "ignore festivals" ruling was given for Fantastical Library; it has NOT been confirmed for this source, where the "festival" is really a normal night at six ordinary pubs. Until ruled: **import the individual pub slots as normal gigs** (they are named act + real venue + real time), and do not create any festival container. Acts captured as discovery leads in SCENICEYE-RUN-REPORT-2026-07-29.md.

## Caps + report
Max 50 creates (§6). Enrich-inline mandatory (§2A.3 tightened: FB search in Chrome + page VISIT; UK-only, never a foreign same-name act; try variants + "Hampshire"/"Portsmouth"). Mandatory TIGHT run report — counts, ids, staged items, every 409/422 verbatim, defaulted times, stale-week check result, snapshot delta. Counts + anomalies only.

## Hard reminders
No identity judgment (§0.2) · obey every bounce (§0.9) · owner-managed untouchable (§0.16) · blank beats wrong, and empty beats a wrong default (§0.18 outranks the actType default) · never create/re-enable schedules (§0.1) · never write QA notes into bndy fields (§0.12).
