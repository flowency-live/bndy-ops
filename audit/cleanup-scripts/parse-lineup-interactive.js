/**
 * Interactive Multi-Artist Lineup Parser
 *
 * Parse lineup strings into individual artists and show suggested actions.
 * User reviews and confirms before execution.
 */

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';

// Lineup artists with parsing hints
const LINEUPS = [
  {
    id: 'bce2a512-3a64-46b5-be58-f3e6511cd828',
    name: 'Die Ego, Vulgaris, and Bound By Burdens',
    artists: ['Die Ego', 'Vulgaris', 'Bound By Burdens'],
    type: 'multi-artist-gig' // Single event, multiple artists
  },
  {
    id: 'a08a9bc0-1397-46b4-a23a-1ec76a9bc322',
    name: 'A Thousand Cuts + Anti-Meta + Tba',
    artists: ['A Thousand Cuts', 'Anti-Meta'], // Skip "Tba"
    type: 'multi-artist-gig'
  },
  {
    id: '1fd5bef1-38d0-49c1-9412-9212b3edeca7',
    name: 'Scarlett Fever, Disco Lizards, and Grenades',
    artists: ['Scarlett Fever', 'Disco Lizards', 'Grenades'],
    type: 'multi-artist-gig'
  },
  {
    id: '2e5f087f-44d0-48e0-a5db-beed87175eee',
    name: 'Elvis tribute show featuring Mark Clay',
    artists: ['Mark Clay'],
    eventTitle: 'Elvis Tribute Show',
    type: 'tribute-show'
  },
  {
    id: '081c5357-bee7-45d3-8ce5-fc1708758106',
    name: 'The Offspin vs Some 41: Derby',
    artists: ['The Offspin', 'Some 41'],
    type: 'multi-artist-gig'
  },
  {
    id: 'c8640d38-3873-43e5-ac5c-577d3446a36c',
    name: 'Seamus Fogarty + Crowspeak + Morning\'s Thief',
    artists: ['Seamus Fogarty', 'Crowspeak', 'Morning\'s Thief'],
    type: 'multi-artist-gig'
  },
  {
    id: '252ee8bf-301a-4b47-afdc-0cfc913a6679',
    name: 'Tombstone, Tits Up, And Bang Bang Firecracker',
    artists: ['Tombstone', 'Tits Up', 'Bang Bang Firecracker'],
    type: 'multi-artist-gig'
  },
  {
    id: 'a036cdd7-1c18-4226-a56b-07095efb3b9e',
    name: '"Bushtonbury Day 2" - Eaton Park, The Vanz, Rob Wheeler',
    artists: ['Eaton Park', 'The Vanz', 'Rob Wheeler'],
    type: 'festival-day', // Create separate events
    eventPrefix: 'Bushtonbury Day 2'
  },
  {
    id: '2c067741-f4a0-4249-a2a4-791841093146',
    name: 'The Gakk, Kid Klumsy, And Choked',
    artists: ['The Gakk', 'Kid Klumsy', 'Choked'],
    type: 'multi-artist-gig'
  },
  {
    id: '3a2595e8-2021-4445-a0a4-aa4a884d1a50',
    name: 'Bushtonbury Day 3 - White Knuckle Ride, Acoustic Anarchy, 20 Mile Island',
    artists: ['White Knuckle Ride', 'Acoustic Anarchy', '20 Mile Island'],
    type: 'festival-day',
    eventPrefix: 'Bushtonbury Day 3'
  },
  {
    id: '0a81a599-f2fe-4780-8cc7-c45ea509ea17',
    name: 'Malpractice + Voodoo Voodoo + Nick Degg',
    artists: ['Malpractice', 'Voodoo Voodoo', 'Nick Degg'],
    type: 'multi-artist-gig'
  },
  {
    id: 'e3a1d7eb-20ea-4fdd-831b-9f42151cc503',
    name: 'Imperial Bees, The Groves, and The Filters',
    artists: ['Imperial Bees', 'The Groves', 'The Filters'],
    type: 'multi-artist-gig'
  },
  {
    id: '6e329829-06b9-4df6-aba9-741e351485ac',
    name: 'Wolves in Alcatraz + Anti-Meta + Cure for the Enemy',
    artists: ['Wolves in Alcatraz', 'Anti-Meta', 'Cure for the Enemy'],
    type: 'multi-artist-gig'
  },
  {
    id: '15024bd2-7bbf-4618-89df-b04011f59ab4',
    name: 'Meat Loaf Vs Elton John',
    artists: [], // Not a live performance - DJ/track night
    type: 'junk-event' // Delete entirely
  },
  {
    id: '732e0bd2-27ed-4f7b-b3bd-f3e4f752d8ca',
    name: 'Anti-Meta, Chin, Fractured Mind + Cure For The Enemy',
    artists: ['Anti-Meta', 'Chin', 'Fractured Mind', 'Cure For The Enemy'],
    type: 'multi-artist-gig'
  },
  {
    id: '840b38d8-d683-44f8-95f4-13793b459691',
    name: '"Bushtonbury Day 1" - Dom Morgan',
    artists: ['Dom Morgan'],
    type: 'festival-day',
    eventPrefix: 'Bushtonbury Day 1'
  }
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

async function showParsingPlan() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Multi-Artist Lineup Parsing Plan                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  for (const lineup of LINEUPS) {
    const events = await getArtistEvents(lineup.id);
    const event = events[0]; // Should only be 1

    console.log('━'.repeat(60));
    console.log(`LINEUP: ${lineup.name}`);
    console.log(`Type: ${lineup.type}`);
    console.log(`\nPARSED ARTISTS (${lineup.artists.length}):`);
    lineup.artists.forEach((artist, i) => {
      console.log(`  ${i + 1}. ${artist}`);
    });

    if (event) {
      console.log(`\nORIGINAL EVENT:`);
      console.log(`  Title: ${event.title}`);
      console.log(`  Date: ${event.date}`);
      console.log(`  Venue: ${event.venueId}`);
    }

    console.log(`\nSUGGESTED ACTION:`);
    if (lineup.type === 'multi-artist-gig') {
      console.log(`  1. Find-or-create ${lineup.artists.length} artists`);
      console.log(`  2. Update event:`);
      console.log(`     - artistId = ${lineup.artists[0]}`);
      console.log(`     - collaboratingArtistIds = [${lineup.artists.slice(1).join(', ')}]`);
      console.log(`  3. Delete lineup artist record`);
    } else if (lineup.type === 'festival-day') {
      console.log(`  1. Find-or-create ${lineup.artists.length} artists`);
      console.log(`  2. Create ${lineup.artists.length} separate events:`);
      lineup.artists.forEach(artist => {
        console.log(`     - ${artist} @ ${event?.venueId || 'venue'} (${event?.date})`);
      });
      console.log(`  3. Delete original event + lineup artist`);
    } else if (lineup.type === 'tribute-show') {
      console.log(`  1. Find-or-create artist(s)`);
      console.log(`  2. Update event title: "${lineup.eventTitle || 'Tribute Show'}"`);
      console.log(`  3. Update artistId to real artist`);
      console.log(`  4. Delete lineup artist`);
    } else if (lineup.type === 'junk-event') {
      console.log(`  ❌ DELETE ENTIRELY - Not a live performance`);
      console.log(`  1. Delete event`);
      console.log(`  2. Delete lineup artist record`);
    }
    console.log('');
  }

  console.log('━'.repeat(60));
  console.log('\nSUMMARY');
  console.log('━'.repeat(60));
  console.log(`Total lineups: ${LINEUPS.length}`);
  console.log(`Total artists to find-or-create: ${LINEUPS.reduce((sum, l) => sum + l.artists.length, 0)}`);

  const multiGigs = LINEUPS.filter(l => l.type === 'multi-artist-gig').length;
  const festivals = LINEUPS.filter(l => l.type === 'festival-day').length;
  const tributes = LINEUPS.filter(l => l.type === 'tribute-show').length;
  const junk = LINEUPS.filter(l => l.type === 'junk-event').length;

  console.log(`Multi-artist gigs: ${multiGigs} (update with collaboratingArtistIds)`);
  console.log(`Festival days: ${festivals} (split into separate events)`);
  console.log(`Tribute shows: ${tributes} (update title + artist)`);
  console.log(`Junk events: ${junk} (delete entirely - not live performances)`);

  console.log('\n⚠️  THIS IS A PREVIEW ONLY');
  console.log('Review the parsing above and confirm:');
  console.log('  1. Artist names are correct');
  console.log('  2. Event handling strategy is appropriate');
  console.log('  3. Ready to proceed with execution\n');
}

showParsingPlan().catch(console.error);
