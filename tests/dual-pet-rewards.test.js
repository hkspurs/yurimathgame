// Dual-companion reward visibility (Plan A) — per-recipient petRewards payload tests.
// Real BattleEngine + GameState fixtures. Expectations:
//   Victory: fresh state, winStreak incremented to 1 before multiplier math, no damage:
//     finalXp = 10 * 1.15 * 1.25 = 14.375 -> 14
//   Rescue:  rawXp = 10 + 20 = 30; 30 * 2.0 * 1.15 * 1.25 = 86.25 -> 86
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/core/GameState.js';
import { BattleEngine } from '../src/battle/BattleEngine.js';
import { eventBus } from '../src/core/EventBus.js';

function makeState(pets = []) {
  const state = new GameState({ stars: 0, egg: null });
  for (const pet of pets) state.addPet(pet);
  return state;
}

function setXpCurve(state, petId, { level, xp, xpToNext }) {
  const pet = state.pets.find(p => p.id === petId);
  pet.level = level;
  pet.xp = xp;
  pet.xpToNext = xpToNext;
  return pet;
}

const DUAL_PETS = [
  { id: 'hotpot', name: 'Hotpot', element: 'fire', level: 1, maxHp: 60, attack: 10, sprite: './assets/sprites/hotpot.png' },
  { id: 'squiddle', name: 'Squiddle', element: 'water', level: 1, maxHp: 80, attack: 12, sprite: './assets/sprites/squiddle.png' }
];

const MONSTER = () => ({ id: 'peeko', name: 'Peeko', element: 'earth', level: 1, maxHp: 60, attack: 8, rewards: { xp: 10, gold: 5 } });

test('handleVictory: petRewards lists both companions with per-recipient outcomes (incl. real evolution)', () => {
  const state = makeState(DUAL_PETS);
  setXpCurve(state, 'hotpot', { level: 4, xp: 96, xpToNext: 100 });    // 96+14 -> LV.5 (evolution level)
  setXpCurve(state, 'squiddle', { level: 1, xp: 0, xpToNext: 1000 }); // no level up
  const engine = new BattleEngine(state, MONSTER());
  let victory = null;
  const off = eventBus.on('BATTLE_VICTORY', payload => { victory = payload; });
  try {
    engine.handleVictory();
    assert.ok(victory, 'BATTLE_VICTORY must fire synchronously');
    assert.ok(Array.isArray(victory.rewards.petRewards), 'rewards.petRewards must be an array');
    const [h, s] = victory.rewards.petRewards;
    assert.equal(victory.rewards.petRewards.length, 2, 'one entry per XP recipient');
    assert.equal(h.petId, 'hotpot');
    assert.equal(h.petName, 'Hotpot');
    assert.equal(h.sprite, './assets/sprites/hotpot.png');
    assert.equal(h.element, 'fire');
    assert.equal(h.prevLevel, 4);
    assert.equal(h.gainedXp, 14);
    assert.equal(h.level, 5);
    assert.equal(h.leveledUp, true);
    assert.equal(h.canEvolve, true, 'hotpot reaches evolution level 5');
    assert.equal(s.petId, 'squiddle');
    assert.equal(s.prevLevel, 1);
    assert.equal(s.gainedXp, 14);
    assert.equal(s.level, 1);
    assert.equal(s.leveledUp, false);
    assert.equal(s.canEvolve, false);
    // Legacy scalar fields retained, unchanged values.
    assert.equal(victory.rewards.petXp, 14);
    assert.equal(victory.rewards.xp, 14);
    assert.equal(victory.rewards.gold, 5);
    assert.equal(victory.rewards.activePet.id, 'hotpot');
    assert.equal(victory.rewards.petLeveledUp, true);
    assert.equal(victory.rewards.canEvolve, true);
    // Live state matches the payload (no extra / missing pet XP).
    assert.equal(state.pets.find(p => p.id === 'hotpot').level, 5);
    assert.equal(state.pets.find(p => p.id === 'squiddle').xp, 14);
    assert.equal(state.xp, 14, 'player XP output unchanged');
  } finally {
    off();
    engine.destroy();
  }
});

