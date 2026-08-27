/**
 * Find Obvious Artist Duplicates
 *
 * Identifies duplicates where artists have:
 * - Same name
 * - Same external identifiers (facebook, instagram, website)
 * - Same or overlapping location
 *
 * Scores each artist to determine which is "richer" (more complete data)
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';

async function scanAllArtists() {
  const items = [];
  let lastKey = null;

  do {
    const params = {
      TableName: ARTISTS_TABLE,
      ExclusiveStartKey: lastKey
    };

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;

    console.log(`Scanned ${items.length} artists...`);
  } while (lastKey);

  return items;
}

/**
 * Normalize location for comparison
 */
function normalizeLocation(location) {
  if (!location) return '';
  return location.toLowerCase()
    .replace(/,\s*uk$/i, '')
    .replace(/,\s*england$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize URL for comparison (remove trailing slash, http/https)
 */
function normalizeUrl(url) {
  if (!url) return '';
  return url.toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/^www\./, '');
}

/**
 * Check if two artists have matching external identifiers
 * Returns: 'confirmed' | 'likely' | 'none'
 */
function checkExternalIdMatch(artist1, artist2) {
  const fb1 = normalizeUrl(artist1.facebookUrl);
  const fb2 = normalizeUrl(artist2.facebookUrl);
  const ig1 = normalizeUrl(artist1.instagramUrl);
  const ig2 = normalizeUrl(artist2.instagramUrl);
  const web1 = normalizeUrl(artist1.websiteUrl);
  const web2 = normalizeUrl(artist2.websiteUrl);

  // Both have same external ID = confirmed duplicate
  const fbMatch = fb1 && fb2 && fb1 === fb2;
  const igMatch = ig1 && ig2 && ig1 === ig2;
  const webMatch = web1 && web2 && web1 === web2;

  if (fbMatch || igMatch || webMatch) return 'confirmed';

  // One has external ID, other doesn't = likely duplicate (needs review)
  const fbOneHas = (fb1 && !fb2) || (!fb1 && fb2);
  const igOneHas = (ig1 && !ig2) || (!ig1 && ig2);
  const webOneHas = (web1 && !web2) || (!web1 && web2);

  if (fbOneHas || igOneHas || webOneHas) return 'likely';

  return 'none';
}

/**
 * Check if locations overlap (one contains the other)
 */
function locationsOverlap(loc1, loc2) {
  const norm1 = normalizeLocation(loc1);
  const norm2 = normalizeLocation(loc2);

  if (!norm1 || !norm2) return true; // One missing = assume overlap

  return norm1.includes(norm2) || norm2.includes(norm1);
}

/**
 * Score an artist based on data completeness
 * Higher score = richer record
 */
function scoreArtist(artist) {
  let score = 0;

  // Rich content fields (high value)
  if (artist.bio && artist.bio.length > 10) score += 3;
  if (artist.genres && artist.genres.length > 0) score += 2;
  if (artist.actType && artist.actType.length > 0) score += 2;

  // External identifiers
  if (artist.websiteUrl) score += 1;
  if (artist.facebookUrl) score += 1;
  if (artist.instagramUrl) score += 1;
  if (artist.spotifyUrl) score += 1;
  if (artist.external_ids && artist.external_ids.length > 0) score += 2;

  // Profile data
  if (artist.profileImageUrl) score += 1;
  if (artist.location && artist.location !== 'UK' && artist.location !== 'England') score += 1; // Specific location

  // Event history (slight preference for older records with events)
  if (artist.eventCount > 0) score += 1;
  if (artist.pastEventCount > 0) score += 1;

  return score;
}

/**
 * Find duplicate artist groups
 */
function findDuplicateGroups(artists) {
  const groups = {};

  // Group by name_lower
  for (const artist of artists) {
    const key = artist.name_lower;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(artist);
  }

  // Find groups with potential duplicates
  const duplicates = [];
  let groupsChecked = 0;

  for (const [name, group] of Object.entries(groups)) {
    if (group.length < 2) continue;

    groupsChecked++;
    if (groupsChecked <= 5) {
      console.log(`Checking group: "${name}" (${group.length} artists)`);
    }

    // Check each pair in the group
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const artist1 = group[i];
        const artist2 = group[j];

        // Check for matching/overlapping external IDs and locations
        const idMatch = checkExternalIdMatch(artist1, artist2);
        const hasOverlap = locationsOverlap(artist1.location, artist2.location);

        if (groupsChecked <= 5) {
          console.log(`  Pair: ${artist1.id.substring(0, 8)} vs ${artist2.id.substring(0, 8)}`);
          console.log(`    ID Match: ${idMatch}, Location overlap: ${hasOverlap}`);
          console.log(`    FB: "${normalizeUrl(artist1.facebookUrl)}" vs "${normalizeUrl(artist2.facebookUrl)}"`);
        }

        // Include both confirmed (same IDs) and likely (one has ID) duplicates
        if ((idMatch === 'confirmed' || idMatch === 'likely') && hasOverlap) {
          const score1 = scoreArtist(artist1);
          const score2 = scoreArtist(artist2);

          // Keep higher score, or older if tied
          const [keeper, duplicate] = score1 > score2
            ? [artist1, artist2]
            : score1 < score2
              ? [artist2, artist1]
              : new Date(artist1.created_at) < new Date(artist2.created_at)
                ? [artist1, artist2]
                : [artist2, artist1];

          duplicates.push({
            name,
            confidence: idMatch, // 'confirmed' or 'likely'
            keeper: {
              id: keeper.id,
              score: scoreArtist(keeper),
              location: keeper.location,
              bio: keeper.bio ? keeper.bio.substring(0, 50) + '...' : '',
              genres: keeper.genres || [],
              eventCount: keeper.eventCount || 0,
              created: keeper.created_at,
              facebookUrl: keeper.facebookUrl,
              instagramUrl: keeper.instagramUrl,
              websiteUrl: keeper.websiteUrl
            },
            duplicate: {
              id: duplicate.id,
              score: scoreArtist(duplicate),
              location: duplicate.location,
              bio: duplicate.bio ? duplicate.bio.substring(0, 50) + '...' : '',
              genres: duplicate.genres || [],
              eventCount: duplicate.eventCount || 0,
              created: duplicate.created_at,
              facebookUrl: duplicate.facebookUrl,
              instagramUrl: duplicate.instagramUrl,
              websiteUrl: duplicate.websiteUrl
            },
            reason: getMatchReason(keeper, duplicate)
          });
        }
      }
    }
  }

  return duplicates;
}

