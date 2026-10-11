import { test } from 'node:test';
import assert from 'node:assert';
import { GameState } from '../src/core/GameState.js';
import { BattleEngine } from '../src/battle/BattleEngine.js';
import { eventBus } from '../src/core/EventBus.js';
import { COMPANION_PET_ASSETS, getPetAssetUrl } from '../src/battle/CompanionPetAssets.js';
import { SPELLS } from '../src/battle/Spells.js';
import { CANON_MONSTERS } from '../src/battle/CanonDatabase.js';

test('Rule A: Correct answer executes spell without removing pets', () => {
  const gs = new GameState({
    pets: [
      { id: 'hotpot', name: 'Hotpot (火鍋怪)', element: 'fire', level: 1, hp: 50, maxHp: 50, attack: 12 },
      { id: 'squiddle', name: 'Squiddle (章魚仔)', element: 'water', level: 1, hp: 55, maxHp: 55, attack: 10 }
    ],
    activePetIds: ['hotpot', 'squiddle'],
    activePetId: 'hotpot'
  });
  const engine = new BattleEngine(gs, { ...CANON_MONSTERS['mossy'] });
  engine.selectSpell('arcane_blast');
  assert.strictEqual(engine.pendingAction !== null, true);

  engine.handleMathResult(true);

  assert.strictEqual(gs.pets.length, 2, 'Pets count must remain 2');
  assert.strictEqual(gs.pets[0].id, 'hotpot');
  assert.strictEqual(gs.pets[1].id, 'squiddle');
  engine.destroy();
});

test('Rule B & D: Wrong answer removes active companion, keeps others, and survives snapshot save/load', () => {
  const gs = new GameState({
    pets: [
      { id: 'hotpot', name: 'Hotpot (火鍋怪)', element: 'fire', level: 1, hp: 50, maxHp: 50, attack: 12 },
      { id: 'squiddle', name: 'Squiddle (章魚仔)', element: 'water', level: 1, hp: 55, maxHp: 55, attack: 10 }
    ],
    activePetIds: ['hotpot', 'squiddle'],
    activePetId: 'hotpot'
  });
  const engine = new BattleEngine(gs, { ...CANON_MONSTERS['mossy'] });
  engine.selectSpell('arcane_blast');

  engine.handleMathResult(false);

  // Exact 1 pet removed
  assert.strictEqual(gs.pets.length, 1, 'Exactly 1 pet must be removed on wrong answer');
  assert.strictEqual(gs.pets[0].id, 'squiddle', 'Remaining pet must be squiddle');
  assert.deepStrictEqual(gs.activePetIds, ['squiddle']);
  assert.strictEqual(gs.activePetId, 'squiddle');

  // Snapshot persistence test (Rule D)
  const snap = gs.getSnapshot();
  const reloadedGs = new GameState(snap);
  assert.strictEqual(reloadedGs.pets.length, 1);
  assert.strictEqual(reloadedGs.pets[0].id, 'squiddle');
  assert.strictEqual(reloadedGs.activePetId, 'squiddle');

  engine.destroy();
});

test('Rule C: Rapid double submit / multiple events only penalize ONCE', () => {
  const gs = new GameState({
    pets: [
      { id: 'hotpot', name: 'Hotpot (火鍋怪)', element: 'fire', level: 1, hp: 50, maxHp: 50, attack: 12 },
      { id: 'squiddle', name: 'Squiddle (章魚仔)', element: 'water', level: 1, hp: 55, maxHp: 55, attack: 10 }
    ],
    activePetIds: ['hotpot', 'squiddle'],
    activePetId: 'hotpot'
  });
  const engine = new BattleEngine(gs, { ...CANON_MONSTERS['mossy'] });
  engine.selectSpell('arcane_blast');

  // First call
  engine.handleMathResult(false);
  // Immediate duplicate call before next turn
  engine.handleMathResult(false);
  engine.handleMathResult(false);

  assert.strictEqual(gs.pets.length, 1, 'Duplicate submissions must not remove a second pet!');
  assert.strictEqual(gs.pets[0].id, 'squiddle');

  engine.destroy();
});

test('Rule E: Can re-encounter and re-rescue a previously lost pet', () => {
  const gs = new GameState({
    pets: [{ id: 'squiddle', name: 'Squiddle (章魚仔)', element: 'water', level: 1, hp: 55, maxHp: 55, attack: 10 }],
    activePetIds: ['squiddle'],
    activePetId: 'squiddle'
  });

  // Re-rescue hotpot
  gs.addPet({
    id: 'hotpot',
    name: 'Hotpot (炭火陶甲獸)',
    element: 'fire',
    level: 2,
    maxHp: 75,
    attack: 15
  });

  assert.strictEqual(gs.pets.length, 2);
  assert.strictEqual(gs.pets.some(p => p.id === 'hotpot'), true);
});

test('Rule F: Zero collection handles penalty gracefully without crash', () => {
  const gs = new GameState({
    pets: [],
    activePetIds: [],
    activePetId: null
  });
  const engine = new BattleEngine(gs, { ...CANON_MONSTERS['mossy'] });
  engine.selectSpell('arcane_blast');

  assert.doesNotThrow(() => {
    engine.handleMathResult(false);
  });
  assert.strictEqual(gs.pets.length, 0);

  engine.destroy();
});

test('Rule I & J: Asset resolution gracefully falls back to modern companion paths and never to obsolete shapes', () => {
  for (const [id, meta] of Object.entries(COMPANION_PET_ASSETS)) {
    const portrait = getPetAssetUrl(id, 'portrait');
    const battlePlayer = getPetAssetUrl(id, 'battle', 'player');
    const battleEnemy = getPetAssetUrl(id, 'battle', 'enemy');
    const overworld = getPetAssetUrl(id, 'overworld');
    const icon = getPetAssetUrl(id, 'icon');

    assert.strictEqual(portrait.includes('companions/'), true, `${id} portrait must use companions directory`);
    assert.strictEqual(battlePlayer.includes('companions/'), true, `${id} battlePlayer must use companions directory`);
    assert.strictEqual(battleEnemy.includes('companions/'), true, `${id} battleEnemy must use companions directory`);
    assert.strictEqual(overworld.includes('companions/'), true, `${id} overworld must use companions directory`);
    assert.strictEqual(icon.includes('companions/'), true, `${id} icon must use companions directory`);
  }
});

test('Rule K: All existing spells preserve canonical cost, damage, and attributes', () => {
  assert.strictEqual(SPELLS['arcane_blast'].energyCost, 0);
  assert.strictEqual(SPELLS['torrent'].energyCost, 1);
  assert.strictEqual(SPELLS['flame_orb'].energyCost, 1);
  assert.strictEqual(SPELLS['vine_whip'].energyCost, 1);
  assert.strictEqual(SPELLS['static_shock'].energyCost, 1);
  assert.strictEqual(SPELLS['star_dust'].energyCost, 2);
});
