// PetAcquisition.js - Derive truthful Pet Book acquisition hints from REAL metadata
//
// A species' acquisition route is classified ONLY from authoritative sources:
//   1. The real `isBoss === true` flag on the catalog entry (the exact predicate
//      BattleEngine.canRescue uses — Realm Bosses are never capturable).
//      Habitat text such as "(Boss)" is deliberately IGNORED.
//   2. PET_EVOLUTIONS entries whose `nextForm.id` points at the species — a
//      genuine evolution route. Only the predecessor's real catalog name is
//      shown (never a fabricated level or star cost).
//   3. Stage monsterIds (WORLDS) and roaming pool ids (REALM_MONSTER_POOLS) —
//      the only encounters where the weaken-to-45% Rescue is actually usable.
// Species with none of these confirmed routes get an honest noncommittal hint.

import { CANON_MONSTERS, PET_EVOLUTIONS } from '../battle/CanonDatabase.js';
import { WORLDS } from '../battle/Worlds.js';
import { REALM_MONSTER_POOLS } from '../scenes/WorldScene.js';

/**
 * Union of every monster id that can be met in the field:
 * stage encounters (WORLDS[].stages[].monsterId) + roaming pool encounters
 * (REALM_MONSTER_POOLS values). Boss keystone stages are included here on
 * purpose — boss precedence is handled by classifyAcquisition, not by
 * filtering the encounter lists.
 */
export function collectWildEncounterIds(worlds, pools) {
  const ids = new Set();
  for (const world of worlds || []) {
    for (const stage of world.stages || []) {
      if (stage && stage.monsterId) ids.add(stage.monsterId);
    }
  }
  for (const pool of Object.values(pools || {})) {
    for (const entry of pool || []) {
      if (entry && entry.id) ids.add(entry.id);
    }
  }
  return ids;
}

/**
 * Build per-species acquisition facts: { isBoss, wild, predecessors: [ids] }.
 * `monsters` maps id -> catalog entry; `evolutions` maps predecessor id ->
 * evolution entry; `wildIds` is the set from collectWildEncounterIds.
 */
export function buildAcquisitionRoutes({ monsters, evolutions, wildIds }) {
  const wild = new Set(wildIds || []);
  const predecessorsByTarget = {};
  for (const [predId, entry] of Object.entries(evolutions || {})) {
    const targetId = entry && entry.nextForm && entry.nextForm.id;
    if (!targetId) continue; // malformed entry — skip, never invent a route
    (predecessorsByTarget[targetId] = predecessorsByTarget[targetId] || []).push(predId);
  }
  const routes = {};
  for (const [id, m] of Object.entries(monsters || {})) {
    routes[id] = {
      isBoss: !!(m && m.isBoss === true), // real flag only, never habitat text
      wild: wild.has(id),
      predecessors: predecessorsByTarget[id] || []
    };
  }
  return routes;
}

/**
 * Precedence: real Boss flag first, then evolution routes, then wild
 * encounter, else unknown.
 */
export function classifyAcquisition(route) {
  const hasPreds = route.predecessors && route.predecessors.length > 0;
  if (route.isBoss) return hasPreds ? 'boss_evolution' : 'boss_only';
  if (hasPreds && route.wild) return 'wild_evolution';
  if (hasPreds) return 'evolution_only';
  if (route.wild) return 'wild';
  return 'unknown';
}

const COPY = {
  wild: '💖 野外遭遇：將體力削弱至 45% 以下，即可使用【💖 Rescue】淨化收服',
  boss_only: '🚫 區域神石首領：此遭遇無法被 Rescue 收服，僅可於神石守護戰中挑戰奪取神石',
  boss_evolution: '🚫 首領遭遇無法被 Rescue 收服；可改由{preds}進化獲得',
  wild_evolution: '💖 野外遭遇削弱至 45% 以下後 Rescue；亦可由{preds}進化獲得',
  evolution_only: '✨ 可改由{preds}進化獲得；目前無已知野外收服途徑',
  unknown: '❓ 圖鑑尚未確認其收服途徑；繼續冒險探索以發現更多'
};

function resolvePredecessorNames(predIds, monsters) {
  return predIds.map(id => (monsters && monsters[id] && monsters[id].name) || id);
}

/**
 * Return the acquisition hint for a species:
 * { kind, text, isBoss, wild, predecessors (resolved display names) }.
 * Defaults to the real catalog (CANON_MONSTERS / PET_EVOLUTIONS /
 * WORLDS + REALM_MONSTER_POOLS); tests may inject fixtures via opts.
 */
export function getAcquisitionHint(monsterId, opts = {}) {
  const monsters = opts.monsters ?? CANON_MONSTERS;
  const evolutions = opts.evolutions ?? PET_EVOLUTIONS;
  const wildIds = opts.wildIds ?? collectWildEncounterIds(WORLDS, REALM_MONSTER_POOLS);

  const routes = buildAcquisitionRoutes({ monsters, evolutions, wildIds });
  const route = routes[monsterId] || { isBoss: false, wild: false, predecessors: [] };
  const kind = classifyAcquisition(route);
  const preds = resolvePredecessorNames(route.predecessors, monsters).join(' / ');
  const text = (COPY[kind] || COPY.unknown).replace('{preds}', preds);

  return {
    kind,
    text,
    isBoss: route.isBoss,
    wild: route.wild,
    predecessors: resolvePredecessorNames(route.predecessors, monsters)
  };
}
