# BUILD BRIEF 03 — Ticketed venue banner + per-gig ticketed flag

**Status:** READY TO BUILD · **Raised:** 2026-07-31 · **Owner:** Jason (CTO)
**Decision record:** `CTO-DECISION-03-ticketed-venue-feature.md` (the *why*; this document is the *what* and *how*)
**Codebases:** `bndy-serverless-api` (backend) · `bndy-app` (greenfield frontend — **NOT** `bndy-frontstage`) · possibly `bndy-types` / `bndy-ui` for shared contracts
**Runbook:** subordinate to `10-Projects/bndy-population/RUNBOOK.md` v2.3

---

## 0. Read this first

Work the three phases **in order**. Phase 2 cannot be built correctly until Phase 1's resolution contract exists, because the frontend must not reimplement the inheritance rule — that duplication is the defect this brief is written to avoid.

**The one idea to hold onto:** *ticketed* and *grassroots* are different axes. bndy's promise is grassroots live music, not free live music. A £6 advance ticket at a back-room pub gig is grassroots; a free acoustic set at a 1,500-capacity touring venue is not. This feature makes ticketing **visible**, not hidden. Nothing here filters anything out.

**bndy takes no payment and must never appear to.** Every ticketing affordance is an outbound link to someone else's box office.

---

## 1. Jason's ruling, verbatim

> "Hairy Dog and the Flowerpot we need to keep, but we need to mark it as a ticketed venue and to check prices with the venue… We need a clear banner on the venue that it's ticketed, with a link to the main ticket site https://www.thehairydogderby.co.uk/gig-guide as well as us having the option of marking individual gigs as ticketed true/false."

This settles two open questions from Decision 01: the two-axis model is **confirmed**, and ignore-listing big rooms is **rejected as the tool**. Ticketing is surfaced, not suppressed.

---

## 2. Non-goals — do not build these

- **`venueTier`** (grassroots / mid / touring). Decision 01 option C, still open. Nothing in the current corpus needs it: The Hairy Dog and The Flowerpot are grassroots rooms with a box office, not touring venues. Building it now means a 1,491-venue backfill for no present benefit. **Leave it.**
- **Changing the default map/list filter.** Decision 01 Q3, still open. This feature adds no filtering behaviour of any kind.
- **Ticket purchase, basket, checkout, price comparison, affiliate links.** Out of scope permanently.
- **Guessing any ticket price.** See §6.

---

## 3. Phase 1 — Backend (`bndy-serverless-api`)

### 3.1 Venue: no new schema

`edit_venue` already carries the three fields needed. Do **not** add a venue field.

| Field | Type | Meaning |
|---|---|---|
| `standardTicketed` | boolean | This venue's gigs are ticketed by default |
| `standardTicketUrl` | string | The venue's own box office / gig guide URL |
| `standardTicketInformation` | string | Free-text ticket info. **Leave empty unless a real value is known.** |

### 3.2 Event: make "unset" representable — this is the crux

The event already has `ticketed`. Today it is a plain boolean defaulting to `false`, which makes the override **unexpressible**: you cannot tell "nobody has said" from "explicitly not ticketed".

**Required:** `ticketed` becomes **tri-state** — `true` · `false` · absent/null.

- Prefer **attribute absence** in DynamoDB (do not write the key at all when unknown) with `ticketed?: boolean | null` in the type layer. This is the least invasive representation and needs no migration.
- If the storage layer forces a value, add `ticketedSource: 'inherited' | 'explicit'` instead. **Do not** use `false` as the default under any circumstance.
- **Migration:** existing events with `ticketed: false` written by the old default are indistinguishable from genuine explicit falses. Treat all existing `false` values as **unset** — strip the attribute in a one-off sweep — because the old default was never a deliberate statement. Log the count swept. Existing `true` values are meaningful and stay.

### 3.3 The resolution rule

```
resolveTicketing(event, venue) -> {
  isTicketed:       boolean
  source:           'event' | 'venue' | 'none'
  price?:           string      // ONLY if actually held
  ticketUrl?:       string      // event's own, else venue.standardTicketUrl
  ticketInformation?: string    // event's own, else venue.standardTicketInformation
}
```

Precedence, highest first:

1. **Event `ticketed` explicitly set (`true` OR `false`) → it wins outright.** A free acoustic afternoon at a ticketed room must be able to say so, and a ticketed one-off at a normally-free pub must too.
2. Event `ticketed` unset → **inherit `venue.standardTicketed`**.
3. Neither set → `isTicketed: false`, `source: 'none'`.

`price`, `ticketUrl` and `ticketInformation` each resolve independently of the boolean: event value if present, else venue standard, else omitted entirely. **Omit the key rather than returning an empty string** — the frontend must not have to distinguish `""` from absent.

### 3.4 Where resolution lives

**Server-side, on the read path.** Every API response that carries an event for display includes the resolved `ticketing` object. The frontend renders what it is given and implements **zero** ticketing logic.

Rationale: `bndy-app`, `bndy-frontstage`, `bndy-backstage` and the MCP surface would otherwise each reimplement the precedence rule and drift. One resolver, one behaviour.

Keep the raw `ticketed` / `standardTicketed` fields in write-path and admin/godmode responses so an editor can see and set the underlying state rather than the resolved result.

### 3.5 MCP surface

- `edit_event` must be able to set `ticketed` to `true`, `false`, **and back to unset**. Adding an explicit `null` (or a `clearTicketed: true` flag) is required — otherwise an incorrectly-set flag can never be undone through MCP, which is the same class of defect as the `externalIds` append-only trap (runbook §6B).
- `edit_venue` already supports the three venue fields. Verify `standardTicketed: false` actually persists and is not dropped as a falsy value.
- Every write is read back with `get_by_id` per runbook §0.10.

