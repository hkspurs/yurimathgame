// CanonDatabase.js - Official Prodigy Math Game Canon Items, Monsters, and Shop Database
import { PETS_500_DATABASE } from './PetDatabase500.js';

export const CANON_ITEMS = {
  wands: [
    { id: 'wand_training', name: 'Training Wand (訓練魔杖)', power: 12, price: 0, element: 'astral', desc: '導師 Theo Addiwise 贈送的舊魔杖，可釋放 Starbit 與 Bop 基礎法術。' },
    { id: 'wand_basic', name: 'Basic Wand (基礎木杖)', power: 10, price: 0, element: 'astral', desc: '新手入學獲贈的魔杖，提供基礎魔法增幅。' },
    { id: 'wand_ember', name: 'Ember Wand (炎火魔杖)', power: 22, price: 120, element: 'fire', desc: '由火螢森林紅木雕刻，火系法術威力提升。' },
    { id: 'wand_tidal', name: 'Tidal Wand (潮汐魔杖)', power: 24, price: 160, element: 'water', desc: '鑲嵌海難海岸藍珍珠，水系法術威力提升。' },
    { id: 'wand_storm', name: 'Thunder Wand (雷霆魔杖)', power: 30, price: 240, element: 'storm', desc: '引導風暴城雷電的精緻魔杖，爆發力極高。' },
    { id: 'wand_titanium', name: 'Titanium Wand (鈦金神杖)', power: 42, price: 450, element: 'astral', desc: '古代學院工藝製造的頂級魔杖，全屬性大幅提升。' }
  ],
  hats: [
    { id: 'hat_apprentice', name: 'Apprentice Hat (學徒帽)', hearts: 15, price: 0, desc: '標準學院學徒巫師帽，提供基礎生命加成。' },
    { id: 'hat_scholar', name: 'Scholar Cap (學者方帽)', hearts: 35, price: 100, desc: '刻有幾何紋理的學者帽，增加 35 點 Hearts。' },
    { id: 'hat_pyro', name: 'Flame Band (炎火頭帶)', hearts: 55, price: 200, desc: '火山探險者佩戴的耐熱頭帶，增加 55 點 Hearts。' },
    { id: 'hat_frost', name: 'Frost Crown (霜凍王冠)', hearts: 80, price: 380, desc: '極地萬年玄冰凝結而成的王冠，增加 80 點 Hearts。' }
  ],
  outfits: [
    { id: 'outfit_apprentice', name: 'Apprentice Robe (學徒法袍)', hearts: 20, price: 0, desc: '學院統一款式的初級法師長袍。' },
    { id: 'outfit_traveler', name: 'Traveler Cloak (旅行者斗篷)', hearts: 45, price: 150, desc: '抗風禦寒的野外探險斗篷，增加 45 點 Hearts。' },
    { id: 'outfit_guardian', name: 'Guardian Robes (守護者法袍)', hearts: 85, price: 350, desc: '編織有神石符文的厚重法袍，大幅提升防護。' }
  ],
  boots: [
    { id: 'boots_leather', name: 'Leather Boots (冒險皮靴)', hearts: 10, price: 0, desc: '耐磨結實的牛皮短靴。' },
    { id: 'boots_winged', name: 'Winged Boots (羽翼輕靴)', hearts: 30, price: 180, desc: '附有浮空羽毛的輕便靴，增加 30 點 Hearts。' }
  ],
  potions: [
    { id: 'potion_health', name: 'Health Potion (生命紅藥水)', heal: 45, price: 30, desc: '立即恢復 45 點生命值（Hearts）。' },
    { id: 'potion_xp', name: 'XP Elixir (雙倍經驗魔藥)', xpBoost: 3, price: 60, desc: '在接下來 3 場戰鬥中獲得 2 倍經驗值！' },
    { id: 'pet_treat', name: 'Starfruit Treat (星光精靈誘餌)', catchBoost: true, price: 50, desc: '戰鬥中使用可安撫野怪心靈，直接削弱野怪體力至可收服線！' }
  ]
};

