/**
 * Delete Multi-Artist Lineup Records
 *
 * Deletes artist records that are actually multi-artist lineups or event names.
 * Also deletes their associated events since they're malformed.
 *
 * Source: data-quality-issues-2026-07-27.json + manual review
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// Multi-artist lineup artist IDs to delete
const LINEUP_ARTISTS = [
  { id: 'bce2a512-3a64-46b5-be58-f3e6511cd828', name: 'Die Ego, Vulgaris, and Bound By Burdens' },
  { id: 'a08a9bc0-1397-46b4-a23a-1ec76a9bc322', name: 'A Thousand Cuts + Anti-Meta + Tba' },
  { id: '1fd5bef1-38d0-49c1-9412-9212b3edeca7', name: 'Scarlett Fever, Disco Lizards, and Grenades' },
  { id: '2e5f087f-44d0-48e0-a5db-beed87175eee', name: 'Elvis tribute show featuring Mark Clay' },
  { id: '081c5357-bee7-45d3-8ce5-fc1708758106', name: 'The Offspin vs Some 41: Derby' },
  { id: 'c8640d38-3873-43e5-ac5c-577d3446a36c', name: 'Seamus Fogarty + Crowspeak + Morning\'s Thief' },
  { id: '252ee8bf-301a-4b47-afdc-0cfc913a6679', name: 'Tombstone, Tits Up, And Bang Bang Firecracker' },
  { id: 'a036cdd7-1c18-4226-a56b-07095efb3b9e', name: '"Bushtonbury Day 2" - Eaton Park, The Vanz, Rob Wheeler' },
  { id: '2c067741-f4a0-4249-a2a4-791841093146', name: 'The Gakk, Kid Klumsy, And Choked' },
  { id: '3a2595e8-2021-4445-a0a4-aa4a884d1a50', name: 'Bushtonbury Day 3 - White Knuckle Ride, Acoustic Anarchy, 20 Mile Island' },
  { id: '0a81a599-f2fe-4780-8cc7-c45ea509ea17', name: 'Malpractice + Voodoo Voodoo + Nick Degg' },
  { id: 'e3a1d7eb-20ea-4fdd-831b-9f42151cc503', name: 'Imperial Bees, The Groves, and The Filters' },
  { id: '6e329829-06b9-4df6-aba9-741e351485ac', name: 'Wolves in Alcatraz + Anti-Meta + Cure for the Enemy' },
  { id: '15024bd2-7bbf-4618-89df-b04011f59ab4', name: 'Meat Loaf Vs Elton John' },
  { id: '732e0bd2-27ed-4f7b-b3bd-f3e4f752d8ca', name: 'Anti-Meta, Chin, Fractured Mind + Cure For The Enemy' },
  { id: '840b38d8-d683-44f8-95f4-13793b459691', name: '"Bushtonbury Day 1" - Dom Morgan' }, // Not in audit (missed pattern)
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

async function deleteEvent(eventId) {
  await dynamodb.delete({
    TableName: EVENTS_TABLE,
    Key: { id: eventId }
  }).promise();
}

async function deleteArtist(artistId) {
  await dynamodb.delete({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
}

async function deleteLineup(lineup) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Deleting: ${lineup.name}`);
  console.log(`ID: ${lineup.id}`);
  console.log(`${'='.repeat(60)}`);

  // Get events
  const events = await getArtistEvents(lineup.id);
  console.log(`Events: ${events.length}`);

  if (events.length > 0) {
    console.log('\nDeleting events:');
    for (const event of events) {
      console.log(`  - ${event.title || event.date} (${event.id})`);
      await deleteEvent(event.id);
    }
    console.log(`✅ Deleted ${events.length} events`);
  }

  console.log(`\nDeleting artist record: ${lineup.id}`);
  await deleteArtist(lineup.id);
  console.log(`✅ Artist deleted`);

  return { success: true, eventsDeleted: events.length };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Delete Multi-Artist Lineup Records                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const results = {
    total: LINEUP_ARTISTS.length,
    succeeded: 0,
    failed: 0,
    eventsDeleted: 0
  };

  for (const lineup of LINEUP_ARTISTS) {
    try {
      const result = await deleteLineup(lineup);
      if (result.success) {
        results.succeeded++;
        results.eventsDeleted += result.eventsDeleted;
      } else {
        results.failed++;
      }
    } catch (error) {
      console.log(`\n❌ ERROR deleting ${lineup.name}:`);
      console.log(error.message);
      results.failed++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total lineups:     ${results.total}`);
  console.log(`Succeeded:         ${results.succeeded}`);
  console.log(`Failed:            ${results.failed}`);
  console.log(`Artists deleted:   ${results.succeeded}`);
  console.log(`Events deleted:    ${results.eventsDeleted}`);
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made');
  console.log('Run with --execute to perform actual deletion\n');

  (async () => {
    console.log(`Would delete ${LINEUP_ARTISTS.length} multi-artist lineup records:\n`);
    let totalEvents = 0;
    for (const lineup of LINEUP_ARTISTS) {
      const events = await getArtistEvents(lineup.id);
      totalEvents += events.length;
      console.log(`${lineup.name}`);
      console.log(`  ID: ${lineup.id}`);
      console.log(`  Events to delete: ${events.length}\n`);
    }
    console.log(`Total: ${LINEUP_ARTISTS.length} artists, ${totalEvents} events\n`);
  })().catch(console.error);
} else {
  main().catch(console.error);
}
