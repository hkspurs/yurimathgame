// WorldScene.js - High-Fidelity Theatrical Adventure World Exploration
import { eventBus } from '../core/EventBus.js';

export const REALM_MONSTER_POOLS = {
  'firefly_forest': [
    { id: 'peeko', name: 'Peeko (葉雀靈)', sprite: './assets/sprites/peeko.png', balloonMsg: '🌱 綠蔭深處 • 點擊戰鬥！', isBoss: false },
    { id: 'hotpot', name: 'Hotpot (火罐靈)', sprite: './assets/sprites/hotpot.png', balloonMsg: '🔥 森林小徑 • 點擊戰鬥！', isBoss: false },
    { id: 'floraflare', name: 'Floraflare (繁花靈鳥)', sprite: './assets/sprites/floraflare.png', balloonMsg: '🌸 繁花古樹 • 點擊戰鬥！', isBoss: false },
    { id: 'sprout', name: 'Sprout (嫩芽精靈)', sprite: './assets/sprites/sprout.png', balloonMsg: '🌱 嫩綠草甸 • 點擊收服！', isBoss: false },
    { id: 'mossy', name: 'Mossy (古石苔靈)', sprite: './assets/sprites/mossy.png', balloonMsg: '🪨 青苔巨石 • 點擊收服！', isBoss: false },
    { id: 'woodling', name: 'Woodling (森之守護獸)', sprite: './assets/sprites/woodling.png', balloonMsg: '🌲 森林神殿 • 點擊收服！', isBoss: false }
  ],
  'shipwreck_shore': [
    { id: 'squiddle', name: 'Squiddle (章魚仔)', sprite: './assets/sprites/squiddle.png', balloonMsg: '🌊 潮汐淺灘 • 點擊戰鬥！', isBoss: false },
    { id: 'fishbol', name: 'Fishbol (小魚獸)', sprite: './assets/sprites/fishbol.png', balloonMsg: '🐠 珊瑚暗礁 • 點擊戰鬥！', isBoss: false },
    { id: 'triptrop', name: 'TripTrop (海龜獸)', sprite: './assets/sprites/triptrop.png', balloonMsg: '🐢 金色沙灘 • 點擊戰鬥！', isBoss: false },
    { id: 'aquafox', name: 'Aquafox (潮汐小狐)', sprite: './assets/sprites/aquafox.png', balloonMsg: '🦊 浪花潮間帶 • 點擊收服！', isBoss: false },
    { id: 'crabbot', name: 'Crabbot (泡泡鋼甲蟹)', sprite: './assets/sprites/crabbot.png', balloonMsg: '🦀 沉船古銅甲 • 點擊收服！', isBoss: false },
    { id: 'starfin', name: 'Starfin (幻藍海星獸)', sprite: './assets/sprites/starfin.png', balloonMsg: '⭐ 蔚藍海灣 • 點擊收服！', isBoss: false }
  ],
  'bonfire_spire': [
    { id: 'magmay', name: 'Magmay (熔岩巨獸)', sprite: './assets/sprites/magmay.png', balloonMsg: '🌋 黑曜石山道 • 點擊戰鬥！', isBoss: false },
    { id: 'pyropup', name: 'Pyropup (火犬獸)', sprite: './assets/sprites/pyropup.png', balloonMsg: '🐶 赤焰熔岩 • 點擊戰鬥！', isBoss: false },
    { id: 'charfoal', name: 'Charfoal (炎馬獸)', sprite: './assets/sprites/charfoal.png', balloonMsg: '🐎 熾熱峽谷 • 點擊收服！', isBoss: false },
    { id: 'burnie', name: 'Burnie (小炎雀)', sprite: './assets/sprites/burnie.png', balloonMsg: '🔥 火山口晚霞 • 點擊收服！', isBoss: false },
    { id: 'cinderkat', name: 'Cinderkat (熾焰幼貓)', sprite: './assets/sprites/cinderkat.png', balloonMsg: '🐱 熔火暖穴 • 點擊收服！', isBoss: false }
  ],
  'shiverchill_mountains': [
    { id: 'snoot', name: 'Snoot (雪鼻獸)', sprite: './assets/sprites/snoot.png', balloonMsg: '❄️ 霜凍松林 • 點擊戰鬥！', isBoss: false },
    { id: 'chillwing', name: 'Chillwing (寒翼鳥)', sprite: './assets/sprites/chillwing.png', balloonMsg: '🦅 冰雪懸崖 • 點擊戰鬥！', isBoss: false },
    { id: 'frostfang', name: 'Frostfang (霜牙雪靈)', sprite: './assets/sprites/frostfang.png', balloonMsg: '🐺 極寒冰川 • 點擊收服！', isBoss: false },
    { id: 'snowfluff', name: 'Snowfluff (雪絨兔)', sprite: './assets/sprites/snowfluff.png', balloonMsg: '🐰 霜凍雪坡 • 點擊收服！', isBoss: false },
    { id: 'polarcub', name: 'Polarcub (冰晶幼熊)', sprite: './assets/sprites/polarcub.png', balloonMsg: '🐻 冰晶洞窟 • 點擊收服！', isBoss: false }
  ],
  'skywatch': [
    { id: 'cloudling', name: 'Cloudling (雷雲獸)', sprite: './assets/sprites/cloudling.png', balloonMsg: '⚡ 浮空外圍 • 點擊戰鬥！', isBoss: false },
    { id: 'stormcloud', name: 'Stormcloud (暴風雲獸)', sprite: './assets/sprites/stormcloud.png', balloonMsg: '☁️ 雲端雷陣 • 點擊戰鬥！', isBoss: false },
    { id: 'electromite', name: 'Electromite (雷電浮靈)', sprite: './assets/sprites/electromite.png', balloonMsg: '⚡ 浮空電磁環 • 點擊收服！', isBoss: false },
    { id: 'zapzap', name: 'Zapzap (雷光飛鼠)', sprite: './assets/sprites/zapzap.png', balloonMsg: '🐿️ 雷光雲海 • 點擊收服！', isBoss: false },
    { id: 'windcherub', name: 'Windcherub (狂風精靈)', sprite: './assets/sprites/windcherub.png', balloonMsg: '✨ 天空聖殿 • 點擊收服！', isBoss: false }
  ]
};

