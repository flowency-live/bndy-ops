# KLMA-STOKE DAILY IMPORT — TASK DEFINITION v2.2 (2026-07-30)

## Artist location is evidence-only
**The Rigger** (Newcastle-under-Lyme, `YOMsEVdj9Y7OMMy88HFV`) · **Eleven** (Sandyford, `8Pky4flebxSt2s36ub3o`) · **Artisan Tap** (Hartshill, `CoS3G3Jr9djE4WSWQqkz`) are clear examples of venues that book touring acts, but the rule applies to every venue. A gig town is source-footprint evidence, not proof of the Artist's canonical home. Set Artist location only when an official or first-party source states it. Otherwise leave it blank; do not substitute the venue town or "UK wide".

**SUBORDINATE TO `MASTER-IMPORT-RUNBOOK.md` (v1.6+). The runbook wins on any conflict. This file holds ONLY the KLMA-specific procedure and parsing quirks.** Replaces every previous KLMA task file. Scheduling this task is Jason-only; until he does, it runs solely as a supervised one-off with him present.

**OUTPUT CONTRACT:** Every run MUST also comply with `RUN-CONTRACT.md` v2.0+ and emit a valid append-only record under `run-ledger/`, including enrichment and canonical read-back evidence.

## Source
KLMA Stoke gig list (Google Sheet). Source id for provenance: `klma-stoke-gig-list`.
- CSV export is BLOCKED (googleusercontent redirect not allowlisted) → use the **gviz endpoint with `?tqx=out:html`** read via Chrome page text (`out:csv` triggers a download Chrome can't read). Re-align columns (headers can shift; verify column mapping against a known row before parsing). Leading cell may be a float row-id (`46225.64455`) OR a form timestamp (`18/11/2025 18:32:18`) — strip both forms before comparing.
- Snapshot diff (runbook §5.7, TWO-SIDED): compare against `Projects/bndy/klma-last-page.txt` — **snapshot is stored in the same out:html page-text format as the capture** (v2.1; the old CSV-format snapshot caused 15 false "removed" rows on 2026-07-29). Added future rows → pipeline below. Removed future rows → cancellation candidates per §5.7 (verify absence isn't format noise; look up by externalId; surface, never silently delete). Past rows dropping off the top are normal. Write the new snapshot at the end of every run.
- Junk rows to skip every run: header rows dated `1/1/0125`, `1/4/0202`, `1/5/2026` (form links) and any far-future placeholder (e.g. a bare 2027 date with no artist).
- Covers Stoke/Staffs/South Cheshire incl. **Cosey Club (Crewe) — KNOWN OFFENDER: its billing lines carry promo copy and descriptions** ("Cyril Blake 60s & 70s Band - It'll Be Fun! All Aboard!!"). Every KLMA billing gets sanitized; Cosey Club rows doubly so.

## Per-row pipeline (mechanical — no judgment calls; unsure = stage, cite the runbook §)

1. **Sanitize the billing** (runbook §0.6): strip everything after ` - `/`–` that reads as description/promo (`sanitizeBillingName` behaviour). "Not Guilty - 5pc Local Rock/pop Covers Band" → "Not Guilty".
2. **Split lineups** (§0.3/§4): `,` `+` `vs` `ft.` etc. → individual acts. Unnameable acts ("+2 more", "TBA") exist only in the event title, never as records. NEVER create a lineup-named artist — the API will bounce it anyway (LINEUP_NAME).
3. **Venue** (§3): `search_venue(name, city)`; verify city; no match → `create_venue(name, address, city)` — never invent a town; result-name mismatch = reject + stage. Known mappings live in this file's Gotchas.
4. **Artist, per act** (§1A + §2A — ENRICH BEFORE DECIDE):
   - If a same/near-name candidate may exist → run §2A identity research FIRST; pass a `facebookUrl` only when the page is tied to the same act by exact gig footprint, first-party cross-linking or equivalent evidence. Name similarity alone is insufficient.
   - `create_artist(name, artistType, location?, facebookUrl?)` → include location only when an official or first-party source states it; never pass the venue town as the Artist location. The server resolver decides: `matched` → use that id · `review` → STAGE with candidates, create nothing · `created` → §2A enrichment top-up (actType via edit_artist, genres) · **409/422 → use the existing id / fix the input. NEVER retry with a varied name (§0.9).**
5. **Event, per act** (§4 interim + §5): one discrete event per artist. `create_event(artistId, venueId, date YYYY-MM-DD ≤12 months out, startTime, isPublic: true, title "«Artist» @ «Venue»", externalIds: [{source: "klma-stoke-gig-list", id: "<stable row hash>"}])`. Multi-act bills: log sibling event ids in the run report (parent events attach retroactively when built). 409 → event exists: top-up missing fields (ticketUrl/price/times) on the EXISTING event only.
6. **Verify every write** with get_by_id (§0.10).

## Row filter
Future dates only (§0.14; past gigs may be spidered for discovery leads, never imported). Reject rows per the accept/reject filter (§6): no karaoke/quiz/bingo/disco/unnamed "live music". Cancelled/removed rows → per §0.17 v1.9: DELETE the event via the API route when it's klma-only-sourced, non-owner, and its absence is confirmed against the full capture; otherwise log. Never an artist named "Cancelled" (server bounces it regardless).

## Caps + report (§6)
Max 50 creates/run — stop cleanly at cap. MANDATORY run report (chat + external file, never in bndy fields): created/matched/review/bounced counts with ids, every staged item + reason, every 409/422 verbatim, snapshot delta size. Any gate bounce is a SUCCESS SIGNAL of the system working — report it, don't fight it.

## Known artist billing aliases (learned mappings — reuse, never review, never create)
- "Danny & Friends" / "Danny Brab & Friends" / "Danny Brab" → artist **Danny Brab** (`FIT600aoQ5lpNSejGctN`). The billing goes in the EVENT TITLE; the artist is always Danny Brab. (Jason ruling 2026-07-29. Applies to EVERY source, not just KLMA — canonical home for these mappings is the artist's nameVariants once server support lands; until then this table.)
- "Rachel Shenton Clubland" / "Rachel Shenton Club Anthems" / "One Woman Rock Show" → artist **Rachel Shenton** (`vOcRqNQmZpVLd5T4X5o9`). Show-name billings; billing in event title only. (Jason ruling 2026-07-29 — stands until she manages her own acts.)
- "Tanky/Electrifying 80's show" → artist **Tanky/Electrifying 80's show** (`a603777d-25f1-4f4c-9d13-866a4a0fe49c`) — FULL name kept verbatim per runbook §2A.5 (it's the act's own FB page name: facebook.com/p/TankyElectrifying-80s-show-61555856745370). Never strip, never review. Variant sighted: "Tanky's Electrifying 80s".
- "Trilogy Rock Band" (Stoke-area rows) → existing artist `XJ2gV4N1qIe6vK2R562Q` (labelled "North West UK" but footprint is Stoke/South Cheshire — 2026-07-29 footprint check). NOT "Trilogy" (Newcastle upon Tyne, North East) and NOT "Trilo3y" (Stockport).
- "So Oasis" / "Sooasis" → same act, one artist record (`80bd40ed-a17b-48cf-b57c-74a627867e48`, normalised keys identical); correct display name pending Jason review.
- "The VANZ ROXX <venue>" → artist **The Vanz** (`7a16a3b6-ed61-4d0f-8191-1d89fdcf440f`); "ROXX" is promo. Vanz gigs frequently pre-exist via the 2026-05-04 poster import → expect DUPLICATE_EVENT bounces (success signals).

## Known venue mappings (learned — reuse, never create twins)
- "Capello lounge Newcastle" → **Cappello Lounge** (`49b346cb-d42f-4a10-8fd6-22533c18f2df`) — note double-p; place_id match.
- "The plough Bignal end" → **The Plough Inn**, Bignall End (`39d65c32-cd5c-4520-9bd3-b8bc41ba11d4`) — Google Places listing name was junk ("2022 - Plough Inn Bignall End"), renamed per Jason 2026-07-29.
- "Ye Olde Crown Burslemmy" → **Ye Olde Crown**, Burslem (`Rf2j76jAGsoRR93vc1pi`) — source typo.
- "Shoulder, Fulford" → **Shoulder of Mutton**, Fulford (`CqOZyc9DQrO7jxNwouKA`).
- "Bushfest / The Bush at Brown Edge / The Bush" → **The Bush At Brown Edge** (`YUno720qqVNIwH0wgAob`).

## KLMA gotchas (carried forward)
- gviz column re-alignment (see Source above).
- `delete_event` may 401 → set `isPublic:false` + flag for manual delete instead.
- Billing descriptions in the act column are the norm, not the exception — sanitize first, always.
- 24-48h search-index lag: check the previous run reports for records too new to be indexed before concluding "new".

## Hard reminders
No judgment on identity — the backend resolver decides (§0.2). Owner-managed records untouchable (§0.16). Blank beats wrong on enrichment (§2A). This task NEVER creates or re-enables schedules (§0.1).
