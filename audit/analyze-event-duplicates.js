const data = require('./deep-audit-2026-07-27.json');
const clusters = data.events.naturalKeyDuplicates;

console.log(`Total event duplicate clusters: ${clusters.length}\n`);

clusters.forEach((cluster, i) => {
  const [e1, e2] = cluster.members;
  console.log(`Cluster ${i+1}: ${e1.title}`);
  console.log(`  Event 1: ${e1.id}`);
  console.log(`    created: ${e1.createdAt}, source: ${e1.source}`);
  console.log(`    external_ids: ${e1.external_ids?.length || 0}`);
  console.log(`  Event 2: ${e2.id}`);
  console.log(`    created: ${e2.createdAt}, source: ${e2.source}`);
  console.log(`    external_ids: ${e2.external_ids?.length || 0}`);

  // Decision logic: prefer external_ids, then community_wizard, then older
  let keepId, deleteId, reason;

  if ((e1.external_ids?.length || 0) > (e2.external_ids?.length || 0)) {
    keepId = e1.id;
    deleteId = e2.id;
    reason = 'Keep event with external_ids';
  } else if ((e2.external_ids?.length || 0) > (e1.external_ids?.length || 0)) {
    keepId = e2.id;
    deleteId = e1.id;
    reason = 'Keep event with external_ids';
  } else if (e1.source === 'community_wizard' && e2.source !== 'community_wizard') {
    keepId = e1.id;
    deleteId = e2.id;
    reason = 'Keep community_wizard over mcp_ai_import';
  } else if (e2.source === 'community_wizard' && e1.source !== 'community_wizard') {
    keepId = e2.id;
    deleteId = e1.id;
    reason = 'Keep community_wizard over mcp_ai_import';
  } else if (new Date(e1.createdAt) < new Date(e2.createdAt)) {
    keepId = e1.id;
    deleteId = e2.id;
    reason = 'Keep older event';
  } else {
    keepId = e2.id;
    deleteId = e1.id;
    reason = 'Keep older event';
  }

  console.log(`  DECISION: Keep ${keepId}, Delete ${deleteId} (${reason})\n`);
});
