// pet-acquisition.test.js - Section B: truthful Pet Book acquisition hints
// Verifies that locked Pet Book cards show guidance derived from REAL catalog
// metadata (isBoss flag, evolution predecessors, stage/pool encounter lists),
// instead of the old blanket "Rescue" hint that wrongly promised rescue for
// Realm Bosses and evolution-only forms.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CANON_MONSTERS, PET_EVOLUTIONS } from '../src/battle/CanonDatabase.js';
import { WORLDS } from '../src/battle/Worlds.js';
import { REALM_MONSTER_POOLS } from '../src/scenes/WorldScene.js';
import {
  collectWildEncounterIds,
  buildAcquisitionRoutes,
  classifyAcquisition,
  getAcquisitionHint,
} from '../src/ui/PetAcquisition.js';
import { PetBookModal } from '../src/ui/PetBookModal.js';

const OLD_BLANKET_HINT = '在冒險戰鬥中將體力削弱至45%後使用【💖 Rescue】淨化';
const KINDS = ['wild', 'boss_only', 'boss_evolution', 'wild_evolution', 'evolution_only', 'unknown'];

const WILD = collectWildEncounterIds(WORLDS, REALM_MONSTER_POOLS);

// ---------------------------------------------------------------------------
// collectWildEncounterIds
// ---------------------------------------------------------------------------

test('collectWildEncounterIds unions stage monsterIds and pool encounter ids', () => {
  // Stage encounters (non-boss + boss keystone stages alike — the boss flag
  // is handled later by classification, not by dropping stage entries).
  for (const id of ['hotpot', 'peeko', 'squiddle', 'snoot', 'cloudling', 'magmay']) {
    assert.ok(WILD.has(id), `stage encounter ${id} must be counted as wild-encounterable`);
  }
  // Roaming pool encounters only (never appear in stage lists).
  for (const id of ['sprout', 'fishbol', 'pyropup', 'chillwing', 'stormcloud']) {
    assert.ok(WILD.has(id), `pool encounter ${id} must be counted as wild-encounterable`);
  }
  // All 10 pet500 canine companions roam realm pools.
  for (const id of Object.keys(CANON_MONSTERS)) {
    if (id.startsWith('pet500_canine_')) {
      assert.ok(WILD.has(id), `${id} must be counted as wild-encounterable`);
    }
  }
  // Exact size: 11 unique stage ids + 15 pool-only ids (5 roaming base + 10 pet500).
  assert.equal(WILD.size, 26, 'union of all stage and pool encounter ids must be exactly 26');
});

// ---------------------------------------------------------------------------
// Real-data classification via getAcquisitionHint (no fixtures)
// ---------------------------------------------------------------------------

test('ordinary wild rescue species are told the weaken-to-45% rescue route', () => {
  for (const id of ['hotpot', 'peeko', 'squiddle', 'snoot', 'cloudling', 'sprout', 'fishbol', 'pyropup', 'chillwing', 'stormcloud']) {
    const hint = getAcquisitionHint(id);
    assert.equal(hint.kind, 'wild', `${id} must be classified wild`);
    assert.equal(hint.isBoss, false, `${id} is not a boss`);
    assert.ok(hint.text.includes('45%'), `${id} hint must mention the 45% threshold`);
    assert.ok(hint.text.includes('【💖 Rescue】'), `${id} hint must mention the Rescue spell`);
    assert.notEqual(hint.text, OLD_BLANKET_HINT, `${id} must not reuse the old blanket hint verbatim`);
  }
  // pet500 companions: real wild pool encounters, rescueable.
  const blazePup = getAcquisitionHint('pet500_canine_fire_1');
  assert.equal(blazePup.kind, 'wild', 'BlazePup must be classified wild');
  assert.ok(blazePup.text.includes('45%'));
});

test('genuine keystone guardian bosses are never promised rescue', () => {
  const ember = getAcquisitionHint('ember_fox');
  assert.equal(ember.kind, 'boss_only');
  assert.equal(ember.isBoss, true);
  assert.ok(ember.text.includes('無法被 Rescue'), 'boss copy must state rescue is impossible');
  assert.ok(ember.text.includes('神石'), 'boss copy must point to the keystone guard battle');
  assert.ok(!ember.text.includes('45%'), 'boss copy must not promise the 45% rescue route');
  assert.ok(!ember.text.includes('【💖 Rescue】'), 'boss copy must not advertise the Rescue spell as usable');

  const pudding = getAcquisitionHint('sparkpudding');
  assert.equal(pudding.kind, 'boss_only');
  assert.ok(pudding.text.includes('無法被 Rescue'));
});