test('handleVictory: level-up status belongs to the pet that actually leveled (second pet only)', () => {
  const state = makeState(DUAL_PETS);
  setXpCurve(state, 'hotpot', { level: 1, xp: 0, xpToNext: 1000 });
  setXpCurve(state, 'squiddle', { level: 4, xp: 96, xpToNext: 100 }); // squiddle alone reaches LV.5
  const engine = new BattleEngine(state, MONSTER());
  let victory = null;
  const off = eventBus.on('BATTLE_VICTORY', payload => { victory = payload; });
  try {
    engine.handleVictory();
    const [h, s] = victory.rewards.petRewards;
    assert.equal(h.petId, 'hotpot');
    assert.equal(h.leveledUp, false, 'hotpot did not level up');
    assert.equal(h.level, 1);
    assert.equal(s.petId, 'squiddle');
    assert.equal(s.leveledUp, true, 'squiddle leveled up — ownership must be squiddle, not activePet');
    assert.equal(s.level, 5);
    assert.equal(s.canEvolve, true);
    assert.equal(victory.rewards.petLeveledUp, true, 'legacy flag stays true when any pet leveled');
  } finally {
    off();
    engine.destroy();
  }
});

test('handleVictory: both companions leveling up each report their own level', () => {
  const state = makeState(DUAL_PETS);
  setXpCurve(state, 'hotpot', { level: 4, xp: 96, xpToNext: 100 });
  setXpCurve(state, 'squiddle', { level: 4, xp: 96, xpToNext: 100 });
  const engine = new BattleEngine(state, MONSTER());
  let victory = null;
  const off = eventBus.on('BATTLE_VICTORY', payload => { victory = payload; });
  try {
    engine.handleVictory();
    const [h, s] = victory.rewards.petRewards;
    assert.equal(h.leveledUp, true);
    assert.equal(h.level, 5);
    assert.equal(s.leveledUp, true);
    assert.equal(s.level, 5);
    assert.ok(h.canEvolve && s.canEvolve);
  } finally {
    off();
    engine.destroy();
  }
});

test('handleVictory: multi-level gain reports literal final level (level - prevLevel = 2)', () => {
  const state = makeState(DUAL_PETS);
  setXpCurve(state, 'hotpot', { level: 1, xp: 200, xpToNext: 20 }); // 214 -> LV.2 (194) -> LV.3 (47)
  setXpCurve(state, 'squiddle', { level: 1, xp: 0, xpToNext: 1000 });
  const engine = new BattleEngine(state, MONSTER());
  const hotpot = state.pets.find(p => p.id === 'hotpot');
  const maxHpBefore = hotpot.maxHp;
  const atkBefore = hotpot.attack;
  let victory = null;
  const off = eventBus.on('BATTLE_VICTORY', payload => { victory = payload; });
  try {
    engine.handleVictory();
    const h = victory.rewards.petRewards[0];
    assert.equal(h.prevLevel, 1);
    assert.equal(h.level, 3);
    assert.equal(h.level - h.prevLevel, 2, 'gain must be the literal level difference');
    assert.equal(h.leveledUp, true);
    assert.equal(hotpot.maxHp, maxHpBefore + 30, '+15 Max HP per level');
    assert.equal(hotpot.attack, atkBefore + 6, '+3 attack per level');
  } finally {
    off();
    engine.destroy();
  }
});

test('handleVictory: zero companions yields empty petRewards (pet section can be hidden)', () => {
  const state = new GameState({ stars: 0, egg: null });
  const engine = new BattleEngine(state, MONSTER());
  let victory = null;
  const off = eventBus.on('BATTLE_VICTORY', payload => { victory = payload; });
  try {
    engine.handleVictory();
    assert.deepEqual(victory.rewards.petRewards, []);
    assert.equal(victory.rewards.activePet, null);
    assert.equal(victory.rewards.petLeveledUp, false);
  } finally {
    off();
    engine.destroy();
  }
});

