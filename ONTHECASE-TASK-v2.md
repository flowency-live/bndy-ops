# ON THE CASE DAILY IMPORT — TASK DEFINITION v2.2 (2026-07-30 — v2.1 plus everything ported from the original scheduled-task prompt)

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.10+). The runbook wins on any conflict. This file holds ONLY OnTheCase-specific procedure and quirks.** Replaces every previous onthecase task file. Scheduling is Jason-only.

## Source
- Site: **onthecasemusic.co.uk/gigs** (North East England feed: Newcastle / Gateshead / Sunderland / Northumberland / Co. Durham). Source id for provenance: `onthecasemusic`.
- **CLIENT-RENDERED — Chrome is mandatory.** Load tools first via ToolSearch (`select:mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__tabs_context_mcp`), then navigate + get_page_text. **If Chrome is not connected: STOP and report the blocker. Do NOT fall back to web fetch, and do not touch bndy.**
- **FIRST ACTION EVERY RUN: establish today's date** (`date +%Y-%m-%d`, or the device clock if no shell).
- **PAGE FORMAT per gig (ported):** line 1 `<Artist> at <Venue> <Town>`; line 2 the address `Street / Town / phone`; line 3 `TIME / PRICE` (FREE or £x). **Take the venue town from the ADDRESS line, not the title** — the title's trailing town is unreliable. A £ price → `ticketed: true`.
- Listings include **explicit times and prices — use them** (no defaults needed where given; price goes on the event).
- **SKIP list (ported):** "Buskers night", open-mic / jam / karaoke, DJ-only, "to be confirmed".
- Snapshot diff (runbook §5.7, TWO-SIDED): `Projects/bndy/onthecase-last-page.txt` — **snapshot stored as normalised pipe rows ("Artist at Venue | address | time / price" under "Weekday DD Month YYYY" headers), the FULL feed including beyond-horizon rows** — normalise the fresh capture to the same shape before diffing. Added future rows → pipeline; removed future rows → §0.17 v1.9 (delete when this-source-only + non-owner + absence confirmed); changed rows → EDIT via externalId. The feed publishes ~17 months ahead — import only ≤12 months (§5.5); beyond-horizon rows stay in the snapshot and enter via later diffs. "to be confirmed" rows are dropped (§0.4).

## Per-listing pipeline (identical to KLMA-TASK-v2 §pipeline — sanitize billing → split lineups → venue §3 → artist §1A/§2A enrich-before-decide → one discrete event per artist §4/§5 → verify §0.10). Differences only:
- Times/prices explicit → carry them; missing time → runbook §5.6 defaults, flagged (this SUPERSEDES the original prompt's flat 20:00).
- externalIds: `{source: "onthecasemusic", id: "<date>-<artist-slug>-<venue-slug>"}`.
- Artist locations: NE towns — canonical region North East; store the town (§1A.1 city preferred). **Fallback default when §2A evidence gives nothing: "North East UK", locationType `regional`** (ported).
- **Artist search discipline (ported):** search at minConfidence 80 AND the bare-core variant (strip Band/Duo/Trio/Live/Acoustic/Music) AND a spelling-normalised form for short/odd names. **A same/near name already in the North East is a prior run's record — REUSE it even at 70–89%, even when the gig town differs.**
- **Venue town is never invented** — no town on the address line → skip + flag (§0.8).

## Known venue mappings (learned — reuse, never review, never create twins)
- "Sea Horse" → bndy **Seahorse Sports Bar**
- "New Hartley SMC" → bndy **New Hartley Memorial Hall**
- "Crook Hotel" → bndy venue `de040d70` (has known dup history — always use this id)
- ⚠ "George Stephenson" previously mis-resolved to a SCHOOL — verify the Google result is a pub/venue before accepting (§3.4 name-agreement rule).
- Artist billing aliases: check all source task files' alias tables (they apply across sources).

## Learned mappings from the 2026-07-29 full run (reuse — never review, never create twins)
- Venues: "Murton Officials Club Seaham" → **Murton Club (Official)** 05272a47 · "Fat Ox Whitley Bay" → **Fat Ox Hotel** f4712549 · "Bridlepath Whickham" → **The Bridle Path** 05c443b1 · "Easington Colliery WMC" → **Easington Colliery Club & Institute** 758d8dc5 · "Clennel Hall Rothbury Bike Night" → **Clennell Hall Country House** 1f0ec1cc · "Sea Horse Club at Whitley Bay FC" → **Seahorse Sports Bar** a5f246ed · "New Hartley SMC" → **New Hartley Memorial Hall** 2a48a6a4 (SMC twin deleted 2026-07-29 — never recreate).
- Billing aliases (Jason rulings): "Russ Tippins Electric Band" → **Russ Tippins** d00d1abd · "Dogs In A Box Duo" → **Dog In A Box** e9e0b454 · "Rock & Roll Preachers" / "Rock n Roll Preachers" → **Rock and Roll Preachers** 1382449f · "Mad Manners - One Man Madness Show" → **Mad Manners** 8c4c7181. Billing goes in the EVENT TITLE only.
- "Riff Raff" (NE rows) → existing NW record **b88a13b3** — cross-region touring band, footprint-proven; never create a NE twin.
- "Rock Doctors" → **The Rock Doctors** (bae7bce9) — RESOLVED 2026-07-29: Jason supplied their FB group (facebook.com/groups/2200574380736709) whose upcoming event was the exact Ox & Plough row; footprint NE (Schooner Gateshead, Red Lion Earsdon); record renamed + relocated NE, was mislabelled "North West UK". Reuse always.
- "Undecided Acoustic Duo" — SKIPPED per Jason 2026-07-29: do not create; skip its rows until further ruling.

## HORIZON — note the deliberate difference from the original prompt
The original prompt said today → +14 days. **This source is NOT a rolling window** — it publishes ~17 months of forward dates in one page, and the 2026-07-29 full run imported 238 gigs to the 12-month runbook horizon (§5.5). Keep **§5.5's 12 months**: a 14-day cut here would silently drop the bulk of the feed, then re-discover it as "new" every night. Beyond-12-month rows stay in the snapshot and enter via later diffs.

## Caps + report
Per runbook §6: max 50 creates, mandatory TIGHT run report — counts, ids, staged items, every 409/422 verbatim, defaulted times, snapshot delta. Counts + anomalies only. Save the fetched listing to `Projects/bndy/onthecase-last-page.txt` before reporting.

## Hard reminders
No identity judgment (§0.2) · obey every bounce (§0.9) · owner-managed untouchable (§0.16) · blank beats wrong (§2A) · never create/re-enable schedules (§0.1).
