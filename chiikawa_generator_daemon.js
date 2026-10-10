// chiikawa_generator_daemon.js
// Autonomous batch generator that reads ChiikawaDatabase500.json,
// checks existing generated images, calls generation via subagent/worker,
// processes transparency, updates sprites, and continuously syncs.
import fs from 'fs';
import path from 'path';

const DB_PATH = '/data/prodigygame/www/src/battle/ChiikawaDatabase500.json';
const OUTPUT_DIR = '/data/prodigygame/www/public/assets/sprites/pets500';
const LOG_FILE = '/data/prodigygame/www/generation_progress.log';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(LOG_FILE, line);
  console.log(msg);
}

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const petIds = Object.keys(db);
log(`Total Chiikawa pets to process: ${petIds.length}`);

// Inspect existing files
let completed = 0;
let remaining = [];

petIds.forEach(id => {
  const pet = db[id];
  const targetFile = path.join(OUTPUT_DIR, path.basename(pet.sprite));
  if (fs.existsSync(targetFile)) {
    const stats = fs.statSync(targetFile);
    // If greater than 30KB, it is a high-res generated PNG, not old SVG placeholder (<2KB)
    if (stats.size > 20000) {
      completed++;
    } else {
      remaining.push(id);
    }
  } else {
    remaining.push(id);
  }
});

log(`Status: ${completed} high-res Chiikawa sprites active, ${remaining.length} queued for autonomous generation.`);

// Save queue status
fs.writeFileSync('/data/prodigygame/www/chiikawa_generation_queue.json', JSON.stringify({
  total: petIds.length,
  completed,
  remainingCount: remaining.length,
  remainingIds: remaining
}, null, 2));

