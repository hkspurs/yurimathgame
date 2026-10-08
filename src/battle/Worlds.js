// Worlds.js - Official Canonical Prodigy Math Game Worlds & Hubs

export const WORLDS = [
  {
    id: 'lamplight_town',
    name: '燈火小鎮與學院 (Lamplight Town & Academy)',
    isHub: true,
    element: 'astral',
    elementName: '和平主城',
    themeColor: '#e056fd',
    bannerIcon: '🏛️',
    desc: '魔法世界的中央和平主城，座落著古老的燈火學院神石祭壇，以及布洛克的魔法商店與幸運大轉盤。',
    gradeText: '安全區域 • 裝備商店 / 每日轉盤 / 神石祭壇',
    requiredStars: 0,
    stages: []
  },
  {
    id: 'firefly_forest',
    name: '螢火蟲森林 (Firefly Forest)',
    element: 'earth',
    elementName: '草/火系',
    themeColor: '#2ed573',
    bannerIcon: '🌲',
    desc: '微光螢火蟲在古樹間飛舞，大地神石（Earth Keystone）在此沈睡。',
    gradeText: '冒險區域 • 大地神石試煉 (大地/草系)',
    requiredStars: 0,
    keystoneId: 'earth',
    stages: [
      { id: 'forest_1', name: '1-1 森林小徑', monsterId: 'hotpot', desc: '初階怪獸 Hotpot (火鍋怪)' },
      { id: 'forest_2', name: '1-2 綠蔭深處', monsterId: 'peeko', desc: '野性怪獸 Peeko (皮克鳥)' },
      { id: 'forest_3', name: '1-3 螢火神樹 [大地神石守護戰]', monsterId: 'ember_fox', desc: '區域守護者 Ember Fox (炎尾小狐狸)' }
    ]
  },
  {
    id: 'shipwreck_shore',
    name: '海難海岸 (Shipwreck Shore)',
    element: 'water',
    elementName: '水系',
    themeColor: '#1e90ff',
    bannerIcon: '🌊',
    desc: '金色沙灘與古代沉船，海洋神石（Water Keystone）隱匿於深海潮汐祭壇。',
    gradeText: '冒險區域 • 海洋神石試煉 (海洋/水系)',
    requiredStars: 3,
    keystoneId: 'water',
    stages: [
      { id: 'shore_1', name: '2-1 潮汐淺灘', monsterId: 'squiddle', desc: '海洋怪獸 Squiddle (章魚仔)' },
      { id: 'shore_2', name: '2-2 潮汐祭壇 [海洋神石守護戰]', monsterId: 'diveosaur', desc: '區域守護者 Diveosaur (潛水恐龍)' }
    ]
  },
  {
    id: 'bonfire_spire',
    name: '篝火火山峰 (Bonfire Spire)',
    element: 'fire',
    elementName: '火系',
    themeColor: '#ff4757',
    bannerIcon: '🌋',
    desc: '黑曜石火山口翻滾著熾熱岩漿，烈焰神石（Fire Keystone）由星火布丁鎮守。',
    gradeText: '冒險區域 • 烈焰神石試煉 (黑曜岩/火系)',
    requiredStars: 6,
    keystoneId: 'fire',
    stages: [
      { id: 'volcano_1', name: '3-1 黑曜石山道', monsterId: 'magmay', desc: '火系怪獸 Magmay (熔岩獸)' },
      { id: 'volcano_2', name: '3-2 熔火之巔 [烈焰神石守護戰]', monsterId: 'sparkpudding', desc: '區域守護者 Sparkpudding (星火布丁)' }
    ]
  },
  {
    id: 'shiverchill_mountains',
    name: '寒顫雪山 (Shiverchill Mountains)',
    element: 'ice',
    elementName: '冰霜/水系',
    themeColor: '#70a1ff',
    bannerIcon: '❄️',
    desc: '終年被極寒冰川覆蓋的雪山，冰霜神石（Ice Keystone）散發極地寒芒。',
    gradeText: '冒險區域 • 冰霜神石試煉 (極地/冰系)',
    requiredStars: 10,
    keystoneId: 'ice',
    stages: [
      { id: 'snow_1', name: '4-1 霜凍松林', monsterId: 'snoot', desc: '雪山怪獸 Snoot (雪鼻獸)' },
      { id: 'snow_2', name: '4-2 冰晶王座 [冰霜神石守護戰]', monsterId: 'ice_elemental', desc: '區域守護者 Ice Elemental (冰霜元素)' }
    ]
  },
  {
    id: 'skywatch',
    name: '浮空風暴城 (Skywatch)',
    element: 'storm',
    elementName: '風暴/星能系',
    themeColor: '#ffa502',
    bannerIcon: '⚡',
    desc: '雲端之上雷霆環繞的古代要塞，風暴神石（Storm Keystone）由狂風獵犬把守。',
    gradeText: '冒險區域 • 風暴神石試煉 (雷霆/風暴系)',
    requiredStars: 14,
    keystoneId: 'storm',
    stages: [
      { id: 'sky_1', name: '5-1 浮空外圍', monsterId: 'cloudling', desc: '雷雲怪獸 Cloudling (雷雲獸)' },
      { id: 'sky_2', name: '5-2 風暴殿堂 [風暴神石守護戰]', monsterId: 'galehound', desc: '區域守護者 Galehound (狂風獵犬)' }
    ]
  }
];
