/**
 * Reconciliation Report: Artist Count Changes
 *
 * User reports:
 * - 2,047 artists (audit)
 * - 1,622 artists (backfill plan)
 * - 1,286 artists (now)
 *
 * Gap: ~760 records. Need to understand what was cleaned already.
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

async function scanAllArtists() {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: 'bndy-artists',
      ExclusiveStartKey: lastKey
    }).promise();

    items.push(...result.Items);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

async function main() {
  console.log('Scanning current artist state...\n');
  const artists = await scanAllArtists();

  const stats = {
    total: artists.length,
    withLocation: 0,
    withoutLocation: 0,
    locationBackfilled: 0,
    hasEvents: 0,
    hasFacebook: 0,
    hasInstagram: 0,
    hasWebsite: 0,
    hasBio: 0,
    hasGenres: 0,
    created2024: 0,
    created2025: 0,
    created2026: 0,
  };

  for (const artist of artists) {
    if (artist.location) stats.withLocation++;
    else stats.withoutLocation++;
    if (artist.locationBackfilled) stats.locationBackfilled++;
    if (artist.eventCount > 0 || artist.pastEventCount > 0) stats.hasEvents++;
    if (artist.facebookUrl) stats.hasFacebook++;
    if (artist.instagramUrl) stats.hasInstagram++;
    if (artist.websiteUrl) stats.hasWebsite++;
    if (artist.bio) stats.hasBio++;
    if (artist.genres && artist.genres.length > 0) stats.hasGenres++;

    if (artist.created_at) {
      const year = artist.created_at.substring(0, 4);
      if (year === '2024') stats.created2024++;
      if (year === '2025') stats.created2025++;
      if (year === '2026') stats.created2026++;
    }
  }

  console.log('═'.repeat(80));
  console.log('CURRENT ARTIST STATE');
  console.log('═'.repeat(80));
  console.log(`Total artists:              ${stats.total}`);
  console.log('');
  console.log('Location:');
  console.log(`  With location:            ${stats.withLocation}`);
  console.log(`  Without location:         ${stats.withoutLocation}`);
  console.log(`  Location backfilled:      ${stats.locationBackfilled}`);
  console.log('');
  console.log('External IDs:');
  console.log(`  Facebook URL:             ${stats.hasFacebook}`);
  console.log(`  Instagram URL:            ${stats.hasInstagram}`);
  console.log(`  Website URL:              ${stats.hasWebsite}`);
  console.log('');
  console.log('Profile Data:');
  console.log(`  Bio:                      ${stats.hasBio}`);
  console.log(`  Genres:                   ${stats.hasGenres}`);
  console.log('');
  console.log('Event History:');
  console.log(`  Has events:               ${stats.hasEvents}`);
  console.log(`  No events:                ${stats.total - stats.hasEvents}`);
  console.log('');
  console.log('Created By Year:');
  console.log(`  2024:                     ${stats.created2024}`);
  console.log(`  2025:                     ${stats.created2025}`);
  console.log(`  2026:                     ${stats.created2026}`);
  console.log('');

  console.log('═'.repeat(80));
  console.log('RECONCILIATION QUESTIONS');
  console.log('═'.repeat(80));
  console.log('User reported artist counts:');
  console.log('  Audit (baseline):         2,047');
  console.log('  Backfill plan:            1,622');
  console.log('  Current (now):            1,286');
  console.log('');
  console.log('Gap from audit to now:      ~760 records');
  console.log('');
  console.log('Need to identify:');
  console.log('  - What cleanup has already been done?');
  console.log('  - Where are the closing reports?');
  console.log('  - Clusters merged, events repointed, deletions?');
  console.log('  - What remains for cleanup?');
}

main().catch(console.error);