test('boss evolution forms say rescue is impossible AND name the real predecessor', () => {
  const cases = [
    ['diveosaur', 'Squiddle'],
    ['ice_elemental', 'Snoot'],
    ['galehound', 'Cloudling'],
  ];
  for (const [id, predName] of cases) {
    const hint = getAcquisitionHint(id);
    assert.equal(hint.kind, 'boss_evolution', `${id} must be classified boss_evolution`);
    assert.equal(hint.isBoss, true);
    assert.ok(hint.text.includes('無法被 Rescue'), `${id} copy must state rescue is impossible`);
    assert.ok(hint.text.includes(predName), `${id} copy must name real predecessor ${predName}`);
    assert.ok(!hint.text.includes('45%'), `${id} copy must not promise the 45% rescue route`);
  }
});

test('magmay is NOT evolution-only: it has both a real wild route and an evolution predecessor', () => {
  const hint = getAcquisitionHint('magmay');
  assert.equal(hint.kind, 'wild_evolution');
  assert.equal(hint.isBoss, false);
  assert.ok(hint.text.includes('45%'), 'magmay must still mention the real wild rescue route');
  assert.ok(hint.text.includes('Hotpot'), 'magmay must name its predecessor Hotpot');
  assert.ok(hint.text.includes('進化'), 'magmay must mention the evolution route');
  assert.ok(!hint.text.includes('目前無已知野外收服途徑'), 'magmay must not be labeled as having no wild route');
});

test('floraflare is evolution-only and names the real predecessor without level or cost', () => {
  const hint = getAcquisitionHint('floraflare');
  assert.equal(hint.kind, 'evolution_only');
  assert.equal(hint.isBoss, false);
  assert.ok(hint.text.includes('Peeko'), 'must name real predecessor Peeko');
  assert.ok(hint.text.includes('進化'), 'must mention evolution');
  assert.ok(hint.text.includes('目前無已知野外收服途徑'), 'must honestly state no known wild route');
  assert.ok(!hint.text.includes('45%'), 'must not promise rescue');
  assert.match(hint.text, /Peeko/, 'predecessor name must be the resolved catalog name');
  assert.ok(!/Lv\.|\d+\s*級|\d+\s*星/.test(hint.text), 'must not fabricate a level or star cost');
});

test('species with no confirmed route get an honest noncommittal hint', () => {
  for (const id of ['triptrop', 'charfoal', 'burnie', 'cinderkat', 'aquafox', 'crabbot', 'starfin',
    'mossy', 'woodling', 'frostfang', 'snowfluff', 'polarcub', 'electromite', 'zapzap', 'windcherub', 'volts']) {
    const hint = getAcquisitionHint(id);
    assert.equal(hint.kind, 'unknown', `${id} must be classified unknown`);
    assert.ok(hint.text.length > 0, `${id} must still show some copy`);
    assert.ok(!hint.text.includes('45%'), `${id} must not promise the 45% rescue route`);
    assert.ok(!hint.text.includes('【💖 Rescue】'), `${id} must not advertise the Rescue spell`);
    assert.ok(!hint.text.includes('進化獲得'), `${id} must not invent an evolution route`);
  }
});

// ---------------------------------------------------------------------------
// Global consistency sweep over every catalog species
// ---------------------------------------------------------------------------

