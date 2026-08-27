# Claim this page. Consolidated research and build plan.

v2.0 2026-08-12. Author: Claude (CTO). Status: FOR REVIEW.
Consolidates v1.0 (industry + codebase research) with Jason's brief "bndy Facebook Artist Claim Integration" (the Meta-side facts and the artist-claim journey). Where the two disagreed, the resolution is marked **[R]**.

Scope: backlog item 8 (claiming) plus the machine-write guard it depends on. Item 9 (owner tools) follows separately.

---

## 1. Fixed facts

### Meta app (from Jason's brief; supersedes v1.0 assumptions)

| Fact | Value |
|---|---|
| App | "bndy", App ID `2294253538016637`, Development mode, Business Portfolio = Flowency Ltd |
| Business verification | **Pending** (ID resubmitted after first rejection). Advanced Access blocked until it clears |
| Login product | Facebook Login installed. Redirect URIs valid: `https://bndy.live/auth/facebook/callback` (+ `api.bndy.co.uk` fallback) |
| App domains | bndy.live, bndy.co.uk. Website `https://bndy.live` |
| Permissions (Standard Access, ready) | `public_profile`, `pages_show_list`, `pages_read_engagement`. **[R]** v1.0 omitted `pages_read_engagement`; it is needed for Page identity fields. Nothing else. Never `pages_read_user_content` |
| Legal pages | privacy, terms, data-deletion, cookies, **claim-policy** live on www.bndy.co.uk. Verify Flowency details are not placeholders. Claim policy must state FB Page control = valid evidence |
| Dev-mode constraint | Only app admins/developers/testers can log in until Advanced Access. Build and E2E-test with those accounts + the bndy Page + a safe test artist |

### Domains

`bndy.live` CloudFront routes `/api/*` and `/auth/*` to the existing API Gateway, so the claim flow is same-origin. `backstage.bndy.co.uk`, `api.bndy.co.uk` and old map domains must not break.

### Industry (v1.0 research, unchanged)

FB Page admin OAuth is the standard (AllEvents, Bandsintown). Every platform keeps a manual fallback. Match on the immutable numeric Page id, never the vanity URL.

### Codebase (v1.0 audit, unchanged)

| Capability | State |
|---|---|
| Sign-in (phone OTP, magic link, Google, Apple), `bndy_session` cookie, OAuth state in DynamoDB, return-URL validation | LIVE in auth-lambda. Reuse this state mechanism for FB |
| Roles `user/curator/owner/staff` | Stored; `owner` grants nothing yet |
| Artist ownership | `bndy-artist-memberships` + `owner_user_id` + `requireArtistAdmin`. Reusable as-is |
| Venue ownership | MISSING. `claimedByUserId` read-only, never written |
| Claim routes/UI | MISSING. Help page promises manual email claiming |
| Machine-write guard | **MISSING, deliberately deferred (WP-05). MCP can edit any record. Blocking dependency** |
| Facebook | `facebookKey()` normaliser (handles numeric ids, `profile.php?id=`) shared across lambdas. `GET /auth/facebook/callback` declared in SAM with NO handler. No app secret wiring |
| Field conflict | Artist `claimedByUserId` deprecated in favour of `owner_user_id` but `isClaimed` still reads the old field |

---

## 2. Design

### 2.1 Ownership and claim data (D1)

