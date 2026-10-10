import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/core/GameState.js';
import { BattleEngine } from '../src/battle/BattleEngine.js';
import { eventBus } from '../src/core/EventBus.js';

function battle() {
  const state = new GameState({ stars: 0, egg: null });
  const engine = new BattleEngine(state, {
    id: 'peeko', name: 'Peeko', element: 'earth', maxHp: 60, level: 1,
    attack: 8, rewards: { xp: 10, gold: 5 },
  });
  return { state, engine };
}

test('a defeated wild monster cannot be rescued', () => {
  const { engine } = battle();
  try {
    engine.monster.hp = 0;
    assert.equal(engine.canRescue(), false);
    engine.attemptRescue();
    assert.equal(engine.pendingAction, null);
  } finally { engine.destroy(); }
});

test('a living weakened wild monster remains eligible for rescue', () => {
  const { engine } = battle();
  try {
    engine.monster.hp = 20;
    assert.equal(engine.canRescue(), true);
  } finally { engine.destroy(); }
});

test('a completed victory cannot reopen the math modal through spell selection', () => {
  const { engine } = battle();
  let requests = 0;
  const off = eventBus.on('REQUEST_MATH_QUESTION', () => requests++);
  try {
    engine.handleVictory();
    engine.selectSpell('starbit');
    assert.equal(requests, 0);
  } finally { off(); engine.destroy(); }
});

for (const outcome of ['handleVictory', 'handleRescueSuccess']) {
  test(`${outcome} grants its reward only once per encounter`, () => {
    const { state, engine } = battle();
    try {
      engine[outcome]();
      const once = JSON.parse(JSON.stringify(state.getSnapshot()));
      engine[outcome]();
      assert.deepEqual(JSON.parse(JSON.stringify(state.getSnapshot())), once);
    } finally { engine.destroy(); }
  });
}

test('math cancellation after victory cannot reactivate the battle', () => {
  const { engine } = battle();
  let requests = 0;
  const off = eventBus.on('REQUEST_MATH_QUESTION', () => requests++);
  try {
    engine.handleVictory();
    engine.onMathCancelled();
    engine.selectSpell('starbit');
    assert.equal(requests, 0);
  } finally { off(); engine.destroy(); }
});
