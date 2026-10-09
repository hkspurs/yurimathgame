// Spells.js - Official Canonical Prodigy Math Game Spells & Items

export const SPELLS = {
  starbit: {
    id: 'starbit',
    name: 'Starbit (星之碎片)',
    element: 'astral',
    icon: '⭐',
    energyCost: 0,
    power: 24,
    desc: '初階訓練魔杖自帶星光法術，凝聚星能碎片打擊目標，不消耗能量。',
    color: '#f39c12'
  },
  bop: {
    id: 'bop',
    name: 'Bop (魔杖敲擊)',
    element: 'astral',
    icon: '🪄',
    energyCost: 0,
    power: 20,
    desc: '揮動訓練魔杖發出清脆的魔法敲擊，命中率極高，不消耗能量。',
    color: '#8e44ad'
  },
  arcane_blast: {
    id: 'arcane_blast',
    name: 'Arcane Blast (秘法衝擊)',
    element: 'astral',
    icon: '🔮',
    energyCost: 0,
    power: 22,
    desc: '標準魔杖法術，不消耗能量點數，造成中等中性魔法傷害。',
    color: '#9b59b6'
  },
  torrent: {
    id: 'torrent',
    name: 'Torrent (激流)',
    element: 'water',
    icon: '🌊',
    energyCost: 1,
    power: 32,
    desc: '正統水系法術，召喚強烈水流轟擊目標，克制火系。',
    color: '#3498db'
  },
  flame_orb: {
    id: 'flame_orb',
    name: 'Flame Orb (烈焰寶珠)',
    element: 'fire',
    icon: '🔥',
    energyCost: 1,
    power: 34,
    desc: '正統火系法術，凝聚高溫火焰球轟擊目標，克制草系/地系。',
    color: '#e74c3c'
  },
  vine_whip: {
    id: 'vine_whip',
    name: 'Vine Whip (藤蔓鞭笞)',
    element: 'earth',
    icon: '🌿',
    energyCost: 1,
    power: 32,
    desc: '正統地/草系法術，召喚荊棘藤蔓猛烈抽擊，克制風暴/雷系。',
    color: '#2ecc71'
  },
  static_shock: {
    id: 'static_shock',
    name: 'Static Shock (靜電震擊)',
    element: 'storm',
    icon: '⚡',
    energyCost: 1,
    power: 32,
    desc: '正統風暴系法術，釋放電弧麻痹敵人，克制水系。',
    color: '#f1c40f'
  },
  star_dust: {
    id: 'star_dust',
    name: 'Star Dust (星塵爆發)',
    element: 'astral',
    icon: '✨',
    energyCost: 2,
    power: 42,
    desc: '正統星能法術，消耗2點能量召喚群星塵埃，不受一般屬性減免。',
    color: '#e67e22'
  },
  potion: {
    id: 'potion',
    name: 'Health Potion (生命藥水)',
    element: 'item',
    icon: '🧪',
    energyCost: 0,
    power: 0,
    healAmount: 40,
    desc: '背包物品：飲用魔法紅藥水，立即恢復 40 點生命值（Hearts）。',
    color: '#27ae60'
  }
};

/**
 * Generates canonical companion pet signature skill based on pet ID & element
 */
export function getPetSignatureSpell(pet) {
  if (!pet) return null;
  const element = pet.element || 'astral';
  const petNameClean = pet.name.split(' ')[0];

  const customMoves = {
    hotpot: { name: '吐火星 (Spit Fire)', icon: '🔥', power: 26 },
    magmay: { name: '熔岩爆發 (Lava Burst)', icon: '🌋', power: 34 },
    squiddle: { name: '墨汁噴射 (Ink Spray)', icon: '💧', power: 26 },
    diveosaur: { name: '深海潮汐 (Tidal Surge)', icon: '🌊', power: 34 },
    peeko: { name: '小鳥啄擊 (Peck Strike)', icon: '🌱', power: 26 },
    floraflare: { name: '藤蔓狂舞 (Vine Barrage)', icon: '🌿', power: 34 },
    snoot: { name: '冰霜吐息 (Frost Breath)', icon: '❄️', power: 26 },
    ice_elemental: { name: '極寒冰柱 (Glacial Spike)', icon: '🧊', power: 34 },
    cloudling: { name: '疾風電光 (Spark Strike)', icon: '⚡', power: 26 },
    galehound: { name: '雷霆咆哮 (Storm Howl)', icon: '🌩️', power: 34 }
  };

  const elemDefaults = {
    fire: { name: '烈焰突擊 (Flame Strike)', icon: '🔥', power: 26 },
    water: { name: '水流衝擊 (Water Jet)', icon: '💧', power: 26 },
    earth: { name: '大地靈擊 (Earth Strike)', icon: '🌱', power: 26 },
    ice: { name: '冰晶飛彈 (Ice Shard)', icon: '❄️', power: 26 },
    storm: { name: '閃電衝擊 (Thunder Zap)', icon: '⚡', power: 26 },
    astral: { name: '星光衝擊 (Star Spark)', icon: '✨', power: 26 }
  };

  const moveData = customMoves[pet.id] || elemDefaults[element] || elemDefaults.astral;
  const spellId = `pet_move_${pet.id}`;

  return {
    id: spellId,
    isPetSpell: true,
    petId: pet.id,
    petName: petNameClean,
    name: `🐾 ${petNameClean}: ${moveData.name}`,
    element: element,
    icon: moveData.icon,
    energyCost: 0,
    power: moveData.power,
    desc: `【🐾 守護精靈專屬招式】由出戰精靈 ${petNameClean} (Lv.${pet.level || 1}) 挺身而出發動的專屬屬性攻擊！`,
    color: '#10ac84'
  };
}

/**
 * Registers pet signature move into SPELLS registry dynamically
 */
export function registerPetSpell(pet) {
  if (!pet) return null;
  const petSpell = getPetSignatureSpell(pet);
  if (petSpell) {
    SPELLS[petSpell.id] = petSpell;
  }
  return petSpell;
}
