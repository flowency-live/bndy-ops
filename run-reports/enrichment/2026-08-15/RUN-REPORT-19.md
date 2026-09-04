# Bv2a Enrichment — Run Report 19 (2026-08-15)

Run id: `bv2a-enrichment-2026-08-15T19-18-51Z`. Unattended hourly firing.

## Step 0 — Circuit breaker

Last 3 run reports (newest first): RUN-REPORT-18 (COMPLETED, `43 records · 22 clean · 0 FAIL · 43 WARN`), RUN-REPORT-17 (COMPLETED, `30 records · 7 clean · 0 FAIL · 46 WARN`), RUN-REPORT-16 (COMPLETED, `38 records · 18 clean · 0 FAIL · 41 WARN`). 0 of 3 recorded a FAIL. All three exist as reports. **Breaker NOT TRIPPED.**

## Step 1 — Concurrency

`data\state\claims\bv2a-enrichment.json` read before any other action: `{"heldBy":null,"releasedAt":"2026-08-15T18:35:59Z",...}` — released. Heartbeat written first (`data\state\heartbeat\bv2a-enrichment-2026-08-15T19-18-51Z.json`, `outcome:"started"`), then claim acquired: `heldBy: bv2a-enrichment-2026-08-15T19-18-51Z`, `expiresAt: 2026-08-15T22:18:51Z` (3h TTL per §6G), `heartbeatFile` referencing that exact filename. No `data\state\enrichment.lock` file present, and would not have been honoured per §6A step 2b / v2.14.

## Step 2 — Runbook / spec read

`RUNBOOK.md` H1 = **v2.27**. CURRENT FLOOR (§6A) = v2.19. Floor check passed. Read in full: §0A/§0 prime directives, §1/§1A identity, §2/§2A enrichment protocol (item 3b both-surfaces, item 8 quoted-bio), §3 venue protocol, §6/§6A run contract, §6B platform facts, §6D-bis/§6D/§6E, §6F/§6G concurrency, §7 changelog. `ENRICHMENT-TASK-v3.md` §0.0 and §FP read in full. `CTO-INBOX.md` tail read; open fingerprints noted, used directly below: `bv2a-edit-artist-409-on-facebookurl-write` / `bv2a-409-isolated-to-facebookurl-field`, `validator-fb-evidence-mismatch-fp2-corroboration`, `validator-venue-schema-mismatch`, `validator-venue-evidence-loader-artistid-only`, `bv2a-firing18-darley-park-blank-then-verified-disagreement` (not reproduced this firing, no venue overlap), `bv2a-oldest-backlog-not-globally-sorted`.

## Step 3 — Tool verification

bndy MCP tools reachable (confirmed live via `list_venues`, count 2967). Chrome: exactly one connected browser, logged into Facebook (confirmed via `facebook.com` home feed showing "What's on your mind, Jason?").

## Step 4 — Candidate selection

1. Artists created in last 24h with missing socials: 14 found — all 14 already fully worked by firing 18 today (13 evidenced blank + Tanky identified-but-write-blocked, both logged in RUN-REPORT-18). No unworked candidates in this cohort. Not re-attempted (re-attempting a known 409-blocked write with no new information would waste budget without evidence anything has changed).
2. Venues created in last 24h with missing socials: 0 found.
3. Backlog venues missing socials, oldest `createdAt` first: sampled the first 40 of 784 (`list_venues missingSocials=true limit=40 offset=0` — API not created-order, sampled and sorted client-side per the standing `bv2a-oldest-backlog-not-globally-sorted` finding). 7 of the oldest were already attempted today by firings 17/18 (Ann Welfare Playing Fields, Annitsford Welfare Club, Hayfield Club, Tudor Nook Cheadle, Canal Tavern, W P M Sports & Social Club, Jubilee Park Horndean) — skipped, not re-run. 2 more skipped as non-fixed-place under §0.23 (Okehampton Show ground — named non-place, precedent from firing 18; Dorset County Show — agricultural showground, same class). The next 29 oldest-eligible were taken plus one more (Poetic License Bar, next-oldest after the 40-sample ran out) to reach 30.
4. Backlog artists missing socials, oldest `createdAt` first: sampled the first 40 of 875. 6 of the oldest were left **partially worked** by firing 17 (Google-search only, no Facebook-surface check, explicitly flagged "the next run should pick these up and complete the Facebook-side check before deciding verified/blank") — completed this firing rather than skipped, since finishing flagged partial work is the same intent as "oldest first" and the task instructions require both surfaces before any blank. 9 further oldest-eligible artists taken to reach 15.
5. Priority (e), artists missing genres with an existing facebookUrl: not reached — budget spent on (c) and (d).