// Canon Prodigy Monsters with exact official names and elemental affiliations
export const BASE_CANON_MONSTERS = {
  // Firefly Forest
  hotpot: {
    id: 'hotpot',
    name: 'Hotpot (火鍋怪)',
    element: 'fire',
    level: 1,
    maxHp: 45,
    attack: 9,
    sprite: './assets/sprites/hotpot.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Spit Fire (吐火星)', power: 8, text: 'Hotpot 噴射出一小團火星！' }],
    rewards: { xp: 25, gold: 15 }
  },
  peeko: {
    id: 'peeko',
    name: 'Peeko (皮克鳥)',
    element: 'earth',
    level: 2,
    maxHp: 60,
    attack: 11,
    sprite: './assets/sprites/peeko.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Peck (啄擊)', power: 10, text: 'Peeko 用尖銳的小喙啄了一下！' }],
    rewards: { xp: 35, gold: 20 }
  },
  floraflare: {
    id: 'floraflare',
    name: 'Floraflare (繁花靈鳥)',
    element: 'earth',
    level: 3,
    maxHp: 65,
    attack: 12,
    sprite: './assets/sprites/floraflare.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Vine Barrage (藤蔓狂舞)', power: 12, text: 'Floraflare 揮舞翠綠藤蔓！' }],
    rewards: { xp: 40, gold: 25 }
  },
  ember_fox: {
    id: 'ember_fox',
    name: 'Ember Fox (炎尾小狐狸) [Boss]',
    element: 'fire',
    isBoss: true,
    level: 3,
    maxHp: 90,
    attack: 15,
    sprite: './assets/sprites/ember_fox.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Flame Burst (烈焰突襲)', power: 15, text: 'Ember Fox 燃起熊熊烈火發動猛撲！' }],
    rewards: { xp: 60, gold: 40 }
  },

  // Shipwreck Shore
  squiddle: {
    id: 'squiddle',
    name: 'Squiddle (章魚仔)',
    element: 'water',
    level: 4,
    maxHp: 80,
    attack: 14,
    sprite: './assets/sprites/squiddle.png',
    weakness: 'storm',
    resistance: 'fire',
    skills: [{ name: 'Ink Spray (墨汁噴射)', power: 13, text: 'Squiddle 噴出了漆黑的深海墨汁！' }],
    rewards: { xp: 50, gold: 30 }
  },
  fishbol: {
    id: 'fishbol',
    name: 'Fishbol (小魚獸)',
    element: 'water',
    level: 4,
    maxHp: 75,
    attack: 13,
    sprite: './assets/sprites/fishbol.png',
    weakness: 'storm',
    resistance: 'fire',
    skills: [{ name: 'Bubble Blast (泡泡連擊)', power: 12, text: 'Fishbol 吐出一串連環氣泡！' }],
    rewards: { xp: 48, gold: 28 }
  },
  triptrop: {
    id: 'triptrop',
    name: 'TripTrop (海龜獸)',
    element: 'water',
    level: 5,
    maxHp: 85,
    attack: 15,
    sprite: './assets/sprites/triptrop.png',
    weakness: 'storm',
    resistance: 'fire',
    skills: [{ name: 'Aqua Jet (水流噴射)', power: 14, text: 'TripTrop 噴射出強烈水流！' }],
    rewards: { xp: 55, gold: 35 }
  },
  diveosaur: {
    id: 'diveosaur',
    name: 'Diveosaur (潛水恐龍) [Boss]',
    element: 'water',
    isBoss: true,
    level: 6,
    maxHp: 130,
    attack: 20,
    sprite: './assets/sprites/diveosaur.png',
    weakness: 'storm',
    resistance: 'fire',
    skills: [{ name: 'Tsunami Wave (海嘯巨浪)', power: 19, text: 'Diveosaur 掀起拍岸巨浪！' }],
    rewards: { xp: 90, gold: 60 }
  },

  // Bonfire Spire
  magmay: {
    id: 'magmay',
    name: 'Magmay (熔岩獸)',
    element: 'fire',
    level: 7,
    maxHp: 120,
    attack: 21,
    sprite: './assets/sprites/magmay.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Lava Toss (岩漿投擲)', power: 19, text: 'Magmay 抓起滾燙岩漿砸了過來！' }],
    rewards: { xp: 85, gold: 50 }
  },
  pyropup: {
    id: 'pyropup',
    name: 'Pyropup (火犬獸)',
    element: 'fire',
    level: 8,
    maxHp: 110,
    attack: 20,
    sprite: './assets/sprites/pyropup.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Flame Bite (炎火撕咬)', power: 18, text: 'Pyropup 燃起火焰撕咬！' }],
    rewards: { xp: 80, gold: 48 }
  },
  sparkpudding: {
    id: 'sparkpudding',
    name: 'Sparkpudding (星火布丁) [Boss]',
    element: 'fire',
    isBoss: true,
    level: 9,
    maxHp: 175,
    attack: 27,
    sprite: './assets/sprites/sparkpudding.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Volcanic Eruption (火山爆發)', power: 26, text: 'Sparkpudding 全身引燃爆發高溫衝擊！' }],
    rewards: { xp: 150, gold: 110 }
  },

  // Shiverchill Mountains
  snoot: {
    id: 'snoot',
    name: 'Snoot (雪鼻獸)',
    element: 'ice',
    level: 11,
    maxHp: 150,
    attack: 26,
    sprite: './assets/sprites/snoot.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Snowball (重裝雪球)', power: 24, text: 'Snoot 滾出巨大雪球撞擊過來！' }],
    rewards: { xp: 130, gold: 85 }
  },
  chillwing: {
    id: 'chillwing',
    name: 'Chillwing (寒翼鳥)',
    element: 'ice',
    level: 11,
    maxHp: 145,
    attack: 25,
    sprite: './assets/sprites/chillwing.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Frost Gust (冰霜颶風)', power: 23, text: 'Chillwing 拍打冰翼捲起寒風！' }],
    rewards: { xp: 125, gold: 80 }
  },
  ice_elemental: {
    id: 'ice_elemental',
    name: 'Ice Elemental (冰霜元素) [Boss]',
    element: 'ice',
    isBoss: true,
    level: 13,
    maxHp: 230,
    attack: 34,
    sprite: './assets/sprites/ice_elemental.png',
    weakness: 'fire',
    resistance: 'ice',
    skills: [{ name: 'Blizzard Storm (暴風雪)', power: 32, text: 'Ice Elemental 召喚遮天蔽日的暴風雪！' }],
    rewards: { xp: 220, gold: 160 }
  },

  // Skywatch
  cloudling: {
    id: 'cloudling',
    name: 'Cloudling (雷雲獸)',
    element: 'storm',
    level: 14,
    maxHp: 200,
    attack: 32,
    sprite: './assets/sprites/cloudling.png',
    weakness: 'earth',
    resistance: 'water',
    skills: [{ name: 'Thunder Shock (雷電擊)', power: 30, text: 'Cloudling 發射出一道霹靂電光！' }],
    rewards: { xp: 200, gold: 130 }
  },
  stormcloud: {
    id: 'stormcloud',
    name: 'Stormcloud (暴風雲獸)',
    element: 'storm',
    level: 15,
    maxHp: 195,
    attack: 31,
    sprite: './assets/sprites/stormcloud.png',
    weakness: 'earth',
    resistance: 'water',
    skills: [{ name: 'Thunder Clap (雷霆重擊)', power: 29, text: 'Stormcloud 引爆雷雲巨響！' }],
    rewards: { xp: 190, gold: 125 }
  },
  galehound: {
    id: 'galehound',
    name: 'Galehound (狂風獵犬) [Boss]',
    element: 'storm',
    isBoss: true,
    level: 17,
    maxHp: 310,
    attack: 43,
    sprite: './assets/sprites/galehound.png',
    weakness: 'earth',
    resistance: 'storm',
    skills: [{ name: 'Hurricane Blitz (颶風突襲)', power: 40, text: 'Galehound 化身風暴席捲全場！' }],
    rewards: { xp: 380, gold: 280 }
  },

  // Additional Canon Prodigy & Elemental Monsters (with unique CC0 sprites)
  charfoal: {
    id: 'charfoal',
    name: 'Charfoal (炎馬獸)',
    element: 'fire',
    level: 5,
    maxHp: 85,
    attack: 16,
    sprite: './assets/sprites/charfoal.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Flame Dash (炎躍衝鋒)', power: 15, text: 'Charfoal 踏著烈焰發起衝鋒！' }],
    rewards: { xp: 55, gold: 35 }
  },
  burnie: {
    id: 'burnie',
    name: 'Burnie (小炎雀)',
    element: 'fire',
    level: 6,
    maxHp: 90,
    attack: 17,
    sprite: './assets/sprites/burnie.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Fire Spark (熾熱火花)', power: 15, text: 'Burnie 振翅灑落灼熱火花！' }],
    rewards: { xp: 60, gold: 38 }
  },
  cinderkat: {
    id: 'cinderkat',
    name: 'Cinderkat (熾焰幼貓)',
    element: 'fire',
    level: 7,
    maxHp: 95,
    attack: 18,
    sprite: './assets/sprites/cinderkat.png',
    weakness: 'water',
    resistance: 'fire',
    skills: [{ name: 'Flame Claw (火花利爪)', power: 16, text: 'Cinderkat 揮出燃燒的貓爪！' }],
    rewards: { xp: 65, gold: 40 }
  },
  aquafox: {
    id: 'aquafox',
    name: 'Aquafox (潮汐小狐)',
    element: 'water',
    level: 5,
    maxHp: 80,
    attack: 15,
    sprite: './assets/sprites/aquafox.png',
    weakness: 'storm',
    resistance: 'fire',
    skills: [{ name: 'Aqua Tail (水紋甩尾)', power: 14, text: 'Aquafox 甩動浪花之尾！' }],
    rewards: { xp: 52, gold: 32 }
  },
  crabbot: {
    id: 'crabbot',
    name: 'Crabbot (泡泡鋼甲蟹)',
    element: 'water',
    level: 7,
    maxHp: 105,
    attack: 19,
    sprite: './assets/sprites/crabbot.png',
    weakness: 'storm',
    resistance: 'ice',
    skills: [{ name: 'Hydro Pincer (巨鉗重擊)', power: 17, text: 'Crabbot 揮動堅硬鐵鉗夾擊！' }],
    rewards: { xp: 75, gold: 45 }
  },
  starfin: {
    id: 'starfin',
    name: 'Starfin (幻藍海星獸)',
    element: 'water',
    level: 6,
    maxHp: 92,
    attack: 16,
    sprite: './assets/sprites/starfin.png',
    weakness: 'storm',
    resistance: 'water',
    skills: [{ name: 'Tidal Wavelet (微浪拍擊)', power: 15, text: 'Starfin 拍打起一片蔚藍水花！' }],
    rewards: { xp: 58, gold: 36 }
  },
  sprout: {
    id: 'sprout',
    name: 'Sprout (嫩芽精靈)',
    element: 'earth',
    level: 3,
    maxHp: 65,
    attack: 11,
    sprite: './assets/sprites/sprout.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Leaf Cutter (飛葉切)', power: 11, text: 'Sprout 投擲出鋒利的翠綠飛葉！' }],
    rewards: { xp: 42, gold: 26 }
  },
  mossy: {
    id: 'mossy',
    name: 'Mossy (古石苔靈)',
    element: 'earth',
    level: 6,
    maxHp: 100,
    attack: 18,
    sprite: './assets/sprites/mossy.png',
    weakness: 'fire',
    resistance: 'storm',
    skills: [{ name: 'Stone Toss (巨石滾擊)', power: 16, text: 'Mossy 滾動青苔巨石！' }],
    rewards: { xp: 70, gold: 42 }
  },
  woodling: {
    id: 'woodling',
    name: 'Woodling (森之守護獸)',
    element: 'earth',
    level: 5,
    maxHp: 90,
    attack: 15,
    sprite: './assets/sprites/woodling.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Bark Shield (樹皮重擊)', power: 14, text: 'Woodling 匯聚樹木元氣揮擊！' }],
    rewards: { xp: 60, gold: 35 }
  },
  frostfang: {
    id: 'frostfang',
    name: 'Frostfang (霜牙雪靈)',
    element: 'ice',
    level: 12,
    maxHp: 165,
    attack: 28,
    sprite: './assets/sprites/frostfang.png',
    weakness: 'fire',
    resistance: 'ice',
    skills: [{ name: 'Glacial Bite (玄冰撕咬)', power: 26, text: 'Frostfang 凝聚霜氣撕咬！' }],
    rewards: { xp: 145, gold: 95 }
  },
  snowfluff: {
    id: 'snowfluff',
    name: 'Snowfluff (雪絨兔)',
    element: 'ice',
    level: 10,
    maxHp: 135,
    attack: 23,
    sprite: './assets/sprites/snowfluff.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Frost Dust (霜塵飛舞)', power: 21, text: 'Snowfluff 拍動絨毛灑下寒霜！' }],
    rewards: { xp: 115, gold: 75 }
  },
  polarcub: {
    id: 'polarcub',
    name: 'Polarcub (冰晶幼熊)',
    element: 'ice',
    level: 11,
    maxHp: 150,
    attack: 25,
    sprite: './assets/sprites/polarcub.png',
    weakness: 'fire',
    resistance: 'water',
    skills: [{ name: 'Ice Claw (冰爪裂擊)', power: 23, text: 'Polarcub 揮舞寒光閃閃的冰熊爪！' }],
    rewards: { xp: 130, gold: 85 }
  },
  electromite: {
    id: 'electromite',
    name: 'Electromite (雷電浮靈)',
    element: 'storm',
    level: 13,
    maxHp: 180,
    attack: 30,
    sprite: './assets/sprites/electromite.png',
    weakness: 'earth',
    resistance: 'water',
    skills: [{ name: 'Spark Pulse (靜電脈衝)', power: 28, text: 'Electromite 爆發出一道強烈電光！' }],
    rewards: { xp: 185, gold: 125 }
  },
  zapzap: {
    id: 'zapzap',
    name: 'Zapzap (雷光飛鼠)',
    element: 'storm',
    level: 14,
    maxHp: 185,
    attack: 31,
    sprite: './assets/sprites/zapzap.png',
    weakness: 'earth',
    resistance: 'storm',
    skills: [{ name: 'Volt Glide (雷馳滑翔)', power: 29, text: 'Zapzap 帶電滑翔突襲！' }],
    rewards: { xp: 190, gold: 130 }
  },
  windcherub: {
    id: 'windcherub',
    name: 'Windcherub (狂風精靈)',
    element: 'storm',
    level: 15,
    maxHp: 190,
    attack: 32,
    sprite: './assets/sprites/windcherub.png',
    weakness: 'earth',
    resistance: 'storm',
    skills: [{ name: 'Aero Whim (輕靈風之息)', power: 30, text: 'Windcherub 掀起歡快的旋風！' }],
    rewards: { xp: 195, gold: 135 }
  },
  volts: {
    id: 'volts',
    name: 'Volts (雷霆蜥蜴)',
    element: 'storm',
    level: 14,
    maxHp: 190,
    attack: 31,
    sprite: './assets/sprites/stormcloud.png',
    weakness: 'earth',
    resistance: 'storm',
    skills: [{ name: 'Shock Bite (帶電猛咬)', power: 29, text: 'Volts 露出帶電利齒撕咬！' }],
    rewards: { xp: 190, gold: 130 }
  },

  // Tutorial Mentor Duel Opponent (Official Canonical Opening)
  theo_addiwise: {
    id: 'theo_addiwise',
    name: 'Theo Addiwise (學院導師)',
    element: 'astral',
    level: 1,
    maxHp: 230,
    attack: 2,
    sprite: './assets/sprites/headmaster_noot.png',
    weakness: null,
    resistance: null,
    isBoss: false,
    isTutorialMentor: true,
    skills: [{ name: 'Practice Sparks (練習火花)', power: 2, text: 'Theo Addiwise 揮動魔杖施展溫和的練習法術！' }],
    rewards: { xp: 50, gold: 30 }
  }
};

