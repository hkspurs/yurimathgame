import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState } from '../src/core/GameState.js';
import { BattleEngine } from '../src/battle/BattleEngine.js';
import { eventBus } from '../src/core/EventBus.js';

for (const outcome of ['handleVictory', 'handleRescueSuccess']) {
  test(`${outcome} publishes restored HP for both companions to the save listener`, () => {
    const state = new GameState({ stars: 0, egg: null });
    state.addPet({ id: 'hotpot', name: 'Hotpot', element: 'fire', level: 1, maxHp: 50, attack: 10 });
    state.addPet({ id: 'squiddle', name: 'Squiddle', element: 'water', level: 1, maxHp: 80, attack: 12 });
    const engine = new BattleEngine(state, {
      id: 'peeko', name: 'Peeko', element: 'earth', level: 1, maxHp: 60, attack: 8,
      rewards: { xp: 10, gold: 5 },
    });
    for (const pet of engine.activePets) pet.hp = 10;
    let saved = null;
    // Snapshot at event time, not a live reference later mutated by the engine.
    const unsubscribe = eventBus.on('PLAYER_STATS_CHANGED', snapshot => {
      saved = JSON.parse(JSON.stringify(snapshot));
    });
    try {
      engine[outcome]();
      for (const id of ['hotpot', 'squiddle']) {
        const live = state.pets.find(p => p.id === id);
        const persisted = saved.pets.find(p => p.id === id);
        assert.equal(live.hp, live.maxHp);
        assert.equal(persisted.hp, live.maxHp, `${id} restored HP must reach auto-save`);
      }
    } finally {
      unsubscribe();
      engine.destroy();
    }
  });
}
