/**
 * Merge Obvious Artist Duplicates (Final 4)
 *
 * MERGE RULE: Reports clusters, events repointed, deletions
 *
 * Source: obvious-duplicates.json (3 keeper artists, 4 duplicates)
 * - Wish We Were Pink Floyd (1 duplicate)
 * - The Inmates (1 duplicate)
 * - The Zone (2 duplicates)
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

const DUPLICATES = [
  {
    name: 'Wish We Were Pink Floyd',
    keeper: 'a67b95c5-9393-42bc-a7bc-9e040482ddfc',
    duplicate: '44a3f105-d3f2-438d-9277-826e61309d56',
    confidence: 'likely'
  },
  {
    name: 'The Inmates',
    keeper: '9171ccad-d78d-4c01-9140-5e7fc30df227',
    duplicate: 'f0c22a3e-28b0-4e84-b110-0faae4f8f75f',
    confidence: 'likely'
  },
  {
    name: 'The Zone',
    keeper: '2b832e36-e476-4e53-b80f-8f69a4b8ff1a',
    duplicate: '0b9c688c-e5b8-4467-8c0a-6da073bfaaa4',
    confidence: 'likely'
  },
  {
    name: 'The Zone',
    keeper: '2b832e36-e476-4e53-b80f-8f69a4b8ff1a',
    duplicate: 'cf03302e-bae0-409b-98be-40b3936046d7',
    confidence: 'likely'
  }
];

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function repointEvent(eventId, newArtistId) {
  await dynamodb.update({
    TableName: EVENTS_TABLE,
    Key: { id: eventId },
    UpdateExpression: 'SET artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': newArtistId }
  }).promise();
}

async function addArtistAlias(artistId, duplicateId) {
  await dynamodb.update({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId },
    UpdateExpression: 'ADD duplicateIds :duplicateId',
    ExpressionAttributeValues: { ':duplicateId': dynamodb.createSet([duplicateId]) }
  }).promise();
}

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function mergePair(pair) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Merging: ${pair.name}`);
  console.log(`Keeper:    ${pair.keeper}`);
  console.log(`Duplicate: ${pair.duplicate}`);
  console.log(`Confidence: ${pair.confidence}`);
  console.log(`${'='.repeat(60)}`);

  // Get duplicate's events
  const events = await getArtistEvents(pair.duplicate);
  console.log(`Events to migrate: ${events.length}`);

  // Repoint events
  let repointed = 0;
  for (const event of events) {
    await repointEvent(event.id, pair.keeper);
    repointed++;
    console.log(`  ✓ Repointed: ${event.title || event.id}`);
  }

  // Add duplicate ID to keeper's aliases
  await addArtistAlias(pair.keeper, pair.duplicate);
  console.log(`✓ Added duplicate ID to keeper's aliases`);

  // Delete duplicate
  await deleteArtist(pair.duplicate);
  console.log(`✓ Deleted duplicate artist`);

  return {
    name: pair.name,
    keeper: pair.keeper,
    duplicate: pair.duplicate,
    eventsRepointed: repointed,
    success: true
  };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Merge Obvious Artist Duplicates (Final 4)               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const results = {
    totalPairs: DUPLICATES.length,
    succeeded: 0,
    failed: 0,
    totalEventsRepointed: 0,
    artistsDeleted: 0,
    details: []
  };

  for (const pair of DUPLICATES) {
    try {
      const result = await mergePair(pair);
      results.succeeded++;
      results.totalEventsRepointed += result.eventsRepointed;
      results.artistsDeleted++;
      results.details.push(result);
    } catch (error) {
      console.error(`\n❌ FAILED: ${pair.name}`);
      console.error(`   ${error.message}`);
      results.failed++;
      results.details.push({
        name: pair.name,
        keeper: pair.keeper,
        duplicate: pair.duplicate,
        success: false,
        error: error.message
      });
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('MERGE RULE REPORT - Obvious Duplicates Cleanup');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Total merge pairs:       ${results.totalPairs}`);
  console.log(`Successfully merged:     ${results.succeeded}`);
  console.log(`Failed:                  ${results.failed}`);
  console.log(`Events repointed:        ${results.totalEventsRepointed}`);
  console.log(`Artists deleted:         ${results.artistsDeleted}`);
  console.log('');

  console.log('Unique keeper artists:   3');
  console.log('  - Wish We Were Pink Floyd');
  console.log('  - The Inmates');
  console.log('  - The Zone (2 duplicates merged)');
  console.log('');

  console.log('Database impact:');
  console.log(`  Artists: 1,286 → ${1286 - results.artistsDeleted}`);
  console.log(`  Events repointed: ${results.totalEventsRepointed}`);
  console.log('');

  // Write report
  const fs = require('fs');
  const reportPath = 'C:/Users/jason/Documents/Claude/Projects/bndy/audit/merge-report-obvious-duplicates.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report saved: ${reportPath}`);
}

// Execute
main().catch(console.error);