test('every catalog species is classified consistently with real metadata', () => {
  const routes = buildAcquisitionRoutes({
    monsters: CANON_MONSTERS,
    evolutions: PET_EVOLUTIONS,
    wildIds: WILD,
  });

  for (const [id, m] of Object.entries(CANON_MONSTERS)) {
    const route = routes[id];
    assert.ok(route, `${id} must have an acquisition route`);
    const kind = classifyAcquisition(route);
    const hint = getAcquisitionHint(id);
    assert.equal(kind, hint.kind, `${id}: classifier and hint must agree`);
    assert.ok(KINDS.includes(kind), `${id}: kind must be one of ${KINDS.join(', ')} (got ${kind})`);
    assert.ok(typeof hint.text === 'string' && hint.text.length > 0, `${id}: text must be non-empty`);
    assert.ok(!hint.text.includes(OLD_BLANKET_HINT), `${id}: old blanket hint must never appear`);

    // The isBoss flag (the exact predicate BattleEngine.canRescue uses) is the
    // only thing that may mark a species as a boss.
    assert.equal(!!hint.isBoss, m.isBoss === true, `${id}: isBoss must mirror the real flag`);

    if (m.isBoss === true) {
      assert.ok(kind === 'boss_only' || kind === 'boss_evolution', `${id}: boss must not be labeled ${kind}`);
      assert.ok(!hint.text.includes('45%'), `${id}: boss copy must not promise rescue at 45%`);
      if (kind === 'boss_evolution') assert.ok(hint.predecessors.length > 0, `${id}: boss_evolution needs predecessors`);
    }

    if (kind === 'wild' || kind === 'wild_evolution') {
      assert.ok(WILD.has(id), `${id}: labeled wild but not present in any stage/pool encounter list`);
      assert.ok(!hint.isBoss, `${id}: wild copy must not apply to a boss`);
    }

    if (kind === 'boss_only' || kind === 'boss_evolution') {
      assert.equal(m.isBoss, true, `${id}: boss copy must only apply to real isBoss species`);
    }

    if (kind === 'evolution_only' || kind === 'boss_evolution' || kind === 'wild_evolution') {
      assert.ok(hint.predecessors.length > 0, `${id}: evolution copy must name at least one predecessor`);
      for (const predId of Object.keys(PET_EVOLUTIONS)) {
        if (PET_EVOLUTIONS[predId].nextForm && PET_EVOLUTIONS[predId].nextForm.id === id) {
          const predName = CANON_MONSTERS[predId]?.name ?? predId;
          assert.ok(hint.text.includes(predName.split(' ')[0]), `${id}: copy must mention real predecessor ${predName}`);
        }
      }
      assert.ok(!/Lv\.|\d+\s*級|\d+\s*星/.test(hint.text), `${id}: must not fabricate level/cost`);
    }

    if (kind === 'unknown') {
      assert.equal(hint.isBoss, false, `${id}: unknown must not be a boss`);
      assert.ok(!WILD.has(id) || m.isBoss === false, `${id}: unknown must not have a confirmed wild route`);
      assert.ok(!hint.text.includes('45%') && !hint.text.includes('【💖 Rescue】'), `${id}: unknown must promise nothing`);
    }
  }
});

// ---------------------------------------------------------------------------
// Branch fixtures (explicit contrived inputs, not catalog data)
// ---------------------------------------------------------------------------

test('habitat text "(Boss)" alone never marks a species as a boss', () => {
  const hint = getAcquisitionHint('fake_roamer', {
    monsters: {
      fake_roamer: { id: 'fake_roamer', name: 'Fake Roamer (假 roaming)', habitat: '某處密林 (Boss)' },
    },
    evolutions: {},
    wildIds: new Set(['fake_roamer']),
  });
  assert.equal(hint.isBoss, false, 'classification must ignore habitat strings');
  assert.equal(hint.kind, 'wild');
});

test('real isBoss flag takes precedence over wild encounter membership', () => {
  const route = { isBoss: true, wild: true, predecessors: [] };
  assert.equal(classifyAcquisition(route), 'boss_only');
  const hint = getAcquisitionHint('stage_boss', {
    monsters: { stage_boss: { id: 'stage_boss', name: 'Stage Boss', isBoss: true } },
    evolutions: {},
    wildIds: new Set(['stage_boss']),
  });
  assert.equal(hint.kind, 'boss_only');
  assert.ok(hint.text.includes('無法被 Rescue'));
});

test('multiple predecessors to the same target are all named, joined with " / "', () => {
  const hint = getAcquisitionHint('twin_form', {
    monsters: {
      p1: { id: 'p1', name: 'P1' },
      p2: { id: 'p2', name: 'P2' },
      twin_form: { id: 'twin_form', name: 'Twin Form' },
    },
    evolutions: {
      p1: { stage: 1, nextForm: { id: 'twin_form', name: 'Twin Form' } },
      p2: { stage: 1, nextForm: { id: 'twin_form', name: 'Twin Form' } },
    },
    wildIds: new Set(),
  });
  assert.equal(hint.kind, 'evolution_only');
  assert.ok(hint.text.includes('P1'), 'must name first predecessor');
  assert.ok(hint.text.includes('P2'), 'must name second predecessor');
  assert.ok(hint.text.includes('P1 / P2'), 'predecessors must be joined with " / "');
});