### 3.6 Data to populate

| Venue | id | `standardTicketed` | `standardTicketUrl` |
|---|---|---|---|
| The Hairy Dog, Derby | `3a5b4ca3-c4d8-4326-a0c8-c5dc585a52b7` | `true` | `https://www.thehairydogderby.co.uk/gig-guide` |
| THE FLOWERPOT DERBY | *agent to look up — do not guess the id* | `true` | **unknown — leave empty** |

⚠ `standardTicketInformation` stays **empty** on both. Jason is checking real prices with the venues. Runbook §0.18: blank beats wrong, and an invented price on a public page is worse than no price.

---

## 4. Phase 2 — Frontend (`bndy-app`)

Consume the resolved `ticketing` object. Implement no precedence logic.

### 4.1 Venue page banner

When the venue resolves as ticketed:

- A clear, persistent banner stating this venue's gigs are ticketed.
- A button/link to `standardTicketUrl`, opening in a new tab (`target="_blank" rel="noopener noreferrer"`), labelled with the **destination**, e.g. *"Tickets at thehairydogderby.co.uk"* — **never a bare "Buy tickets"**, which reads as though bndy is selling them.
- **Suppress the banner entirely when `standardTicketUrl` is empty.** A ticketed claim with nowhere to go is worse than saying nothing. (This is why The Flowerpot shows no banner until its URL is confirmed — that is correct behaviour, not a bug.)

### 4.2 Event card / event page marker

- A compact ticketed marker, visually consistent with the venue banner.
- **Render `price` only when a real value is held.** Never `£—`, never `TBC`, never `Price on door` unless that string genuinely came from the source.
- Ticket link falls back to the venue's `standardTicketUrl` when the event has none of its own.
- An event resolving to **not** ticketed renders no marker at all — not a "free" badge. Absence of a ticket is not a positive claim about price.

### 4.3 Design

Follow the established bndy design system rather than inventing treatment — see `bndy-skins-v4.html` and `marker-spec-after-dark.md` in `Documents\Claude\Projects\bndy\`. The marker must survive both light and dark families and must not collide with the existing live/upcoming marker states (pink = live is intentional and must stay legible next to a ticket marker).

---

## 5. Phase 3 — Import-side rule

A runbook amendment ships with this build. Three rules:

1. **When a source states a price or a ticket marker, set event `ticketed` + `price` explicitly. Never discard it.** This is a live defect, not a new feature: Lemonrock's feed gives per-gig price text (`FREE!`, `£5`, `£5 (cover charge)`, `£18.70`) and the importer is currently throwing most of it away.
2. **Never set event `ticketed` by inference about the venue.** That is the venue flag's job, and doing it per-event destroys the distinction between "the room sells tickets" and "this gig sells tickets".
3. **Never strip a "🎫" or similar marker into a name field** (runbook §0.6). It sets `ticketed` instead.

`FREE!` and equivalents set `ticketed: false` **explicitly** — that is a real statement by the source, and it is exactly the override case that Phase 1's tri-state exists to carry.

---

## 6. Acceptance criteria

Backend:

1. An event with no explicit `ticketed` at The Hairy Dog resolves `isTicketed: true`, `source: 'venue'`.
2. An event with explicit `ticketed: false` at The Hairy Dog resolves `isTicketed: false`, `source: 'event'` — and the venue page banner still shows.
3. An event with explicit `ticketed: true` at a non-ticketed venue resolves `isTicketed: true`, `source: 'event'`.
4. Neither set → `isTicketed: false`, `source: 'none'`.
5. `edit_event` can set `true`, `false`, and clear back to unset; each verified by `get_by_id` read-back.
6. `standardTicketed: false` persists on a venue and is not dropped as falsy.
7. The migration sweep converts pre-existing default `false` values to unset, and reports the count.
8. No response ever returns an empty-string `price`, `ticketUrl` or `ticketInformation` — the key is omitted.

Frontend:

9. The Hairy Dog venue page shows the banner with an outbound link to its gig guide, opening in a new tab.
10. A venue with `standardTicketed: true` and **no** `standardTicketUrl` shows **no** banner.
11. No price renders anywhere unless a real value is stored.
12. A non-ticketed event renders no ticket marker and no "free" badge.
13. No ticketing precedence logic exists anywhere in the frontend — verifiable by grep.

Import:

14. A source row carrying a price produces event `ticketed: true` + `price` set.
15. A source row stating free/no charge produces event `ticketed: false` **explicitly**.
16. No ticket marker character ever reaches a name or title field.

---

## 7. Traps and prior art

- **Read back every write** with `get_by_id` (runbook §0.10). `search_event` under-reports and has two false-negative modes (§6B) — do not use it to verify.
- **Do not guess venue ids.** Look The Flowerpot up; two live venues in the onthecase cohort share their first 8 UUID characters, so partial ids are dangerous.
- **Do not invent ticket prices, ticket URLs, or ticket information.** §0.18 governs.
- Falsy-value handling is the likeliest source of silent bugs here — `standardTicketed: false`, `ticketed: false` and `price: ""` will each get dropped by a naive "if (value)" guard somewhere in the stack. Test explicitly for all three.

---

## 8. Related, still open — do not resolve in this build

- Decision 01 **Q2** (`venueTier`) and **Q3** (default filter definition).
- Real ticket prices for The Hairy Dog and The Flowerpot — Jason is checking with the venues. Blocks `standardTicketInformation` only, not this build.
- The Flowerpot's ticket URL — unknown; the venue correctly shows no banner until it is supplied.
