/**
 * Multi-Artist Lineup Review Tool
 *
 * Reviews the 15 multi-artist lineup records identified in audit.
 * Shows each lineup, their events, and helps parse them into proper artists.
 *
 * Source: data-quality-issues-2026-07-27.json
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// 15 multi-artist lineup artist IDs from audit
const LINEUP_ARTIST_IDS = [
  'bce2a512-3a64-46b5-be58-f3e6511cd828', // Die Ego, Vulgaris, and Bound By Burdens
  'a08a9bc0-1397-46b4-a23a-1ec76a9bc322', // A Thousand Cuts + Anti-Meta + Tba
  '1fd5bef1-38d0-49c1-9412-9212b3edeca7', // Scarlett Fever, Disco Lizards, and Grenades
  '2e5f087f-44d0-48e0-a5db-beed87175eee', // Elvis tribute show featuring Mark Clay
  '081c5357-bee7-45d3-8ce5-fc1708758106', // The Offspin vs Some 41: Derby
  'c8640d38-3873-43e5-ac5c-577d3446a36c', // Seamus Fogarty + Crowspeak + Morning's Thief
  '252ee8bf-301a-4b47-afdc-0cfc913a6679', // Tombstone, Tits Up, And Bang Bang Firecracker
  'a036cdd7-1c18-4226-a56b-07095efb3b9e', // "Bushtonbury Day 2" - Eaton Park, The Vanz, Rob Wheeler
  '2c067741-f4a0-4249-a2a4-791841093146', // The Gakk, Kid Klumsy, And Choked
  '3a2595e8-2021-4445-a0a4-aa4a884d1a50', // Bushtonbury Day 3 - White Knuckle Ride, Acoustic Anarchy, 20 Mile Island
  '0a81a599-f2fe-4780-8cc7-c45ea509ea17', // Malpractice + Voodoo Voodoo + Nick Degg
  'e3a1d7eb-20ea-4fdd-831b-9f42151cc503', // Imperial Bees, The Groves, and The Filters
  '6e329829-06b9-4df6-aba9-741e351485ac', // Wolves in Alcatraz + Anti-Meta + Cure for the Enemy
  '15024bd2-7bbf-4618-89df-b04011f59ab4', // Meat Loaf Vs Elton John
  '732e0bd2-27ed-4f7b-b3bd-f3e4f752d8ca', // Anti-Meta, Chin, Fractured Mind + Cure For The Enemy
];

async function getArtist(artistId) {
  const result = await dynamodb.get({
    TableName: ARTISTS_TABLE,
    Key: { id: artistId }
  }).promise();
  return result.Item;
}

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function reviewLineups() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Multi-Artist Lineup Review Tool                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const results = [];

  for (const artistId of LINEUP_ARTIST_IDS) {
    const artist = await getArtist(artistId);

    if (!artist) {
      console.log(`⚠️  Artist not found: ${artistId}\n`);
      continue;
    }

    const events = await getArtistEvents(artistId);

    console.log('━'.repeat(60));
    console.log(`Artist: ${artist.name}`);
    console.log(`ID: ${artistId}`);
    console.log(`Location: ${artist.location || 'N/A'}`);
    console.log(`Events: ${events.length}`);
    console.log(`URL: https://gigmap.bndy.co.uk/artists/${artistId}`);

    if (events.length > 0) {
      console.log('\nEvents:');
      events.forEach((event, i) => {
        console.log(`  ${i + 1}. ${event.title || event.date}`);
        console.log(`     Date: ${event.date}, Venue: ${event.venueId}`);
        console.log(`     Source: ${event.source}, Created: ${event.createdAt}`);
      });
    }

    results.push({
      artistId,
      artistName: artist.name,
      eventCount: events.length,
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        venueId: e.venueId
      }))
    });

    console.log('');
  }

  console.log('━'.repeat(60));
  console.log('\nSUMMARY');
  console.log('━'.repeat(60));
  console.log(`Total lineup artists: ${LINEUP_ARTIST_IDS.length}`);
  console.log(`Found: ${results.length}`);
  console.log(`Total events: ${results.reduce((sum, r) => sum + r.eventCount, 0)}`);

  const withEvents = results.filter(r => r.eventCount > 0);
  console.log(`With events: ${withEvents.length}`);
  console.log(`Without events: ${results.length - withEvents.length}`);

  return results;
}

reviewLineups()
  .then(results => {
    console.log('\n✅ Review complete\n');
    console.log('Next steps:');
    console.log('1. Review each lineup artist and their events');
    console.log('2. Parse artist names from lineup strings');
    console.log('3. Create proper artist records via find-or-create');
    console.log('4. Update events with correct artistId');
    console.log('5. Delete lineup artist records\n');
  })
  .catch(console.error);