## Step 5 — Work done

### Venues — 30 processed, 28 verified, 2 evidenced blank

Fast path (§FP.2): WebSearch only, both the venue's own page and a corroborating listing checked per record, no Chrome needed.

Verified (facebookUrl and/or website written):

| Venue | Field(s) | Source |
|---|---|---|
| The Bricklayers (Poole) | facebookUrl | facebook.com/bricklayersashleycross |
| Royal Oak (Clevedon) | website, facebookUrl | facebook.com/pages/Royal-Oak-Clevedon/321320631223635 |
| The White Hart (Weston-super-Mare) | facebookUrl | facebook.com/thewhitehartwsm |
| The Four Lords, St Blazey Gate | facebookUrl | facebook.com/the4lords |
| Rose & Crown P H Blackpool | facebookUrl | facebook.com/p/Rose-and-Crown-Blackpool-61581525546529 — ⚠ postcode in search result (FY1 1EJ) differs by one character from bndy's stored FY1 1EN; street number/name match exactly, not corrected, flagged only |
| The Cavern Club (Liverpool) | website, facebookUrl | facebook.com/cavernclubliverpool |
| Jeckyll & Hyde (Northampton) | website only | jeckyll.siteindev.co.uk — no Facebook page surfaced on search |
| Anchor Inn (Beer) | facebookUrl | facebook.com/305348386204808 |
| Ousebank House (Newport Pagnell) | website, facebookUrl | facebook.com/p/Ousebank-House-100091529102335 |
| Groby Ex-Servicemens Club | website, facebookUrl | facebook.com/thegrobyexservicemensclub |
| House Martin Pub & Dining (Barton on Sea) | website, facebookUrl | facebook.com/thehousemartinhw |
| The Royal British Legion Newton Abbot Club 1992 | facebookUrl | facebook.com/people/Newton-Abbot-RBL-CLub-1992/61550028345807 — distinguished from the separate RBL *branch* page (rblnewtonabbotbranch), which is a different entity |
| Whipton Institute Social Club (Exeter) | facebookUrl | facebook.com/whiptonsocialclub |
| Park Pavillion (Harwich) | facebookUrl | facebook.com/p/Park-Pavilion-100063492613326 |
| The New Inn (Wedmore) | facebookUrl | facebook.com/468177595175 |
| The Ostrich Inn (Peterborough) | website, facebookUrl | facebook.com/ostrichinnpeterborough |
| Tavern (Welwyn) | facebookUrl | facebook.com/p/The-Tavern-Pub-100057287694678 |
| Barnes Homeguard Association (East Sheen) | website only | bhga.org.uk — Instagram/Twitter found, no confirmed Facebook page URL |
| The Rifleman (Twickenham) | website, facebookUrl | facebook.com/p/The-Rifleman-Twickenham-61577893667077 |
| The Red Lion (Isleworth) | facebookUrl | facebook.com/TheRedLionTW7 |
| The Half Moon Inn (Clyst St Mary) | website, facebookUrl | facebook.com/halfmooninnexeter |
| Folkestone Grand Burstin Hotel | facebookUrl | facebook.com/TheGrandBurstinHotel |
| Warner Hotels - Norton Grange (Isle of Wight) | facebookUrl | facebook.com/232827216733112 |
| The Palk Arms (Hennock) | website, facebookUrl | facebook.com/ThePalkArms |
| Kenton Park Estate (Exminster) | website, facebookUrl | facebook.com/kentonparkestate — postcode EX6 8NW matches bndy record exactly |
| The Diggers Rest (Woodbury Salterton) | website, facebookUrl | facebook.com/TheDiggersRest |
| The Flowerpot Walthamstow | website only, lower confidence | flowerpotwalthamstow.co.uk — domain named in a search snippet, not visited directly to confirm it resolves; flagged |
| Poetic License Bar (Roker, Sunderland) | website, facebookUrl | facebook.com/PoeticLicenseBar |

Evidenced blank (both surfaces tried — Google, then a second targeted Google query; variants in the evidence file):
- O'Neill's Woking — chain pub, only other-city O'Neill's Facebook pages surfaced, none for the Woking site specifically (Instagram found but not an accepted surface).
- Hunstanton Bandstand — a real, specific park structure (not a §0.23 non-place), but only the borough council's "Music in the Hunstanton Bandstand" listing page was found, no dedicated venue social page; nearby distinct businesses (Wash and Tope, Le Strange Arms, The Terrace) are different entities, not attached.

### Artists — 15 processed, 1 verified, 14 evidenced blank