- Canonical owner = `owner_user_id` on the artist/venue record. `claimedByUserId` retired via one migration pass. `isClaimed` recomputed.
- Artists: approval mints an owner membership (existing backstage shape) AND sets `owner_user_id`.
- Venues: single `owner_user_id`, no venue-memberships table yet. Manual claims only in this phase **[R]** (Jason's brief scopes FB verification to artists).
- On FB approval, persist the immutable `facebook_page_id` on the artist record. This also upgrades the identity graph (numeric id beats vanity URL) for enrichment later, without expanding this task into enrichment.

New table `bndy-claims` (merged shape **[R]**):

```
claim_id, target_type ('artist'|'venue'), target_id, user_id,
status: 'verified' | 'pending_review' | 'rejected' | 'disputed',
verification_method: 'facebook_page' | 'manual' | 'staff',
facebook_page_id?, facebook_page_name?, facebook_user_id?,
match_type: 'exact_page_id' | 'facebook_url' | 'name_match' | 'manual',
match_confidence, evidence, created_at, verified_at?, decided_by?
```

No Page access tokens stored. Tokens live only for the verification call, then discarded. Never logged.

### 2.2 Machine-write guard (D2 REVISED, Jason 2026-08-12; ships first)

Ownership protects the claimed PROFILE from machine overwrite. It does not stop machines discovering and adding gigs for claimed acts.

1. `isOwned(record) = !!owner_user_id`. If owned: artists-lambda and venues-lambda MCP update/delete refuse with 423 `{ code: 'OWNED' }`.
2. Venue PUT `/mcp` gets `requireMcpAuth` first (currently none).
3. Events: machines MAY create and maintain independently sourced event records for owned artists/venues. Machines may NOT edit or delete an owner-touched event: `membershipId != null` OR `createdByUserId != null` OR `verifiedByArtist === true` → 423. Owner edits win over conflicting machine edits.
4. Curators and staff unaffected. Import runs log the 423 and skip; one runbook line documents it.

### 2.3 Claim journey (artists; Jason's brief §journey + v1.0 UI)

Precondition **[R]**: the user signs into bndy first (existing AuthGate). Facebook is claim EVIDENCE, not a bndy login method. One user system. Backstage untouched.

1. `bndy.live/artists/{id}` shows **Claim this artist** (beside Favourite/Flag; CuratorBar-style mount).
2. Panel: "Is this your band?" Copy: control of the band's Facebook Page verifies you automatically. Primary **Verify with Facebook**. Secondary **Verify another way**.
3. `GET /auth/facebook/claim?artistId=…` builds OAuth state via the existing DynamoDB state mechanism: artist id, user id, safe return URL, claim intent. No trust in raw callback params.
4. Redirect to FB OAuth, scopes exactly: `public_profile pages_show_list pages_read_engagement`.
5. Existing registered callback `https://bndy.live/auth/facebook/callback`. Server-side code exchange; app secret from Secrets Manager (new secret, same conventions; Jason told the name/shape before creation); never in browser or logs.
6. `GET /me/accounts?fields=id,name,username,link,tasks`.
7. Match ladder (Jason's brief, amended at L2 **[R]**):

| Level | Condition | Outcome |
|---|---|---|
| 1 | Managed Page id or `facebookKey(link/username)` equals the artist's stored FB identity | **verified** automatically. MANAGE task required; lesser tasks → pending_review. **Sanity rule (Jason 2026-08-12): if the Page name is materially inconsistent with the artist name, fall to pending_review even on an exact id match. Protects against a bad historic enrichment link** |
| 2 | No stored FB id, but managed Page name closely matches artist name and evidence aligns | **pending_review, high-confidence.** NOT auto: bndy's own identity bar says a name match alone is never sufficient. One-click approve in godmode |
| 3 | Several candidate Pages / unclear | User selects the candidate Page; pending_review |
| 4 | No matching Page | Not a rejection. Offer the manual route |

8. Outcomes: verified = "You manage this page now" + Owner verified mark. Pending = expectation of 2 to 3 days. Existing verified claimant = **disputed**, never silently overwritten; both parties surfaced in godmode.

Manual route (always available, both types): statement of relationship + contact email + FB page URL if the record lacks one. Same `bndy-claims` row, `method: manual`. Replaces the help-page email promise.

### 2.4 Error handling

User cancels, missing code, invalid/expired state, exchange failure, permission declined (partial grants return nothing), zero Pages, FB API failure, already claimed, dispute, expired token. Human copy, no technical leakage, correlation ids logged, never tokens.

### 2.5 Meta App Review pack (deliverable, in-repo doc)

Permission justifications (three, worded in Jason's brief), reproducible reviewer steps against a supplied test artist, screen-recording plan: artist → claim → FB consent → Page → verified. The claim UI must run this end-to-end with no admin intervention.

---

## 3. Phasing

| Phase | Content | Owner | Gate |
|---|---|---|---|
| P0 | Field migration, `bndy-claims` table, guard in artist+venue MCP paths, venue PUT `/mcp` auth | Claude builds, agent deploys | MCP edit of a test-owned record returns 423 |
| P1 | Claim UI both profiles, manual method end-to-end, godmode pending/dispute list, Owner verified mark | Claude | Manual claim approved in godmode grants ownership; machine edit refused |
| P2 | FB OAuth start/callback, `/me/accounts`, match ladder, page-id persistence, App Review pack | Claude builds; dev-mode E2E with app-role accounts + bndy Page + test artist (10-point checklist in Jason's brief §dev-mode) | All 10 checks pass in dev mode |
| P3 | Jason: Business Verification clears → request Advanced Access for the three permissions → record screencast → app Live | Jason + Meta | Public FB claiming |
| P4 | Item 9 owner tools; FB verification for venues; disputes UX beyond godmode | next plan | — |

P0–P2 have zero Meta-timeline dependency. P3 is Meta's clock, not ours.

## 4. Decisions

| # | Decision | Status |
|---|---|---|
| D1 | `owner_user_id` canonical; claims table above | APPROVED |
| D2 | Guard protects PROFILES; machine gig discovery continues for claimed acts; owner-touched events are machine-immutable | **APPROVED as revised (Jason 2026-08-12)** |
| D3 | Menu at launch: Facebook + manual. No X/Instagram/phone/video | APPROVED |
| D4 | Auto-approve ONLY level 1 with MANAGE + Page-name sanity check. Name-match never auto | **APPROVED with condition (Jason 2026-08-12)** |
| D5 | **One active approved owner claim per TARGET. A user may own multiple artists/venues** (was: one claim per user, wrong for managers/promoters; memberships model already supports multi) | **REVISED + APPROVED (Jason 2026-08-12)** |
| D6 | bndy sign-in first; FB is evidence. Condition: persist the FB user identity (`facebook_user_id` linked on the bndy user record) cleanly enough that Sign in with Facebook can be added later without rebuilding claims | **APPROVED with condition (Jason 2026-08-12)** |

## 5. Risks

1. Business Verification already rejected once. P0–P2 proceed regardless; only public FB claiming waits.
2. Records without a stored `facebookUrl` reach level 2/3 at best. Every manual claim captures the FB URL, closing the gap.
3. Guard 423s appear in import run reports. Correct behaviour; runbook line required.
4. Legal pages must show real Flowency details before App Review; claim-policy must name FB Page control as valid evidence. Checklist item for Jason in P3.
