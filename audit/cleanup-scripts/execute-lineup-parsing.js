/**
 * Execute Multi-Artist Lineup Parsing
 *
 * Implements the parsing plan from parse-lineup-interactive.js:
 * 1. Find-or-create individual artists via API
 * 2. Update/create events based on lineup type
 * 3. Delete lineup artist records
 *
 * Lineup Types:
 * - multi-artist-gig: Update event with collaboratingArtistIds
 * - festival-day: Create separate events for each artist
 * - tribute-show: Update event with real artist
 * - junk-event: Delete entirely (DJ/track nights)
 */

const AWS = require('aws-sdk');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-2' });

const ARTISTS_TABLE = 'bndy-artists';
const EVENTS_TABLE = 'bndy-events';
const API_BASE = 'https://qry0k6pmd0.execute-api.eu-west-2.amazonaws.com/api';

// Lineup parsing plan
const LINEUPS = [
  {
    id: 'bce2a512-3a64-46b5-be58-f3e6511cd828',
    name: 'Die Ego, Vulgaris, and Bound By Burdens',
    artists: ['Die Ego', 'Vulgaris', 'Bound By Burdens'],
    type: 'multi-artist-gig'
  },
  {
    id: 'a08a9bc0-1397-46b4-a23a-1ec76a9bc322',
    name: 'A Thousand Cuts + Anti-Meta + Tba',
    artists: ['A Thousand Cuts', 'Anti-Meta'],
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
    type: 'festival-day',
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
    artists: [],
    type: 'junk-event'
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

async function getArtistEvents(artistId) {
  const result = await dynamodb.query({
    TableName: EVENTS_TABLE,
    IndexName: 'artistId-date-index',
    KeyConditionExpression: 'artistId = :artistId',
    ExpressionAttributeValues: { ':artistId': artistId }
  }).promise();
  return result.Items || [];
}

async function findOrCreateArtist(name, location) {
  try {
    const response = await axios.post(`${API_BASE}/artists/find-or-create`, {
      name,
      location,
      canCreate: true
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      // Validation rejection (multi-artist, cancelled, etc.)
      throw new Error(`Validation failed for "${name}": ${error.response.data.error}`);
    }
    throw error;
  }
}

async function updateEvent(eventId, updates) {
  const updateExpressions = [];
  const expressionNames = {};
  const expressionValues = {};

  Object.keys(updates).forEach((key, i) => {
    updateExpressions.push(`#attr${i} = :val${i}`);
    expressionNames[`#attr${i}`] = key;
    expressionValues[`:val${i}`] = updates[key];
  });

  await dynamodb.update({
    TableName: EVENTS_TABLE,
    Key: { id: eventId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionNames,
    ExpressionAttributeValues: expressionValues
  }).promise();
}

async function createEvent(eventData) {
  await dynamodb.put({
    TableName: EVENTS_TABLE,
    Item: {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      source: 'lineup_parser',
      ...eventData
    }
  }).promise();
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

async function processMultiArtistGig(lineup, event) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${lineup.name}`);
  console.log(`Strategy: Multi-artist gig (collaboratingArtistIds)`);
  console.log(`${'='.repeat(60)}`);

  // Infer location from venue or existing event
  const location = event.region || event.location || 'Unknown';

  // Find-or-create all artists
  const artistResults = [];
  for (const artistName of lineup.artists) {
    console.log(`\nFinding/creating: ${artistName} (${location})`);
    const result = await findOrCreateArtist(artistName, location);
    console.log(`  → ${result.action}: ${result.artist.name} (${result.artist.id})`);
    artistResults.push(result.artist);
  }

  // Update event
  const primaryArtist = artistResults[0];
  const collaborators = artistResults.slice(1).map(a => a.id);

  console.log(`\nUpdating event: ${event.id}`);
  console.log(`  artistId: ${primaryArtist.id} (${primaryArtist.name})`);
  console.log(`  collaboratingArtistIds: [${collaborators.join(', ')}]`);

  await updateEvent(event.id, {
    artistId: primaryArtist.id,
    collaboratingArtistIds: collaborators
  });

  console.log(`✅ Event updated`);

  return { artistsCreated: artistResults.length, eventsUpdated: 1 };
}

async function processFestivalDay(lineup, event) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${lineup.name}`);
  console.log(`Strategy: Festival day (create separate events)`);
  console.log(`${'='.repeat(60)}`);

  const location = event.region || event.location || 'Unknown';

  // Find-or-create all artists
  const artistResults = [];
  for (const artistName of lineup.artists) {
    console.log(`\nFinding/creating: ${artistName} (${location})`);
    const result = await findOrCreateArtist(artistName, location);
    console.log(`  → ${result.action}: ${result.artist.name} (${result.artist.id})`);
    artistResults.push(result.artist);
  }

  // Create separate events for each artist
  console.log(`\nCreating ${artistResults.length} separate events:`);
  for (const artist of artistResults) {
    const newEvent = {
      artistId: artist.id,
      venueId: event.venueId,
      date: event.date,
      time: event.time,
      title: `${lineup.eventPrefix} - ${artist.name}`,
      region: event.region,
      location: event.location,
      ticketUrl: event.ticketUrl,
      imageUrl: event.imageUrl
    };

    await createEvent(newEvent);
    console.log(`  ✅ Created: ${artist.name} @ ${event.venueId} (${event.date})`);
  }

  // Delete original event
  console.log(`\nDeleting original event: ${event.id}`);
  await deleteEvent(event.id);

  return { artistsCreated: artistResults.length, eventsCreated: artistResults.length, eventsDeleted: 1 };
}

async function processTributeShow(lineup, event) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${lineup.name}`);
  console.log(`Strategy: Tribute show (update with real performer)`);
  console.log(`${'='.repeat(60)}`);

  const location = event.region || event.location || 'Unknown';
  const artistName = lineup.artists[0];

  console.log(`\nFinding/creating: ${artistName} (${location})`);
  const result = await findOrCreateArtist(artistName, location);
  console.log(`  → ${result.action}: ${result.artist.name} (${result.artist.id})`);

  console.log(`\nUpdating event: ${event.id}`);
  console.log(`  title: ${lineup.eventTitle}`);
  console.log(`  artistId: ${result.artist.id} (${result.artist.name})`);

  await updateEvent(event.id, {
    title: lineup.eventTitle,
    artistId: result.artist.id
  });

  console.log(`✅ Event updated`);

  return { artistsCreated: 1, eventsUpdated: 1 };
}

async function processJunkEvent(lineup, event) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${lineup.name}`);
  console.log(`Strategy: Junk event (delete entirely - DJ/track night)`);
  console.log(`${'='.repeat(60)}`);

  console.log(`\nDeleting event: ${event.id}`);
  await deleteEvent(event.id);
  console.log(`✅ Event deleted`);

  return { eventsDeleted: 1 };
}

async function processLineup(lineup) {
  console.log(`\n${'━'.repeat(60)}`);
  console.log(`LINEUP: ${lineup.name}`);
  console.log(`ID: ${lineup.id}`);
  console.log(`Type: ${lineup.type}`);
  console.log(`${'━'.repeat(60)}`);

  // Get event
  const events = await getArtistEvents(lineup.id);
  if (events.length === 0) {
    console.log(`⚠️  No events found for lineup artist`);
    return { skipped: true };
  }
  if (events.length > 1) {
    console.log(`⚠️  Multiple events found (${events.length}), expected 1`);
  }

  const event = events[0];
  console.log(`Event: ${event.title || event.date} @ ${event.venueId}`);

  // Process based on type
  let result;
  switch (lineup.type) {
    case 'multi-artist-gig':
      result = await processMultiArtistGig(lineup, event);
      break;
    case 'festival-day':
      result = await processFestivalDay(lineup, event);
      break;
    case 'tribute-show':
      result = await processTributeShow(lineup, event);
      break;
    case 'junk-event':
      result = await processJunkEvent(lineup, event);
      break;
    default:
      throw new Error(`Unknown lineup type: ${lineup.type}`);
  }

  // Delete lineup artist record
  console.log(`\nDeleting lineup artist record: ${lineup.id}`);
  await deleteArtist(lineup.id);
  console.log(`✅ Lineup artist deleted`);

  return { ...result, lineupDeleted: true };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Execute Multi-Artist Lineup Parsing                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const stats = {
    total: LINEUPS.length,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    artistsCreated: 0,
    eventsCreated: 0,
    eventsUpdated: 0,
    eventsDeleted: 0,
    lineupsDeleted: 0
  };

  for (const lineup of LINEUPS) {
    try {
      const result = await processLineup(lineup);

      if (result.skipped) {
        stats.skipped++;
      } else {
        stats.succeeded++;
        stats.artistsCreated += result.artistsCreated || 0;
        stats.eventsCreated += result.eventsCreated || 0;
        stats.eventsUpdated += result.eventsUpdated || 0;
        stats.eventsDeleted += result.eventsDeleted || 0;
        stats.lineupsDeleted += result.lineupDeleted ? 1 : 0;
      }
    } catch (error) {
      console.log(`\n❌ ERROR processing ${lineup.name}:`);
      console.log(error.message);
      stats.failed++;
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Total lineups:         ${stats.total}`);
  console.log(`Succeeded:             ${stats.succeeded}`);
  console.log(`Failed:                ${stats.failed}`);
  console.log(`Skipped:               ${stats.skipped}`);
  console.log(`Artists created:       ${stats.artistsCreated}`);
  console.log(`Events created:        ${stats.eventsCreated}`);
  console.log(`Events updated:        ${stats.eventsUpdated}`);
  console.log(`Events deleted:        ${stats.eventsDeleted}`);
  console.log(`Lineup artists deleted: ${stats.lineupsDeleted}`);
}

// Dry-run mode
const DRY_RUN = process.argv.includes('--execute') ? false : true;

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE');
  console.log('This script will modify the database. Review parse-lineup-interactive.js first.');
  console.log('Run with --execute to perform actual changes\n');
  process.exit(0);
} else {
  main().catch(console.error);
}
