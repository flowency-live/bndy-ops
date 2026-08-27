# CTO DECISION 01 — Ticketed gigs vs the grassroots promise

**Raised:** 2026-07-31, Lemonrock Torbay import · **Owner:** Jason (CTO) · **Status:** OPEN, blocks nothing today
**Related:** MASTER-IMPORT-RUNBOOK §0.19 (ignore lists) · LEMONROCK-TASK-v1.md

---

## The problem

bndy's default filter shows free, non-ticketed gigs. That promise is the product. Lemonrock's larger venues (Arena Torquay et al.) list real live music that is ticketed and often touring — The Lemonheads, Belphegor, The Slackers at £18.70.

Two failure modes, and we are currently exposed to both:

- **Include them naively** → the default view fills with £20 touring shows. bndy reads as Skiddle.
- **Ignore-list the venue** (today's fix) → we drop real live music, and the ignore list becomes a blunt instrument that silently hides a whole town's biggest room.

## The insight I'd push back with

**Ticketed and grassroots are two different axes, and we've been conflating them.**

A £5 door charge at the Spinning Wheel is grassroots. A free acoustic set at a 1,500-cap touring venue is not. Filtering on `ticketed` alone gets both wrong. We need:

- `ticketed` — a factual property of the gig (is there a ticket to buy in advance?)
- **venue tier** — a property of the room (grassroots / mid / touring)

Default filter = grassroots tier, free or door-price. That keeps the promise without pretending the Arena doesn't exist.

## Options

### A. Venue-level `standardTicketed` cascade (cheapest — schema already exists)
`edit_venue` already carries `standardTicketed`, `standardTicketInformation`, `standardTicketUrl`. Mark the big rooms ticketed; every event there inherits it unless the source says otherwise.
- **For:** zero schema work, works today, one flag per venue.
- **Against:** binary. Doesn't distinguish "ticketed because it's a touring show" from "ticketed because it's a £6 advance-only night at a pub". Default filter still needs a second signal or it just hides all ticketed gigs including grassroots ones.

### B. Event-level `ticketed` only, populated from source price
Lemonrock's feed gives price text per gig — `FREE!`, `£5`, `£5 (cover charge)`, `£18.70`. Parse it, set `ticketed` + `price` per event.
- **For:** accurate per gig; no venue judgement needed; we already capture the string.
- **Against:** doesn't stop the Arena polluting the default view, because a £5 pub gig and a £19 touring show look identical to the filter.

### C. Venue tier + event ticketed (recommended)
Add `venueTier: grassroots | mid | touring` to the venue record. Populate `ticketed`/`price` per event from the source. Default filter = `venueTier = grassroots`, optionally `price = free`.
- **For:** the only option that keeps the Arena's gigs discoverable while protecting the default view. Makes the ignore list a last resort rather than the main tool. Gives us a real product surface later ("show me touring shows too").
- **Against:** new field; needs a rule for assigning tier; backfill across 1,491 existing venues (though defaulting everything to `grassroots` and only promoting exceptions is cheap).

### D. Ignore-list the venues (status quo)
- **For:** done, zero work.
- **Against:** we lose real gigs; the list grows forever; every new source repeats the judgement. Arena Torquay also turned out to hold a `poster-import` event we destroyed as collateral.

## Recommendation

**C, implemented in two steps.** Step one is B — parse Lemonrock's price text into `ticketed`/`price` on every event, which is pure gain and unblocks the current import. Step two is the `venueTier` field and the default-filter change.

Interim, until `venueTier` ships: option A on the handful of known big rooms, so nothing ticketed leaks into the default view.

## How to assign tier without hand-curating 2,664 venues

Signals available for free from the source:
- **Price** — a listing above ~£12 is almost never a grassroots pub gig. Strongest single signal.
- **Lemonrock venue type** — `Live Music Venue`, `Live Entertainment Venue`, `Theatre`, `Club` skew touring; `Pub`, `Social Club`, `Working Men's Club`, `Sports & Social Club`, `Café / Music Bar` skew grassroots.
- **Act's own footprint** — an act with gigs in 15 towns nationwide is touring; three towns is local. We already compute footprints for §1A.

Proposal: default every venue to `grassroots`; promote to `touring` on two or more signals; anything ambiguous goes to the review queue (CTO Decision 02) rather than being guessed.

## Live test case — The Beehive, Honiton (2026-07-31)

A small Honiton arts venue. Listing: **Fairport Convention £36**, ZZ Toppd £25, Dire Streets £26, Forever Queen £22, The Zoots £24, The George Michael Legacy £28, Mick Jogger & The Stones Experience £25. Real live music, ticketed, touring-tribute circuit — but a ~200-cap community arts venue, not a 1,500-cap room.

**Jason's ruling 2026-07-31: PARKED — revisit when the ticketed-venue feature exists.** Not ignore-listed, not imported. The venue stub exists in bndy with zero events; **26 gigs are held behind this decision.** This is the case that proves the two-axis model: an ignore list gets it wrong (throws away real music in a town where bndy would otherwise be empty), and importing it naively gets it wrong (fills the free-gig default view with £36 shows).

For contrast, judged grassroots-fine on the same pass: **Exmouth Pavilion** (only listing is a free local covers band) and **Manor Pavilion Theatre** (a Devon-based ABBA tribute). Venue size alone does not decide it — the listing does.

## Decisions needed from the CTO

1. Confirm the two-axis model (ticketed ≠ non-grassroots), or reject it and tell me the single axis you want.
2. Approve `venueTier` as a venue field, or say we live with `standardTicketed` alone.
3. Confirm the default filter definition: grassroots-only, free-only, or grassroots-and-free.
4. Reinstate Arena Torquay once tiering exists? (Its data was deleted 2026-07-31 and would need re-importing.)

## Immediate consequence for Lemonrock

Regardless of the decision above, the importer must **capture and store the price/ticketed state on every event** — we have it in the feed and are currently discarding it on most rows. That is not a decision, it's a defect, and I'll fix it in the next run.
