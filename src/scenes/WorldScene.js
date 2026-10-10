// WorldScene.js - High-Fidelity Theatrical Adventure World Exploration
import { eventBus } from '../core/EventBus.js';
import { PETS_500_DATABASE } from '../battle/PetDatabase500.js';
import { getPetAssetUrl, getPetConfig } from '../battle/CompanionPetAssets.js';

export const REALM_MONSTER_POOLS = {
  'firefly_forest': [
    { id: 'sprout', name: 'Sprout (芽芽草熊)', sprite: getPetAssetUrl('sprout', 'overworld', 'enemy', './assets/sprites/sprout.png'), balloonMsg: '🌱 嫩綠草甸 • 點擊收服！', isBoss: false },
    { id: 'peeko', name: 'Peeko (葉羽雀靈)', sprite: getPetAssetUrl('peeko', 'overworld', 'enemy', './assets/sprites/peeko.png'), balloonMsg: '🌿 樹蔭枝頭 • 點擊戰鬥！', isBoss: false },
    { id: 'mossy', name: 'Mossy (苔原水豚)', sprite: getPetAssetUrl('mossy', 'overworld', 'enemy', './assets/sprites/mossy.png'), balloonMsg: '🍃 濕地溪畔 • 點擊戰鬥！', isBoss: false }
  ],
  'shipwreck_shore': [
    { id: 'squiddle', name: 'Squiddle (水滴萌兔)', sprite: getPetAssetUrl('squiddle', 'overworld', 'enemy', './assets/sprites/squiddle.png'), balloonMsg: '🌊 潮汐淺灘 • 點擊收服！', isBoss: false },
    { id: 'fishbol', name: 'Fishbol (泡泡刺魨)', sprite: getPetAssetUrl('fishbol', 'overworld', 'enemy', './assets/sprites/fishbol.png'), balloonMsg: '🫧 珊瑚暗礁 • 點擊戰鬥！', isBoss: false },
    { id: 'triptrop', name: 'TripTrop (碧浪海龜)', sprite: getPetAssetUrl('triptrop', 'overworld', 'enemy', './assets/sprites/triptrop.png'), balloonMsg: '🐢 暖陽沙灘 • 點擊戰鬥！', isBoss: false },
    { id: 'aquafox', name: 'Aquafox (浪花靈狐)', sprite: getPetAssetUrl('aquafox', 'overworld', 'enemy', './assets/sprites/aquafox.png'), balloonMsg: '🦊 蔚藍海岸 • 點擊戰鬥！', isBoss: false }
  ],
  'bonfire_spire': [
    { id: 'hotpot', name: 'Hotpot (炭火陶甲獸)', sprite: getPetAssetUrl('hotpot', 'overworld', 'enemy', './assets/sprites/hotpot.png'), balloonMsg: '🍲 熔岩暖灶 • 點擊收服！', isBoss: false },
    { id: 'pyropup', name: 'Pyropup (烈焰柴犬)', sprite: getPetAssetUrl('pyropup', 'overworld', 'enemy', './assets/sprites/pyropup.png'), balloonMsg: '🐶 赤焰熔岩 • 點擊戰鬥！', isBoss: false },
    { id: 'cinderkat', name: 'Cinderkat (餘燼暖貓)', sprite: getPetAssetUrl('cinderkat', 'overworld', 'enemy', './assets/sprites/cinderkat.png'), balloonMsg: '🐱 餘燼岩隙 • 點擊戰鬥！', isBoss: false },
    { id: 'magmay', name: 'Magmay (熔岩幼龍)', sprite: getPetAssetUrl('magmay', 'overworld', 'enemy', './assets/sprites/magmay.png'), balloonMsg: '🌋 黑曜石山道 • 點擊戰鬥！', isBoss: false }
  ],
  'shiverchill_mountains': [
    { id: 'snoot', name: 'Snoot (雪絨企鵝)', sprite: getPetAssetUrl('snoot', 'overworld', 'enemy', './assets/sprites/snoot.png'), balloonMsg: '❄️ 霜凍松林 • 點擊戰鬥！', isBoss: false },
    { id: 'chillwing', name: 'Chillwing (霜羽雪鴞)', sprite: getPetAssetUrl('chillwing', 'overworld', 'enemy', './assets/sprites/chillwing.png'), balloonMsg: '🦅 冰雪懸崖 • 點擊戰鬥！', isBoss: false },
    { id: 'snowfluff', name: 'Snowfluff (雪球圓雀)', sprite: getPetAssetUrl('snowfluff', 'overworld', 'enemy', './assets/sprites/snowfluff.png'), balloonMsg: '🌨️ 白雪山嶺 • 點擊戰鬥！', isBoss: false },
    { id: 'frostfang', name: 'Frostfang (冰川海豹)', sprite: getPetAssetUrl('frostfang', 'overworld', 'enemy', './assets/sprites/frostfang.png'), balloonMsg: '🦭 浮冰海灣 • 點擊戰鬥！', isBoss: false }
  ],
  'skywatch': [
    { id: 'cloudling', name: 'Cloudling (雷電倉鼠)', sprite: getPetAssetUrl('cloudling', 'overworld', 'enemy', './assets/sprites/cloudling.png'), balloonMsg: '⚡ 浮空外圍 • 點擊收服！', isBoss: false },
    { id: 'stormcloud', name: 'Stormcloud (雷雲飛鼠)', sprite: getPetAssetUrl('stormcloud', 'overworld', 'enemy', './assets/sprites/stormcloud.png'), balloonMsg: '☁️ 雲端雷陣 • 點擊戰鬥！', isBoss: false },
    { id: 'galehound', name: 'Galehound (疾風獵犬)', sprite: getPetAssetUrl('galehound', 'overworld', 'enemy', './assets/sprites/galehound.png'), balloonMsg: '🌪️ 狂風石階 • 點擊戰鬥！', isBoss: false },
    { id: 'zapzap', name: 'Zapzap (電光飛蜥)', sprite: getPetAssetUrl('zapzap', 'overworld', 'enemy', './assets/sprites/zapzap.png'), balloonMsg: '🦎 雷霆尖塔 • 點擊戰鬥！', isBoss: false }
  ]
};

export const REALM_ADJACENCY = {
  'firefly_forest': {
    north: 'shiverchill_mountains',
    south: 'shipwreck_shore',
    east: 'bonfire_spire',
    west: 'skywatch'
  },
  'shipwreck_shore': {
    north: 'firefly_forest',
    south: 'bonfire_spire',
    east: 'bonfire_spire',
    west: 'skywatch'
  },
  'bonfire_spire': {
    north: 'shiverchill_mountains',
    south: 'shipwreck_shore',
    east: 'skywatch',
    west: 'firefly_forest'
  },
  'shiverchill_mountains': {
    north: 'skywatch',
    south: 'firefly_forest',
    east: 'bonfire_spire',
    west: 'skywatch'
  },
  'skywatch': {
    north: 'shiverchill_mountains',
    south: 'shipwreck_shore',
    east: 'firefly_forest',
    west: 'bonfire_spire'
  }
};