// Keep ONLY the first 10 Gemini AI-generated Pokemon pets (hide the other 490 SVG placeholders)
const ACTIVE_POKEMON_PETS = Object.fromEntries(
  Object.entries(PETS_500_DATABASE).filter(([id]) => id.startsWith('pet500_canine_') && parseInt(id.split('_').pop(), 10) <= 10)
);

// Merged Canon Monsters + Only AI-Drawn Pokémon Pets
export const CANON_MONSTERS = {
  ...BASE_CANON_MONSTERS,
  ...ACTIVE_POKEMON_PETS
};

// Canon Prodigy Pet Evolutions (Stage 1 -> Stage 2 -> Stage 3)
export const PET_EVOLUTIONS = {
  hotpot: {
    stage: 1,
    evolutionLevel: 5,
    starCost: 2,
    nextForm: {
      id: 'magmay',
      name: 'Magmay (熔岩巨獸)',
      element: 'fire',
      sprite: './assets/sprites/magmay.png',
      hpBonus: 50,
      atkBonus: 9,
      newSkill: { name: 'Lava Toss (岩漿投擲)', power: 19 }
    }
  },
  squiddle: {
    stage: 1,
    evolutionLevel: 5,
    starCost: 2,
    nextForm: {
      id: 'diveosaur',
      name: 'Diveosaur (深潛雷龍)',
      element: 'water',
      sprite: './assets/sprites/diveosaur.png',
      hpBonus: 55,
      atkBonus: 8,
      newSkill: { name: 'Tsunami Wave (海嘯巨浪)', power: 19 }
    }
  },
  peeko: {
    stage: 1,
    evolutionLevel: 5,
    starCost: 2,
    nextForm: {
      id: 'floraflare',
      name: 'Floraflare (繁花靈鳥)',
      element: 'earth',
      sprite: './assets/sprites/floraflare.png',
      hpBonus: 45,
      atkBonus: 8,
      newSkill: { name: 'Vine Barrage (藤蔓狂舞)', power: 18 }
    }
  },
  snoot: {
    stage: 1,
    evolutionLevel: 5,
    starCost: 2,
    nextForm: {
      id: 'ice_elemental',
      name: 'Ice Elemental (冰晶巨像)',
      element: 'ice',
      sprite: './assets/sprites/ice_elemental.png',
      hpBonus: 65,
      atkBonus: 10,
      newSkill: { name: 'Blizzard Storm (暴風雪)', power: 32 }
    }
  },
  cloudling: {
    stage: 1,
    evolutionLevel: 5,
    starCost: 2,
    nextForm: {
      id: 'galehound',
      name: 'Galehound (狂風獵犬)',
      element: 'storm',
      sprite: './assets/sprites/galehound.png',
      hpBonus: 65,
      atkBonus: 11,
      newSkill: { name: 'Hurricane Blitz (颶風突襲)', power: 40 }
    }
  }
};