/**
 * Explain why these are duplicates
 */
function getMatchReason(artist1, artist2) {
  const reasons = [];

  const fb1 = normalizeUrl(artist1.facebookUrl);
  const fb2 = normalizeUrl(artist2.facebookUrl);
  if (fb1 && fb2 && fb1 === fb2) reasons.push('same Facebook');

  const ig1 = normalizeUrl(artist1.instagramUrl);
  const ig2 = normalizeUrl(artist2.instagramUrl);
  if (ig1 && ig2 && ig1 === ig2) reasons.push('same Instagram');

  const web1 = normalizeUrl(artist1.websiteUrl);
  const web2 = normalizeUrl(artist2.websiteUrl);
  if (web1 && web2 && web1 === web2) reasons.push('same website');

  return reasons.join(', ');
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Find Obvious Artist Duplicates                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning all artists...\n');
  const artists = await scanAllArtists();
  console.log(`\nTotal artists: ${artists.length}`);

  console.log('\nFinding duplicate groups...\n');
  const duplicates = findDuplicateGroups(artists);

  console.log(`Found ${duplicates.length} obvious duplicates\n`);

  // Show details
  for (const dup of duplicates) {
    console.log('━'.repeat(60));
    console.log(`Artist: ${dup.name}`);
    console.log(`Confidence: ${dup.confidence.toUpperCase()}`);
    console.log(`Reason: ${dup.reason || 'Same name + overlapping location'}`);
    console.log('━'.repeat(60));

    console.log('\nKEEP (richer):');
    console.log(`  ID: ${dup.keeper.id}`);
    console.log(`  Score: ${dup.keeper.score}`);
    console.log(`  Location: ${dup.keeper.location}`);
    console.log(`  Bio: ${dup.keeper.bio || '(none)'}`);
    console.log(`  Genres: ${dup.keeper.genres.join(', ') || '(none)'}`);
    console.log(`  Events: ${dup.keeper.eventCount}`);
    console.log(`  Created: ${dup.keeper.created}`);

    console.log('\nDELETE (duplicate):');
    console.log(`  ID: ${dup.duplicate.id}`);
    console.log(`  Score: ${dup.duplicate.score}`);
    console.log(`  Location: ${dup.duplicate.location}`);
    console.log(`  Bio: ${dup.duplicate.bio || '(none)'}`);
    console.log(`  Genres: ${dup.duplicate.genres.join(', ') || '(none)'}`);
    console.log(`  Events: ${dup.duplicate.eventCount}`);
    console.log(`  Created: ${dup.duplicate.created}`);

    console.log('');
  }

  // Summary
  console.log('━'.repeat(60));
  console.log('SUMMARY');
  console.log('━'.repeat(60));
  console.log(`Total duplicates found: ${duplicates.length}`);
  console.log(`Total events to migrate: ${duplicates.reduce((sum, d) => sum + d.duplicate.eventCount, 0)}`);
  console.log('');

  // Export for merge script
  const fs = require('fs');
  const exportPath = 'C:\\Users\\jason\\Documents\\Claude\\Projects\\bndy\\audit\\obvious-duplicates.json';
  fs.writeFileSync(exportPath, JSON.stringify(duplicates, null, 2));
  console.log(`Exported to: ${exportPath}`);
}

main().catch(console.error);
