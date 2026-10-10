// CompanionPetAssets.js - Canonical asset manifest & resolution for living elemental companions
export const COMPANION_PET_ASSETS = {
  sprout: {
    id: 'sprout',
    name: 'Sprout (嫩芽精靈)',
    speciesTitle: '芽芽草熊 (草)',
    element: 'earth',
    portrait: './assets/sprites/companions/sprout_portrait.png',
    battlePlayer: './assets/sprites/companions/sprout_battle_player.png',
    battleEnemy: './assets/sprites/companions/sprout_battle_enemy.png',
    overworld: './assets/sprites/companions/sprout_overworld.png',
    icon: './assets/sprites/companions/sprout_icon.png',
    fallback: './assets/sprites/sprout.png',
    mirrorSafe: true,
    scale: 1.05,
    anchorY: 0.95,
    idleCycleSpeed: 0.95,
    idleBobAmp: 2.0
  },
  squiddle: {
    id: 'squiddle',
    name: 'Squiddle (章魚仔)',
    speciesTitle: '水滴萌兔 (水)',
    element: 'water',
    portrait: './assets/sprites/companions/squiddle_portrait.png',
    battlePlayer: './assets/sprites/companions/squiddle_battle_player.png',
    battleEnemy: './assets/sprites/companions/squiddle_battle_enemy.png',
    overworld: './assets/sprites/companions/squiddle_overworld.png',
    icon: './assets/sprites/companions/squiddle_icon.png',
    fallback: './assets/sprites/squiddle.png',
    mirrorSafe: true,
    scale: 1.0,
    anchorY: 0.95,
    idleCycleSpeed: 1.45,
    idleBobAmp: 2.8
  },
  cloudling: {
    id: 'cloudling',
    name: 'Cloudling (雷雲獸)',
    speciesTitle: '雷電倉鼠 (電)',
    element: 'storm',
    portrait: './assets/sprites/companions/cloudling_portrait.png',
    battlePlayer: './assets/sprites/companions/cloudling_battle_player.png',
    battleEnemy: './assets/sprites/companions/cloudling_battle_enemy.png',
    overworld: './assets/sprites/companions/cloudling_overworld.png',
    icon: './assets/sprites/companions/cloudling_icon.png',
    fallback: './assets/sprites/cloudling.png',
    mirrorSafe: true,
    scale: 1.0,
    anchorY: 0.95,
    idleCycleSpeed: 2.1,
    idleBobAmp: 2.4
  },
  pyropup: {
    id: 'pyropup',
    name: 'Pyropup (火犬獸)',
    speciesTitle: '烈焰柴犬 (火)',
    element: 'fire',
    portrait: './assets/sprites/companions/pyropup_portrait.png',
    battlePlayer: './assets/sprites/companions/pyropup_battle_player.png',
    battleEnemy: './assets/sprites/companions/pyropup_battle_enemy.png',
    overworld: './assets/sprites/companions/pyropup_overworld.png',
    icon: './assets/sprites/companions/pyropup_icon.png',
    fallback: './assets/sprites/pyropup.png',
    mirrorSafe: true,
    scale: 1.0,
    anchorY: 0.95,
    idleCycleSpeed: 1.6,
    idleBobAmp: 2.4
  },
  hotpot: {
    id: 'hotpot',
    name: 'Hotpot (火鍋怪)',
    speciesTitle: '炭火陶甲獸 (火)',
    element: 'fire',
    portrait: './assets/sprites/companions/hotpot.png',
    battlePlayer: './assets/sprites/companions/hotpot_battle_player.png',
    battleEnemy: './assets/sprites/companions/hotpot_battle_enemy.png',
    overworld: './assets/sprites/companions/hotpot_overworld.png',
    icon: './assets/sprites/companions/hotpot_icon.png',
    fallback: './assets/sprites/hotpot.png',
    mirrorSafe: true,
    scale: 1.05,
    anchorY: 0.95,
    idleCycleSpeed: 0.9,
    idleBobAmp: 1.8
  },
  cinderkat: {
    id: 'cinderkat',
    name: 'Cinderkat (熾焰幼貓)',
    speciesTitle: '餘燼暖貓 (火)',
    element: 'fire',
    portrait: './assets/sprites/companions/cinderkat_portrait.png',
    battlePlayer: './assets/sprites/companions/cinderkat_battle_player.png',
    battleEnemy: './assets/sprites/companions/cinderkat_battle_enemy.png',
    overworld: './assets/sprites/companions/cinderkat_overworld.png',
    icon: './assets/sprites/companions/cinderkat_icon.png',
    fallback: './assets/sprites/cinderkat.png',
    mirrorSafe: true,
    scale: 0.95,
    anchorY: 0.95,
    idleCycleSpeed: 1.8,
    idleBobAmp: 2.2
  },
  magmay: {
    id: 'magmay',
    name: 'Magmay (熔岩獸)',
    speciesTitle: '熔岩幼龍 (火)',
    element: 'fire',
    portrait: './assets/sprites/companions/magmay.png',
    battlePlayer: './assets/sprites/companions/magmay_battle_player.png',
    battleEnemy: './assets/sprites/companions/magmay_battle_enemy.png',
    overworld: './assets/sprites/companions/magmay_overworld.png',
    icon: './assets/sprites/companions/magmay_icon.png',
    fallback: './assets/sprites/magmay.png',
    mirrorSafe: true,
    scale: 1.15,
    anchorY: 0.95,
    idleCycleSpeed: 0.85,
    idleBobAmp: 2.0
  }
};

/**
 * Resolve companion sprite asset path by purpose and side, with graceful fallback.
 * @param {string} id - Pet or Monster ID
 * @param {'portrait'|'battle'|'overworld'|'icon'} purpose
 * @param {'player'|'enemy'} side
 * @param {string} fallbackUrl - Optional fallback URL
 * @returns {string} Resolved image source path
 */
export function getPetAssetUrl(id, purpose = 'portrait', side = 'player', fallbackUrl = null) {
  if (!id) return fallbackUrl || './assets/sprites/hotpot.png';
  const comp = COMPANION_PET_ASSETS[id];
  if (!comp) return fallbackUrl || `./assets/sprites/${id}.png`;
  
  switch (purpose) {
    case 'battle':
      return side === 'enemy' ? comp.battleEnemy : comp.battlePlayer;
    case 'overworld':
      return comp.overworld;
    case 'icon':
      return comp.icon;
    case 'portrait':
    default:
      return comp.portrait;
  }
}

/**
 * Get companion metadata config (animations, scale, anchors)
 * @param {string} id
 */
export function getPetConfig(id) {
  return COMPANION_PET_ASSETS[id] || null;
}