export class WorldScene {
  constructor(canvas, gameState = null) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.gameState = gameState;

    // Player position and movement
    this.player = {
      x: 280,
      y: 360,
      targetX: null,
      targetY: null,
      size: 64,
      speed: 3.5,
      direction: 'down',
      isMoving: false,
      animTimer: 0,
      dustParticles: []
    };

    // Follower Pet companion behind wizard
    this.followerPet = {
      x: 240,
      y: 380,
      size: 46,
      hopTimer: 0,
      img: new Image()
    };

    // Tap target indicator
    this.tapIndicator = null;

    // Dynamic Roaming Monsters Array (Multiple wild creatures wandering per realm)
    this.roamingMonsters = [];
    this.encounterCooldown = 0; // Grace period after returning from battle

    // Academy Mentor NPC: Headmaster Noot
    this.npcHeadmaster = {
      name: '努特校長 (Headmaster Noot)',
      title: '燈火學院院長',
      x: 390,
      y: 190,
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

    // Ambient floating particles
    this.fireflies = Array.from({ length: 35 }, () => ({
      x: Math.random() * 1024,
      y: Math.random() * 768,
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

    this.bindInputs();
    this.loadRealm(this.currentRealm);
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

  loadRealm(realmId) {
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
        monsterSprite: './assets/sprites/squiddle.png',
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
        monsterSprite: './assets/sprites/magmay.png',
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
        monsterSprite: './assets/sprites/snoot.png',
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
        monsterSprite: './assets/sprites/cloudling.png',
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
    const monster1Def = pool[0];
    const monster2Def = pool.length > 1 ? pool[1] : pool[0];

    const ch = this.canvas?.height || 600;
    const isCompact = ch <= 500;

    const m1 = {
      id: monster1Def.id,
      name: monster1Def.name,
      balloonMsg: monster1Def.balloonMsg,
      isBoss: !!monster1Def.isBoss,
      x: 540,
      y: isCompact ? Math.min(230, ch * 0.52) : 260,
      homeX: 540,
      homeY: isCompact ? Math.min(230, ch * 0.52) : 260,
      wanderTimer: 0,
      wanderAngle: Math.random() * Math.PI * 2,
      size: monster1Def.isBoss ? (isCompact ? 70 : 80) : (isCompact ? 62 : 72),
      bobTimer: 0,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    m1.img.src = monster1Def.sprite;

    const m2Y = isCompact ? Math.min(280, ch - 85) : 320;
    const m2 = {
      id: monster2Def.id,
      name: monster2Def.name,
      balloonMsg: monster2Def.balloonMsg,
      isBoss: !!monster2Def.isBoss,
      x: 740,
      y: m2Y,
      homeX: 740,
      homeY: m2Y,
      wanderTimer: 1.5,
      wanderAngle: Math.random() * Math.PI * 2,
      size: monster2Def.isBoss ? (isCompact ? 70 : 80) : (isCompact ? 62 : 72),
      bobTimer: Math.PI * 0.7,
      alert: false,
      flameParticles: [],
      img: new Image()
    };
    m2.img.src = monster2Def.sprite;

    this.roamingMonsters = [m1, m2];
    this.monsterImg.src = m1.img.src;
    this.isEncountering = false;
    this.encounterCooldown = 0;

    // Reset player position safely
    this.player.x = 280;
    this.player.y = isCompact ? Math.min(300, ch - 80) : 360;
    this.player.targetX = null;
    this.player.targetY = null;

    // Interactive Adventure Entities for Current Realm
    const chestConfigs = {
      'firefly_forest': { id: 'chest_forest', x: 190, y: isCompact ? Math.min(220, ch * 0.5) : 240, rewards: { gold: 40, xp: 30, stars: 1 } },
      'shipwreck_shore': { id: 'chest_shore', x: 210, y: isCompact ? Math.min(260, ch * 0.6) : 310, rewards: { gold: 45, xp: 35, stars: 1 } },
      'bonfire_spire': { id: 'chest_volcano', x: 190, y: isCompact ? Math.min(210, ch * 0.48) : 230, rewards: { gold: 50, xp: 40, stars: 1 } },
      'shiverchill_mountains': { id: 'chest_snow', x: 220, y: isCompact ? Math.min(250, ch * 0.58) : 280, rewards: { gold: 50, xp: 40, stars: 1 } },
      'skywatch': { id: 'chest_sky', x: 200, y: isCompact ? Math.min(260, ch * 0.6) : 290, rewards: { gold: 60, xp: 50, stars: 2 } }
    };
    const cCfg = chestConfigs[this.currentRealm] || chestConfigs['firefly_forest'];
    this.treasureChest = {
      id: cCfg.id,
      x: cCfg.x,
      y: cCfg.y,
      size: isCompact ? 36 : 42,
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
      x: 710,
      y: isCompact ? Math.min(310, ch - 80) : 370,
      size: isCompact ? 48 : 58,
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
      'firefly_forest': '📜 【森林路牌】向北通往燈火學院主城，向東常有野生怪獸（弱水）出沒！',
      'shipwreck_shore': '📜 【海岸路牌】金色沙灘潮汐洶湧！野生章魚怪獸（弱風暴）鎮守海岸！',
      'bonfire_spire': '📜 【火山路牌】黑曜石熔岩翻滾！火山怪獸（弱水）常在附近徘徊！',
      'shiverchill_mountains': '📜 【雪山路牌】極地暴風雪呼嘯！冰霜雪鼻獸（弱火）潛伏雪谷！',
      'skywatch': '📜 【浮空路牌】雷霆雲層翻湧！雷雲獸（弱地）穿梭雲巔！'
    };
    this.signpost = {
      x: 330,
      y: isCompact ? Math.min(330, ch - 65) : 420,
      size: isCompact ? 30 : 36,
      text: signpostConfigs[this.currentRealm] || signpostConfigs['firefly_forest']
    };

    // Props for current realm
    this.environmentProps = this.generatePropsForRealm(this.currentRealm);
  }

  generatePropsForRealm(realmId) {
    const ch = this.canvas?.height || 600;
    const isCompact = ch <= 500;
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

    // 35 decorative thematic items
    for (let i = 0; i < 35; i++) {
      props.push({
        type: 'flower',
        x: seedRandom(i * 3) * 960 + 30,
        y: seedRandom(i * 3 + 1) * (isCompact ? (ch - 90) : 680) + 50,
        size: seedRandom(i * 3 + 3) * 3 + 4,
        color: palette[Math.floor(seedRandom(i * 7) * palette.length)]
      });
    }

    // Natural landscape landmarks / trees / rocks
    props.push({ type: 'tree', x: 100, y: 150, r: 52 });
    props.push({ type: 'tree', x: 230, y: 110, r: 44 });
    props.push({ type: 'tree', x: 780, y: 140, r: 58 });
    props.push({ type: 'tree', x: 920, y: 220, r: 50 });
    props.push({ type: 'tree', x: 80, y: isCompact ? ch - 55 : 560, r: isCompact ? 42 : 54 });
    props.push({ type: 'tree', x: 180, y: isCompact ? ch - 35 : 640, r: isCompact ? 36 : 46 });
    props.push({ type: 'tree', x: 880, y: isCompact ? ch - 50 : 580, r: isCompact ? 40 : 52 });

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
    // Lamplight Gate stone pillars
    const gateMidX = this.canvas.width * 0.48;
    list.push({ x: gateMidX - 50, y: 70, r: 18 });
    list.push({ x: gateMidX + 50, y: 70, r: 18 });
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
        const distToGate = Math.hypot(this.player.x - this.canvas.width * 0.48, this.player.y - 80);
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

    // Tap/Click on canvas to interact or move
    this.canvas.addEventListener('pointerdown', (e) => {
      // Strictly prevent clicks during battle or when any modal/grimoire overlay is open
      if (!this.isActive || window.gameApp?.currentScene !== 'world') return;
      if (document.querySelector('.tome-overlay:not(.hidden)')) return;

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // Click on monster (Checks all active roaming monsters in realm)
      for (const monster of this.roamingMonsters) {
        const distToMonster = Math.hypot(clickX - monster.x, clickY - monster.y);
        if (distToMonster < 70 && !this.isEncountering && this.encounterCooldown <= 0) {
          this.isEncountering = true;
          monster.alert = true;
          eventBus.emit('TRIGGER_ENCOUNTER_ALERT', { monster });
          return;
        }
      }

      // Click on Headmaster Noot NPC
      const distToNPC = Math.hypot(clickX - this.npcHeadmaster.x, clickY - this.npcHeadmaster.y);
      if (distToNPC < 65) {
        eventBus.emit('INTERACT_NPC_HEADMASTER');
        return;
      }

      // Click on Lamplight Town Gate
      const distToGate = Math.hypot(clickX - this.canvas.width * 0.48, clickY - 80);
      if (distToGate < 75) {
        eventBus.emit('OPEN_TOWN_SHOP');
        return;
      }

      // Click on Treasure Chest
      if (this.treasureChest) {
        const distToChest = Math.hypot(clickX - this.treasureChest.x, clickY - this.treasureChest.y);
        if (distToChest < 60) {
          this.interactWithChest();
          return;
        }
      }

      // Click on Keystone Altar
      if (this.keystoneAltar) {
        const distToAltar = Math.hypot(clickX - this.keystoneAltar.x, clickY - this.keystoneAltar.y);
        if (distToAltar < 65) {
          this.interactWithAltar();
          return;
        }
      }

      // Click on Signpost
      if (this.signpost) {
        const distToSign = Math.hypot(clickX - this.signpost.x, clickY - this.signpost.y);
        if (distToSign < 55) {
          eventBus.emit('SHOW_TOAST', { message: this.signpost.text, type: 'info' });
          return;
        }
      }

      // Tap to move
      this.player.targetX = Math.max(50, Math.min(this.canvas.width - 60, clickX));
      this.player.targetY = Math.max(90, Math.min(this.canvas.height - 70, clickY));
      this.tapIndicator = {
        x: this.player.targetX,
        y: this.player.targetY,
        r: 6,
        alpha: 1.0
      };
    });
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
      const targetX = Math.max(50, Math.min(this.canvas.width - 60, this.player.x + stepX));
      const targetY = Math.max(90, Math.min(this.canvas.height - 70, this.player.y + stepY));

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
    this.player.x = Math.max(50, Math.min(this.canvas.width - 60, this.player.x));
    this.player.y = Math.max(90, Math.min(this.canvas.height - 70, this.player.y));

    // Walking through North Lamplight Gate Archway
    const gateMidX = this.canvas.width * 0.48;
    if (this.player.y <= 95 && Math.abs(this.player.x - gateMidX) < 48) {
      if (!this.hasTriggeredGate) {
        this.hasTriggeredGate = true;
        this.player.y = 110;
        this.player.targetX = null;
        this.player.targetY = null;
        this.player.isMoving = false;
        eventBus.emit('OPEN_TOWN_SHOP');
        setTimeout(() => { this.hasTriggeredGate = false; }, 1200);
      }
    }

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
        if (Math.hypot(nextX - hx, nextY - hy) < 38) {
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

    // Fireflies update
    this.fireflies.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += dt * 3;
      if (p.y < 0) {
        p.y = this.canvas.height;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
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

  updateFollowerPet(dt) {
    const activePet = this.getActivePet();
    if (!activePet) return;

    const spritePath = activePet.sprite || './assets/sprites/hotpot.png';
    if (!this.followerPet.img.src || !this.followerPet.img.src.includes(spritePath.replace('./', ''))) {
      this.followerPet.img.src = spritePath;
    }

    let targetX = this.player.x;
    let targetY = this.player.y;

    if (this.player.direction === 'left') {
      targetX += 42;
      targetY += 12;
    } else if (this.player.direction === 'right') {
      targetX -= 42;
      targetY += 12;
    } else if (this.player.direction === 'up') {
      targetX += 26;
      targetY += 38;
    } else { // 'down'
      targetX -= 28;
      targetY -= 26;
    }

    const lerpSpeed = this.player.isMoving ? 0.14 : 0.08;
    this.followerPet.x += (targetX - this.followerPet.x) * lerpSpeed;
    this.followerPet.y += (targetY - this.followerPet.y) * lerpSpeed;

    this.followerPet.hopTimer += dt * (this.player.isMoving ? 12 : 3.5);

    if (this.player.x > this.followerPet.x + 3) {
      this.followerPet.facing = 'right';
    } else if (this.player.x < this.followerPet.x - 3) {
      this.followerPet.facing = 'left';
    }
  }

  renderFollowerPet() {
    const activePet = this.getActivePet();
    if (!activePet) return;

    const { ctx } = this;
    const hopBob = Math.abs(Math.sin(this.followerPet.hopTimer)) * (this.player.isMoving ? 8 : 3.5);

    // Follower shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(this.followerPet.x, this.followerPet.y + 16, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Follower sprite
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (this.followerPet.facing === 'left') {
      ctx.translate(this.followerPet.x, this.followerPet.y - hopBob);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.followerPet.img,
        -this.followerPet.size / 2,
        -this.followerPet.size / 2,
        this.followerPet.size,
        this.followerPet.size
      );
    } else {
      ctx.drawImage(
        this.followerPet.img,
        this.followerPet.x - this.followerPet.size / 2,
        this.followerPet.y - this.followerPet.size / 2 - hopBob,
        this.followerPet.size,
        this.followerPet.size
      );
    }
    ctx.restore();

    // Cute Follower Pill Name Tag
    ctx.save();
    const shortName = (activePet.name || '夥伴').split(' ')[0];
    ctx.font = 'bold 10px "ProdigySans", sans-serif';
    const tagText = `🐾 ${shortName}`;
    const textWidth = ctx.measureText(tagText).width;
    const badgeW = Math.max(50, textWidth + 14);
    const badgeH = 16;
    const badgeX = this.followerPet.x - badgeW / 2;
    const badgeY = this.followerPet.y - this.followerPet.size / 2 - hopBob - 18;

    ctx.fillStyle = 'rgba(26, 18, 11, 0.78)';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fffae6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, this.followerPet.x, badgeY + badgeH / 2 + 0.5);
    ctx.restore();
  }

  render() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // 1. Multi-tone Thematic Realm Meadow / Terrain
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

    // Soft dappled light patches
    ctx.fillStyle = cfg.lightDapple || 'rgba(120, 210, 85, 0.2)';
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.4, 260, 180, 0.2, 0, Math.PI * 2);
    ctx.ellipse(w * 0.7, h * 0.6, 280, 190, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // 2. Animated Sparkling Stream along right boundary
    this.renderStream(w, h);

    // 3. Winding Cobblestone Road
    this.renderRoad(w, h);

    // 4. North Lamplight Gateway Arch
    this.renderLamplightGate(w * 0.48, 80);

    // 5. Environmental props (Flowers, Shrubs, Trees)
    this.renderProps(w, h);

    // 5.2 Adventure Signpost
    this.renderSignpost();

    // 5.4 Ancient Keystone Altar
    this.renderKeystoneAltar();

    // 5.6 Interactive Treasure Chest
    this.renderTreasureChest();

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

    // 8. Roaming Monsters Shadow & Character (All active wild monsters)
    for (const monster of this.roamingMonsters) {
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
    }

    // 9. Floating Golden Fireflies
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

    // 10. Diegetic World Guide Ribbon (Bottom Center)
    this.renderWorldGuideBanner(w, h);
  }

  renderRoad(w, h) {
    const { ctx } = this;
    ctx.save();
    
    // Road dirt foundation
    ctx.strokeStyle = '#c8a268';
    ctx.lineWidth = 82;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(w * 0.48, 60);
    ctx.bezierCurveTo(w * 0.46, h * 0.35, w * 0.35, h * 0.5, w * 0.5, h * 0.65);
    ctx.bezierCurveTo(w * 0.65, h * 0.8, w * 0.55, h * 0.95, w * 0.52, h + 20);
    ctx.stroke();

    // Cobblestone core
    ctx.strokeStyle = '#dfc294';
    ctx.lineWidth = 70;
    ctx.stroke();

    // Stylized Cobblestone pavers
    ctx.fillStyle = '#bca070';
    const stones = [
      { x: w * 0.47, y: 120, rx: 12, ry: 8 },
      { x: w * 0.49, y: 150, rx: 14, ry: 9 },
      { x: w * 0.44, y: 200, rx: 13, ry: 8 },
      { x: w * 0.42, y: 260, rx: 15, ry: 10 },
      { x: w * 0.39, y: 320, rx: 14, ry: 8 },
      { x: w * 0.44, y: 390, rx: 16, ry: 9 },
      { x: w * 0.52, y: 440, rx: 14, ry: 10 },
      { x: w * 0.56, y: 500, rx: 15, ry: 9 },
      { x: w * 0.54, y: 560, rx: 13, ry: 8 }
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

    // River bed
    ctx.fillStyle = '#1e75a8';
    ctx.beginPath();
    ctx.moveTo(w * 0.84, 0);
    ctx.bezierCurveTo(w * 0.78, h * 0.35, w * 0.88, h * 0.65, w * 0.82, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Sparkling water flow
    ctx.fillStyle = '#3aa0db';
    ctx.beginPath();
    ctx.moveTo(w * 0.87, 0);
    ctx.bezierCurveTo(w * 0.81, h * 0.35, w * 0.90, h * 0.65, w * 0.85, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Water ripple highlights
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 5; i++) {
      const waveY = ((i * 140 + this.waterTimer * 40) % h);
      ctx.beginPath();
      ctx.arc(w * 0.90 + Math.sin(waveY * 0.05) * 8, waveY, 18, 0, Math.PI * 0.6);
      ctx.stroke();
    }

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
    this.encounterCooldown = 1.5; // 1.5s grace period so player isn't instantly re-trapped
    
    // Clear alert flags on all monsters
    this.roamingMonsters.forEach(m => m.alert = false);

    const pool = REALM_MONSTER_POOLS[this.currentRealm] || REALM_MONSTER_POOLS['firefly_forest'];
    if (!pool || pool.length === 0) return;

    // Find which monster slot was fought
    let targetIndex = this.roamingMonsters.findIndex(m => m.id === lastFoughtMonsterId);
    if (targetIndex === -1) {
      // If a boss was fought (or external stage), refresh slot 0 or slot 1 safely if it was alerted
      targetIndex = 0;
    }

    // Get the monster ID currently occupying the other slot to avoid having identical duplicates on screen
    const otherSlotMonsterId = this.roamingMonsters[targetIndex === 0 ? 1 : 0]?.id;

    // Filter candidate wild monsters to ensure constant rotation and variety
    let candidates = pool.filter(p => p.id !== lastFoughtMonsterId && p.id !== otherSlotMonsterId);
    if (candidates.length === 0) {
      candidates = pool.filter(p => p.id !== lastFoughtMonsterId);
    }
    if (candidates.length === 0) {
      candidates = pool;
    }
    const nextDef = candidates[Math.floor(Math.random() * candidates.length)];

    const slotPos = targetIndex === 0 
      ? { x: 540 + (Math.random() - 0.5) * 40, y: 260 + (Math.random() - 0.5) * 30 }
      : { x: 740 + (Math.random() - 0.5) * 40, y: 320 + (Math.random() - 0.5) * 30 };

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

    // Trigger toast notifying player of newly appeared wild creature
    eventBus.emit('SHOW_TOAST', {
      icon: '🐾',
      title: '野生新物怪出沒！',
      text: `${nextDef.name} 穿梭到了 ${this.getRealmDisplayName(this.currentRealm)}！`
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
    const { ctx } = this;
    ctx.save();

    const bannerW = 380;
    const bannerH = 34;
    const bannerX = (w - bannerW) / 2;
    const bannerY = h - 46;

    // Background shield pill
    ctx.fillStyle = 'rgba(26, 36, 43, 0.88)';
    ctx.strokeStyle = 'rgba(241, 196, 15, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect?.(bannerX, bannerY, bannerW, bannerH, 17);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 13px ProdigySans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧭 點擊畫面任意處移動，或用十字鍵探索；點擊怪獸立即戰鬥！', w * 0.5, bannerY + 22);

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