test('unknown id resolves to an honest noncommittal hint', () => {
  const hint = getAcquisitionHint('does_not_exist', {
    monsters: {},
    evolutions: {},
    wildIds: new Set(),
  });
  assert.equal(hint.kind, 'unknown');
  assert.ok(hint.text.length > 0);
  assert.ok(!hint.text.includes('45%') && !hint.text.includes('【💖 Rescue】'));
});

test('a predecessor missing from the catalog falls back to its id (no crash, no fabricated name)', () => {
  const hint = getAcquisitionHint('orphan_form', {
    monsters: { orphan_form: { id: 'orphan_form', name: 'Orphan Form' } },
    evolutions: { mystery_pred: { stage: 1, nextForm: { id: 'orphan_form', name: 'Orphan Form' } } },
    wildIds: new Set(),
  });
  assert.equal(hint.kind, 'evolution_only');
  assert.ok(hint.text.includes('mystery_pred'), 'missing predecessor must fall back to its id');
});

test('evolution entries without nextForm.id are ignored gracefully', () => {
  const routes = buildAcquisitionRoutes({
    monsters: { p: { id: 'p', name: 'P' }, t: { id: 't', name: 'T' } },
    evolutions: {
      p: { stage: 1, evolutionLevel: 5, starCost: 2 }, // no nextForm at all
      broken: { stage: 1, nextForm: {} },               // nextForm without id
    },
    wildIds: new Set(),
  });
  assert.deepEqual(routes.t.predecessors, [], 't must not gain fake predecessors');
  assert.equal(classifyAcquisition(routes.t), 'unknown');
  assert.ok(routes.p, 'p must still be routed even without a nextForm');
  assert.deepEqual(routes.p.predecessors, []);
  assert.equal(classifyAcquisition(routes.p), 'unknown');
});

// ---------------------------------------------------------------------------
// UI integration: PetBookModal renders derived copy on locked cards
// ---------------------------------------------------------------------------

function makeEl() {
  const el = {
    children: [],
    classList: { add() {}, remove() {}, contains: () => false },
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => [],
    style: {},
    dataset: {},
    appendChild(child) { el.children.push(child); },
    _innerHTML: '',
  };
  Object.defineProperty(el, 'innerHTML', {
    get: () => el._innerHTML,
    set: (v) => { el._innerHTML = String(v); el.children = []; },
  });
  return el;
}

