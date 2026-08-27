#!/usr/bin/env ts-node
/**
 * bndy Data Quality Audit - Specific Issues
 *
 * Detects:
 * 1. Multi-artist lineups imported as single artist records
 * 2. "Cancelled" as artist names (should be event cancellations)
 * 3. Unsearchable/garbage artist names (unicode, special chars)
 * 4. Zero-event artists (candidates for deletion)
 *
 * Usage: ts-node data-quality-audit.ts
 */

import * as fs from 'fs/promises';

const dateStr = new Date().toISOString().split('T')[0];
const auditDir = `C:\\Users\\jason\\Documents\\Claude\\Projects\\bndy\\audit`;

interface Artist {
  id: string;
  name: string;
  location?: string;
  source?: string;
  created_source?: string;
  created_at?: string;
  facebook_url?: string;
}

interface Event {
  id: string;
  artistId: string;
  venueId: string;
  date: string;
  title?: string;
  collaboratingArtistIds?: string[];
  artistIds?: string[];
}

async function loadBackups() {
  console.log('Loading backups...\n');

  const [artists, events] = await Promise.all([
    fs.readFile(`${auditDir}\\backup-artists-${dateStr}.json`, 'utf-8').then(JSON.parse),
    fs.readFile(`${auditDir}\\backup-events-${dateStr}.json`, 'utf-8').then(JSON.parse),
  ]);

  console.log(`✓ Loaded ${artists.length} artists`);
  console.log(`✓ Loaded ${events.length} events\n`);

  return { artists, events };
}

// ============================================================================
// MULTI-ARTIST LINEUP DETECTION
// ============================================================================

function detectMultiArtistLineups(artists: Artist[]) {
  console.log('=== MULTI-ARTIST LINEUP DETECTION ===\n');

  const patterns = [
    /\+\s*\d+\s*more/i,           // "+ 2 more", "+ 1 more", etc.
    /\+.*\+/,                      // Multiple + signs
    /\sand\s.*\sand\s/i,           // "A and B and C"
    /,.*,/,                        // Multiple commas "A, B, C"
    /\bvs?\b/i,                    // "A vs B", "A v B"
    /\bw\/\b/i,                    // "A w/ B"
    /\bwith\s+special\s+guests?\b/i, // "with special guest(s)"
    /\bfeaturing\b/i,              // "featuring"
    /\bft\.?\b/i,                  // "ft", "ft."
    /\bsupporting\b/i,             // "supporting"
    /\bsupport\s+from\b/i,         // "support from"
  ];

  const multiArtistLineups: Array<{
    id: string;
    name: string;
    pattern: string;
    gigmapUrl: string;
  }> = [];

  for (const artist of artists) {
    for (const pattern of patterns) {
      if (pattern.test(artist.name)) {
        multiArtistLineups.push({
          id: artist.id,
          name: artist.name,
          pattern: pattern.toString(),
          gigmapUrl: `https://gigmap.bndy.co.uk/artists/${artist.id}`,
        });
        break; // Only count once per artist
      }
    }
  }

  console.log(`✓ Multi-artist lineups detected: ${multiArtistLineups.length}`);

  // Show top 20 examples
  console.log('\nTop 20 examples:');
  for (const lineup of multiArtistLineups.slice(0, 20)) {
    console.log(`  - ${lineup.name}`);
    console.log(`    ${lineup.gigmapUrl}`);
  }
  console.log();

  return multiArtistLineups;
}

// ============================================================================
// CANCELLED EVENT DETECTION
// ============================================================================

function detectCancelledArtists(artists: Artist[]) {
  console.log('=== CANCELLED EVENT DETECTION ===\n');

  const cancelledPattern = /^cancelled$/i;
  const tbcPattern = /^(tbc|to be confirmed|t\.b\.c\.?)$/i;

  const cancelledArtists = artists.filter(a =>
    cancelledPattern.test(a.name) || tbcPattern.test(a.name)
  );

  console.log(`✓ "Cancelled" artists: ${cancelledArtists.length}`);

  for (const artist of cancelledArtists) {
    console.log(`  - ${artist.name} (${artist.id})`);
    console.log(`    https://gigmap.bndy.co.uk/artists/${artist.id}`);
  }
  console.log();

  return cancelledArtists;
}

// ============================================================================
// UNSEARCHABLE NAME DETECTION
// ============================================================================

