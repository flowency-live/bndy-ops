# Bv2a Enrichment — Run Report 18 (2026-08-15)

Run id: `bv2a-enrichment-2026-08-15T18-18-09Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-17 (COMPLETED, `30 records · 7 clean · 0 FAIL · 46 WARN`), RUN-REPORT-16 (COMPLETED, `38 records · 18 clean · 0 FAIL · 41 WARN`), RUN-REPORT-15 (STOPPED, locked, zero writes, no validator run). 0 of 3 recorded a FAIL. All three exist as reports. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read before any other action: `{"heldBy":null,"releasedAt":"2026-08-15T17:32:00Z",...}` — released. No `data\state\enrichment.lock` file present (and would not have been honoured if present, per §6A step 2b / v2.14). Acquired cleanly: `heldBy: bv2a-enrichment-2026-08-15T18-18-09Z`, `expiresAt: 2026-08-15T21:18:09Z` (3h TTL per §6G), `heartbeatFile: data\state\heartbeat\bv2a-enrichment-2026-08-15T18-18-09Z.json`. Heartbeat written first with `outcome:"started"`.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6B platform facts, §6D-§6E, §6F/§6G concurrency, §7 changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints noted below.

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`). Chrome: exactly one connected browser, logged into Facebook (confirmed via `facebook.com` home feed showing "What's on your mind, Jason?").

## Step 4 — Candidate selection

1. Artists created in last 24h with missing socials: 16 found (`list_artists createdSince=2026-08-14T18:18Z missingSocials=true`). One (`Danny & Friends`, `d27e100b…`) skipped — already an open CTO-INBOX fingerprint as a duplicate of Danny Brab pending merge; enriching it ahead of that merge is wasted work. 15 of the remaining 15 processed (budget cap).
2. Venues created in last 24h with missing socials: 0 found.
3. Backlog venues missing socials, oldest `createdAt` first: sampled the first 100 of 805 (`list_venues missingSocials=true limit=100 offset=0` — the API does not return in created-order, so this is a 100-record sample, not a guaranteed-global-oldest-30; noted as a judgment call). Sorted client-side; oldest 30 taken, with 2 swapped out (`Venue TBC` — §0.23 named non-place, `Okehampton Show ground` — §0.23 non-fixed-building) and replaced from position 31/36 in the sort. 4 of the 30 turned out to have already been processed by an earlier firing today (17:18–17:35Z window) with the same blank outcome — re-derived independently, same conclusion, logged as duplicate effort below, not a data problem.

## Step 5 — Work done

### Venues — 30 processed, 21 verified, 9 evidenced blank

Verified (facebookUrl and/or website written, both surfaces checked via WebSearch per FP.2 — no Chrome needed):

| Venue | Field(s) | Source |
|---|---|---|
| Darley Park (Derby) | website, facebookUrl | facebook.com/DarleyPark |
| The Princess Royal (Sheffield) | facebookUrl | facebook.com/theprincessroyalpub |
| Beyond The Pale (Leek) | website, facebookUrl | facebook.com/beyondthepaleleek |
| The low moor club (Bradford) | website | lowmoorclub.com |
| Oak & Ivy (Burton upon Trent) | website, facebookUrl | facebook.com/p/The-Oak-and-Ivy-at-Burton-100037550726461 |
| Secret Garden Leisure (Wisbech) | website, facebookUrl | facebook.com/thesecretgardenwisbech |
| Ship & Bell Hotel (Horndean) | website, facebookUrl | facebook.com/p/The-Ship-and-Bell-Horndean-100082990556257 |
| Ladybarn Social Club (Manchester) | facebookUrl | facebook.com/ladybarnsocialclub |
| The Black Lion, Consall Forge | website, facebookUrl | facebook.com/blacklionconsallforge |
| Barbican Theatre (Plymouth) | website, facebookUrl | facebook.com/BarbicanTheatrePlymouth |
| Leadworks (Plymouth) | facebookUrl | facebook.com/LeadworksProjects |
| The Yarcombe Inn | facebookUrl | facebook.com/p/The-Yarcombe-Inn-61575420615799 |
| Newton Abbot Racecourse | website, facebookUrl | facebook.com/NewtonAbbotRacecourse |
| Bullers Arms (Looe) | facebookUrl | facebook.com/p/The-Bullers-Arms-Looe-61576921690595 |
| Looe Social Club | facebookUrl | facebook.com/looesocialclubofficial |
| The Tamar Inn (Calstock) | website, facebookUrl | facebook.com/TheTamarInn |
| The Lord Nelson Pub & Kitchen (Topsham) | website, facebookUrl | facebook.com/TheLordNelsonPubandKitchen |
| The York Inn (Exmouth) | facebookUrl | facebook.com/theyorkinn |
| Sidmouth Conservative Club | website, facebookUrl | facebook.com/SidmouthConservativeClub |
| Bodmin Band & Social Club | website, facebookUrl | facebook.com/bodminbandandsocialclub |
| Bosvena Events Arts Theatre (The BEAT), Bodmin | website, facebookUrl | facebook.com/bosvenaeventsartstheatre |

Evidenced blank (WebSearch tried, town/postcode did not corroborate a candidate page, or no page found — variants in the evidence file):