test('handleRescueSuccess: petRewards + top-level isNewPet; rescued pet earns no battle XP', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const state = makeState(DUAL_PETS);
  setXpCurve(state, 'hotpot', { level: 1, xp: 0, xpToNext: 1000 });
  setXpCurve(state, 'squiddle', { level: 4, xp: 96, xpToNext: 100 }); // rescue XP 86 -> LV.5
  const engine = new BattleEngine(state, MONSTER());
  let rescue = null;
  const off = eventBus.on('BATTLE_RESCUE_VICTORY', payload => { rescue = payload; });
  try {
    engine.handleRescueSuccess();
    assert.equal(rescue, null, 'rescue victory is deferred');
    t.mock.timers.tick(1000);
    assert.ok(rescue, 'BATTLE_RESCUE_VICTORY must fire after the 1s delay');
    assert.equal(rescue.isNewPet, true, 'isNewPet is a top-level event flag');
    assert.ok(Array.isArray(rescue.bonusReasons) && rescue.bonusReasons.length > 0, 'rescue bonus reasons top-level');
    const rows = rescue.rewards.petRewards;
    assert.ok(Array.isArray(rows), 'rescue rewards.petRewards must be an array');
    assert.equal(rows.length, 2, 'two pre-existing companions, not the rescued monster');
    assert.equal(rows[0].petId, 'hotpot');
    assert.equal(rows[0].gainedXp, 86);
    assert.equal(rows[0].level, 1);
    assert.equal(rows[0].leveledUp, false);
    assert.equal(rows[1].petId, 'squiddle');
    assert.equal(rows[1].gainedXp, 86);
    assert.equal(rows[1].level, 5);
    assert.equal(rows[1].leveledUp, true);
    assert.ok(!rows.some(r => r.petId === 'peeko'), 'newly rescued pet must not appear in petRewards');
    assert.equal(rescue.rewards.petXp, 86, 'legacy petXp retained');
    assert.ok(state.pets.some(p => p.id === 'peeko'), 'rescued monster joins the team');
  } finally {
    off();
    engine.destroy();
    t.mock.timers.reset();
  }
});

// ---- src/ui/RewardRows.js helper (dynamic import: RED = module not found) ----

async function loadRewardRows() {
  return import('../src/ui/RewardRows.js');
}

test('resolvePetRewardRows: prefers petRewards array (order preserved)', async () => {
  const { resolvePetRewardRows } = await loadRewardRows();
  const a = { petId: 'hotpot', petName: 'Hotpot', gainedXp: 14, level: 5, leveledUp: true };
  const b = { petId: 'squiddle', petName: 'Squiddle', gainedXp: 14, level: 1, leveledUp: false };
  const rows = resolvePetRewardRows({ petRewards: [a, b], activePet: { id: 'other' } });
  assert.equal(rows.length, 2);
  assert.equal(rows[0].petId, 'hotpot');
  assert.equal(rows[1].petId, 'squiddle');
});

test('resolvePetRewardRows: legacy single-pet fallback from activePet + scalar fields', async () => {
  const { resolvePetRewardRows } = await loadRewardRows();
  const rows = resolvePetRewardRows({
    activePet: { id: 'hotpot', name: 'Hotpot', sprite: './assets/sprites/hotpot.png', element: 'fire', level: 5 },
    petXp: 86,
    petLeveledUp: true,
    canEvolve: false
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].petId, 'hotpot');
  assert.equal(rows[0].petName, 'Hotpot');
  assert.equal(rows[0].gainedXp, 86);
  assert.equal(rows[0].level, 5);
  assert.equal(rows[0].leveledUp, true);
});

test('resolvePetRewardRows: falls back to xp when petXp missing; empty payload -> []', async () => {
  const { resolvePetRewardRows } = await loadRewardRows();
  const rows = resolvePetRewardRows({ activePet: { id: 'hotpot', name: 'Hotpot', level: 2 }, xp: 45 });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].gainedXp, 45);
  assert.deepEqual(resolvePetRewardRows({ activePet: null, petRewards: [] }), []);
  assert.deepEqual(resolvePetRewardRows(null), []);
});

