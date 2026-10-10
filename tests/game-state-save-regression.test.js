import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/core/GameState.js';

// Regression: treating valid saved zero values as absent recreates rewards on reload.
for (const field of ['gold', 'stars', 'potionsCount', 'petTreatsCount']) {
  test(`loading an exhausted ${field} balance preserves zero`, () => {
    const state = new GameState({ [field]: 0 });
    assert.equal(state[field], 0);
    const restored = new GameState(JSON.parse(JSON.stringify(state.getSnapshot())));
    assert.equal(restored[field], 0);
  });
}

test('loading an explicitly consumed egg does not create a new starter egg', () => {
  const state = new GameState({ egg: null });
  assert.equal(state.egg, null);
  const restored = new GameState(JSON.parse(JSON.stringify(state.getSnapshot())));
  assert.equal(restored.egg, null);
});

test('fresh and legacy saves without balances or an egg retain their defaults', () => {
  for (const saved of [null, {}]) {
    const state = new GameState(saved);
    assert.equal(state.gold, 150);
    assert.equal(state.stars, 3);
    assert.equal(state.potionsCount, 3);
    assert.equal(state.petTreatsCount, 1);
    assert.equal(state.egg.hasEgg, true);
    assert.equal(state.egg.progress, 1);
    assert.equal(state.egg.target, 3);
  }
});

test('a populated saved egg and nonzero balances survive a snapshot round trip', () => {
  const egg = { hasEgg: true, name: 'Saved egg', progress: 2, target: 3 };
  const state = new GameState({ gold: 42, stars: 7, potionsCount: 2, petTreatsCount: 4, egg });
  const restored = new GameState(JSON.parse(JSON.stringify(state.getSnapshot())));
  assert.equal(restored.gold, 42);
  assert.equal(restored.stars, 7);
  assert.equal(restored.potionsCount, 2);
  assert.equal(restored.petTreatsCount, 4);
  assert.deepEqual(restored.egg, egg);
});