West End Club (Stapleford) · Ann Welfare Playing Fields (Annitsford) · Annitsford Welfare Club · Hayfield Club · Tudor Nook, Cheadle (found "Tudor House Crafts", a different business in the same building — not attached) · Canal Tavern (Kidsgrove) · W P M Sports & Social Club (Gosport — only a sub-team page "WPM Titans" found, not the club's own page) · Jubilee Park (Horndean) · The Saracens Head (Newton Abbot).

Of these, 4 (Darley Park's blank predecessor — no, corrected: **Hayfield Club, Jubilee Park, The Saracens Head, and Darley Park's own record**) were independently re-processed this firing without realising an earlier firing today (17:18–17:35Z) had already reached the same blank/verified conclusion on 3 of them and a *different* (also-blank) conclusion basis on the 4th (Darley Park was blank at 17:35Z, verified at 18:21Z this firing — this firing found the "Derby Parks" council page and judged it close enough on address; the earlier firing had rejected it as "not confidently this specific venue". **Flagging this disagreement rather than silently preferring my own conclusion** — see CTO-INBOX below.

### Artists — 15 processed, 1 verified, 2 identified-but-write-blocked, 12 evidenced blank

**Verified:** Bound By Burdens (`575f7f51…`) — facebookUrl, instagramUrl, profileImageUrl, bio all written and read back. Identity: Facebook category "Musician/band", page location "Newcastle under Lyme" (exact match to stored "Staffordshire UK"), bio quoted verbatim with line breaks and member list preserved from the page's own Bio tab.

**Identified, evidence captured, but the bndy write itself failed — NOT part of the shipped batch:**
- Tanky (`9df6bcf2…`) — found `facebook.com/profile.php?id=61555856745370` ("Tanky/Electrifying 80's show"), bio byte-identical to the record's existing stored bio (Tier A evidence). `edit_artist(facebookUrl=...)` returned **HTTP 409 Duplicate artist** — reproduces the known, still-open fingerprint `bv2a-edit-artist-409-on-facebookurl-write` (first raised against Tanky, 06:46Z firing today).
- Nu Call (`c488fd88…`) — found `facebook.com/lastcallswindon` ("NU CALL - Nu-Metal Tribute Band"), bio byte-identical. Same `edit_artist(facebookUrl=...)` call returned **HTTP 409 Duplicate artist** — also already logged against this record (07:20Z firing today), reproduced again here.
- **New this firing: isolated the defect to the field, not the record.** On Nu Call, `edit_artist(websiteUrl=<throwaway test value>)` succeeded immediately and was then reverted to empty (also succeeded). `search_artist("Nu Call")` returns exactly one match (itself, 100% confidence) — no genuine name collision exists to explain a "duplicate". **The 409 fires specifically on a `facebookUrl` write to these two records, not on edits to them generally, and not because of a real duplicate.** This is a sharper diagnosis than either prior firing had — logged to CTO-INBOX as a refinement of the existing fingerprint, not a new one.

**Evidenced blank** (WebSearch + Facebook page search both tried per §2A.1 item 3b; no candidate met the identification bar): Dave Legg · Northwestern · Paul Gibson · Morning's Thief · Rob Black (a plausibly-related "Rob Black Band" page found, `facebook.com/robblackmusic`, but no location evidence ties it to this record and the artistType doesn't match — solo vs band — so left blank rather than risk a wrong link) · Charlotte · Laura Evans · Vulgaris (`facebook.com/VBANDUK` found, category "Band", but bio is a bare link-in-bio with no location — Tier C evidence only, insufficient) · Die Ego · Jorge Wilson · The Complaint That Creeps.

**Bring Me The Horizon UK** (`ba67daa6…`) — deliberately not searched further after establishing the name collides with the real, globally famous Bring Me the Horizon (Sheffield) and at least one distinct UK tribute act trading under a near-identical name. Left blank; recommend adding to the ENRICHMENT-TASK-v3 §5.4 do-not-attach list.

## Validator

Built via the standing workaround pattern (`data\state\build_validator_input_run1809.py`) — venue `socialMediaUrls[0].url`/`website` aliased to top-level `facebookUrl`, `city` aliased to `location`; `venueId` evidence lines aliased to `artistId` — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints. Tanky and Nu Call **excluded** from validator input entirely — nothing was persisted to bndy for either, so they are not part of a batch that "ships".

**Validator summary line (verbatim): `43 records · 22 clean · 0 FAIL · 43 WARN   [mode=gate]`**

All 43 WARNs are `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 21 verified venues (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch, per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding) plus one `NAME_BILLING` on "Bosvena Events Arts Theatre (The BEAT)" for its parenthetical — a pre-existing, correct venue name, not something written this firing.

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## CTO-INBOX — new entries this firing

1. **Refinement of `bv2a-edit-artist-409-on-facebookurl-write`** (not a new fingerprint — appended evidence to the existing line): isolated the 409 to the `facebookUrl` field specifically on Nu Call — a `websiteUrl` write to the same record succeeds and `search_artist` confirms no real name collision. Worth an engineering look at the `facebookUrl` uniqueness/duplicate check rather than continued manual retries on these two records.
2. **`bv2a-firing18-darley-park-blank-then-verified-disagreement`** — firing at 17:18–17:35Z recorded Darley Park (`beb9fcaa…`) as an evidenced blank ("only a generic council page, not confidently this specific venue"); this firing (18:18Z) attached `facebook.com/DarleyPark` as verified, judging the exact address/phone match sufficient. Both evidence lines are preserved in the append-only evidence file. Flagging the disagreement rather than silently overriding — worth a human sanity check on which call was right, since a wrong Facebook attach on a council park page is public-facing.
3. **`bv2a-oldest-backlog-not-globally-sorted`** — `list_venues`/`list_artists` do not return results in `createdAt` order, so "oldest backlog first" (task prompt priority 3/4) can only be approximated by sampling a page and sorting client-side, not guaranteed globally oldest. Noted for future firings; not a blocker.

## Budget

30/30 venues, 15/15 artists (of which 1 verified-written, 2 identified-but-blocked-by-a-write-defect, 12 evidenced blank). Circuit breaker did not fire. Wall-clock: approximately 18:18:09Z to 18:34Z (~16 minutes), well inside the 40-minute budget.
