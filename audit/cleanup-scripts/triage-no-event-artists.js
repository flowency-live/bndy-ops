/**
 * Triage No-Event Artists (95 total)
 *
 * Categorize into:
 * - DELETE: Test/junk artists (gates now prevent these)
 * - KEEP: Legitimate new artists awaiting first event
 * - NEEDS_JASON: Ambiguous cases requiring manual review
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const { isMultiArtistLineup, isCancelledIndicator, validateArtistName } =
  require('C:/VSProjects/bndy-serverless-api/artists-lambda/lib/data-quality');

async function scanNoEventArtists() {
  const items = [];
  let lastKey = null;

  do {
    const result = await dynamodb.scan({
      TableName: 'bndy-artists',
      ExclusiveStartKey: lastKey
    }).promise();

    for (const artist of result.Items) {
      const hasEvents = (artist.eventCount || 0) > 0 || (artist.pastEventCount || 0) > 0;
      if (!hasEvents) {
        items.push(artist);
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

function categorizeArtist(artist) {
  const signals = {
    name: artist.name,
    id: artist.id,
    created: artist.created_at,
    location: artist.location || '',
    hasFacebook: !!artist.facebookUrl,
    hasInstagram: !!artist.instagramUrl,
    hasWebsite: !!artist.websiteUrl,
    hasBio: !!artist.bio,
    hasGenres: !!(artist.genres && artist.genres.length > 0),
    externalIdCount: 0
  };

  if (signals.hasFacebook) signals.externalIdCount++;
  if (signals.hasInstagram) signals.externalIdCount++;
  if (signals.hasWebsite) signals.externalIdCount++;

  // DELETE signals (obvious junk/test)
  const deleteSignals = [];

  // Test/placeholder names
  if (/^test/i.test(artist.name)) {
    deleteSignals.push('test_name');
  }
  if (/^(placeholder|dummy|example|sample)/i.test(artist.name)) {
    deleteSignals.push('placeholder_name');
  }

  // Would fail validation gates
  if (isMultiArtistLineup(artist.name)) {
    deleteSignals.push('multi_artist_lineup');
  }
  if (isCancelledIndicator(artist.name)) {
    deleteSignals.push('cancelled_indicator');
  }
  const nameValidation = validateArtistName(artist.name);
  if (!nameValidation.valid) {
    deleteSignals.push('unsearchable_name');
  }

  // Single character or very short names (likely junk)
  if (artist.name.trim().length <= 2) {
    deleteSignals.push('too_short');
  }

  // KEEP signals (legitimate artist)
  const keepSignals = [];

  // Has external IDs
  if (signals.externalIdCount >= 2) {
    keepSignals.push('multiple_external_ids');
  }
  if (signals.externalIdCount === 1) {
    keepSignals.push('single_external_id');
  }

  // Has rich profile data
  if (signals.hasBio) {
    keepSignals.push('has_bio');
  }
  if (signals.hasGenres) {
    keepSignals.push('has_genres');
  }

  // Recently created (2026) - new artists awaiting first event
  if (artist.created_at && artist.created_at.startsWith('2026')) {
    keepSignals.push('created_2026');
  }

  // Decision logic
  let category = 'NEEDS_JASON';
  let reason = '';

  if (deleteSignals.length > 0) {
    category = 'DELETE';
    reason = deleteSignals.join(', ');
  } else if (keepSignals.includes('multiple_external_ids')) {
    category = 'KEEP';
    reason = 'Multiple external IDs - legitimate artist';
  } else if (keepSignals.includes('has_bio') && keepSignals.includes('has_genres')) {
    category = 'KEEP';
    reason = 'Rich profile data - legitimate artist';
  } else if (keepSignals.includes('single_external_id') && keepSignals.includes('created_2026')) {
    category = 'KEEP';
    reason = 'Recent artist with external ID';
  } else if (keepSignals.length === 0) {
    category = 'DELETE';
    reason = 'No external IDs, no profile data, no events - likely junk';
  }

  return {
    ...signals,
    category,
    reason,
    deleteSignals,
    keepSignals
  };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Triage No-Event Artists (95)                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('Scanning no-event artists...\n');
  const artists = await scanNoEventArtists();
  console.log(`Found ${artists.length} artists with no events\n`);

  const categorized = artists.map(categorizeArtist);

  const toDelete = categorized.filter(a => a.category === 'DELETE');
  const toKeep = categorized.filter(a => a.category === 'KEEP');
  const needsJason = categorized.filter(a => a.category === 'NEEDS_JASON');

  console.log('═'.repeat(80));
  console.log('TRIAGE SUMMARY');
  console.log('═'.repeat(80));
  console.log(`Total:        ${artists.length}`);
  console.log(`DELETE:       ${toDelete.length} (test/junk artists)`);
  console.log(`KEEP:         ${toKeep.length} (legitimate new artists)`);
  console.log(`NEEDS_JASON:  ${needsJason.length} (manual review required)`);
  console.log('');

  // Show DELETE candidates
  if (toDelete.length > 0) {
    console.log('═'.repeat(80));
    console.log('DELETE CANDIDATES (Test/Junk Artists)');
    console.log('═'.repeat(80));
    for (const artist of toDelete) {
      console.log(`\n${artist.name}`);
      console.log(`  ID: ${artist.id}`);
      console.log(`  Created: ${artist.created}`);
      console.log(`  Reason: ${artist.reason}`);
      console.log(`  Signals: ${artist.deleteSignals.join(', ')}`);
    }
    console.log('');
  }

  // Show KEEP candidates
  if (toKeep.length > 0) {
    console.log('═'.repeat(80));
    console.log('KEEP CANDIDATES (Legitimate Artists)');
    console.log('═'.repeat(80));
    console.log(`Count: ${toKeep.length}`);
    console.log('(Use --show-keep to see full list)');
    if (process.argv.includes('--show-keep')) {
      for (const artist of toKeep) {
        console.log(`\n${artist.name}`);
        console.log(`  ID: ${artist.id}`);
        console.log(`  External IDs: ${artist.externalIdCount}`);
        console.log(`  Bio: ${artist.hasBio ? 'Yes' : 'No'}`);
        console.log(`  Genres: ${artist.hasGenres ? 'Yes' : 'No'}`);
        console.log(`  Reason: ${artist.reason}`);
      }
    }
    console.log('');
  }

  // Show NEEDS_JASON
  if (needsJason.length > 0) {
    console.log('═'.repeat(80));
    console.log('NEEDS JASON (Manual Review Required)');
    console.log('═'.repeat(80));
    for (const artist of needsJason) {
      console.log(`\n${artist.name}`);
      console.log(`  ID: ${artist.id}`);
      console.log(`  Created: ${artist.created}`);
      console.log(`  Location: ${artist.location || '(none)'}`);
      console.log(`  External IDs: ${artist.externalIdCount}`);
      console.log(`  Profile: Bio=${artist.hasBio}, Genres=${artist.hasGenres}`);
      console.log(`  Reason: ${artist.reason}`);
    }
    console.log('');
  }

  // Export for deletion script
  const fs = require('fs');
  const exportPath = 'C:/Users/jason/Documents/Claude/Projects/bndy/audit/no-event-triage.json';
  fs.writeFileSync(exportPath, JSON.stringify({
    total: artists.length,
    toDelete: toDelete.map(a => ({ id: a.id, name: a.name, reason: a.reason })),
    toKeep: toKeep.map(a => ({ id: a.id, name: a.name, reason: a.reason })),
    needsJason: needsJason.map(a => ({
      id: a.id,
      name: a.name,
      location: a.location,
      externalIds: a.externalIdCount,
      reason: a.reason
    }))
  }, null, 2));

  console.log('═'.repeat(80));
  console.log(`Triage exported: ${exportPath}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Review ${toDelete.length} DELETE candidates - run deletion script if approved`);
  console.log(`  2. Keep ${toKeep.length} legitimate artists as-is`);
  console.log(`  3. Manual review for ${needsJason.length} ambiguous cases`);
}

main().catch(console.error);
