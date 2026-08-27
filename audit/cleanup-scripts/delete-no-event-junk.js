/**
 * Delete No-Event Junk Artists (49)
 *
 * All created July 2026, zero external IDs, zero profile data, zero events.
 * Likely imported junk predating validation gates.
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });
const fs = require('fs');

const ARTISTS_TABLE = 'bndy-artists';

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Delete No-Event Junk Artists (49)                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Load triage results
  const triage = JSON.parse(fs.readFileSync(
    'C:/Users/jason/Documents/Claude/Projects/bndy/audit/no-event-triage.json',
    'utf8'
  ));

  const toDelete = triage.needsJason; // All 49 manual review cases
  console.log(`Artists to delete: ${toDelete.length}\n`);

  const results = {
    total: toDelete.length,
    deleted: 0,
    failed: 0,
    errors: []
  };

  for (const artist of toDelete) {
    try {
      await deleteArtist(artist.id);
      results.deleted++;
      console.log(`✓ Deleted: ${artist.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({
        id: artist.id,
        name: artist.name,
        error: error.message
      });
      console.error(`✗ FAILED: ${artist.name} - ${error.message}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('DELETION REPORT');
  console.log(`${'═'.repeat(60)}`);
  console.log(`Total:    ${results.total}`);
  console.log(`Deleted:  ${results.deleted}`);
  console.log(`Failed:   ${results.failed}`);
  console.log('');
  console.log('Database impact:');
  console.log(`  Artists: 1,282 → ${1282 - results.deleted}`);
  console.log('');

  // Save report
  const reportPath = 'C:/Users/jason/Documents/Claude/Projects/bndy/audit/delete-no-event-junk-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`Report saved: ${reportPath}`);
}

main().catch(console.error);