function detectUnsearchableNames(artists: Artist[]) {
  console.log('=== UNSEARCHABLE NAME DETECTION ===\n');

  const unsearchable: Array<{
    id: string;
    name: string;
    reason: string;
    gigmapUrl: string;
    suggestion?: string;
  }> = [];

  for (const artist of artists) {
    const name = artist.name;

    // Check for excessive unicode/special characters
    const asciiChars = name.replace(/[^a-zA-Z0-9\s\-'&]/g, '').length;
    const totalChars = name.length;
    const nonAsciiRatio = (totalChars - asciiChars) / totalChars;

    if (nonAsciiRatio > 0.3) { // >30% non-ASCII
      unsearchable.push({
        id: artist.id,
        name,
        reason: `${Math.round(nonAsciiRatio * 100)}% non-ASCII characters`,
        gigmapUrl: `https://gigmap.bndy.co.uk/artists/${artist.id}`,
      });
    }

    // Check for excessive special characters
    const specialChars = name.match(/[†ᛟɣᛨɸÜ°§¶•]/g);
    if (specialChars && specialChars.length > 2) {
      unsearchable.push({
        id: artist.id,
        name,
        reason: `Excessive special/unicode characters: ${specialChars.join('')}`,
        gigmapUrl: `https://gigmap.bndy.co.uk/artists/${artist.id}`,
      });
    }

    // Check for all-caps with special chars (likely stylized)
    if (/^[A-Z†ᛟɣᛨɸÜ°§¶•\s]+$/.test(name) && name.length > 5) {
      const normalized = name.replace(/[†ᛟɣᛨɸÜ°§¶•]/g, '').toLowerCase();
      if (normalized.length > 0 && normalized !== name.toLowerCase()) {
        unsearchable.push({
          id: artist.id,
          name,
          reason: 'Stylized all-caps with unicode',
          gigmapUrl: `https://gigmap.bndy.co.uk/artists/${artist.id}`,
          suggestion: normalized.charAt(0).toUpperCase() + normalized.slice(1),
        });
      }
    }

    // Check for names that are just symbols
    if (/^[^a-zA-Z0-9]+$/.test(name)) {
      unsearchable.push({
        id: artist.id,
        name,
        reason: 'Name contains no alphanumeric characters',
        gigmapUrl: `https://gigmap.bndy.co.uk/artists/${artist.id}`,
      });
    }
  }

  // Dedupe by ID (might match multiple patterns)
  const uniqueUnsearchable = Array.from(
    new Map(unsearchable.map(u => [u.id, u])).values()
  );

  console.log(`✓ Unsearchable names: ${uniqueUnsearchable.length}`);

  console.log('\nExamples:');
  for (const artist of uniqueUnsearchable.slice(0, 20)) {
    console.log(`  - "${artist.name}" (${artist.id})`);
    console.log(`    Reason: ${artist.reason}`);
    if (artist.suggestion) {
      console.log(`    Suggestion: "${artist.suggestion}"`);
    }
    console.log(`    ${artist.gigmapUrl}`);
  }
  console.log();

  return uniqueUnsearchable;
}

// ============================================================================
// ZERO-EVENT ARTISTS
// ============================================================================

function detectZeroEventArtists(artists: Artist[], events: Event[]) {
  console.log('=== ZERO-EVENT ARTISTS ===\n');

  // Build set of all artist IDs that appear in events
  const artistIdsWithEvents = new Set<string>();

  for (const event of events) {
    artistIdsWithEvents.add(event.artistId);

    // Also check collaborating artists
    if (event.collaboratingArtistIds) {
      for (const id of event.collaboratingArtistIds) {
        artistIdsWithEvents.add(id);
      }
    }
    if (event.artistIds) {
      for (const id of event.artistIds) {
        artistIdsWithEvents.add(id);
      }
    }
  }

  // Find artists with zero events
  const zeroEventArtists = artists.filter(a => !artistIdsWithEvents.has(a.id));

  console.log(`✓ Zero-event artists: ${zeroEventArtists.length} / ${artists.length}`);
  console.log(`  Percentage: ${((zeroEventArtists.length / artists.length) * 100).toFixed(1)}%`);

  // Group by source
  const bySource = new Map<string, Artist[]>();
  for (const artist of zeroEventArtists) {
    const source = artist.created_source || artist.source || 'unknown';
    if (!bySource.has(source)) {
      bySource.set(source, []);
    }
    bySource.get(source)!.push(artist);
  }

  console.log('\nZero-event artists by source:');
  for (const [source, list] of bySource.entries()) {
    console.log(`  ${source}: ${list.length}`);
  }

  // Group by creation date
  const recent = zeroEventArtists.filter(a => {
    if (!a.created_at) return false;
    const createdAt = new Date(a.created_at).getTime();
    const cutoff = new Date('2026-07-01').getTime();
    return createdAt > cutoff;
  });

  console.log(`\nCreated in July 2026: ${recent.length}`);
  console.log();

  return zeroEventArtists;
}

// ============================================================================
// ALIAS CANDIDATES
// ============================================================================

function detectAliasCandidates(artists: Artist[]) {
  console.log('=== ALIAS CANDIDATES ===\n');

  // Known cases where we need to enforce alias usage
  const knownCases = [
    {
      badId: '87f59213-c6fc-42de-a720-657bf443c539',
      badName: 'ÜL†RᛟɣᛨɸLE†',
      goodId: '30c4ade9-64f3-4ed2-a792-17cb157b4288',
      goodName: 'Ultraviolet',
      reason: 'Unsearchable unicode stylization',
    },
  ];

  const aliasCandidates: Array<{
    artistId: string;
    artistName: string;
    targetArtistId?: string;
    targetArtistName?: string;
    reason: string;
    action: 'merge' | 'alias' | 'delete';
  }> = [];

  // Add known cases
  for (const known of knownCases) {
    const badArtist = artists.find(a => a.id === known.badId);
    const goodArtist = artists.find(a => a.id === known.goodId);

    if (badArtist && goodArtist) {
      aliasCandidates.push({
        artistId: badArtist.id,
        artistName: badArtist.name,
        targetArtistId: goodArtist.id,
        targetArtistName: goodArtist.name,
        reason: known.reason,
        action: 'merge',
      });
    }
  }

  console.log(`✓ Alias candidates: ${aliasCandidates.length}`);

  for (const candidate of aliasCandidates) {
    console.log(`  BAD:  "${candidate.artistName}" (${candidate.artistId})`);
    console.log(`        https://gigmap.bndy.co.uk/artists/${candidate.artistId}`);
    console.log(`  GOOD: "${candidate.targetArtistName}" (${candidate.targetArtistId})`);
    console.log(`        https://gigmap.bndy.co.uk/artists/${candidate.targetArtistId}`);
    console.log(`  Reason: ${candidate.reason}`);
    console.log(`  Action: ${candidate.action.toUpperCase()}\n`);
  }

  return aliasCandidates;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('bndy Data Quality Audit - Specific Issues\n');

  const { artists, events } = await loadBackups();

  const multiArtistLineups = detectMultiArtistLineups(artists);
  const cancelledArtists = detectCancelledArtists(artists);
  const unsearchableNames = detectUnsearchableNames(artists);
  const zeroEventArtists = detectZeroEventArtists(artists, events);
  const aliasCandidates = detectAliasCandidates(artists);

  // Generate report
  const report = {
    metadata: {
      date: dateStr,
      analysisType: 'data-quality-specific-issues',
      totalArtists: artists.length,
      totalEvents: events.length,
    },
    multiArtistLineups: {
      count: multiArtistLineups.length,
      items: multiArtistLineups,
    },
    cancelledArtists: {
      count: cancelledArtists.length,
      items: cancelledArtists.map(a => ({
        id: a.id,
        name: a.name,
        gigmapUrl: `https://gigmap.bndy.co.uk/artists/${a.id}`,
      })),
    },
    unsearchableNames: {
      count: unsearchableNames.length,
      items: unsearchableNames,
    },
    zeroEventArtists: {
      count: zeroEventArtists.length,
      percentage: ((zeroEventArtists.length / artists.length) * 100).toFixed(1),
      items: zeroEventArtists.map(a => ({
        id: a.id,
        name: a.name,
        source: a.created_source || a.source,
        created_at: a.created_at,
      })),
    },
    aliasCandidates: {
      count: aliasCandidates.length,
      items: aliasCandidates,
    },
  };

  const reportPath = `${auditDir}\\data-quality-issues-${dateStr}.json`;
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`✓ Saved report: ${reportPath}\n`);

  // Generate cleanup script IDs
  const cleanupLists = {
    deleteZeroEventArtists: zeroEventArtists.map(a => a.id),
    mergeBadToGoodArtists: aliasCandidates
      .filter(c => c.action === 'merge')
      .map(c => ({
        deleteId: c.artistId,
        keepId: c.targetArtistId,
      })),
  };

  const cleanupPath = `${auditDir}\\cleanup-lists-${dateStr}.json`;
  await fs.writeFile(cleanupPath, JSON.stringify(cleanupLists, null, 2));
  console.log(`✓ Saved cleanup lists: ${cleanupPath}\n`);

  console.log('=== SUMMARY ===\n');
  console.log(`Multi-artist lineups:     ${multiArtistLineups.length}`);
  console.log(`"Cancelled" artists:      ${cancelledArtists.length}`);
  console.log(`Unsearchable names:       ${unsearchableNames.length}`);
  console.log(`Zero-event artists:       ${zeroEventArtists.length} (${report.zeroEventArtists.percentage}%)`);
  console.log(`Alias candidates:         ${aliasCandidates.length}`);
  console.log();

  console.log('=== DATA QUALITY AUDIT COMPLETE ===\n');
}

main().catch(console.error);