export class WorldScene {
  constructor(canvas, gameState = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;

    // 5-minute spot respawn cooldown tracking: { [realm_slot]: { slotIndex, realm, respawnTimer } }
    this.zoneCooldowns = {};

    // Seamless border transition states
    this.isTransitioningRealm = false;
    this.realmTransitionCooldown = 0;
    this.fadeAlpha = 0;

    // World Dimensions & Dynamic Viewport Camera
    this.worldWidth = 1400;
    this.worldHeight = 1600;
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    // Player position and movement (Spawn at central crossroads)
    this.player = {
      x: 700,
      y: 800,
      targetX: null,
      targetY: null,
      size: 64,
      speed: 4.2,
      direction: 'down',
      isMoving: false,
      animTimer: 0,
      dustParticles: []
    };

    // Follower Pet companion squad (Dual pets: Pet A on left, Pet B on right)
    this.followerPet = {
      x: 660,
      y: 820,
      size: 46,
      hopTimer: 0,
      img: new Image()
    };
    this.followerPetB = {
      x: 740,
      y: 820,
      size: 46,
      hopTimer: Math.PI * 0.6,
      img: new Image()
    };
    this.petGoofyMode = null;
    this.petGoofyTimer = 0;
    this.petGoofyAngle = 0;
    this.petInteractionIndex = 0;

    // Tap target indicator
    this.tapIndicator = null;

    // Dynamic Roaming Monsters Array (Multiple wild creatures wandering per realm)
    this.roamingMonsters = [];
    this.encounterCooldown = 0; // Grace period after returning from battle

    // Academy Mentor NPC: Headmaster Noot (Near North Lamplight Gate)
    this.npcHeadmaster = {
      name: '努特校長 (Headmaster Noot)',
      title: '燈火學院院長',
      x: 620,
      y: 220,
      size: 64,
      bobTimer: 0
    };

    // Images
    this.playerImg = new Image();
    this.playerImg.src = this.gameState?.avatarSprite || './assets/sprites/wizard_apprentice.png';

    this.monsterImg = new Image();
    this.monsterImg.src = './assets/sprites/ember_fox.png';

    this.npcImg = new Image();
    this.npcImg.src = './assets/sprites/headmaster_noot.png';

    this.keys = {};
    this.isActive = true;
    this.isEncountering = false;
    this.currentRealm = this.gameState?.currentRealm || 'firefly_forest';

    // Ambient floating particles across large realm
    this.fireflies = Array.from({ length: 45 }, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 1600,
      radius: Math.random() * 2.5 + 1.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }));

    // River water animation timer
    this.waterTimer = 0;

    // Adventure interactive world entities
    this.treasureChest = null;
    this.keystoneAltar = null;
    this.signpost = null;
    this.rustlingBushes = []; // Mystery bushes with animated shake and surprises!
    this.petHearts = [];      // Floating heart particles when petting follower

    this.bindInputs();
    this.loadRealm(this.currentRealm);
  }

  centerCameraOnPlayer(immediate = false) {
    const cw = this.canvas?.width || 800;
    const ch = this.canvas?.height || 600;
    const targetCamX = this.player.x - cw / 2;
    const targetCamY = this.player.y - ch / 2;
    const maxCamX = Math.max(0, this.worldWidth - cw);
    const maxCamY = Math.max(0, this.worldHeight - ch);

    this.camera.targetX = Math.max(0, Math.min(maxCamX, targetCamX));
    this.camera.targetY = Math.max(0, Math.min(maxCamY, targetCamY));

    if (immediate) {
      this.camera.x = this.camera.targetX;
      this.camera.y = this.camera.targetY;
    }
  }

  onResize(newW, newH) {
    this.centerCameraOnPlayer(false);
  }

  get roamingMonster() {
    return this.roamingMonsters[0] || null;
  }

  set roamingMonster(val) {
    if (this.roamingMonsters.length > 0) {
      this.roamingMonsters[0] = val;
    } else {
      this.roamingMonsters.push(val);
    }
  }

  loadRealm(realmId, spawnX = 700, spawnY = 800) {
    this.currentRealm = realmId || 'firefly_forest';
    const realmConfigs = {
      'firefly_forest': {
        monsterId: 'ember_fox',
        monsterName: '炎尾小狐狸',
        monsterSprite: './assets/sprites/ember_fox.png',
        balloonMsg: '🔥 點擊/靠近戰鬥！',
        skyTop: '#559c3a',
        skyBottom: '#44842d',
        lightDapple: 'rgba(120, 210, 85, 0.2)',
        streamColor: '#38ada9',
        streamBorder: '#1e75a8',
        roadColor: '#c8a268',
        particleColor: '255, 238, 140',
        gateName: '燈火學院拱門 (Lamplight Gate)'
      },
      'shipwreck_shore': {
        monsterId: 'squiddle',
        monsterName: '章魚仔 (Squiddle)',
        monsterSprite: getPetAssetUrl('squiddle', 'overworld', 'enemy', './assets/sprites/squiddle.png'),
        balloonMsg: '🌊 潮汐淺灘 • 點擊戰鬥！',
        skyTop: '#f5cd79',
        skyBottom: '#eccc68',
        lightDapple: 'rgba(255, 234, 167, 0.25)',
        streamColor: '#1e90ff',
        streamBorder: '#0984e3',
        roadColor: '#dfb76c',
        particleColor: '116, 185, 255',
        gateName: '古代沉船遺址 (Shipwreck)'
      },
      'bonfire_spire': {
        monsterId: 'magmay',
        monsterName: '熔岩獸 (Magmay)',
        monsterSprite: getPetAssetUrl('magmay', 'overworld', 'enemy', './assets/sprites/magmay.png'),
        balloonMsg: '🌋 熔火黑曜石 • 點擊戰鬥！',
        skyTop: '#2f3542',
        skyBottom: '#1e272e',
        lightDapple: 'rgba(235, 77, 75, 0.15)',
        streamColor: '#ff4757',
        streamBorder: '#c0392b',
        roadColor: '#57606f',
        particleColor: '255, 107, 129',
        gateName: '黑曜石火山口 (Bonfire Spire)'
      },
      'shiverchill_mountains': {
        monsterId: 'snoot',
        monsterName: '雪鼻獸 (Snoot)',
        monsterSprite: getPetAssetUrl('snoot', 'overworld', 'enemy', './assets/sprites/snoot.png'),
        balloonMsg: '❄️ 霜凍極地 • 點擊戰鬥！',
        skyTop: '#f1f2f6',
        skyBottom: '#dfe4ea',
        lightDapple: 'rgba(223, 230, 233, 0.3)',
        streamColor: '#70a1ff',
        streamBorder: '#5352ed',
        roadColor: '#ced6e0',
        particleColor: '255, 255, 255',
        gateName: '極地霜凍神殿 (Frost Sanctuary)'
      },
      'skywatch': {
        monsterId: 'cloudling',
        monsterName: '雷雲獸 (Cloudling)',
        monsterSprite: getPetAssetUrl('cloudling', 'overworld', 'enemy', './assets/sprites/cloudling.png'),
        balloonMsg: '⚡ 浮空雷霆 • 點擊戰鬥！',
        skyTop: '#74b9ff',
        skyBottom: '#a29bfe',
        lightDapple: 'rgba(224, 86, 253, 0.2)',
        streamColor: '#575fcf',
        streamBorder: '#3c40c6',
        roadColor: '#dff9fb',
        particleColor: '254, 211, 48',
        gateName: '風暴神石要塞 (Skywatch)'
      }
    };

    const cfg = realmConfigs[this.currentRealm] || realmConfigs['firefly_forest'];
    this.realmConfig = cfg;

    const pool = REALM_MONSTER_POOLS[this.currentRealm] || REALM_MONSTER_POOLS['firefly_forest'];
    
    // Prioritize uncollected pets from player's Pet Book
    const ownedPetIds = (this.gameState?.pets || []).map(p => p.id);
    const unownedPool = pool.filter(p => !ownedPetIds.includes(p.id));
    const selectionPool = unownedPool.length > 0 ? [...unownedPool, ...pool] : [...pool];

    const pickUnique = (exclude = []) => {
      const candidates = selectionPool.filter(p => !exclude.includes(p.id));
      if (candidates.length > 0) return candidates[Math.floor(Math.random() * candidates.length)];
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const monster1Def = pickUnique();
    const monster2Def = pickUnique([monster1Def.id]);
    const monster3Def = pickUnique([monster1Def.id, monster2Def.id]);

    // Zone 1: Northwest Glade (x: 320, y: 380)
    const m1 = {
      id: monster1Def.id,
      name: monster1Def.name,
      balloonMsg: monster1Def.balloonMsg,
      isBoss: !!monster1Def.isBoss,
      x: 320,
      y: 380,
      homeX: 320,
      homeY: 380,
      wanderTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      size: monster1Def.isBoss ? 78 : 70,
      bobTimer: 0,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    m1.img.src = monster1Def.sprite;

    // Zone 2: Eastern Ruins & Riverbank (x: 1120, y: 820)
    const m2 = {
      id: monster2Def.id,
      name: monster2Def.name,
      balloonMsg: monster2Def.balloonMsg,
      isBoss: !!monster2Def.isBoss,
      x: 1120,
      y: 820,
      homeX: 1120,
      homeY: 820,
      wanderTimer: 1.5,
      wanderAngle: Math.random() * Math.PI * 2,
      size: monster2Def.isBoss ? 78 : 70,
      bobTimer: Math.PI * 0.7,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    m2.img.src = monster2Def.sprite;

    // Zone 3: Southern Deep Mystic Wilds (x: 780, y: 1380)
    const m3 = {
      id: monster3Def.id,
      name: monster3Def.name,
      balloonMsg: monster3Def.balloonMsg,
      isBoss: !!monster3Def.isBoss,
      x: 780,
      y: 1380,
      homeX: 780,
      homeY: 1380,
      wanderTimer: 2.2,
      wanderAngle: Math.random() * Math.PI * 2,
      size: monster3Def.isBoss ? 78 : 70,
      bobTimer: Math.PI * 1.3,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    m3.img.src = monster3Def.sprite;

    // Check if any slot is currently on a 5-minute respawn cooldown
    const cd0 = this.zoneCooldowns?.[`${this.currentRealm}_slot_0`]?.respawnTimer > 0;
    const cd1 = this.zoneCooldowns?.[`${this.currentRealm}_slot_1`]?.respawnTimer > 0;
    const cd2 = this.zoneCooldowns?.[`${this.currentRealm}_slot_2`]?.respawnTimer > 0;
    this.roamingMonsters = [cd0 ? null : m1, cd1 ? null : m2, cd2 ? null : m3];

    this.monsterImg.src = m1.img.src;
    this.isEncountering = false;
    this.encounterCooldown = 0;

    // Position player and follower companions at designated spawn coordinates
    this.player.x = spawnX;
    this.player.y = spawnY;
    this.player.targetX = null;
    this.player.targetY = null;
    this.player.isMoving = false;
    this.followerPet.x = spawnX - 35;
    this.followerPet.y = spawnY + 20;
    this.followerPetB.x = spawnX + 35;
    this.followerPetB.y = spawnY + 20;

    // Center camera on player
    this.centerCameraOnPlayer(true);

    // Interactive Adventure Entities for Current Realm
    const chestConfigs = {
      'firefly_forest': { id: 'chest_forest', x: 280, y: 1300, rewards: { gold: 40, xp: 30, stars: 1 } },
      'shipwreck_shore': { id: 'chest_shore', x: 280, y: 1300, rewards: { gold: 45, xp: 35, stars: 1 } },
      'bonfire_spire': { id: 'chest_volcano', x: 280, y: 1300, rewards: { gold: 50, xp: 40, stars: 1 } },
      'shiverchill_mountains': { id: 'chest_snow', x: 280, y: 1300, rewards: { gold: 50, xp: 40, stars: 1 } },
      'skywatch': { id: 'chest_sky', x: 280, y: 1300, rewards: { gold: 60, xp: 50, stars: 2 } }
    };
    const cCfg = chestConfigs[this.currentRealm] || chestConfigs['firefly_forest'];
    this.treasureChest = {
      id: cCfg.id,
      x: cCfg.x,
      y: cCfg.y,
      size: 42,
      rewards: cCfg.rewards,
      sparkleTimer: 0,
      particles: []
    };

    const altarConfigs = {
      'firefly_forest': { keystoneId: 'earth', name: '大地神石 (Earth)', icon: '🌱', color: '#2ed573', bossId: 'ember_fox', bossName: 'Ember Fox (炎尾小狐狸)', bossStage: 'forest_3' },
      'shipwreck_shore': { keystoneId: 'water', name: '海洋神石 (Water)', icon: '💧', color: '#1e90ff', bossId: 'diveosaur', bossName: 'Diveosaur (潛水恐龍)', bossStage: 'shore_2' },
      'bonfire_spire': { keystoneId: 'fire', name: '烈焰神石 (Fire)', icon: '🔥', color: '#ff4757', bossId: 'sparkpudding', bossName: 'Sparkpudding (星火布丁)', bossStage: 'volcano_2' },
      'shiverchill_mountains': { keystoneId: 'ice', name: '冰霜神石 (Ice)', icon: '❄️', color: '#70a1ff', bossId: 'ice_elemental', bossName: 'Ice Elemental (冰晶巨像)', bossStage: 'snow_2' },
      'skywatch': { keystoneId: 'storm', name: '風暴神石 (Storm)', icon: '⚡', color: '#ffa502', bossId: 'galehound', bossName: 'Galehound (狂風獵犬)', bossStage: 'sky_2' }
    };
    const aCfg = altarConfigs[this.currentRealm] || altarConfigs['firefly_forest'];
    this.keystoneAltar = {
      x: 1120,
      y: 260,
      size: 58,
      keystoneId: aCfg.keystoneId,
      name: aCfg.name,
      icon: aCfg.icon,
      color: aCfg.color,
      bossId: aCfg.bossId,
      bossName: aCfg.bossName,
      bossStage: aCfg.bossStage,
      pulseTimer: 0
    };

    const signpostConfigs = {
      'firefly_forest': '📜 【十字路口路牌】北通燈火學院；東通繁花溪流；西南藏有古寶箱；南通秘林野生怪獸！',
      'shipwreck_shore': '📜 【海岸十字路】北通沉船前哨；東通珊瑚浪潮；西南有失落寶箱！野生章魚怪獸常在南境徘徊！',
      'bonfire_spire': '📜 【火山十字路】北通黑曜石主城；東北為烈焰祭壇；南通熔岩峽谷，火山巨獸出沒！',
      'shiverchill_mountains': '📜 【雪山十字路】北通霜凍要塞；東通極地冰川；南通雪靈深谷，小心暴風雪！',
      'skywatch': '📜 【浮空十字路】北通雷霆神殿；東通浮空雲島；南通狂風深淵，雷雲精靈盤旋！'
    };
    this.signpost = {
      x: 630,
      y: 720,
      size: 36,
      text: signpostConfigs[this.currentRealm] || signpostConfigs['firefly_forest']
    };

    // 4 Mystery Rustling Bushes distributed across explorer paths
    this.rustlingBushes = [
      { id: 'bush_nw', x: 240, y: 320, r: 24, shakeTimer: 0, shakePhase: 0, leafParticles: [], opened: false },
      { id: 'bush_ne', x: 920, y: 340, r: 26, shakeTimer: 1.2, shakePhase: Math.PI * 0.4, leafParticles: [], opened: false },
      { id: 'bush_sw', x: 420, y: 1120, r: 25, shakeTimer: 2.1, shakePhase: Math.PI * 0.9, leafParticles: [], opened: false },
      { id: 'bush_se', x: 1040, y: 1240, r: 25, shakeTimer: 0.8, shakePhase: Math.PI * 1.5, leafParticles: [], opened: false }
    ];

    // Props for current realm across 1400 x 1600 world
    this.environmentProps = this.generatePropsForRealm(this.currentRealm);
  }

  generatePropsForRealm(realmId) {
    const props = [];
    const seedRandom = (s) => {
      let x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };

    const flowerPalettes = {
      'firefly_forest': ['#ff7675', '#fd79a8', '#f9ca24', '#ffffff', '#e056fd'],
      'shipwreck_shore': ['#74b9ff', '#00cec9', '#ffeaa7', '#ffffff', '#fd79a8'],
      'bonfire_spire': ['#ff7675', '#d63031', '#e17055', '#fdcb6e', '#fab1a0'],
      'shiverchill_mountains': ['#dfe6e9', '#74b9ff', '#81ecec', '#ffffff', '#a29bfe'],
      'skywatch': ['#ffeaa7', '#fdcb6e', '#a29bfe', '#81ecec', '#ffffff']
    };
    const palette = flowerPalettes[realmId] || flowerPalettes['firefly_forest'];

    // 70 decorative thematic flowers across the whole 1400 x 1600 realm
    for (let i = 0; i < 70; i++) {
      props.push({
        type: 'flower',
        x: seedRandom(i * 3) * (this.worldWidth - 140) + 70,
        y: seedRandom(i * 3 + 1) * (this.worldHeight - 180) + 100,
        size: seedRandom(i * 3 + 3) * 3 + 4,
        color: palette[Math.floor(seedRandom(i * 7) * palette.length)]
      });
    }

    // Natural landscape landmarks & trees distributed across world
    // Northwest Grove (around Monster 1)
    props.push({ type: 'tree', x: 120, y: 180, r: 54 });
    props.push({ type: 'tree', x: 260, y: 140, r: 46 });
    props.push({ type: 'tree', x: 160, y: 440, r: 50 });
    props.push({ type: 'tree', x: 420, y: 220, r: 48 });

    // Northeast Altar Grove
    props.push({ type: 'tree', x: 960, y: 160, r: 52 });
    props.push({ type: 'tree', x: 1240, y: 180, r: 56 });
    props.push({ type: 'tree', x: 1220, y: 380, r: 46 });

    // West Boundary Trees
    props.push({ type: 'tree', x: 90, y: 720, r: 52 });
    props.push({ type: 'tree', x: 90, y: 920, r: 50 });

    // East Ruins & Riverbank Trees
    props.push({ type: 'tree', x: 1180, y: 640, r: 48 });
    props.push({ type: 'tree', x: 1240, y: 980, r: 52 });

    // Southwest Chest Clearing
    props.push({ type: 'tree', x: 140, y: 1180, r: 54 });
    props.push({ type: 'tree', x: 380, y: 1420, r: 50 });
    props.push({ type: 'tree', x: 160, y: 1460, r: 48 });

    // South Deep Woods (around Monster 3)
    props.push({ type: 'tree', x: 620, y: 1480, r: 56 });
    props.push({ type: 'tree', x: 940, y: 1460, r: 52 });
    props.push({ type: 'tree', x: 1120, y: 1380, r: 50 });

    // Central Crossroads accents (leaves paths clear)
    props.push({ type: 'tree', x: 480, y: 620, r: 44 });
    props.push({ type: 'tree', x: 920, y: 640, r: 44 });
    props.push({ type: 'tree', x: 480, y: 960, r: 44 });
    props.push({ type: 'tree', x: 920, y: 960, r: 44 });

    return props;
  }

  getObstacles() {
    const list = [];
    if (this.environmentProps) {
      this.environmentProps.filter(p => p.type === 'tree').forEach(t => {
        list.push({ x: t.x, y: t.y + t.r * 0.35, r: t.r * 0.42 });
      });
    }
    if (this.npcHeadmaster) {
      list.push({ x: this.npcHeadmaster.x, y: this.npcHeadmaster.y, r: 28 });
    }
    if (this.keystoneAltar) {
      list.push({ x: this.keystoneAltar.x, y: this.keystoneAltar.y + 4, r: 36 });
    }
    // Lamplight Gate stone pillars at (700, 80)
    list.push({ x: 650, y: 70, r: 18 });
    list.push({ x: 750, y: 70, r: 18 });
    return list;
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      if (!this.isActive || window.gameApp?.currentScene !== 'world') return;
      if (document.querySelector('.tome-overlay:not(.hidden)')) return;

      this.keys[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key.toLowerCase() === 'e') {
        if (this.treasureChest) {
          const dist = Math.hypot(this.player.x - this.treasureChest.x, this.player.y - this.treasureChest.y);
          if (dist < 80) {
            this.interactWithChest();
            return;
          }
        }
        if (this.signpost) {
          const dist = Math.hypot(this.player.x - this.signpost.x, this.player.y - this.signpost.y);
          if (dist < 80) {
            eventBus.emit('SHOW_TOAST', { message: this.signpost.text, type: 'info' });
            return;
          }
        }
        if (this.keystoneAltar) {
          const dist = Math.hypot(this.player.x - this.keystoneAltar.x, this.player.y - this.keystoneAltar.y);
          if (dist < 85) {
            this.interactWithAltar();
            return;
          }
        }
        const distToGate = Math.hypot(this.player.x - 700, this.player.y - 80);
        if (distToGate < 80) {
          eventBus.emit('OPEN_TOWN_SHOP');
          return;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (!this.isActive || window.gameApp?.currentScene !== 'world') {
        this.keys = {};
        return;
      }
      this.keys[e.key.toLowerCase()] = false;
    });

    eventBus.on('DPAD_MOVE', ({ dir, active }) => {
      if (!this.isActive || window.gameApp?.currentScene !== 'world') {
        this.keys = {};
        return;
      }
      if (active) {
        this.player.targetX = null;
        this.player.targetY = null;
      }
      if (dir === 'up') this.keys['arrowup'] = active;
      if (dir === 'down') this.keys['arrowdown'] = active;
      if (dir === 'left') this.keys['arrowleft'] = active;
      if (dir === 'right') this.keys['arrowright'] = active;
    });

    eventBus.on('PLAYER_STATS_CHANGED', (stats) => {
      if (stats.avatarSprite && !this.playerImg.src.includes(stats.avatarSprite.replace('./', ''))) {
        this.playerImg.src = stats.avatarSprite;
      }
    });

    eventBus.on('REALM_CHANGED', ({ realmId }) => {
      this.loadRealm(realmId);
    });

    // Tap/Click on canvas to interact or move in large world
    this.canvas.addEventListener('pointerdown', (e) => {
      // Strictly prevent clicks during battle or when any modal/grimoire overlay is open
      if (!this.isActive || window.gameApp?.currentScene !== 'world') return;
      if (document.querySelector('.tome-overlay:not(.hidden)')) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const screenClickX = (e.clientX - rect.left) * scaleX;
      const screenClickY = (e.clientY - rect.top) * scaleY;

      // Project screen touch into virtual world coordinates
      const worldClickX = screenClickX + this.camera.x;
      const worldClickY = screenClickY + this.camera.y;

      // Click on monster (Checks all active roaming monsters in realm)
      for (const monster of this.roamingMonsters) {
        if (!monster) continue;
        const distToMonster = Math.hypot(worldClickX - monster.x, worldClickY - monster.y);
        if (distToMonster < 75 && !this.isEncountering && this.encounterCooldown <= 0) {
          this.isEncountering = true;
          monster.alert = true;
          eventBus.emit('TRIGGER_ENCOUNTER_ALERT', { monster });
          return;
        }
      }

      // Click on Headmaster Noot NPC
      const distToNPC = Math.hypot(worldClickX - this.npcHeadmaster.x, worldClickY - this.npcHeadmaster.y);
      if (distToNPC < 70) {
        eventBus.emit('INTERACT_NPC_HEADMASTER');
        return;
      }

      // Click on Lamplight Town Gate (x: 700, y: 80)
      const distToGate = Math.hypot(worldClickX - 700, worldClickY - 80);
      if (distToGate < 80) {
        eventBus.emit('OPEN_TOWN_SHOP');
        return;
      }

      // Click on Treasure Chest
      if (this.treasureChest) {
        const distToChest = Math.hypot(worldClickX - this.treasureChest.x, worldClickY - this.treasureChest.y);
        if (distToChest < 65) {
          this.interactWithChest();
          return;
        }
      }

      // Click on Keystone Altar
      if (this.keystoneAltar) {
        const distToAltar = Math.hypot(worldClickX - this.keystoneAltar.x, worldClickY - this.keystoneAltar.y);
        if (distToAltar < 70) {
          this.interactWithAltar();
          return;
        }
      }

      // Click on Follower Pet (Pet interaction & feeding!)
      if (this.followerPet) {
        const distToPet = Math.hypot(worldClickX - this.followerPet.x, worldClickY - this.followerPet.y);
        if (distToPet < 55) {
          this.interactWithFollowerPet();
          return;
        }
      }

      // Click on Rustling Bushes (Mystery encounter & surprises!)
      for (const bush of this.rustlingBushes) {
        const distToBush = Math.hypot(worldClickX - bush.x, worldClickY - bush.y);
        if (distToBush < 50) {
          this.interactWithBush(bush);
          return;
        }
      }

      // Click on Signpost
      if (this.signpost) {
        const distToSign = Math.hypot(worldClickX - this.signpost.x, worldClickY - this.signpost.y);
        if (distToSign < 60) {
          eventBus.emit('SHOW_TOAST', { message: this.signpost.text, type: 'info' });
          return;
        }
      }

      // Tap to move in world space
      this.isDraggingMove = true;
      this.player.targetX = Math.max(25, Math.min(this.worldWidth - 25, worldClickX));
      this.player.targetY = Math.max(25, Math.min(this.worldHeight - 25, worldClickY));
      this.tapIndicator = {
        x: this.player.targetX,
        y: this.player.targetY,
        r: 6,
        alpha: 1.0
      };
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isDraggingMove || !this.isActive || window.gameApp?.currentScene !== 'world') return;
      if (document.querySelector('.tome-overlay:not(.hidden)')) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const worldClickX = (e.clientX - rect.left) * scaleX + this.camera.x;
      const worldClickY = (e.clientY - rect.top) * scaleY + this.camera.y;

      this.player.targetX = Math.max(25, Math.min(this.worldWidth - 25, worldClickX));
      this.player.targetY = Math.max(25, Math.min(this.worldHeight - 25, worldClickY));
    });

    const stopDrag = () => {
      this.isDraggingMove = false;
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);
  }

  interactWithChest() {
    if (!this.gameState || !this.treasureChest) return;
    if (this.gameState.isChestOpened(this.treasureChest.id)) {
      eventBus.emit('SHOW_TOAST', { message: '✨ 這個遠古寶箱已經被探索過了！', type: 'info' });
      return;
    }
    const rewards = this.gameState.openChest(this.treasureChest.id, this.treasureChest.rewards);
    if (rewards) {
      // Spawn burst of 28 glittering gold & star particles
      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 2;
        this.treasureChest.particles.push({
          x: this.treasureChest.x,
          y: this.treasureChest.y - 10,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 3,
          alpha: 1.0,
          size: Math.random() * 4 + 3,
          color: ['#f1c40f', '#f39c12', '#ffffff', '#2ecc71', '#e74c3c'][Math.floor(Math.random() * 5)]
        });
      }
      eventBus.emit('SHOW_TOAST', {
        message: `🎁 開啟遠古寶箱！獲得 +${rewards.gold} 金幣、+${rewards.xp} XP、+${rewards.stars} 星石！`,
        type: 'success'
      });
    }
  }

  interactWithAltar() {
    if (!this.keystoneAltar) return;
    const hasStone = this.gameState?.keystones.includes(this.keystoneAltar.keystoneId);
    if (hasStone) {
      eventBus.emit('SHOW_TOAST', {
        message: `✨ ${this.keystoneAltar.name} 祭壇共鳴中！守護結界光芒萬丈，王國恢復和平！`,
        type: 'success'
      });
    } else {
      eventBus.emit('TRIGGER_ALTAR_BOSS_TRIAL', {
        realmId: this.currentRealm,
        altar: this.keystoneAltar
      });
    }
  }

  interactWithFollowerPet() {
    let activePet = this.getActivePet();
    if (!activePet) {
      if (this.gameState) {
        this.gameState.addPet({
          id: 'peeko',
          name: 'Peeko (葉雀靈)',
          element: 'earth',
          level: 1,
          maxHp: 80,
          hp: 80,
          attack: 14,
          sprite: './assets/sprites/peeko.png'
        });
        this.gameState.activePetId = 'peeko';
        activePet = this.getActivePet();
      }
    }
    if (!activePet) return;

    this.petInteractionIndex = (this.petInteractionIndex || 0) + 1;
    const modeRoll = this.petInteractionIndex % 4;
    const petName = (activePet.name || '夥伴').split(' ')[0];

    // Jump up in joy
    this.followerPet.hopTimer = Math.PI * 0.5;

    if (modeRoll === 1) {
      // 1. 🌶️ 爆辣火焰椒！噴火繞圈狂奔
      this.petGoofyMode = 'chili';
      this.petGoofyTimer = 3.5;
      this.petGoofyAngle = 0;
      for (let i = 0; i < 8; i++) {
        this.petHearts.push({
          x: this.followerPet.x,
          y: this.followerPet.y - 10,
          vx: (Math.random() - 0.5) * 3,
          vy: -(Math.random() * 3 + 2),
          alpha: 1.0,
          size: 16,
          symbol: '🔥'
        });
      }
      eventBus.emit('SHOW_TOAST', {
        message: `🌶️ 你餵【${petName}】吃了爆辣火焰椒！嘴巴噴火像火箭一樣狂奔！(+10 親密度)`,
        type: 'success'
      });
    } else if (modeRoll === 2) {
      // 2. 🍦 急凍雪糕！結成冰塊發抖
      this.petGoofyMode = 'ice';
      this.petGoofyTimer = 2.5;
      for (let i = 0; i < 8; i++) {
        this.petHearts.push({
          x: this.followerPet.x,
          y: this.followerPet.y - 15,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 2 + 1),
          alpha: 1.0,
          size: 16,
          symbol: '❄️'
        });
      }
      eventBus.emit('SHOW_TOAST', {
        message: `🍦 你餵【${petName}】吃了急凍雪糕！凍成冰塊瑟瑟發抖～ (+10 親密度)`,
        type: 'info'
      });
    } else if (modeRoll === 3) {
      // 3. 🫘 彈跳跳跳豆！高高彈起
      this.petGoofyMode = 'bean';
      this.petGoofyTimer = 3.0;
      for (let i = 0; i < 8; i++) {
        this.petHearts.push({
          x: this.followerPet.x,
          y: this.followerPet.y - 20,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 3 + 2),
          alpha: 1.0,
          size: 15,
          symbol: ['🫘', '⭐', '🎶'][Math.floor(Math.random() * 3)]
        });
      }
      eventBus.emit('SHOW_TOAST', {
        message: `🫘 你餵【${petName}】吃了彈跳跳跳豆！變成彈簧球在螢幕上高高蹦跳！(+10 親密度)`,
        type: 'success'
      });
    } else {
      // 4. 🪶 摸肚子癢癢！打滾大笑
      this.petGoofyMode = 'tickle';
      this.petGoofyTimer = 2.8;
      for (let i = 0; i < 8; i++) {
        this.petHearts.push({
          x: this.followerPet.x + (Math.random() - 0.5) * 20,
          y: this.followerPet.y - 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2 + 1.5),
          alpha: 1.0,
          size: 16,
          symbol: ['😆', '💖', '🐾', '🤣'][Math.floor(Math.random() * 4)]
        });
      }
      eventBus.emit('SHOW_TOAST', {
        message: `🪶 你搔了搔【${petName}】的肚皮！牠笑到在草地上打滾翻跟斗！(+15 親密度)`,
        type: 'success'
      });
    }

    if (this.gameState) {
      this.gameState.addPetXp(activePet.id, 10);
    }
  }

  interactWithBush(bush) {
    if (bush.opened) {
      eventBus.emit('SHOW_TOAST', { message: '🌿 這裡的小草剛剛沙沙晃過，現在很安靜～', type: 'info' });
      return;
    }

    // Leaf burst particles
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 2;
      bush.leafParticles.push({
        x: bush.x,
        y: bush.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2,
        alpha: 1.0,
        size: Math.random() * 5 + 4,
        color: ['#2ed573', '#7bed9f', '#26de81', '#f1c40f', '#ffa502'][Math.floor(Math.random() * 5)]
      });
    }

    bush.opened = true;
    const roll = Math.random();

    // 方案 B：蛋孵化與草叢撿蛋
    if (this.gameState?.egg && this.gameState.egg.hasEgg) {
      const eggRes = this.gameState.progressEgg(1);
      if (eggRes?.readyToHatch) {
        eventBus.emit('SHOW_TOAST', {
          message: '🥚 喀嚓！隨身保溫巢裡的【神秘精靈蛋】劇烈晃動，要破殼啦！',
          type: 'success'
        });
        setTimeout(() => {
          eventBus.emit('TRIGGER_EGG_HATCH', { egg: this.gameState.egg });
        }, 800);
      } else {
        eventBus.emit('SHOW_TOAST', {
          message: `🥚 探索暖意傳入保溫巢！精靈蛋裂縫擴大 (${this.gameState.egg.progress}/${this.gameState.egg.target})！`,
          type: 'info'
        });
      }
    } else if (roll < 0.25) {
      if (this.gameState) {
        this.gameState.egg = {
          hasEgg: true,
          name: '星紋恐龍蛋',
          icon: '🥚',
          pattern: 'dino',
          progress: 0,
          target: 3
        };
        eventBus.emit('SHOW_TOAST', {
          message: '🥚 奇蹟！你在蓬鬆草叢裡挖出了一枚溫暖的【星紋神秘精靈蛋】！',
          type: 'success'
        });
      }
    }

    if (roll < 0.50) {
      // Surprise! A wild monster leaped out of the bush!
      const pool = REALM_MONSTER_POOLS[this.currentRealm] || REALM_MONSTER_POOLS['firefly_forest'];
      const ownedPetIds = (this.gameState?.pets || []).map(p => p.id);
      const unownedPool = pool.filter(p => !ownedPetIds.includes(p.id));
      const surpriseDef = unownedPool.length > 0
        ? unownedPool[Math.floor(Math.random() * unownedPool.length)]
        : pool[Math.floor(Math.random() * pool.length)];

      eventBus.emit('SHOW_TOAST', {
        message: `✨ 沙沙！一隻野生的【${surpriseDef.name}】從草叢跳了出來！`,
        type: 'success'
      });

      setTimeout(() => {
        if (window.gameApp && !this.isEncountering) {
          this.isEncountering = true;
          window.gameApp.startBattle(surpriseDef.id, `🌿 草叢奇遇 • 野生 ${surpriseDef.name}`);
        }
      }, 700);
    } else if (roll < 0.85) {
      // Golden coins and stars discovered!
      const goldGain = Math.floor(Math.random() * 25) + 15;
      const starGain = 1;
      this.gameState?.addGold(goldGain);
      this.gameState?.addStars(starGain);
      eventBus.emit('SHOW_TOAST', {
        message: `🍓 草叢裡藏著秘密寶物！獲得 +${goldGain} 金幣、+${starGain} 星石！`,
        type: 'success'
      });
    } else {
      // Recovering Magic Sweet Berry (Full heal + XP)
      this.gameState?.heal(30);
      this.gameState?.addXp(20);
      eventBus.emit('SHOW_TOAST', {
        message: `✨ 發現【魔法甜甜果】！巫師與精靈回復 30 體力，獲得 +20 XP！`,
        type: 'success'
      });
    }
  }

  update(dt) {
    let dx = 0;
    let dy = 0;

    const hasKeyInput = this.keys['arrowup'] || this.keys['w'] ||
                        this.keys['arrowdown'] || this.keys['s'] ||
                        this.keys['arrowleft'] || this.keys['a'] ||
                        this.keys['arrowright'] || this.keys['d'];

    if (hasKeyInput) {
      this.player.targetX = null;
      this.player.targetY = null;
      if (this.keys['arrowup'] || this.keys['w']) dy -= 1;
      if (this.keys['arrowdown'] || this.keys['s']) dy += 1;
      if (this.keys['arrowleft'] || this.keys['a']) dx -= 1;
      if (this.keys['arrowright'] || this.keys['d']) dx += 1;
    } else if (this.player.targetX !== null && this.player.targetY !== null) {
      const distX = this.player.targetX - this.player.x;
      const distY = this.player.targetY - this.player.y;
      const dist = Math.hypot(distX, distY);
      if (dist > 5) {
        dx = distX / dist;
        dy = distY / dist;
      } else {
        this.player.targetX = null;
        this.player.targetY = null;
      }
    }

    this.player.isMoving = dx !== 0 || dy !== 0;

    if (this.player.isMoving) {
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.direction = dx > 0 ? 'right' : 'left';
      } else if (dy !== 0) {
        this.player.direction = dy > 0 ? 'down' : 'up';
      }

      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;

      const stepX = dx * this.player.speed;
      const stepY = dy * this.player.speed;
      const targetX = Math.max(25, Math.min(this.worldWidth - 25, this.player.x + stepX));
      const targetY = Math.max(25, Math.min(this.worldHeight - 25, this.player.y + stepY));

      const obstacles = this.getObstacles();
      const isColliding = (px, py) => {
        const playerRadius = 16;
        return obstacles.some(obs => Math.hypot(px - obs.x, py - obs.y) < (playerRadius + obs.r));
      };

      if (!isColliding(targetX, targetY)) {
        this.player.x = targetX;
        this.player.y = targetY;
      } else if (!isColliding(targetX, this.player.y)) {
        this.player.x = targetX; // slide horizontally
      } else if (!isColliding(this.player.x, targetY)) {
        this.player.y = targetY; // slide vertically
      } else {
        if (this.player.targetX !== null) {
          this.player.targetX = null;
          this.player.targetY = null;
        }
      }

      this.player.animTimer += dt * 9;

      // Spawn dust particle
      if (Math.random() < 0.4) {
        this.player.dustParticles.push({
          x: this.player.x + (Math.random() - 0.5) * 16,
          y: this.player.y + 24,
          r: Math.random() * 3 + 2,
          alpha: 0.6
        });
      }
    }

    // Universal boundary safety clamp
    this.player.x = Math.max(25, Math.min(this.worldWidth - 25, this.player.x));
    this.player.y = Math.max(25, Math.min(this.worldHeight - 25, this.player.y));

    // Update border transition cooldown and check border crossing
    if (this.realmTransitionCooldown > 0) {
      this.realmTransitionCooldown -= dt;
    } else if (!this.isTransitioningRealm && !this.isEncountering && window.gameApp?.currentScene === 'world') {
      const adj = REALM_ADJACENCY[this.currentRealm] || REALM_ADJACENCY['firefly_forest'];

      // North Border (y <= 48): avoid central Town Gate at (700, 80)
      if (this.player.y <= 48 && Math.abs(this.player.x - 700) >= 65) {
        if (adj.north) {
          const spawnX = Math.max(90, Math.min(this.worldWidth - 90, this.player.x));
          const spawnY = this.worldHeight - 120;
          this.transitionToRealm(adj.north, spawnX, spawnY, '⬆️ 穿越北境邊界');
        }
      }
      // South Border (y >= this.worldHeight - 48)
      else if (this.player.y >= this.worldHeight - 48) {
        if (adj.south) {
          const spawnX = Math.max(90, Math.min(this.worldWidth - 90, this.player.x));
          const spawnY = 120;
          this.transitionToRealm(adj.south, spawnX, spawnY, '⬇️ 跨越南境邊界');
        }
      }
      // West Border (x <= 48)
      else if (this.player.x <= 48) {
        if (adj.west) {
          const spawnX = this.worldWidth - 120;
          const spawnY = Math.max(100, Math.min(this.worldHeight - 100, this.player.y));
          this.transitionToRealm(adj.west, spawnX, spawnY, '⬅️ 穿過西側峽谷');
        }
      }
      // East Border (x >= this.worldWidth - 48)
      else if (this.player.x >= this.worldWidth - 48) {
        if (adj.east) {
          const spawnX = 120;
          const spawnY = Math.max(100, Math.min(this.worldHeight - 100, this.player.y));
          this.transitionToRealm(adj.east, spawnX, spawnY, '➡️ 越過東側山徑');
        }
      }
    }

    // Update 5-minute spot respawn cooldown timers
    if (this.zoneCooldowns) {
      for (const [key, cd] of Object.entries(this.zoneCooldowns)) {
        if (cd.respawnTimer > 0) {
          cd.respawnTimer -= dt;
          if (cd.respawnTimer <= 0) {
            if (cd.realm === this.currentRealm && this.roamingMonsters[cd.slotIndex] === null) {
              this.spawnMonsterForSlot(cd.slotIndex);
            }
            delete this.zoneCooldowns[key];
          }
        }
      }
    }

    // Update Screen Fade Alpha
    if (this.fadeAlpha > 0) {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - dt * 2.2);
    }

    // Walking through North Lamplight Gate Archway at (700, 80)
    if (this.player.y <= 95 && Math.abs(this.player.x - 700) < 60) {
      if (!this.hasTriggeredGate) {
        this.hasTriggeredGate = true;
        this.player.y = 115;
        this.player.targetX = null;
        this.player.targetY = null;
        this.player.isMoving = false;
        eventBus.emit('OPEN_TOWN_SHOP');
        setTimeout(() => { this.hasTriggeredGate = false; }, 1200);
      }
    }

    // Dynamic Camera Viewport Smooth Tracking
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const targetCamX = this.player.x - cw / 2;
    const targetCamY = this.player.y - ch / 2;
    const maxCamX = Math.max(0, this.worldWidth - cw);
    const maxCamY = Math.max(0, this.worldHeight - ch);

    this.camera.targetX = Math.max(0, Math.min(maxCamX, targetCamX));
    this.camera.targetY = Math.max(0, Math.min(maxCamY, targetCamY));

    this.camera.x += (this.camera.targetX - this.camera.x) * 0.14;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.14;

    // Update Follower Pet
    this.updateFollowerPet(dt);

    // Update dust particles
    this.player.dustParticles.forEach(d => {
      d.r += dt * 3;
      d.alpha -= dt * 1.5;
    });
    this.player.dustParticles = this.player.dustParticles.filter(d => d.alpha > 0);

    // Decrement encounter cooldown grace period
    if (this.encounterCooldown > 0) {
      this.encounterCooldown -= dt;
    }

    // Update all roaming monsters in the realm
    for (const monster of this.roamingMonsters) {
      if (!monster) continue;
      monster.bobTimer += dt * 3.5;

      // Gentle ecological roaming around home area
      if (!monster.alert && !this.isEncountering) {
        monster.wanderTimer = (monster.wanderTimer || 0) + dt;
        if (monster.wanderTimer > 2.8) {
          monster.wanderTimer = 0;
          monster.wanderAngle = Math.random() * Math.PI * 2;
        }
        const wdx = Math.cos(monster.wanderAngle || 0) * 0.45;
        const wdy = Math.sin(monster.wanderAngle || 0) * 0.35;
        const nextX = monster.x + wdx;
        const nextY = monster.y + wdy;
        const hx = monster.homeX || monster.x;
        const hy = monster.homeY || monster.y;
        if (Math.hypot(nextX - hx, nextY - hy) < 42) {
          monster.x = nextX;
          monster.y = nextY;
        } else {
          monster.wanderAngle = Math.atan2(hy - monster.y, hx - monster.x);
        }
      }

      if (Math.random() < 0.35) {
        monster.flameParticles.push({
          x: monster.x + 22 + (Math.random() - 0.5) * 8,
          y: monster.y - 4 + (Math.random() - 0.5) * 8,
          r: Math.random() * 3 + 1.5,
          speedY: -(Math.random() * 1.2 + 0.8),
          alpha: 0.85
        });
      }

      monster.flameParticles.forEach(f => {
        f.y += f.speedY;
        f.alpha -= dt * 1.8;
      });
      monster.flameParticles = monster.flameParticles.filter(f => f.alpha > 0);

      // Proximity encounter trigger
      const dist = Math.hypot(this.player.x - monster.x, this.player.y - monster.y);
      if (dist < 60 && !this.isEncountering && this.encounterCooldown <= 0) {
        this.isEncountering = true;
        monster.alert = true;
        eventBus.emit('TRIGGER_ENCOUNTER_ALERT', { monster });
        break;
      }
    }

    // Water animation timer
    this.waterTimer += dt;

    // Fireflies update across world dimensions
    this.fireflies.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += dt * 3;
      if (p.y < 0) {
        p.y = this.worldHeight;
        p.x = Math.random() * this.worldWidth;
      }
      if (p.x < 0) p.x = this.worldWidth;
      if (p.x > this.worldWidth) p.x = 0;
    });

    // Update chest sparkle & particles
    if (this.treasureChest) {
      this.treasureChest.sparkleTimer += dt * 3;
      this.treasureChest.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += dt * 5;
        p.alpha -= dt * 1.2;
      });
      this.treasureChest.particles = this.treasureChest.particles.filter(p => p.alpha > 0);
    }

    // Update altar pulse
    if (this.keystoneAltar) {
      this.keystoneAltar.pulseTimer += dt * 2.5;
    }

    // Update Rustling Bushes shake animation & leaves
    this.rustlingBushes.forEach(b => {
      if (!b.opened) {
        b.shakeTimer += dt;
        b.shakePhase = Math.sin(b.shakeTimer * 5) * 4;
      } else {
        b.shakePhase = 0;
      }
      b.leafParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += dt * 4;
        p.alpha -= dt * 1.5;
      });
      b.leafParticles = b.leafParticles.filter(p => p.alpha > 0);
    });

    // Update Floating Pet Hearts
    this.petHearts.forEach(h => {
      h.x += h.vx;
      h.y += h.vy;
      h.alpha -= dt * 0.9;
    });
    this.petHearts = this.petHearts.filter(h => h.alpha > 0);

    // Follower Pet logic
    this.updateFollowerPet(dt);
  }

  getActivePet() {
    if (!this.gameState || !this.gameState.pets || this.gameState.pets.length === 0) {
      return null;
    }
    const activeId = this.gameState.activePetId || this.gameState.pets[0]?.id;
    return this.gameState.pets.find(p => p.id === activeId) || this.gameState.pets[0] || null;
  }

  getActivePets() {
    if (!this.gameState || !this.gameState.pets) return [];
    if (this.gameState.getActivePets) {
      return this.gameState.getActivePets();
    }
    const activeId = this.gameState.activePetId || this.gameState.pets[0]?.id;
    const p = this.gameState.pets.find(pet => pet.id === activeId) || this.gameState.pets[0];
    return p ? [p] : [];
  }

  updateFollowerPet(dt) {
    const activePets = this.getActivePets();
    if (!activePets || !activePets.length) return;

    const petA = activePets[0];
    const petB = activePets[1] || null;

    // --- Pet A (Left companion) ---
    const spritePathA = getPetAssetUrl(petA.id, 'overworld', 'player', petA.sprite || './assets/sprites/hotpot.png');
    if (!this.followerPet.img.src || !this.followerPet.img.src.includes(spritePathA.replace('./', ''))) {
      this.followerPet.img.src = spritePathA;
    }

    // Goofy Pet Behaviors on Pet A
    if (this.petGoofyMode) {
      this.petGoofyTimer -= dt;
      if (this.petGoofyTimer <= 0) {
        if (this.petGoofyMode === 'ice') {
          for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 3 + 1.5;
            this.petHearts.push({
              x: this.followerPet.x,
              y: this.followerPet.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              alpha: 1.0,
              size: 14,
              symbol: '❄️'
            });
          }
        }
        this.petGoofyMode = null;
      } else if (this.petGoofyMode === 'chili') {
        this.petGoofyAngle += dt * 7.5;
        this.followerPet.x = this.player.x + Math.cos(this.petGoofyAngle) * 58;
        this.followerPet.y = this.player.y + Math.sin(this.petGoofyAngle) * 45;
        this.followerPet.facing = Math.cos(this.petGoofyAngle) > 0 ? 'right' : 'left';
        if (Math.random() < 0.40) {
          this.petHearts.push({
            x: this.followerPet.x,
            y: this.followerPet.y,
            vx: -Math.cos(this.petGoofyAngle) * 2,
            vy: -Math.sin(this.petGoofyAngle) * 2,
            alpha: 1.0,
            size: 14,
            symbol: '🔥'
          });
        }
      }
    }

    let targetAX = this.player.x;
    let targetAY = this.player.y;
    let targetBX = this.player.x;
    let targetBY = this.player.y;

    if (this.player.direction === 'left') {
      targetAX += 42;
      targetAY += 14;
      targetBX += 68;
      targetBY -= 12;
    } else if (this.player.direction === 'right') {
      targetAX -= 42;
      targetAY += 14;
      targetBX -= 68;
      targetBY -= 12;
    } else if (this.player.direction === 'up') {
      targetAX -= 32;
      targetAY += 38;
      targetBX += 32;
      targetBY += 38;
    } else { // 'down'
      targetAX -= 36;
      targetAY -= 26;
      targetBX += 36;
      targetBY -= 26;
    }

    const lerpSpeed = this.player.isMoving ? 0.14 : 0.08;
    if (!this.petGoofyMode || this.petGoofyMode !== 'chili') {
      this.followerPet.x += (targetAX - this.followerPet.x) * lerpSpeed;
      this.followerPet.y += (targetAY - this.followerPet.y) * lerpSpeed;
    }

    this.followerPet.hopTimer += dt * (this.player.isMoving ? 12 : 3.5);

    if (this.player.x > this.followerPet.x + 3) {
      this.followerPet.facing = 'right';
    } else if (this.player.x < this.followerPet.x - 3) {
      this.followerPet.facing = 'left';
    }

    // --- Pet B (Right companion, if equipped) ---
    if (petB) {
      const spritePathB = getPetAssetUrl(petB.id, 'overworld', 'player', petB.sprite || './assets/sprites/squiddle.png');
      if (!this.followerPetB.img.src || !this.followerPetB.img.src.includes(spritePathB.replace('./', ''))) {
        this.followerPetB.img.src = spritePathB;
      }

      this.followerPetB.x += (targetBX - this.followerPetB.x) * (lerpSpeed * 0.92);
      this.followerPetB.y += (targetBY - this.followerPetB.y) * (lerpSpeed * 0.92);
      this.followerPetB.hopTimer += dt * (this.player.isMoving ? 11 : 3.2);

      if (this.player.x > this.followerPetB.x + 3) {
        this.followerPetB.facing = 'right';
      } else if (this.player.x < this.followerPetB.x - 3) {
        this.followerPetB.facing = 'left';
      }
    }
  }

  renderFollowerPet() {
    const activePets = this.getActivePets();
    if (!activePets || !activePets.length) return;

    const { ctx } = this;
    const petA = activePets[0];
    const petB = activePets[1] || null;

    // Render Pet A (Left)
    this.renderSinglePet(this.followerPet, petA, '1號');

    // Render Pet B (Right, if present)
    if (petB && this.followerPetB) {
      this.renderSinglePet(this.followerPetB, petB, '2號');
    }

    // Render Floating Pet Hearts & Emojis
    this.petHearts.forEach(h => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, h.alpha);
      ctx.font = `${h.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(h.symbol, h.x, h.y);
      ctx.restore();
    });
  }

  renderSinglePet(followerObj, petData, slotLabel) {
    const { ctx } = this;
    let hopBob = Math.abs(Math.sin(followerObj.hopTimer)) * (this.player.isMoving ? 8 : 3.5);
    let petRot = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (followerObj === this.followerPet && this.petGoofyMode === 'bean') {
      hopBob = Math.abs(Math.sin(Date.now() * 0.008)) * 36;
      scaleX = hopBob < 5 ? 1.3 : 0.85;
      scaleY = hopBob < 5 ? 0.7 : 1.25;
    } else if (followerObj === this.followerPet && this.petGoofyMode === 'tickle') {
      petRot = Math.sin(Date.now() * 0.012) * 0.75;
      hopBob = 2;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(followerObj.x, followerObj.y + 16, 16 * scaleX, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(followerObj.x, followerObj.y - hopBob);
    if (followerObj.facing === 'left') {
      ctx.scale(-scaleX, scaleY);
    } else {
      ctx.scale(scaleX, scaleY);
    }
    if (petRot !== 0) {
      ctx.rotate(petRot);
    }

    if (followerObj === this.followerPet && this.petGoofyMode === 'chili') {
      ctx.filter = 'drop-shadow(0 0 10px #ff4757)';
    }

    if (followerObj.img.complete && followerObj.img.naturalWidth > 0) {
      ctx.drawImage(
        followerObj.img,
        -followerObj.size / 2,
        -followerObj.size / 2,
        followerObj.size,
        followerObj.size
      );
    }
    ctx.restore();

    // Cute Pill Tag
    ctx.save();
    const shortName = (petData.name || '夥伴').split(' ')[0];
    ctx.font = 'bold 9.5px "ProdigySans", sans-serif';
    const tagText = `🐾 ${shortName}`;
    const textWidth = ctx.measureText(tagText).width;
    const badgeW = Math.max(46, textWidth + 12);
    const badgeH = 15;
    const badgeX = followerObj.x - badgeW / 2;
    const badgeY = followerObj.y - followerObj.size / 2 - hopBob - 17;

    ctx.fillStyle = 'rgba(26, 18, 11, 0.78)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 7);
    ctx.fill();
    ctx.strokeStyle = slotLabel === '1號' ? 'rgba(241, 196, 15, 0.7)' : 'rgba(46, 213, 115, 0.7)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fffae6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, followerObj.x, badgeY + badgeH / 2 + 0.5);
    ctx.restore();
  }

  renderRustlingBushes() {
    const { ctx } = this;
    this.rustlingBushes.forEach(bush => {
      ctx.save();
      const shakeX = Math.sin(Date.now() * 0.012 + (bush.shakeTimer || 0)) * (bush.opened ? 0 : 3.5);
      const bx = bush.x + shakeX;
      const by = bush.y;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
      ctx.beginPath();
      ctx.ellipse(bx, by + bush.r * 0.7, bush.r * 1.1, bush.r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bush Cluster Body (3 overlapping lush foliage bubbles)
      const bushBaseColor = bush.opened ? '#4a7c59' : '#27ae60';
      const bushHighlightColor = bush.opened ? '#5d9c6f' : '#2ecc71';

      ctx.fillStyle = bushBaseColor;
      ctx.beginPath();
      ctx.arc(bx - bush.r * 0.4, by, bush.r * 0.7, 0, Math.PI * 2);
      ctx.arc(bx + bush.r * 0.4, by, bush.r * 0.7, 0, Math.PI * 2);
      ctx.arc(bx, by - bush.r * 0.35, bush.r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bushHighlightColor;
      ctx.beginPath();
      ctx.arc(bx - bush.r * 0.25, by - bush.r * 0.3, bush.r * 0.4, 0, Math.PI * 2);
      ctx.arc(bx + bush.r * 0.25, by - bush.r * 0.2, bush.r * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // If active and rustling, render sparkling mystery star and question mark
      if (!bush.opened) {
        const bounce = Math.abs(Math.sin(Date.now() * 0.008)) * 4;
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 13px "ProdigySans", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 4;
        ctx.fillText('✨ ?', bx, by - bush.r - 4 - bounce);
      }

      // Leaf burst particles
      bush.leafParticles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }

  render() {
    const { ctx, canvas } = this;
    const screenW = canvas.width;
    const screenH = canvas.height;

    // 0. Base screen background
    ctx.fillStyle = '#06090e';
    ctx.fillRect(0, 0, screenW, screenH);

    // ==========================================
    // 1. WORLD SPACE (Transformed by Camera Viewport)
    // ==========================================
    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. Multi-tone Thematic Realm Meadow / Terrain
    this.renderTerrain(this.worldWidth, this.worldHeight);

    // 2. Animated Sparkling Stream along East border
    this.renderStream(this.worldWidth, this.worldHeight);

    // 3. Winding Cobblestone Road Network
    this.renderRoad(this.worldWidth, this.worldHeight);

    // 4. North Lamplight Gateway Arch at (700, 80)
    this.renderLamplightGate(700, 80);

    // 5. Environmental props (Flowers, Shrubs, Trees)
    this.renderProps(this.worldWidth, this.worldHeight);

    // 5.2 Adventure Signpost at (630, 720)
    this.renderSignpost();

    // 5.4 Ancient Keystone Altar at (1120, 260)
    this.renderKeystoneAltar();

    // 5.6 Interactive Treasure Chest at (280, 1300)
    this.renderTreasureChest();

    // 5.7 Mystery Rustling Bushes (Surprises & Wild Encounters)
    this.renderRustlingBushes();

    // 5.8 Tap Indicator (Ripple)
    if (this.tapIndicator) {
      this.tapIndicator.r += 0.8;
      this.tapIndicator.alpha -= 0.04;
      if (this.tapIndicator.alpha > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(241, 196, 15, ${this.tapIndicator.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(this.tapIndicator.x, this.tapIndicator.y, this.tapIndicator.r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.tapIndicator.alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.tapIndicator.x, this.tapIndicator.y, this.tapIndicator.r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        this.tapIndicator = null;
      }
    }

    // 6. Dust particles behind player
    this.player.dustParticles.forEach(d => {
      ctx.fillStyle = `rgba(220, 210, 190, ${d.alpha})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 7. Depth sorted: Pet behind wizard if higher Y
    const isPetBehind = this.followerPet.y < this.player.y;
    if (isPetBehind) {
      this.renderFollowerPet();
    }

    // Player Shadow & Character
    const walkBob = this.player.isMoving ? Math.sin(this.player.animTimer) * 4.5 : Math.sin(Date.now() * 0.003) * 1.5;
    const walkTilt = this.player.isMoving ? Math.sin(this.player.animTimer) * 0.07 : 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(this.player.x, this.player.y + 24, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(this.player.x, this.player.y + walkBob);
    ctx.rotate(walkTilt);
    if (this.player.direction === 'left') {
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.playerImg,
        -this.player.size / 2,
        -this.player.size / 2,
        this.player.size,
        this.player.size
      );
    } else {
      ctx.drawImage(
        this.playerImg,
        -this.player.size / 2,
        -this.player.size / 2,
        this.player.size,
        this.player.size
      );
    }
    ctx.restore();

    // Depth sorted: Pet in front of wizard if lower Y
    if (!isPetBehind) {
      this.renderFollowerPet();
    }

    // 7.5 Academy Mentor NPC: Headmaster Noot
    this.npcHeadmaster.bobTimer = (this.npcHeadmaster.bobTimer || 0) + 0.03;
    const npcBob = Math.sin(this.npcHeadmaster.bobTimer) * 3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(this.npcHeadmaster.x, this.npcHeadmaster.y + 24, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      this.npcImg,
      this.npcHeadmaster.x - this.npcHeadmaster.size / 2,
      this.npcHeadmaster.y - this.npcHeadmaster.size / 2 + npcBob,
      this.npcHeadmaster.size,
      this.npcHeadmaster.size
    );
    ctx.restore();

    // Headmaster Speech Balloon
    this.renderNpcBalloon(this.npcHeadmaster.x, this.npcHeadmaster.y - 42 + npcBob);

    // 8. Roaming Monsters Shadow & Character (All active wild monsters or Tranquil Nature spots)
    const slotBasePositions = [
      { x: 320, y: 380, name: '西北林地' },
      { x: 1120, y: 820, name: '東境廢墟' },
      { x: 780, y: 1380, name: '南境深谷' }
    ];

    for (let i = 0; i < this.roamingMonsters.length; i++) {
      const monster = this.roamingMonsters[i];
      if (monster) {
        const monsterBob = Math.sin(monster.bobTimer) * 5;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(monster.x, monster.y + 28, 26, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Monster flame trail particles
        monster.flameParticles.forEach(f => {
          ctx.fillStyle = `rgba(255, 118, 117, ${f.alpha})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y + monsterBob, f.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        const mImg = monster.img || this.monsterImg;
        ctx.drawImage(
          mImg,
          monster.x - monster.size / 2,
          monster.y - monster.size / 2 + monsterBob,
          monster.size,
          monster.size
        );
        ctx.restore();

        // Cute Monster Speech Balloon
        this.renderMonsterBalloon(monster, monster.x, monster.y - 48 + monsterBob);

        // Monster Alert (!) Bubble when triggered
        if (monster.alert) {
          this.renderMonsterAlertBubble(monster.x, monster.y - monster.size / 2 - 20 + monsterBob);
        }
      } else {
        // Monster slot in 5-minute Tranquil Nature Cooldown
        const cdKey = `${this.currentRealm}_slot_${i}`;
        const cdInfo = this.zoneCooldowns?.[cdKey];
        const remainingSec = cdInfo ? Math.max(0, Math.ceil(cdInfo.respawnTimer)) : 0;
        const mins = Math.floor(remainingSec / 60);
        const secs = String(remainingSec % 60).padStart(2, '0');
        const pos = slotBasePositions[i] || { x: 500, y: 500 };

        ctx.save();
        // Soft sanctuary green clover aura
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
        const auraGrad = ctx.createRadialGradient(pos.x, pos.y, 10, pos.x, pos.y, 55);
        auraGrad.addColorStop(0, `rgba(46, 213, 115, ${0.25 + pulse * 0.15})`);
        auraGrad.addColorStop(0.7, `rgba(46, 213, 115, 0.08)`);
        auraGrad.addColorStop(1, 'rgba(46, 213, 115, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 55, 0, Math.PI * 2);
        ctx.fill();

        // Tranquil flower ring
        ctx.strokeStyle = `rgba(46, 213, 115, ${0.4 + pulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Sanctuary emblem
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌿', pos.x, pos.y - 4 + Math.sin(Date.now() * 0.002) * 2);

        // Pill badge with cooldown
        const badgeW = 120;
        const badgeH = 22;
        const badgeX = pos.x - badgeW / 2;
        const badgeY = pos.y + 20;

        ctx.fillStyle = 'rgba(12, 22, 16, 0.85)';
        ctx.strokeStyle = '#2ed573';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect?.(badgeX, badgeY, badgeW, badgeH, 11);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a8e6cf';
        ctx.font = 'bold 10px ProdigySans, sans-serif';
        ctx.fillText(`清幽寧靜 • ${mins}:${secs}`, pos.x, badgeY + badgeH / 2 + 0.5);
        ctx.restore();
      }
    }

    // 8.5 Seamless Realm Border Exit Portals / Directional Indicators in World Space
    this.renderBorderPortals();

    // 9. Floating Golden Fireflies in World Space
    this.fireflies.forEach(p => {
      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
      glow.addColorStop(0, `rgba(255, 238, 140, ${currentAlpha})`);
      glow.addColorStop(1, 'rgba(255, 238, 140, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore(); // END OF WORLD SPACE

    // ==========================================
    // 2. SCREEN SPACE (Fixed Viewport HUD Elements)
    // ==========================================

    // 10. Off-screen Creature Radar Indicators (Live distance tracking!)
    this.renderRadarIndicators(screenW, screenH);

    // 11. Current Exploration Region Pill
    this.renderRegionPill(screenW, screenH);

    // 12. Diegetic World Guide Ribbon (Bottom Center)
    this.renderWorldGuideBanner(screenW, screenH);

    // 13. Screen Transition Fade Overlay
    if (this.fadeAlpha > 0) {
      ctx.fillStyle = `rgba(6, 9, 14, ${this.fadeAlpha})`;
      ctx.fillRect(0, 0, screenW, screenH);
    }
  }

  renderTerrain(w, h) {
    const { ctx } = this;
    const cfg = this.realmConfig || {
      skyTop: '#559c3a',
      skyBottom: '#44842d',
      lightDapple: 'rgba(120, 210, 85, 0.2)'
    };
    const grassGrad = ctx.createLinearGradient(0, 0, 0, h);
    grassGrad.addColorStop(0, cfg.skyTop);
    grassGrad.addColorStop(1, cfg.skyBottom);
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 0, w, h);

    // Soft dappled light patches across zones
    ctx.fillStyle = cfg.lightDapple || 'rgba(120, 210, 85, 0.2)';
    const dapples = [
      { x: 350, y: 380, rx: 260, ry: 200, rot: 0.2 },
      { x: 1050, y: 300, rx: 240, ry: 180, rot: -0.15 },
      { x: 400, y: 800, rx: 280, ry: 210, rot: 0.1 },
      { x: 1050, y: 850, rx: 260, ry: 190, rot: -0.2 },
      { x: 350, y: 1300, rx: 250, ry: 190, rot: 0.15 },
      { x: 800, y: 1380, rx: 270, ry: 200, rot: -0.1 }
    ];
    dapples.forEach(d => {
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.rx, d.ry, d.rot, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderRoad(w, h) {
    const { ctx } = this;
    ctx.save();
    
    // Road dirt foundation - Main North-South Highway
    ctx.strokeStyle = '#c8a268';
    ctx.lineWidth = 88;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(700, 60);
    ctx.bezierCurveTo(690, 350, 710, 600, 700, 800);
    ctx.bezierCurveTo(690, 1050, 710, 1300, 700, 1550);
    ctx.stroke();

    // East-West Crossroads Trail
    ctx.beginPath();
    ctx.moveTo(220, 800);
    ctx.lineTo(1180, 800);
    ctx.stroke();

    // Northeast Path to Keystone Altar
    ctx.beginPath();
    ctx.moveTo(700, 420);
    ctx.bezierCurveTo(850, 400, 980, 340, 1120, 260);
    ctx.stroke();

    // Southwest Path to Treasure Chest
    ctx.beginPath();
    ctx.moveTo(700, 1150);
    ctx.bezierCurveTo(550, 1180, 420, 1220, 280, 1300);
    ctx.stroke();

    // Cobblestone core
    ctx.strokeStyle = '#dfc294';
    ctx.lineWidth = 72;
    ctx.beginPath();
    ctx.moveTo(700, 60);
    ctx.bezierCurveTo(690, 350, 710, 600, 700, 800);
    ctx.bezierCurveTo(690, 1050, 710, 1300, 700, 1550);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(220, 800);
    ctx.lineTo(1180, 800);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(700, 420);
    ctx.bezierCurveTo(850, 400, 980, 340, 1120, 260);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(700, 1150);
    ctx.bezierCurveTo(550, 1180, 420, 1220, 280, 1300);
    ctx.stroke();

    // Stylized Cobblestone pavers
    ctx.fillStyle = '#bca070';
    const stones = [
      { x: 695, y: 140, rx: 14, ry: 9 },
      { x: 705, y: 220, rx: 13, ry: 8 },
      { x: 690, y: 320, rx: 15, ry: 10 },
      { x: 700, y: 440, rx: 14, ry: 9 },
      { x: 705, y: 580, rx: 16, ry: 10 },
      { x: 690, y: 700, rx: 15, ry: 9 },
      { x: 700, y: 800, rx: 20, ry: 14 },
      { x: 640, y: 800, rx: 14, ry: 9 },
      { x: 760, y: 800, rx: 14, ry: 9 },
      { x: 520, y: 800, rx: 15, ry: 10 },
      { x: 900, y: 800, rx: 15, ry: 9 },
      { x: 1040, y: 800, rx: 14, ry: 8 },
      { x: 695, y: 920, rx: 14, ry: 9 },
      { x: 705, y: 1040, rx: 15, ry: 10 },
      { x: 690, y: 1180, rx: 14, ry: 9 },
      { x: 705, y: 1320, rx: 15, ry: 10 },
      { x: 695, y: 1460, rx: 14, ry: 9 },
      { x: 840, y: 390, rx: 13, ry: 8 },
      { x: 970, y: 330, rx: 14, ry: 9 },
      { x: 550, y: 1200, rx: 14, ry: 9 },
      { x: 410, y: 1240, rx: 13, ry: 8 }
    ];
    stones.forEach(s => {
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.rx, s.ry, 0.1, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  renderStream(w, h) {
    const { ctx } = this;
    ctx.save();

    // River bed along East border
    ctx.fillStyle = '#1e75a8';
    ctx.beginPath();
    ctx.moveTo(1260, 0);
    ctx.bezierCurveTo(1220, 400, 1290, 800, 1240, 1200);
    ctx.bezierCurveTo(1210, 1400, 1260, 1500, 1250, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Sparkling water flow
    ctx.fillStyle = '#3aa0db';
    ctx.beginPath();
    ctx.moveTo(1280, 0);
    ctx.bezierCurveTo(1240, 400, 1310, 800, 1260, 1200);
    ctx.bezierCurveTo(1230, 1400, 1280, 1500, 1270, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Water ripple highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 12; i++) {
      const waveY = ((i * 140 + this.waterTimer * 40) % h);
      ctx.beginPath();
      ctx.arc(1280 + Math.sin(waveY * 0.05) * 12, waveY, 20, 0, Math.PI * 0.6);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderRadarIndicators(screenW, screenH) {
    const { ctx } = this;
    const margin = 34;
    const ownedPetIds = (this.gameState?.pets || []).map(p => p.id);

    this.roamingMonsters.forEach(m => {
      if (!m) return;
      // Calculate monster position in current screen viewport
      const screenX = m.x - this.camera.x;
      const screenY = m.y - this.camera.y;

      const isOffScreen = screenX < 20 || screenX > screenW - 20 || screenY < 75 || screenY > screenH - 55;
      if (isOffScreen) {
        const clampedX = Math.max(margin, Math.min(screenW - margin, screenX));
        const clampedY = Math.max(85, Math.min(screenH - margin - 25, screenY));
        const angle = Math.atan2(screenY - clampedY, screenX - clampedX);
        const dist = Math.round(Math.hypot(m.x - this.player.x, m.y - this.player.y));
        const isUnowned = !ownedPetIds.includes(m.id);

        ctx.save();
        ctx.translate(clampedX, clampedY);
        ctx.rotate(angle);

        // Radar Arrow Pointer
        ctx.fillStyle = isUnowned ? '#f1c40f' : '#2ed573';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-8, -10);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-8, 10);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Off-screen Mini Badge with distance (safely clamped to viewport bounds)
        ctx.save();
        ctx.font = 'bold 9.5px ProdigySans, sans-serif';
        ctx.fillStyle = isUnowned ? '#fff3cd' : '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 5;
        ctx.textAlign = 'center';
        const label = isUnowned ? `✨${m.name.split(' ')[0]} ${dist}m` : `${m.name.split(' ')[0]} ${dist}m`;
        const labelW = ctx.measureText(label).width;
        const safeLabelX = Math.max(labelW / 2 + 8, Math.min(screenW - labelW / 2 - 8, clampedX));
        ctx.fillText(label, safeLabelX, clampedY + 16);
        ctx.restore();
      }
    });
  }

  renderRegionPill(screenW, screenH) {
    const { ctx } = this;
    ctx.save();

    let regionName = '🌾 中央十字平原 (Crossroads)';
    if (this.player.y < 520) {
      regionName = '🌲 北方前哨 • 學院神殿區 (North)';
    } else if (this.player.y > 1100) {
      regionName = '🌿 南方深谷 • 秘境密林 (South)';
    } else if (this.player.x > 950) {
      regionName = '🏛️ 東方遺跡 • 潮汐溪畔 (East)';
    } else if (this.player.x < 450) {
      regionName = '🌸 西方花甸 • 晨曦平原 (West)';
    }

    ctx.font = 'bold 10.5px ProdigySans, sans-serif';
    const textW = ctx.measureText(regionName).width;
    const pillW = textW + 18;
    const pillH = 22;
    const pillX = Math.round((screenW - pillW) / 2);
    const pillY = screenW <= 550 ? 78 : 106; // Below top realm badge

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect?.(pillX, pillY, pillW, pillH, 11);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(regionName, pillX + pillW / 2, pillY + pillH / 2 + 0.5);

    ctx.restore();
  }

  renderLamplightGate(x, y) {
    const { ctx } = this;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + 25, 60, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone Pillars
    const drawPillar = (px) => {
      const grad = ctx.createLinearGradient(px - 14, y, px + 14, y);
      grad.addColorStop(0, '#57606f');
      grad.addColorStop(0.5, '#747d8c');
      grad.addColorStop(1, '#2f3542');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(px - 12, y - 40, 24, 60, 4);
      ctx.fill();

      // Golden Ring
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(px - 14, y - 25, 28, 6);
    };

    drawPillar(x - 50);
    drawPillar(x + 50);

    // Archway lintel
    const archGrad = ctx.createLinearGradient(x - 65, y - 48, x + 65, y - 48);
    archGrad.addColorStop(0, '#2f3542');
    archGrad.addColorStop(0.5, '#57606f');
    archGrad.addColorStop(1, '#2f3542');
    ctx.fillStyle = archGrad;
    ctx.beginPath();
    ctx.roundRect?.(x - 65, y - 56, 130, 20, 8);
    ctx.fill();
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lamplight Town Emblem
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(x, y - 46, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffeaa7';
    ctx.font = 'bold 11px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏛️', x, y - 42);

    // Archway Title
    ctx.fillStyle = '#f5f6fa';
    ctx.font = 'bold 11px ProdigySans, sans-serif';
    ctx.fillText('燈火主城 通道', x, y - 62);

    // Proximity interaction balloon
    const distToPlayer = Math.hypot(this.player.x - x, this.player.y - y);
    if (distToPlayer < 85) {
      this.renderEntityBalloon(x, y - 76, '🏛️ 燈火學院拱門 • 走入或點擊進入主城！', '#9b59b6');
    }

    ctx.restore();
  }

  renderProps(w, h) {
    const { ctx } = this;

    // Flowers
    this.environmentProps.filter(p => p.type === 'flower').forEach(f => {
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
      // Flower center
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Trees with lush foliage
    this.environmentProps.filter(p => p.type === 'tree').forEach(t => {
      // Tree shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(t.x, t.y + t.r * 0.8, t.r * 0.9, t.r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trunk
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(t.x - 12, t.y + 10, 24, t.r * 0.8);

      // Layer 1 - Deep foliage
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.arc(t.x - t.r * 0.45, t.y + t.r * 0.2, t.r * 0.7, 0, Math.PI * 2);
      ctx.arc(t.x + t.r * 0.45, t.y + t.r * 0.2, t.r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Layer 2 - Highlight foliage
      ctx.fillStyle = '#43a047';
      ctx.beginPath();
      ctx.arc(t.x - 6, t.y - 8, t.r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Layer 3 - Top light cap
      ctx.fillStyle = '#66bb6a';
      ctx.beginPath();
      ctx.arc(t.x - 10, t.y - 16, t.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderMonsterBalloon(monster, x, y) {
    const { ctx } = this;
    ctx.save();

    const balloonText = (typeof monster === 'object' && monster?.balloonMsg) 
      ? monster.balloonMsg 
      : '🔥 點擊/靠近戰鬥！';
    const isBoss = typeof monster === 'object' && monster?.isBoss;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect?.(x - 72, y - 2, 144, 28, 14);
    ctx.fill();

    // Balloon body
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = isBoss ? '#e74c3c' : '#e67e22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect?.(x - 74, y - 4, 148, 28, 14);
    ctx.fill();
    ctx.stroke();

    // Little triangle pointer
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 24);
    ctx.lineTo(x + 5, y + 24);
    ctx.lineTo(x, y + 31);
    ctx.fill();

    // Text
    ctx.fillStyle = isBoss ? '#c0392b' : '#d35400';
    ctx.font = 'bold 11px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(balloonText, x, y + 14);

    ctx.restore();
  }

  renderMonsterAlertBubble(x, y) {
    const { ctx } = this;
    ctx.save();

    // Pulsing outer halo
    const pulse = 1.0 + Math.sin(Date.now() * 0.015) * 0.2;
    ctx.fillStyle = 'rgba(231, 76, 60, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, 18 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Alert badge circle
    ctx.fillStyle = '#e74c3c';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exclamation text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❗', x, y);

    ctx.restore();
  }

  getRealmDisplayName(realmId) {
    const names = {
      'firefly_forest': '螢火蟲森林 (Firefly Forest)',
      'shipwreck_shore': '海難海岸 (Shipwreck Shore)',
      'bonfire_spire': '篝火火山峰 (Bonfire Spire)',
      'shiverchill_mountains': '寒顫雪山 (Shiverchill Mountains)',
      'skywatch': '浮空風暴城 (Skywatch)'
    };
    return names[realmId] || '冒險王國';
  }

  respawnAfterBattle(lastFoughtMonsterId) {
    this.isEncountering = false;
    this.encounterCooldown = 2.0; // 2s grace period
    
    // Clear alert flags on all active monsters
    this.roamingMonsters.forEach(m => {
      if (m) m.alert = false;
    });

    // Find which monster slot was fought
    let targetIndex = this.roamingMonsters.findIndex(m => m && m.id === lastFoughtMonsterId);
    if (targetIndex === -1) {
      targetIndex = 0;
    }

    // Set 5-minute (300 seconds) respawn cooldown on this spot!
    const cooldownSeconds = 300;
    this.zoneCooldowns = this.zoneCooldowns || {};
    const cdKey = `${this.currentRealm}_slot_${targetIndex}`;
    this.zoneCooldowns[cdKey] = {
      slotIndex: targetIndex,
      realm: this.currentRealm,
      respawnTimer: cooldownSeconds
    };

    // Clear monster from this roaming slot so spot is tranquil
    this.roamingMonsters[targetIndex] = null;

    eventBus.emit('SHOW_TOAST', {
      icon: '🌿',
      title: '此地重歸寧靜',
      text: `野外精靈已被收服/退散！此區域將保持寧靜 5 分鐘，可安心探索！`
    });
  }

  spawnMonsterForSlot(targetIndex) {
    const pool = REALM_MONSTER_POOLS[this.currentRealm] || REALM_MONSTER_POOLS['firefly_forest'];
    if (!pool || pool.length === 0) return;

    const activeMonsterIds = this.roamingMonsters.filter(Boolean).map(m => m.id);
    const ownedPetIds = (this.gameState?.pets || []).map(p => p.id);

    let candidates = pool.filter(p => !activeMonsterIds.includes(p.id));
    if (candidates.length === 0) {
      candidates = pool;
    }

    // Prioritize uncollected pets
    const unownedCandidates = candidates.filter(p => !ownedPetIds.includes(p.id));
    const nextDef = unownedCandidates.length > 0 
      ? unownedCandidates[Math.floor(Math.random() * unownedCandidates.length)]
      : candidates[Math.floor(Math.random() * candidates.length)];

    const slotPos = targetIndex === 0 
      ? { x: 320 + (Math.random() - 0.5) * 50, y: 380 + (Math.random() - 0.5) * 50 }
      : (targetIndex === 1 
          ? { x: 1120 + (Math.random() - 0.5) * 50, y: 820 + (Math.random() - 0.5) * 50 }
          : { x: 780 + (Math.random() - 0.5) * 50, y: 1380 + (Math.random() - 0.5) * 50 });

    const newMonster = {
      id: nextDef.id,
      name: nextDef.name,
      balloonMsg: nextDef.balloonMsg,
      isBoss: false,
      x: slotPos.x,
      y: slotPos.y,
      homeX: slotPos.x,
      homeY: slotPos.y,
      wanderTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      size: 72,
      bobTimer: Math.random() * Math.PI,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    newMonster.img.src = nextDef.sprite;

    this.roamingMonsters[targetIndex] = newMonster;

    eventBus.emit('SHOW_TOAST', {
      icon: '🐾',
      title: '野生新物怪出沒！',
      text: `5 分鐘已過，野生【${nextDef.name}】重新遊蕩到了 ${this.getRealmDisplayName(this.currentRealm)}！`
    });
  }

  transitionToRealm(targetRealm, spawnX, spawnY, dirText) {
    if (this.isTransitioningRealm || this.realmTransitionCooldown > 0) return;
    this.isTransitioningRealm = true;
    this.realmTransitionCooldown = 2.0;

    // Stop player movement
    this.player.targetX = null;
    this.player.targetY = null;
    this.player.isMoving = false;
    this.keys = {};

    // Trigger visual fade transition
    this.fadeAlpha = 1.0;

    // Update GameState and emit REALM_CHANGED
    if (this.gameState) {
      this.gameState.currentRealm = targetRealm;
      if (typeof this.gameState.save === 'function') {
        this.gameState.save();
      }
    }
    eventBus.emit('REALM_CHANGED', { realmId: targetRealm });

    // Load new realm
    this.loadRealm(targetRealm, spawnX, spawnY);

    // Toast notification
    const realmName = this.getRealmDisplayName(targetRealm);
    eventBus.emit('SHOW_TOAST', {
      icon: '🧭',
      title: '無縫邊界探索',
      text: `${dirText} • 抵達【${realmName}】！`
    });

    setTimeout(() => {
      this.isTransitioningRealm = false;
    }, 1200);
  }

  renderBorderPortals() {
    const { ctx } = this;
    const adj = REALM_ADJACENCY[this.currentRealm] || REALM_ADJACENCY['firefly_forest'];
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);

    const portals = [
      {
        id: 'north',
        target: adj.north,
        x: 700,
        y: 35,
        arrow: '⬆️',
        w: 160,
        h: 28,
        label: `北境 • ${this.getRealmDisplayName(adj.north)}`
      },
      {
        id: 'south',
        target: adj.south,
        x: 700,
        y: this.worldHeight - 35,
        arrow: '⬇️',
        w: 160,
        h: 28,
        label: `南境 • ${this.getRealmDisplayName(adj.south)}`
      },
      {
        id: 'west',
        target: adj.west,
        x: 35,
        y: 800,
        arrow: '⬅️',
        w: 160,
        h: 28,
        label: `西境 • ${this.getRealmDisplayName(adj.west)}`
      },
      {
        id: 'east',
        target: adj.east,
        x: this.worldWidth - 35,
        y: 800,
        arrow: '➡️',
        w: 160,
        h: 28,
        label: `東境 • ${this.getRealmDisplayName(adj.east)}`
      }
    ];

    portals.forEach(p => {
      if (!p.target) return;
      ctx.save();
      // Glowing aura
      const auraGrad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, 45);
      auraGrad.addColorStop(0, `rgba(241, 196, 15, ${0.3 + pulse * 0.2})`);
      auraGrad.addColorStop(1, 'rgba(241, 196, 15, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 45, 0, Math.PI * 2);
      ctx.fill();

      // Border pill banner
      ctx.fillStyle = 'rgba(10, 15, 25, 0.82)';
      ctx.strokeStyle = `rgba(241, 196, 15, ${0.6 + pulse * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect?.(p.x - p.w / 2, p.y - p.h / 2, p.w, p.h, 14);
      ctx.fill();
      ctx.stroke();

      // Text label
      ctx.fillStyle = '#fff9d2';
      ctx.font = 'bold 11px ProdigySans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${p.arrow} ${p.label}`, p.x, p.y + 0.5);

      ctx.restore();
    });
  }

  renderNpcBalloon(x, y) {
    const { ctx } = this;
    ctx.save();

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect?.(x - 66, y - 2, 132, 28, 14);
    ctx.fill();

    // Balloon body (cyan/gold magic mentor balloon)
    ctx.fillStyle = '#f0f9ff';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect?.(x - 68, y - 4, 136, 28, 14);
    ctx.fill();
    ctx.stroke();

    // Little pointer
    ctx.fillStyle = '#f0f9ff';
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 24);
    ctx.lineTo(x + 5, y + 24);
    ctx.lineTo(x, y + 31);
    ctx.fill();

    // Text
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 12px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧙‍♂️ 點擊交談/學院導引', x, y + 15);

    ctx.restore();
  }

  renderWorldGuideBanner(w, h) {
    // On narrow screens (e.g. mobile portrait), omit banner to keep D-Pad & screen clear
    if (w <= 550) return;

    const { ctx } = this;
    ctx.save();

    const bannerW = Math.min(380, w - 40);
    const bannerH = 32;
    const bannerX = (w - bannerW) / 2;
    const bannerY = h - 44;

    // Background shield pill
    ctx.fillStyle = 'rgba(26, 36, 43, 0.88)';
    ctx.strokeStyle = 'rgba(241, 196, 15, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect?.(bannerX, bannerY, bannerW, bannerH, 16);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 12px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧭 點擊畫面任意處移動，或用十字鍵探索；點擊怪獸立即戰鬥！', w * 0.5, bannerY + bannerH / 2 + 0.5);

    ctx.restore();
  }

  renderTreasureChest() {
    if (!this.treasureChest) return;
    const { ctx } = this;
    const { x, y, id } = this.treasureChest;
    const isOpened = this.gameState?.isChestOpened(id);

    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isOpened) {
      // UNOPENED CHEST
      const grad = ctx.createLinearGradient(x - 20, y - 10, x + 20, y + 14);
      grad.addColorStop(0, '#a0522d');
      grad.addColorStop(0.5, '#8b4513');
      grad.addColorStop(1, '#5c2c16');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(x - 18, y - 8, 36, 22, 4);
      ctx.fill();

      // Golden metal bands & corners
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(x - 18, y - 8, 5, 22);
      ctx.fillRect(x + 13, y - 8, 5, 22);
      ctx.fillRect(x - 18, y + 2, 36, 4);

      // Curved Lid
      const lidGrad = ctx.createLinearGradient(x - 20, y - 18, x + 20, y - 6);
      lidGrad.addColorStop(0, '#b86235');
      lidGrad.addColorStop(1, '#6d3012');
      ctx.fillStyle = lidGrad;
      ctx.beginPath();
      ctx.roundRect?.(x - 20, y - 16, 40, 10, [6, 6, 2, 2]);
      ctx.fill();

      // Gold clasp & keyhole lock
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.roundRect?.(x - 5, y - 6, 10, 10, 2);
      ctx.fill();
      ctx.fillStyle = '#2c3e50';
      ctx.beginPath();
      ctx.arc(x, y - 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Shimmer sparkle
      const sparkleAlpha = 0.5 + 0.5 * Math.sin(this.treasureChest.sparkleTimer * 3);
      ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
      ctx.beginPath();
      ctx.arc(x - 8, y - 12, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // OPENED CHEST
      const grad = ctx.createLinearGradient(x - 20, y, x + 20, y + 14);
      grad.addColorStop(0, '#8b4513');
      grad.addColorStop(1, '#4a220b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect?.(x - 18, y - 2, 36, 16, 3);
      ctx.fill();

      // Open lid angled back
      ctx.fillStyle = '#6d3012';
      ctx.beginPath();
      ctx.roundRect?.(x - 20, y - 22, 40, 8, [5, 5, 1, 1]);
      ctx.fill();

      // Golden inner radiance glow
      const glow = ctx.createRadialGradient(x, y - 4, 2, x, y - 4, 22);
      glow.addColorStop(0, 'rgba(255, 234, 167, 0.9)');
      glow.addColorStop(0.6, 'rgba(241, 196, 15, 0.4)');
      glow.addColorStop(1, 'rgba(241, 196, 15, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y - 4, 22, 0, Math.PI * 2);
      ctx.fill();

      // Piles of sparkling coins & gems
      const coinColors = ['#f1c40f', '#f39c12', '#2ecc71', '#3498db', '#e74c3c'];
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = coinColors[(i + 5) % coinColors.length];
        ctx.beginPath();
        ctx.arc(x + i * 4, y - 2 + (i % 2) * 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render particles
    this.treasureChest.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Proximity interaction balloon
    const distToPlayer = Math.hypot(this.player.x - x, this.player.y - y);
    if (distToPlayer < 75) {
      this.renderEntityBalloon(x, y - 28, isOpened ? '✨ 遠古寶箱 (已開啟)' : '🎁 點擊/靠近開啟寶箱！', isOpened ? '#7f8c8d' : '#f39c12');
    }

    ctx.restore();
  }

  renderKeystoneAltar() {
    if (!this.keystoneAltar) return;
    const { ctx } = this;
    const { x, y, keystoneId, name, icon, color, pulseTimer } = this.keystoneAltar;
    const hasKeystone = this.gameState?.keystones?.includes(keystoneId);

    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 22, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone Steps & Dais
    ctx.fillStyle = '#485460';
    ctx.beginPath();
    ctx.roundRect?.(x - 32, y + 6, 64, 16, 4);
    ctx.fill();

    // Top dais
    ctx.fillStyle = '#57606f';
    ctx.beginPath();
    ctx.roundRect?.(x - 24, y - 6, 48, 14, 3);
    ctx.fill();

    // Carved ancient runes along stone
    ctx.fillStyle = hasKeystone ? color : '#3d3d3d';
    ctx.fillRect(x - 18, y - 4, 6, 2);
    ctx.fillRect(x - 8, y - 4, 4, 2);
    ctx.fillRect(x + 2, y - 4, 5, 2);
    ctx.fillRect(x + 11, y - 4, 7, 2);

    // Stone Pillars
    const drawPillar = (px) => {
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(px - 4, y - 18, 8, 22);
      ctx.fillStyle = hasKeystone ? color : '#747d8c';
      ctx.beginPath();
      ctx.arc(px, y - 20, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    drawPillar(x - 26);
    drawPillar(x + 26);

    if (hasKeystone) {
      // ACTIVE FLOATING GLOWING KEYSTONE!
      const floatBob = Math.sin(pulseTimer) * 6;
      const pulseScale = 1.0 + 0.1 * Math.sin(pulseTimer * 2);

      // Magical Aura
      const aura = ctx.createRadialGradient(x, y - 24 + floatBob, 4, x, y - 24 + floatBob, 28 * pulseScale);
      aura.addColorStop(0, color);
      aura.addColorStop(0.5, `${color}66`);
      aura.addColorStop(1, `${color}00`);
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(x, y - 24 + floatBob, 28 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // Floating Keystone Crystal
      ctx.fillStyle = '#ffffff';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, x, y - 24 + floatBob);
    } else {
      // EMPTY CARVED PEDESTAL
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.ellipse(x, y - 6, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a4b0be';
      ctx.font = 'bold 10px ProdigySans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️ 空祭壇', x, y - 14);
    }

    // Proximity interaction balloon
    const distToPlayer = Math.hypot(this.player.x - x, this.player.y - y);
    if (distToPlayer < 85) {
      const msg = hasKeystone
        ? `✨ ${name} 祭壇 • 守護力全開！`
        : `🏛️ 遠古神石祭壇 (等待奪回奉納)`;
      this.renderEntityBalloon(x, y - 48, msg, hasKeystone ? '#27ae60' : '#7f8c8d');
    }

    ctx.restore();
  }

  renderSignpost() {
    if (!this.signpost) return;
    const { ctx } = this;
    const { x, y, text } = this.signpost;

    ctx.save();
    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wooden post stake
    ctx.fillStyle = '#5c3d2e';
    ctx.fillRect(x - 3, y - 6, 6, 22);

    // Signboard plank
    ctx.fillStyle = '#8d5524';
    ctx.beginPath();
    ctx.roundRect?.(x - 16, y - 18, 32, 14, 3);
    ctx.fill();
    ctx.strokeStyle = '#c68c53';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inscribed icon
    ctx.fillStyle = '#fffae6';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📜', x, y - 11);

    // Proximity interaction balloon
    const distToPlayer = Math.hypot(this.player.x - x, this.player.y - y);
    if (distToPlayer < 75) {
      this.renderEntityBalloon(x, y - 32, text, '#2980b9');
    }

    ctx.restore();
  }

  renderEntityBalloon(x, y, text, borderColor = '#e67e22') {
    const { ctx } = this;
    ctx.save();
    ctx.font = 'bold 11px ProdigySans, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const w = Math.max(80, textWidth + 24);
    const h = 26;
    const bx = x - w / 2;
    const by = y - h / 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect?.(bx + 2, by + 2, w, h, 13);
    ctx.fill();

    // Balloon body
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect?.(bx, by, w, h, 13);
    ctx.fill();
    ctx.stroke();

    // Triangle pointer
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 4, by + h - 1);
    ctx.lineTo(x + 4, by + h - 1);
    ctx.lineTo(x, by + h + 6);
    ctx.fill();

    // Text
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, by + h / 2);

    ctx.restore();
  }
}