test('levelGain: literal final-minus-prev, flag fallback, no level-up -> 0', async () => {
  const { levelGain } = await loadRewardRows();
  assert.equal(levelGain({ prevLevel: 4, level: 5, leveledUp: true }), 1);
  assert.equal(levelGain({ prevLevel: 3, level: 6, leveledUp: true }), 3, 'multi-level gain is literal');
  assert.equal(levelGain({ prevLevel: null, level: 5, leveledUp: true }), 1, 'legacy row without prevLevel');
  assert.equal(levelGain({ prevLevel: 2, level: 2, leveledUp: false }), 0);
});

test('levelUpBannerText: incumbent copy for +1, scaled stat copy for multi-level', async () => {
  const { levelUpBannerText } = await loadRewardRows();
  assert.equal(
    levelUpBannerText({ petName: 'Hotpot', level: 5, prevLevel: 4, leveledUp: true }),
    '🎉 守護精靈 Hotpot 升級至 LV. 5！(Max HP +15, 攻擊 +3)'
  );
  assert.equal(
    levelUpBannerText({ petName: 'Squiddle', level: 6, prevLevel: 3, leveledUp: true }),
    '🎉 守護精靈 Squiddle 升級至 LV. 6！(Max HP +45, 攻擊 +9)'
  );
});

test('resolvePetRewardRows: explicit empty petRewards array is authoritative (no legacy fallback)', async () => {
  const { resolvePetRewardRows } = await loadRewardRows();
  const rows = resolvePetRewardRows({
    petRewards: [],
    activePet: { id: 'hotpot', name: 'Hotpot', level: 1 },
    xp: 50
  });
  assert.deepEqual(rows, [], 'an explicit present array (even empty) must win over legacy scalars');
});

test('resolvePetRewardRows: legacy fallback only when the array contract is absent', async () => {
  const { resolvePetRewardRows } = await loadRewardRows();
  const rows = resolvePetRewardRows({ activePet: { id: 'hotpot', name: 'Hotpot', level: 2 }, xp: 50 });
  assert.equal(rows.length, 1, 'no petRewards key at all -> incumbent single-pet payload still renders');
  assert.equal(rows[0].gainedXp, 50);
});

test('rewardNoticeState: new-companion notice coexists with level-up info (simultaneous level-up + isNewPet)', async () => {
  const { rewardNoticeState } = await loadRewardRows();
  const rows = [
    { petName: 'Squiddle', level: 5, prevLevel: 4, leveledUp: true },
    { petName: 'Hotpot', level: 1, prevLevel: 1, leveledUp: false }
  ];
  const state = rewardNoticeState({ rows, isNewPet: true, monsterName: 'Peeko' });
  assert.equal(state.levelBannerText, '🎉 守護精靈 Squiddle 升級至 LV. 5！(Max HP +15, 攻擊 +3)');
  assert.equal(state.newPetNoticeText, '🌟 【新夥伴入隊】Peeko 已成功解鎖登錄至精靈圖鑑！');
});

test('rewardNoticeState: normal victory carries no isNewPet -> no stale new-companion notice', async () => {
  const { rewardNoticeState } = await loadRewardRows();
  const rows = [{ petName: 'Hotpot', level: 5, prevLevel: 4, leveledUp: true }];
  const state = rewardNoticeState({ rows, monsterName: 'Peeko' }); // monsterName present, flag absent
  assert.equal(state.levelBannerText, '🎉 守護精靈 Hotpot 升級至 LV. 5！(Max HP +15, 攻擊 +3)');
  assert.equal(state.newPetNoticeText, null, 'no isNewPet flag -> notice must be cleared, not shown');
  assert.deepEqual(rewardNoticeState({ rows: [] }), { levelBannerText: null, newPetNoticeText: null });
});

test('rewardNoticeState: rescue without level-up keeps incumbent notice, banner empty', async () => {
  const { rewardNoticeState } = await loadRewardRows();
  const rows = [{ petName: 'Hotpot', level: 1, prevLevel: 1, leveledUp: false }];
  const state = rewardNoticeState({ rows, isNewPet: true, monsterName: 'Peeko' });
  assert.equal(state.levelBannerText, null);
  assert.equal(state.newPetNoticeText, '🌟 【新夥伴入隊】Peeko 已成功解鎖登錄至精靈圖鑑！');
});