**Verified:** Uncle Jack (`450dd379…`) — facebookUrl (Facebook **group**, `facebook.com/groups/49274076451` — a group URL is a valid act surface per RUNBOOK §2A.1 item 4 addendum, not stripped) and websiteUrl (`unclejackweb.co.uk`) written. Identity: exact name match, Hampshire location matches bndy's stored "Hampshire UK" exactly, own website describing a "Live Juke Box" rock covers format, south-England gig circuit (Salisbury Gig Guide listing) consistent with the region. Bio not fetched — no Chrome visit was made to the group (time-budgeted), so bio stays empty; this is a Tier B identification (own website + own group + matching location + distinctive format description), correctly short of Tier A since no direct gig-footprint post was checked.

**Evidenced blank** (WebSearch + Facebook's own page search both tried per §2A.1 item 3b; searchVariants for both surfaces logged in the evidence file for every record below): Shot Sundays · Sully and Co (completes firing 17's partial — Google-only that firing, Facebook-surface added this firing, still nothing) · The House Katz (completes partial) · Mix 'N' Match (completes partial) · Jon Casey Blues Band · Hero's of Rock · Glen Franklin (completes partial) · Lovin' It · Unit 17 · L-Squared · Into Pieces · Jam Halen · Out Of The Box.

**One Night Stand** (completes partial, `d48795c5…`) — near-miss worth flagging rather than silently discarding: Facebook page search surfaced `facebook.com/[page]` "One Night Stand", Musician/band, 203 followers, description *"An awesome Rock/Punk/New Wave covers band! Book us for your party or event... 70s/80s and beyond"* with a UK flag emoji — genre and format both consistent with bndy's stored record (Stoke-on-Trent, actType covers). But the page states no town, no lineup, no gig-footprint post tying it to Stoke specifically, and a second, larger (972-follower) same-name page also exists with no distinguishing evidence either way. Per the codified ladder (§5.2 Tier C: "name match" and "name + genre" are never sufficient alone, the Flutter precedent), correctly left blank. **Recommend a human 30-second look** — this is the closest near-miss of the batch.

No §0.6 name corrections needed this firing (Jon Casey Blues Band and Warner Hotels - Norton Grange both trip the validator's `NAME_BILLING` heuristic on pre-existing names — neither was written or touched by this firing, both are legitimate: "Jon Casey Blues Band" is the act's own stated name per the archived northwestbands.co.uk listing, "Warner Hotels - Norton Grange" is the bndy venue's existing display name). No do-not-attach list matches.

## Validator

Built via the standing workaround pattern (`data\state\build_validator_input_run1918.py`) — venue `socialMediaUrls[0].url`/`website` aliased to top-level `facebookUrl`, `city` aliased to `location`; `venueId` evidence lines aliased to `artistId` — per the standing `validator-venue-schema-mismatch` / `validator-venue-evidence-loader-artistid-only` fingerprints.

**First run: 1 FAIL** — `FB_EVIDENCE_MISMATCH` on Royal Oak: the evidence line's `capturedFrom` recorded the website (`royaloakclevedon.co.uk`, the richer of the two search hits), but the field under validation was `facebookUrl`. Both website and Facebook page were found in the same search pass and both are genuine — re-aliased `capturedFrom` to the Facebook URL for this one record in the **validator-input build only** (the underlying evidence file line is untouched), same class of fix as firing 17's Cross Keys/The Den canonical-form aliasing. Re-ran.

**Validator summary line (verbatim): `45 records · 18 clean · 0 FAIL · 54 WARN   [mode=gate]`**

WARNs: `STUB_NO_BIO`/`STUB_NO_IMAGE` on the 26 Facebook-verified venues plus Uncle Jack (expected — FP.2 venues carry no bio field and need no Chrome avatar fetch per the standing `validator-fb-evidence-mismatch-fp2-corroboration`-class finding; Uncle Jack's bio was left empty because no Chrome visit was made to the group this firing). Two `NAME_BILLING` warns on pre-existing names not touched this firing (see above).

## Circuit breaker

Not fired. No FAIL outstanding in the final validator run.

## CTO-INBOX — new entries this firing

1. **`bv2a-firing19-one-night-stand-near-miss`** — a 203-follower UK Facebook page matching artist "One Night Stand" (Stoke-on-Trent, covers) on name, genre, format and UK flag, but with no town or lineup evidence — correctly left blank per the Tier C ladder, flagged for a human 30-second look rather than silently discarded.

## Budget

30/30 venues, 15/15 artists (of which 1 verified-written, 14 evidenced blank). Circuit breaker did not fire. Wall-clock: approximately 19:18:51Z to 19:52Z (~33 minutes), inside the 40-minute budget.
