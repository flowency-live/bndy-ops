# Facebook Artist Image Enrichment — Nightly Browser-Based Plan

**Created:** 2026-07-05
**Context:** `migrate-facebook-images.js` (bndy-serverless-api) cleared only 13/200 via the Graph API — it only works for simple `facebook.com/username` page URLs. **187 artists remain** with a `facebookUrl` but no `profileImageUrl`. This plan replaces the Graph-API approach with Claude driving the bndy Chrome browser (logged into Facebook) on a nightly schedule.

## Decisions (agreed 2026-07-05)

- **Storage:** download image → bndy storage (S3). FB CDN (`scontent`) URLs expire in ~weeks, so they must never be stored directly as the permanent `profileImageUrl`.
- **Batch size:** 50 artists per night (~4 nights to clear backlog).
- **Scope:** anything viewable — pages, personal profiles, resolved `/share/` links, groups if the group photo is clearly the band. Google image search as a last-resort fallback (conservative: only a clearly-matching image of the act).

## Failure categories in the 187

| Type | Example | Approach |
|---|---|---|
| `/p/Name-ID/` pages (majority) | `/p/The-Glamz-100095209691045/` | Browser view → extract profile pic |
| `/people/Name/ID/` | `/people/Burning-Circus/61562342693576/` | Same |
| Personal profiles | `fizzy.fish.3` | Browser view (logged-in session can see public profile pic) |
| `/share/xxx` short links | `/share/1CGP7e3nEy/` | Follow redirect → extract pic → **also update `facebookUrl` to canonical URL** |
| `/groups/…` (~15) | `/groups/rush3tte` | Use group photo only if clearly the band; else Google fallback; else flag |
| `/pages/category/…` legacy | `Charlie-H-632287896964392` | Extract trailing numeric ID or browser view |

## Prerequisites (blockers to resolve)

1. **Artist image upload path.** The MCP has `upload_event_poster` but no artist equivalent. Needed: an `upload_artist_image(artistId, imageUrl)` MCP tool / endpoint where the **backend** fetches the (currently-valid) scontent URL server-side and stores it in S3, then sets `profileImageUrl`. This is the cleanest design — server-side fetch avoids browser/client limitations entirely. → Add to serverless-api backlog (Vincent/Valerie/Veronica).
   - **Interim fallback until it exists:** where a numeric page ID is extractable, store the stable `https://graph.facebook.com/{id}/picture?type=large` URL (never expires, works for pages). Where not, record the scontent URL in the nightly report only — do NOT write expiring URLs to bndy.
2. **Machine state at 1am.** Scheduled tasks run only while the Claude desktop app is open; the browser flow additionally needs Chrome running with the Claude extension connected and Facebook logged in. If the machine is asleep at 1am the task runs on next app launch instead. If 1am unattended proves unreliable, move to a time the machine is awake.

## Test results (2026-07-05, 4-artist live test) — VALIDATED RECIPE

3/4 succeeded, 1 flagged. The working method (now in the scheduled-task prompt):

1. Navigate to facebookUrl → extract owner id (`"profile_owner":{"id":"…"}` / `"userID"`).
2. Find `delegate_page` id **only within ±400 chars of owner-id occurrences** in the HTML. ⚠️ An unscoped global regex matches Jason's OWN sidebar pages — the test briefly wrote The Torrists' photo (685142534680018) to The Glamz before being caught and reverted. Owner-scoped matching + ownership verification are mandatory.
3. Verify ownership: `facebook.com/{delegateId}` must redirect to the same profile.
4. Verify image: `graph.facebook.com/{delegateId}/picture?type=large` must NOT be the placeholder (filename contains `84628273_176159830277856`).
5. Store the stable graph URL via edit_artist; verify with get_by_id.
- `/share/` links resolve fine; canonical `profile.php?id=…` written back to facebookUrl (Velvet Sun ✓).
- Personal profiles (Fizzyfish) have no delegate page → graph = placeholder → flagged; these genuinely need the upload endpoint.
- The Chrome extension redacts scontent URLs from JS anyway, so the graph-URL approach is also the only practical one.
- Browser is now named "bndy" in the Chrome extension — the task selects it by name.

## Nightly run flow (01:00)

1. **Preflight.** Confirm Chrome extension connected. Navigate to facebook.com; if login wall or checkpoint → abort immediately and report (never attempt to log in or dismiss security prompts).
2. **Build worklist.** `list_artists` → filter: no `profileImageUrl`, has `facebookUrl`. Subtract permanent skips and artists at retry cap (3) from `fb-image-progress.json`. Take first 50.
3. **Per artist:**
   - Navigate to `facebookUrl` (new tab, reuse it). Random 5–10s pacing between artists. Read-only — never click Like/Follow/Join, never interact.
   - Extract profile image: `og:image` meta or profile-photo DOM node via `javascript_tool` / `get_page_text`.
   - `/share/` link → note canonical URL, update artist `facebookUrl` via `edit_artist`.
   - Store: call `upload_artist_image` (or interim fallback above), then `edit_artist` if needed.
   - **Verify with `get_by_id`** that `profileImageUrl` persisted (edit_event reassign was a silent no-op — trust nothing unverified).
   - Nothing usable on FB → Google image search "<artist name> band <locality>"; only accept an unambiguous match; else increment retry count / flag.
4. **Safety rails.** Hard cap 50/night. If FB shows a checkpoint, unusual-activity page, or logs out mid-run: stop the whole run, report. Never bulk-open tabs.
5. **Wrap-up.** Update `Projects/bndy/fb-image-progress.json` (per-artist: status, attempts, imageUrl found, notes). Re-count remaining artists needing images (verification). Short report: succeeded / failed / skipped / flagged-for-manual, plus any account-safety events.

## State files (Projects/bndy/)

- `fb-image-progress.json` — per-artist attempt log, retry counts, permanent skips.
- Nightly report appended summary in same file under `runs[]`.

## Rollout

1. **Night 1–4:** clear the 187 backlog at 50/night.
2. **Steady state:** task keeps running nightly; catches new artists whose import-time enrichment missed an avatar (enrichment-before-create rule still applies to all sources — this is a safety net, not a replacement).
3. **Later (once upload endpoint exists):** optionally re-run over the 13 Graph-API successes + interim graph-URL artists to migrate everything onto owned S3 images.

## Risks

- **FB account flagging** — mitigated by 50/night cap, human pacing, read-only behaviour, immediate stop on checkpoint. If Jason's account gets checkpointed once, pause the task and reassess (consider a dedicated FB account).
- **Expiring URLs** — mitigated by server-side upload design; interim rule forbids writing scontent URLs.
- **Silent edit no-ops** — every write verified via `get_by_id`.