test('PetBookModal locked cards show derived acquisition copy; silhouettes, habitat, counter and owned buttons are preserved', () => {
  const els = {};
  for (const id of ['pet-book-modal', 'pet-book-grid', 'pet-book-counter', 'pet-book-tabs', 'btn-close-pet-book']) {
    els[id] = makeEl();
  }
  globalThis.document = {
    getElementById: (id) => els[id] ?? null,
    createElement: () => makeEl(),
  };

  // The modal only touches document in its constructor, so the stub must be
  // ready before construction.
  const fakeState = {
    getSnapshot: () => ({
      pets: [{ id: 'hotpot', name: 'Hotpot (火鍋怪)', element: 'fire', level: 1, maxHp: 45, attack: 9, weakness: 'water', resistance: 'fire' }],
      activePetIds: [],
      activePetId: null,
    }),
    canEvolvePet: () => false,
    toggleActivePet: () => {},
  };

  const modal = new PetBookModal(fakeState);
  modal.renderGrid();

  const cards = els['pet-book-grid'].children;
  const findCard = (sprite, habitat) => cards.find(c =>
    c.innerHTML.includes(sprite) && (habitat ? c.innerHTML.includes(habitat) : true));

  // Counter reflects real owned/catalog counts (44 catalog - 1 tutorial mentor = 43).
  assert.equal(cards.length, 43, 'pet book must show 43 cards');
  assert.equal(els['pet-book-counter'].textContent, '🐾 已收服精靈：1 / 43');

  // Owned card keeps its existing UI (follow button, no silhouette, no hint tag).
  const hotpotCard = findCard('hotpot.png');
  assert.ok(hotpotCard, 'owned hotpot card must render');
  assert.ok(hotpotCard.className.includes('unlocked'));
  assert.ok(hotpotCard.innerHTML.includes('btn-dex-follow'), 'owned card must keep the follow button');
  assert.ok(!hotpotCard.innerHTML.includes('silhouette'), 'owned card must not use the silhouette');

  // Locked Ember Fox: boss copy, silhouette, habitat clue all preserved.
  const bossCard = findCard('ember_fox.png');
  assert.ok(bossCard, 'locked ember_fox card must render');
  assert.ok(bossCard.className.includes('locked'));
  assert.ok(bossCard.innerHTML.includes('silhouette-img'), 'locked card must keep the silhouette');
  assert.ok(bossCard.innerHTML.includes('🔒 未解鎖'));
  assert.ok(bossCard.innerHTML.includes('??? (暗影未淨化)'));
  assert.ok(bossCard.innerHTML.includes('📍 出沒地帶：'), 'locked card must keep the habitat clue line');
  assert.ok(bossCard.innerHTML.includes('螢火古樹 (Boss)'), 'current habitat string must be preserved verbatim');
  assert.ok(bossCard.innerHTML.includes('dex-hint-tag'), 'locked card must keep the hint slot');
  assert.ok(bossCard.innerHTML.includes('無法被 Rescue'), 'boss card must state rescue is impossible');
  assert.ok(bossCard.innerHTML.includes('神石'), 'boss card must point to the keystone battle');
  assert.ok(!bossCard.innerHTML.includes(OLD_BLANKET_HINT), 'old blanket hint must be gone from boss cards');
  assert.ok(!bossCard.innerHTML.includes('45%'), 'boss card must not promise the 45% route');

  // Locked Floraflare: evolution copy names Peeko, no rescue promise.
  const floraCard = findCard('floraflare.png');
  assert.ok(floraCard, 'locked floraflare card must render');
  assert.ok(floraCard.innerHTML.includes('Peeko'), 'floraflare card must name predecessor Peeko');
  assert.ok(floraCard.innerHTML.includes('進化'), 'floraflare card must mention evolution');
  assert.ok(!floraCard.innerHTML.includes('45%'), 'floraflare card must not promise rescue');

  // Locked Magmay: dual route — wild rescue AND Hotpot evolution (not evolution-only).
  const magmayCard = findCard('magmay.png');
  assert.ok(magmayCard, 'locked magmay card must render');
  assert.ok(magmayCard.innerHTML.includes('45%'), 'magmay card must keep the real wild rescue route');
  assert.ok(magmayCard.innerHTML.includes('Hotpot'), 'magmay card must name predecessor Hotpot');
  assert.ok(!magmayCard.innerHTML.includes('目前無已知野外收服途徑'), 'magmay must not be labeled evolution-only');

  // Locked Diveosaur: boss + evolution copy names Squiddle.
  const diveCard = findCard('diveosaur.png');
  assert.ok(diveCard, 'locked diveosaur card must render');
  assert.ok(diveCard.innerHTML.includes('無法被 Rescue'));
  assert.ok(diveCard.innerHTML.includes('Squiddle'), 'diveosaur card must name predecessor Squiddle');

  // Locked Volts: unknown — honest copy, no rescue promise. (shares sprite with
  // stormcloud, so disambiguate by habitat.)
  const voltsCard = findCard('stormcloud.png', '雷霆要塞');
  assert.ok(voltsCard, 'locked volts card must render');
  assert.ok(!voltsCard.innerHTML.includes('45%'), 'unknown card must not promise the 45% route');
  assert.ok(!voltsCard.innerHTML.includes('【💖 Rescue】'), 'unknown card must not advertise Rescue');
  assert.ok(voltsCard.innerHTML.includes('dex-hint-tag'), 'unknown card must still fill the hint slot');

  // Locked BlazePup (pet500): real wild pool encounter, so rescue copy is honest.
  const pupCard = findCard('pet500_canine_fire_1.png');
  assert.ok(pupCard, 'locked BlazePup card must render');
  assert.ok(pupCard.innerHTML.includes('45%'), 'BlazePup is a real wild encounter and must keep rescue copy');

  // No locked card anywhere may still carry the old blanket hint.
  const lockedCards = cards.filter(c => c.className.split(' ').includes('locked'));
  assert.ok(lockedCards.length === 42, 'exactly 42 cards are locked with 1 owned');
  for (const c of lockedCards) {
    assert.ok(!c.innerHTML.includes(OLD_BLANKET_HINT), 'old blanket hint must be gone from every locked card');
    assert.ok(c.innerHTML.includes('📍 出沒地帶：'), 'every locked card must keep its habitat clue');
    assert.ok(c.innerHTML.includes('dex-hint-tag'), 'every locked card must fill the hint slot');
  }
});
