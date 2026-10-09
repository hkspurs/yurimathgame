// main.js - Application bootstrap and scene coordinator
import { eventBus } from './core/EventBus.js';
import { GameState } from './core/GameState.js';
import { SaveManager } from './core/SaveManager.js';
import { WorldScene } from './scenes/WorldScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { HUD } from './ui/HUD.js';
import { MathModal } from './ui/MathModal.js';
import { MONSTERS } from './battle/Monsters.js';
import { SPELLS, registerPetSpell } from './battle/Spells.js';
import { WORLDS } from './battle/Worlds.js';
import { BattleEngine } from './battle/BattleEngine.js';
import { audioManager } from './core/AudioManager.js';
import { WorldMapModal } from './ui/WorldMapModal.js';
import { InventoryModal } from './ui/InventoryModal.js';
import { TownShopModal } from './ui/TownShopModal.js';
import { StoryModal } from './ui/StoryModal.js';
import { CharacterCreatorModal } from './ui/CharacterCreatorModal.js';
import { PetBookModal } from './ui/PetBookModal.js';
import { SchoolOrHomeModal } from './ui/SchoolOrHomeModal.js';
import { PetEvolutionModal } from './ui/PetEvolutionModal.js';
import { TapToLoginModal } from './ui/TapToLoginModal.js';
import { LeaveProdigyModal } from './ui/LeaveProdigyModal.js';
import { QuestionGenerator } from './math/QuestionGenerator.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Load or initialize state
    const saved = SaveManager.load();
    this.gameState = new GameState(saved);

    // Save on state changes
    eventBus.on('PLAYER_STATS_CHANGED', (snapshot) => {
      SaveManager.save(snapshot);
      this.updateBattleEnergyUI();
      if (this.currentScene === 'battle') {
        this.renderBattleSpellButtons();
      }
    });

    this.eventBus = eventBus;
    window.eventBus = eventBus;
    window.QuestionGenerator = QuestionGenerator;
    this.audioManager = audioManager;
    window.audioManager = audioManager;
    audioManager.init(this.gameState);

    // UI Controllers
    this.hud = new HUD(this.gameState);
    this.mathModal = new MathModal(this.gameState);
    this.worldMapModal = new WorldMapModal(this.gameState);
    this.inventoryModal = new InventoryModal(this.gameState);
    this.townShopModal = new TownShopModal(this.gameState);
    this.storyModal = new StoryModal(this.gameState);
    this.characterCreatorModal = new CharacterCreatorModal(this.gameState);
    this.petBookModal = new PetBookModal(this.gameState);
    this.schoolOrHomeModal = new SchoolOrHomeModal(this.gameState);
    this.petEvolutionModal = new PetEvolutionModal(this.gameState);
    this.tapToLoginModal = new TapToLoginModal(this.gameState);
    this.leaveProdigyModal = new LeaveProdigyModal(this.gameState);
    this.currentBattlingMonsterId = null;

    // Official Loading Screen Elements (APK Authenticated)
    this.loadingScreenEl = document.getElementById('cloud-loading-screen');
    this.loadingProgressBar = document.getElementById('loading-progress-bar');
    this.loadingProgressText = document.getElementById('loading-progress-percent');
    this.loadingTipText = document.getElementById('loading-tip-text');

    // Wild Encounter Alert & Swirl Overlay
    this.encounterOverlayEl = document.getElementById('encounter-overlay');
    this.encounterTextEl = document.getElementById('encounter-text');

    // Top Center Realm Badge
    this.realmBadgeEl = document.getElementById('hud-realm-badge');
    this.realmBadgeIconEl = document.getElementById('realm-badge-icon');
    this.realmBadgeNameEl = document.getElementById('realm-badge-name');

    // Measure viewport display before constructing world scene
    this.resizeCanvas();

    // Scenes
    this.worldScene = new WorldScene(this.canvas, this.gameState);
    this.battleScene = new BattleScene(this.canvas);
    this.currentScene = 'world'; // 'world' | 'battle'
    this.battleEngine = null;

    // DOM Elements for Battle UI
    this.battleUiEl = document.getElementById('battle-ui');
    this.battleMessageEl = document.getElementById('battle-message');
    this.spellGridEl = document.getElementById('spell-action-grid');
    this.rewardModalEl = document.getElementById('reward-modal');
    this.btnRewardConfirm = document.getElementById('btn-reward-confirm');
    this.rewardXpEl = document.getElementById('reward-xp');
    this.rewardGoldEl = document.getElementById('reward-gold');
    this.rewardPetSlotEl = document.getElementById('reward-pet-slot');
    this.rewardPetXpEl = document.getElementById('reward-pet-xp');
    this.rewardPetLvlupBannerEl = document.getElementById('reward-pet-lvlup-banner');
    this.mobileControlsEl = document.getElementById('mobile-controls');

    // Battle Announcement Banner
    this.battleBannerEl = document.getElementById('battle-banner');
    this.bannerRibbonEl = document.getElementById('banner-ribbon');
    this.bannerIconEl = document.getElementById('banner-icon');
    this.bannerMainEl = document.getElementById('banner-main');
    this.bannerSubEl = document.getElementById('banner-sub');
    this.bannerTimer = null;

    // Level Up & Keystone Modals
    this.levelUpModalEl = document.getElementById('level-up-modal');
    this.levelUpTitleEl = document.getElementById('level-up-title');
    this.levelUpHpEl = document.getElementById('level-up-hp');
    this.btnLevelUpConfirm = document.getElementById('btn-level-up-confirm');

    this.keystoneModalEl = document.getElementById('keystone-modal');
    this.keystoneIconEl = document.getElementById('keystone-large-icon');
    this.keystoneTitleEl = document.getElementById('keystone-restore-title');
    this.keystoneRealmEl = document.getElementById('keystone-realm-badge');
    this.btnKeystoneConfirm = document.getElementById('btn-keystone-confirm');
    this.btnKeystoneNextRealm = document.getElementById('btn-keystone-next-realm');
    this.btnKeystoneNextRealmText = document.getElementById('btn-keystone-next-realm-text');
    this.btnKeystoneTown = document.getElementById('btn-keystone-town');

    // Altar Boss Trial Modal
    this.altarBossModalEl = document.getElementById('altar-boss-modal');
    this.altarBossIconEl = document.getElementById('altar-boss-icon');
    this.altarBossHeadingEl = document.getElementById('altar-boss-heading');
    this.altarBossDescEl = document.getElementById('altar-boss-desc');
    this.btnStartAltarBoss = document.getElementById('btn-start-altar-boss');
    this.btnCancelAltarBoss = document.getElementById('btn-cancel-altar-boss');
    this.btnCloseAltarBoss = document.getElementById('btn-close-altar-boss');
    this.currentPendingNextRealm = null;
    this.currentAltarTrial = null;

    // Defeat (Out of Hearts) Modal
    this.defeatModalEl = document.getElementById('defeat-modal');
    this.btnDefeatConfirm = document.getElementById('btn-defeat-confirm');

    this.pendingLevelUp = null;
    this.pendingKeystone = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resizeCanvas(), 80));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => this.resizeCanvas());
    }
    if (window.ResizeObserver) {
      const stageEl = document.getElementById('game-stage');
      if (stageEl) {
        const ro = new ResizeObserver(() => this.resizeCanvas());
        ro.observe(stageEl);
      }
    }

    this.updateRealmBadge();
    this.bindAppEvents();
    this.setupMobileControls();
    this.initLoadingScreen();

    // Start loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    const container = document.getElementById('game-stage') || this.canvas.parentElement;
    if (!container) return;
    const displayW = Math.round(container.clientWidth || window.innerWidth || 800);
    const displayH = Math.round(container.clientHeight || window.innerHeight || 600);

    // Keep container view locked against unintentional mobile browser shifts
    if (container.scrollLeft !== 0) container.scrollLeft = 0;
    if (container.scrollTop !== 0) container.scrollTop = 0;

    if (displayW > 0 && displayH > 0) {
      if (this.canvas.width !== displayW || this.canvas.height !== displayH) {
        this.canvas.width = displayW;
        this.canvas.height = displayH;
        if (this.worldScene?.onResize) {
          this.worldScene.onResize(displayW, displayH);
        }
      }
    }
  }

  bindAppEvents() {
    // World Map button in HUD
    const btnWorldMap = document.getElementById('btn-world-map');
    if (btnWorldMap) {
      btnWorldMap.addEventListener('click', () => {
        if (this.currentScene === 'battle') {
          eventBus.emit('SHOW_TOAST', {
            icon: '⚔️',
            title: '戰鬥進行中',
            text: '無法在奧術決鬥中開啟世界地圖傳送！'
          });
          return;
        }
        eventBus.emit('OPEN_WORLD_MAP');
      });
    }

    // Backpack / Inventory button in HUD
    const btnBackpack = document.getElementById('btn-backpack');
    if (btnBackpack) {
      btnBackpack.addEventListener('click', () => {
        if (this.currentScene === 'battle') {
          eventBus.emit('SHOW_TOAST', {
            icon: '🎒',
            title: '戰鬥進行中',
            text: '戰鬥中請使用法術選單中的【生命藥水】法術！'
          });
          return;
        }
        eventBus.emit('OPEN_INVENTORY');
      });
    }

    // Pet Book button in HUD
    const btnPetBook = document.getElementById('btn-pet-book');
    if (btnPetBook) {
      btnPetBook.addEventListener('click', () => {
        if (this.currentScene === 'battle') {
          eventBus.emit('SHOW_TOAST', {
            icon: '📖',
            title: '戰鬥進行中',
            text: '無法在奧術決鬥中翻閱精靈圖鑑與更換出戰精靈！'
          });
          return;
        }
        eventBus.emit('OPEN_PET_BOOK');
      });
    }

    // Player Crest click to open Character Stylist
    const btnCrest = document.getElementById('hud-crest-btn');
    if (btnCrest) {
      btnCrest.addEventListener('click', () => {
        if (this.currentScene === 'battle') {
          eventBus.emit('SHOW_TOAST', {
            icon: '🧙‍♂️',
            title: '戰鬥進行中',
            text: '無法在奧術決鬥中更換巫師造型！'
          });
          return;
        }
        eventBus.emit('OPEN_CHARACTER_CREATOR');
      });
    }

    // Rescue button in Battle UI
    const btnRescue = document.getElementById('btn-rescue-monster');
    if (btnRescue) {
      btnRescue.addEventListener('click', () => {
        if (this.battleEngine) {
          this.battleEngine.attemptRescue();
        }
      });
    }

    // Flee (Run Away) button in Battle UI
    const btnFlee = document.getElementById('btn-flee-battle');
    if (btnFlee) {
      btnFlee.addEventListener('click', () => {
        if (this.battleEngine) {
          this.battleEngine.flee();
        }
      });
    }

    // Realm Badge click to open World Map
    if (this.realmBadgeEl) {
      this.realmBadgeEl.addEventListener('click', () => {
        if (this.currentScene === 'battle') {
          eventBus.emit('SHOW_TOAST', {
            icon: '⚔️',
            title: '戰鬥進行中',
            text: '無法在奧術決鬥中開啟世界地圖傳送！'
          });
          return;
        }
        eventBus.emit('OPEN_WORLD_MAP');
      });
    }

    // Leave Prodigy button in HUD
    const btnLeave = document.getElementById('btn-leave-prodigy');
    if (btnLeave) {
      btnLeave.addEventListener('click', () => {
        eventBus.emit('OPEN_LEAVE_PRODIGY');
      });
    }

    eventBus.on('STUDENT_LOGGED_IN', ({ username }) => {
      eventBus.emit('SHOW_TOAST', {
        icon: '🎓',
        title: '學生憑證登入成功',
        text: `歡迎回來，${username}！準備進入課堂同步學習！`
      });
      if (!this.gameState.playLocation) {
        eventBus.emit('OPEN_WHERE_PLAYING');
      } else if (!this.gameState.hasCreatedCharacter) {
        eventBus.emit('OPEN_CHARACTER_CREATOR');
      } else if (!this.gameState.hasSeenPrologue) {
        eventBus.emit('TRIGGER_OPENING_PROLOGUE');
      }
    });

    eventBus.on('PLAY_AS_GUEST', () => {
      if (!this.gameState.playLocation) {
        eventBus.emit('OPEN_WHERE_PLAYING');
      } else if (!this.gameState.hasCreatedCharacter) {
        eventBus.emit('OPEN_CHARACTER_CREATOR');
      } else if (!this.gameState.hasSeenPrologue) {
        eventBus.emit('TRIGGER_OPENING_PROLOGUE');
      }
    });

    eventBus.on('REALM_CHANGED', () => {
      this.updateRealmBadge();
    });

    eventBus.on('TRIGGER_ENCOUNTER_ALERT', ({ monster }) => {
      this.triggerEncounter(monster.id, monster.name);
    });

    // Launch Stage from World Map
    eventBus.on('LAUNCH_STAGE', ({ worldId, stageId }) => {
      const world = WORLDS.find(w => w.id === worldId);
      const stage = world?.stages.find(s => s.id === stageId);
      if (world && stage) {
        // Retain the student's chosen pedagogical grade; do not overwrite with world.grade!
        this.gameState.setRealm(worldId);
        this.currentStageId = stageId;
        this.currentWorldId = worldId;
        this.triggerEncounter(stage.monsterId, stage.name);
      }
    });

    // Battle Start Trigger from overworld walking
    eventBus.on('START_BATTLE_WITH', ({ monsterId }) => {
      if (this.currentScene === 'battle') return;
      this.triggerEncounter(monsterId, '野生物怪遭遇戰');
    });

    // Return to Overworld Trigger
    eventBus.on('RETURN_TO_WORLD', () => {
      this.returnToWorld();
    });

    // Tutorial Duel with Theo Addiwise
    eventBus.on('START_TUTORIAL_DUEL', () => {
      this.currentStageId = 'tutorial_theo';
      this.triggerEncounter('theo_addiwise', 'Theo 導師教學決鬥');
    });

    // Battle log updates
    eventBus.on('BATTLE_LOG', (msg) => {
      if (this.battleMessageEl) {
        this.battleMessageEl.textContent = msg;
      }
      this.updateBattleEnergyUI();
    });

    eventBus.on('BATTLE_DAMAGE_DEALT', () => {
      if (this.currentScene === 'battle') {
        this.renderBattleSpellButtons();
        this.updateBattleEnergyUI();
      }
    });

    // Hide banner when math challenge opens
    eventBus.on('REQUEST_MATH_QUESTION', () => {
      if (this.battleBannerEl) {
        this.battleBannerEl.classList.add('hidden');
      }
    });

    // Math result received
    eventBus.on('MATH_QUESTION_ANSWERED', ({ isCorrect }) => {
      if (this.battleEngine) {
        this.battleEngine.handleMathResult(isCorrect);
      }
    });

    // Level Up Event
    eventBus.on('PLAYER_LEVEL_UP', ({ level, maxHp }) => {
      this.pendingLevelUp = { level, maxHp };
    });

    // Where are you playing? flow transition
    eventBus.on('PLAY_LOCATION_CHOSEN', () => {
      if (!this.gameState.hasCreatedCharacter) {
        eventBus.emit('OPEN_CHARACTER_CREATOR');
      } else if (!this.gameState.hasSeenPrologue) {
        eventBus.emit('TRIGGER_OPENING_PROLOGUE');
      }
    });

    // Battle Victory
    eventBus.on('BATTLE_VICTORY', ({ monster, rewards }) => {
      if (this.currentStageId) {
        this.gameState.recordStageClear(this.currentStageId, 3);
        // Correct official Warden Keystone boss drop map
        const keystoneMap = {
          'forest_3': { id: 'earth', name: '大地神石 (Earth Keystone)', realm: '螢火森林 (Firefly Forest)', icon: '🌱', nextRealm: 'shipwreck_shore', nextRealmName: '海難海岸' },
          'shore_2': { id: 'water', name: '海洋神石 (Water Keystone)', realm: '海難海岸 (Shipwreck Shore)', icon: '💧', nextRealm: 'bonfire_spire', nextRealmName: '篝火火山峰' },
          'volcano_2': { id: 'fire', name: '烈焰神石 (Fire Keystone)', realm: '篝火火山峰 (Bonfire Spire)', icon: '🔥', nextRealm: 'shiverchill_mountains', nextRealmName: '寒顫雪山' },
          'snow_2': { id: 'ice', name: '冰霜神石 (Ice Keystone)', realm: '寒顫雪山 (Shiverchill Mountains)', icon: '❄️', nextRealm: 'skywatch', nextRealmName: '浮空風暴城' },
          'sky_2': { id: 'storm', name: '風暴神石 (Storm Keystone)', realm: '浮空風暴城 (Skywatch)', icon: '⚡', nextRealm: 'lamplight_town', nextRealmName: '燈火主城' }
        };
        const stoneInfo = keystoneMap[this.currentStageId];
        if (stoneInfo && !this.gameState.keystones.includes(stoneInfo.id)) {
          this.gameState.addKeystone(stoneInfo.id);
          this.pendingKeystone = stoneInfo;
        }
      }
      if (rewards.canEvolve && rewards.activePet) {
        this.pendingPetEvolution = rewards.activePet.id;
      }
      this.battleUiEl.classList.add('hidden');
      this.rewardXpEl.textContent = `+${rewards.xp} XP`;
      this.rewardGoldEl.textContent = `+${rewards.gold} 金幣`;

      if (rewards.activePet && this.rewardPetXpEl) {
        if (this.rewardPetSlotEl) this.rewardPetSlotEl.classList.remove('hidden');
        this.rewardPetXpEl.textContent = `+${rewards.petXp || rewards.xp} ${rewards.activePet.name.split(' ')[0]} XP`;
      } else if (this.rewardPetSlotEl) {
        this.rewardPetSlotEl.classList.add('hidden');
      }

      if (this.rewardPetLvlupBannerEl) {
        if (rewards.petLeveledUp && rewards.activePet) {
          this.rewardPetLvlupBannerEl.textContent = `🎉 守護精靈 ${rewards.activePet.name} 升級至 LV. ${rewards.activePet.level}！(Max HP +15, 攻擊 +3)`;
          this.rewardPetLvlupBannerEl.classList.remove('hidden');
        } else {
          this.rewardPetLvlupBannerEl.classList.add('hidden');
        }
      }

      this.rewardModalEl.classList.remove('hidden');
    });

    // Battle Rescue Victory
    eventBus.on('BATTLE_RESCUE_VICTORY', ({ monster, rewards }) => {
      if (this.currentStageId) {
        this.gameState.recordStageClear(this.currentStageId, 3);
      }
      if (rewards.canEvolve && rewards.activePet) {
        this.pendingPetEvolution = rewards.activePet.id;
      }
      this.battleUiEl.classList.add('hidden');
      const bonusStr = (rewards.bonusReasons && rewards.bonusReasons.length > 0) ? `\n(${rewards.bonusReasons.join(' • ')})` : '';
      this.rewardXpEl.textContent = `+${rewards.xp} XP ${bonusStr}`;
      this.rewardGoldEl.textContent = `+${rewards.gold} 金幣`;

      if (rewards.activePet && this.rewardPetXpEl) {
        if (this.rewardPetSlotEl) this.rewardPetSlotEl.classList.remove('hidden');
        this.rewardPetXpEl.textContent = `+${rewards.petXp || rewards.xp} ${rewards.activePet.name.split(' ')[0]} XP`;
      } else if (this.rewardPetSlotEl) {
        this.rewardPetSlotEl.classList.add('hidden');
      }

      if (this.rewardPetLvlupBannerEl) {
        if (rewards.petLeveledUp && rewards.activePet) {
          this.rewardPetLvlupBannerEl.textContent = `🎉 守護精靈 ${rewards.activePet.name} 升級至 LV. ${rewards.activePet.level}！(Max HP +15, 攻擊 +3)`;
          this.rewardPetLvlupBannerEl.classList.remove('hidden');
        } else if (rewards.isNewPet) {
          this.rewardPetLvlupBannerEl.textContent = `🌟 【新夥伴入隊】${monster.name} 已成功解鎖登錄至精靈圖鑑！`;
          this.rewardPetLvlupBannerEl.classList.remove('hidden');
        } else {
          this.rewardPetLvlupBannerEl.classList.add('hidden');
        }
      }

      this.rewardModalEl.classList.remove('hidden');
    });

    // Battle Defeat (Out of Hearts)
    eventBus.on('BATTLE_DEFEAT', () => {
      this.battleUiEl.classList.add('hidden');
      if (this.battleBannerEl) this.battleBannerEl.classList.add('hidden');
      if (this.defeatModalEl) {
        this.defeatModalEl.classList.remove('hidden');
      } else {
        this.gameState.hp = this.gameState.maxHp;
        this.returnToWorld();
      }
    });

    // Battle Announcement Banners (Turn / Critical / Fizzle)
    eventBus.on('BATTLE_PLAYER_TURN', () => {
      this.showBattleBanner({
        type: 'turn',
        icon: '⚡',
        main: 'YOUR TURN!',
        sub: 'Choose a spell to cast. (請選擇你要施放的法術)'
      });
    });

    eventBus.on('BATTLE_CRITICAL_HIT', () => {
      this.showBattleBanner({
        type: 'critical',
        icon: '💥',
        main: 'SUPER EFFECTIVE!',
        sub: '屬性克制 • 造成 150% 暴擊傷害！'
      });
    });

    eventBus.on('BATTLE_SPELL_FIZZLE', () => {
      this.showBattleBanner({
        type: 'fizzle',
        icon: '💨',
        main: 'MISS / FIZZLE!',
        sub: '算術封印未解開 • 法術未命中'
      });
    });

    eventBus.on('BATTLE_MONSTER_TURN', ({ monster }) => {
      this.showBattleBanner({
        type: 'opponent',
        icon: '👾',
        main: "OPPONENT'S TURN!",
        sub: `${monster.name} 正在積聚暗影法力...`
      });
    });

    // Progression Modals Flow (Victory -> Level Up -> Evolution -> Keystone -> World)
    this.btnRewardConfirm.addEventListener('click', () => {
      this.rewardModalEl.classList.add('hidden');
      if (this.currentBattlingMonsterId === 'theo_addiwise') {
        this.gameState.hasCompletedTutorialDuel = true;
        this.battleUiEl.classList.add('hidden');
        eventBus.emit('TUTORIAL_DUEL_WON');
        return;
      }
      if (this.pendingLevelUp) {
        this.showLevelUpModal(this.pendingLevelUp);
        this.pendingLevelUp = null;
      } else if (this.pendingPetEvolution) {
        const petId = this.pendingPetEvolution;
        this.pendingPetEvolution = null;
        eventBus.emit('TRIGGER_PET_EVOLUTION', {
          petId,
          onComplete: () => {
            if (this.pendingKeystone) {
              this.showKeystoneModal(this.pendingKeystone);
              this.pendingKeystone = null;
            } else {
              this.returnToWorld();
            }
          }
        });
      } else if (this.pendingKeystone) {
        this.showKeystoneModal(this.pendingKeystone);
        this.pendingKeystone = null;
      } else {
        this.returnToWorld();
      }
    });

    if (this.btnLevelUpConfirm) {
      this.btnLevelUpConfirm.addEventListener('click', () => {
        if (this.levelUpModalEl) this.levelUpModalEl.classList.add('hidden');
        if (this.pendingPetEvolution) {
          const petId = this.pendingPetEvolution;
          this.pendingPetEvolution = null;
          eventBus.emit('TRIGGER_PET_EVOLUTION', {
            petId,
            onComplete: () => {
              if (this.pendingKeystone) {
                this.showKeystoneModal(this.pendingKeystone);
                this.pendingKeystone = null;
              } else {
                this.returnToWorld();
              }
            }
          });
        } else if (this.pendingKeystone) {
          this.showKeystoneModal(this.pendingKeystone);
          this.pendingKeystone = null;
        } else {
          this.returnToWorld();
        }
      });
    }

    // Altar Boss Trial Trigger
    eventBus.on('TRIGGER_ALTAR_BOSS_TRIAL', ({ realmId, altar }) => {
      this.currentAltarTrial = { realmId, altar };
      if (this.altarBossHeadingEl) this.altarBossHeadingEl.textContent = `${altar.name} 祭壇`;
      if (this.altarBossIconEl) this.altarBossIconEl.textContent = altar.icon;
      const realmBadge = document.getElementById('altar-boss-realm-badge');
      if (realmBadge) realmBadge.textContent = `${altar.name} 守護者決鬥`;
      if (this.altarBossDescEl) {
        this.altarBossDescEl.innerHTML = `區域守護者<strong>${altar.bossName}</strong> 正在祭壇鎮守！挑戰守護者並贏得決鬥，即可淨化並奪回<strong>${altar.name}</strong>！`;
      }
      if (this.altarBossModalEl) this.altarBossModalEl.classList.remove('hidden');
    });

    if (this.btnStartAltarBoss) {
      this.btnStartAltarBoss.addEventListener('click', () => {
        if (this.altarBossModalEl) this.altarBossModalEl.classList.add('hidden');
        if (this.currentAltarTrial) {
          eventBus.emit('LAUNCH_STAGE', {
            worldId: this.currentAltarTrial.realmId,
            stageId: this.currentAltarTrial.altar.bossStage
          });
        }
      });
    }

    const closeAltarBossModal = () => {
      if (this.altarBossModalEl) this.altarBossModalEl.classList.add('hidden');
    };
    if (this.btnCancelAltarBoss) this.btnCancelAltarBoss.addEventListener('click', closeAltarBossModal);
    if (this.btnCloseAltarBoss) this.btnCloseAltarBoss.addEventListener('click', closeAltarBossModal);

    // Keystone Navigation Choices (Next Realm / Lamplight Town / Stay in Realm)
    if (this.btnKeystoneNextRealm) {
      this.btnKeystoneNextRealm.addEventListener('click', () => {
        if (this.keystoneModalEl) this.keystoneModalEl.classList.add('hidden');
        if (this.currentPendingNextRealm) {
          this.gameState.setRealm(this.currentPendingNextRealm);
        }
        this.returnToWorld();
      });
    }

    if (this.btnKeystoneTown) {
      this.btnKeystoneTown.addEventListener('click', () => {
        if (this.keystoneModalEl) this.keystoneModalEl.classList.add('hidden');
        this.gameState.setRealm('lamplight_town');
        this.returnToWorld();
      });
    }

    if (this.btnKeystoneConfirm) {
      this.btnKeystoneConfirm.addEventListener('click', () => {
        if (this.keystoneModalEl) this.keystoneModalEl.classList.add('hidden');
        this.returnToWorld();
      });
    }

    if (this.btnDefeatConfirm) {
      this.btnDefeatConfirm.addEventListener('click', () => {
        if (this.defeatModalEl) this.defeatModalEl.classList.add('hidden');
        this.gameState.hp = this.gameState.maxHp;
        eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
        this.returnToWorld();
      });
    }

    // Official APK offline / reconnection handling
    window.addEventListener('offline', () => {
      const offlineModal = document.getElementById('offline-modal');
      if (offlineModal) offlineModal.classList.remove('hidden');
    });
    window.addEventListener('online', () => {
      const offlineModal = document.getElementById('offline-modal');
      if (offlineModal) offlineModal.classList.add('hidden');
    });
    const btnOfflineRetry = document.getElementById('btn-offline-retry');
    if (btnOfflineRetry) {
      btnOfflineRetry.addEventListener('click', () => {
        const offlineModal = document.getElementById('offline-modal');
        if (navigator.onLine) {
          if (offlineModal) offlineModal.classList.add('hidden');
        } else {
          btnOfflineRetry.animate([
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' }
          ], { duration: 250 });
        }
      });
    }
  }

  showLevelUpModal({ level, maxHp }) {
    if (!this.levelUpModalEl) return;
    if (this.levelUpTitleEl) this.levelUpTitleEl.textContent = `等級提升至 LV. ${level}！`;
    if (this.levelUpHpEl) this.levelUpHpEl.textContent = `${maxHp} Hearts (+20)`;
    this.levelUpModalEl.classList.remove('hidden');
  }

  showKeystoneModal(stoneInfo) {
    if (!this.keystoneModalEl) return;
    if (this.keystoneIconEl) this.keystoneIconEl.textContent = stoneInfo.icon;
    if (this.keystoneTitleEl) this.keystoneTitleEl.textContent = `${stoneInfo.name} 已淨化！`;
    if (this.keystoneRealmEl) this.keystoneRealmEl.textContent = `${stoneInfo.realm} • 暗影退散`;

    this.currentPendingNextRealm = stoneInfo.nextRealm || null;
    if (this.btnKeystoneNextRealm && this.btnKeystoneNextRealmText) {
      if (stoneInfo.nextRealm && stoneInfo.nextRealm !== 'lamplight_town') {
        this.btnKeystoneNextRealm.classList.remove('hidden');
        this.btnKeystoneNextRealmText.textContent = `🚀 前往下一王國 (${stoneInfo.nextRealmName})`;
      } else {
        this.btnKeystoneNextRealm.classList.add('hidden');
      }
    }

    this.keystoneModalEl.classList.remove('hidden');
  }

  showBattleBanner({ type, icon, main, sub }) {
    if (!this.battleBannerEl || this.currentScene !== 'battle') return;

    if (this.bannerTimer) {
      clearTimeout(this.bannerTimer);
      this.bannerTimer = null;
    }

    this.battleBannerEl.className = `battle-announcement-banner banner-${type}`;
    if (this.bannerIconEl) this.bannerIconEl.textContent = icon;
    if (this.bannerMainEl) this.bannerMainEl.textContent = main;
    if (this.bannerSubEl) this.bannerSubEl.textContent = sub;

    this.battleBannerEl.classList.remove('hidden');

    this.bannerTimer = setTimeout(() => {
      if (this.battleBannerEl) {
        this.battleBannerEl.classList.add('banner-exit');
        setTimeout(() => {
          this.battleBannerEl.classList.add('hidden');
          this.battleBannerEl.classList.remove('banner-exit');
        }, 300);
      }
    }, 1300);
  }

  startBattle(monsterId) {
    const monsterDef = MONSTERS[monsterId] || MONSTERS['ember_fox'];
    this.currentScene = 'battle';
    if (this.worldScene) {
      this.lastWorldX = this.worldScene.player.x;
      this.lastWorldY = this.worldScene.player.y;
      this.worldScene.isActive = false;
      this.worldScene.player.targetX = null;
      this.worldScene.player.targetY = null;
      this.worldScene.player.isMoving = false;
      this.worldScene.keys = {};
    }
    this.mobileControlsEl.classList.add('hidden');
    this.battleUiEl.classList.remove('hidden');
    const hudLayer = document.getElementById('hud-layer');
    if (hudLayer) hudLayer.classList.add('battle-mode');

    // Hide any lingering modals
    if (this.rewardModalEl) this.rewardModalEl.classList.add('hidden');
    if (this.levelUpModalEl) this.levelUpModalEl.classList.add('hidden');
    if (this.keystoneModalEl) this.keystoneModalEl.classList.add('hidden');
    if (this.altarBossModalEl) this.altarBossModalEl.classList.add('hidden');
    if (this.defeatModalEl) this.defeatModalEl.classList.add('hidden');

    this.battleEngine = new BattleEngine(this.gameState, monsterDef);
    this.battleScene.setCombatants(this.gameState.getSnapshot(), this.battleEngine.monster);

    this.renderBattleSpellButtons();
    this.battleEngine.start();
    this.updateBattleEnergyUI();
    this.battleMessageEl.textContent = monsterId === 'theo_addiwise'
      ? 'Choose a spell to cast. (請選擇你要施放的法術)'
      : `Choose a spell to cast. (野生的 ${monsterDef.name} 出現了！請選擇法術)`;
  }

  updateBattleEnergyUI() {
    const pipsEl = document.getElementById('battle-energy-pips');
    if (pipsEl) {
      const pips = pipsEl.querySelectorAll('.mana-crystal, .pip');
      pips.forEach((p, idx) => {
        if (idx < this.gameState.energy) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }

    const streakBadge = document.getElementById('battle-streak-badge');
    if (streakBadge) {
      const streak = this.gameState.winStreak || 0;
      if (streak > 0) {
        streakBadge.textContent = `🔥 ${streak} 連勝 (+${Math.min(75, streak * 15)}%)`;
        streakBadge.classList.remove('hidden');
      } else {
        streakBadge.classList.add('hidden');
      }
    }

    const elixirBadge = document.getElementById('battle-elixir-badge');
    if (elixirBadge) {
      const battles = this.gameState.xpBoostBattles || 0;
      if (battles > 0) {
        elixirBadge.textContent = `🧪 雙倍XP (${battles}場)`;
        elixirBadge.classList.remove('hidden');
      } else {
        elixirBadge.classList.add('hidden');
      }
    }

    const btnRescue = document.getElementById('btn-rescue-monster');
    if (btnRescue && this.battleEngine) {
      if (this.battleEngine.monster.isBoss) {
        btnRescue.disabled = true;
        btnRescue.innerHTML = '<span class="rescue-icon">🛡️</span><span class="rescue-text">首領怪獸 (不可收服)</span>';
      } else {
        const can = this.battleEngine.canRescue();
        btnRescue.disabled = !can;
        btnRescue.innerHTML = can 
          ? '<span class="rescue-icon">💖</span><span class="rescue-text">立即淨化拯救 (Rescue)!</span>'
          : '<span class="rescue-icon">💖</span><span class="rescue-text">淨化拯救 (怪獸體力&lt;45%)</span>';
      }
    }
  }

  renderBattleSpellButtons() {
    this.spellGridEl.innerHTML = '';
    const activePet = this.gameState.getActivePet();
    const spellList = [...this.gameState.unlockedSpells];

    if (activePet) {
      const petSpell = registerPetSpell(activePet);
      if (petSpell) {
        spellList.unshift(petSpell.id);
      }
    }

    spellList.forEach(spellId => {
      const spell = SPELLS[spellId];
      if (!spell) return;

      const isPet = !!spell.isPetSpell;
      const isPotion = spell.id === 'potion';
      const isPetFainted = isPet && (this.battleEngine?.activePet?.isFainted || (this.battleEngine?.activePet?.hp !== undefined && this.battleEngine.activePet.hp <= 0));

      let costBadge = 'FREE';
      if (isPet) {
        costBadge = isPetFainted ? '💫 昏迷' : '🐾 精靈技';
      } else if (isPotion) {
        costBadge = `x${this.gameState.potionsCount}`;
      } else if (spell.energyCost > 0) {
        costBadge = `${spell.energyCost}⚡`;
      }

      const isDisabled = (isPotion && this.gameState.potionsCount <= 0) || isPetFainted;

      const btn = document.createElement('button');
      btn.className = `spell-orb-btn ${isPet ? 'pet-spell-btn' : ''} ${isDisabled ? 'disabled' : ''}`;
      if (isDisabled) btn.disabled = true;

      btn.innerHTML = `
        <div class="orb-disc element-${spell.element || 'neutral'}">
          <span class="orb-icon">${spell.icon}</span>
          <span class="orb-cost-badge ${isPet ? 'badge-pet' : ''}">${costBadge}</span>
        </div>
        <span class="orb-label">${spell.name}</span>
      `;

      btn.addEventListener('mouseenter', () => {
        if (this.battleMessageEl) {
          if (isPet && isPetFainted) {
            this.battleMessageEl.textContent = `💫 守護精靈 ${spell.petName || '精靈'} 體力耗盡昏迷中，無法出戰！請使用巫師法術或生命藥水！`;
          } else if (isPotion && isDisabled) {
            this.battleMessageEl.textContent = `🎒 生命藥水已耗盡！可前往燈火鎮布洛克商店購買。`;
          } else {
            this.battleMessageEl.textContent = `${spell.icon} ${spell.name} [${costBadge}] • ${spell.desc}`;
          }
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (this.battleMessageEl && this.battleEngine) {
          this.battleMessageEl.textContent = 'Choose a spell to cast. (請選擇你要施放的法術或精靈招式)';
        }
      });

      btn.addEventListener('click', () => {
        if (this.battleEngine && this.battleEngine.isPlayerTurn && !this.battleEngine.isBusy) {
          this.battleEngine.selectSpell(spellId);
        }
      });

      this.spellGridEl.appendChild(btn);
    });
  }

  initLoadingScreen() {
    if (!this.loadingScreenEl) {
      this.finishLoading();
      return;
    }

    const tips = [
      '正在喚醒魔法精靈...',
      '正在連接燈火奧術學院...',
      '載入五大元素王國地貌...',
      '校長努特正在籌備今日數學考題...'
    ];
    let tipIdx = 0;
    let progress = 0;

    const tipInterval = setInterval(() => {
      tipIdx = (tipIdx + 1) % tips.length;
      if (this.loadingTipText) {
        this.loadingTipText.textContent = tips[tipIdx];
      }
    }, 400);

    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        clearInterval(tipInterval);

        if (this.loadingProgressBar) this.loadingProgressBar.style.width = '100%';
        if (this.loadingProgressText) this.loadingProgressText.textContent = '100%';

        setTimeout(() => {
          if (this.loadingScreenEl) {
            this.loadingScreenEl.classList.add('fade-out');
            setTimeout(() => {
              this.finishLoading();
            }, 550);
          } else {
            this.finishLoading();
          }
        }, 250);
      } else {
        if (this.loadingProgressBar) this.loadingProgressBar.style.width = `${progress}%`;
        if (this.loadingProgressText) this.loadingProgressText.textContent = `${progress}%`;
      }
    }, 100);
  }

  finishLoading() {
    if (!this.gameState.playLocation) {
      eventBus.emit('OPEN_WHERE_PLAYING');
    } else if (!this.gameState.hasCreatedCharacter) {
      eventBus.emit('OPEN_CHARACTER_CREATOR');
    } else if (!this.gameState.hasSeenPrologue) {
      eventBus.emit('TRIGGER_OPENING_PROLOGUE');
    }
  }

  updateRealmBadge() {
    const realmMap = {
      'firefly_forest': { icon: '🌲', name: '螢火蟲森林 (Firefly Forest)' },
      'shipwreck_shore': { icon: '🌊', name: '海難海岸 (Shipwreck Shore)' },
      'bonfire_spire': { icon: '🌋', name: '篝火火山峰 (Bonfire Spire)' },
      'shiverchill_mountains': { icon: '❄️', name: '寒顫雪山 (Shiverchill Mountains)' },
      'skywatch': { icon: '⚡', name: '浮空風暴城 (Skywatch)' },
      'lamplight_town': { icon: '🏛️', name: '燈火主城 (Lamplight Town)' }
    };
    const info = realmMap[this.gameState.currentRealm] || realmMap['firefly_forest'];
    if (this.realmBadgeIconEl) this.realmBadgeIconEl.textContent = info.icon;
    if (this.realmBadgeNameEl) this.realmBadgeNameEl.textContent = info.name;
  }

  triggerEncounter(monsterId, battleTitle = '野生物怪遭遇戰') {
    this.currentBattlingMonsterId = monsterId;
    const monsterDef = MONSTERS[monsterId] || MONSTERS['ember_fox'];
    if (this.encounterOverlayEl) {
      if (this.encounterTextEl) {
        this.encounterTextEl.textContent = `⚔️ 野生的 ${monsterDef.name} 出現了！進入奧術決鬥！`;
      }
      this.encounterOverlayEl.classList.remove('hidden');
      audioManager.play('hit');
      setTimeout(() => {
        this.encounterOverlayEl.classList.add('hidden');
        if (this.worldScene) {
          this.worldScene.isEncountering = false;
        }
        this.startBattle(monsterId, battleTitle);
      }, 650);
    } else {
      this.startBattle(monsterId, battleTitle);
    }
  }

  returnToWorld() {
    this.currentScene = 'world';
    if (this.battleEngine) {
      this.battleEngine.destroy();
      this.battleEngine = null;
    }
    this.battleUiEl.classList.add('hidden');
    if (this.battleBannerEl) {
      this.battleBannerEl.classList.add('hidden');
    }
    const hudLayer = document.getElementById('hud-layer');
    if (hudLayer) hudLayer.classList.remove('battle-mode');
    this.mobileControlsEl.classList.remove('hidden');

    if (this.worldScene) {
      this.worldScene.isActive = true;
      this.worldScene.player.targetX = null;
      this.worldScene.player.targetY = null;
      this.worldScene.player.isMoving = false;
      this.worldScene.keys = {};
      
      // Preserve player's previous coordinates so they don't lose exploration progress
      if (typeof this.lastWorldX === 'number' && typeof this.lastWorldY === 'number') {
        this.worldScene.player.x = this.lastWorldX;
        this.worldScene.player.y = this.lastWorldY;
      } else {
        this.worldScene.player.x = 240;
        this.worldScene.player.y = 280;
      }
      this.worldScene.encounterCooldown = 2.0; // 2s grace period on return
      this.worldScene.respawnAfterBattle(this.currentBattlingMonsterId);
    }
    this.currentBattlingMonsterId = null;
    this.audioManager.playRealmBgm(this.gameState.currentRealm);
    eventBus.emit('RETURNED_TO_WORLD');
  }

  setupMobileControls() {
    const dpadButtons = document.querySelectorAll('.dpad-btn[data-dir]');
    dpadButtons.forEach(btn => {
      const dir = btn.dataset.dir;

      const start = (e) => {
        e.preventDefault();
        eventBus.emit('DPAD_MOVE', { dir, active: true });
      };

      const end = (e) => {
        e.preventDefault();
        eventBus.emit('DPAD_MOVE', { dir, active: false });
      };

      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
    });
  }

  gameLoop(timestamp) {
    const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;

    // Zero-overhead resolution synchronization guard
    const stage = document.getElementById('game-stage');
    if (stage) {
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      if (sw > 0 && sh > 0 && (this.canvas.width !== sw || this.canvas.height !== sh)) {
        this.resizeCanvas();
      }
    }

    if (this.currentScene === 'world') {
      this.worldScene.update(dt);
      this.worldScene.render();
    } else if (this.currentScene === 'battle') {
      this.battleScene.update(dt);
      this.battleScene.render();
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Bootstrap when DOM is ready
function bootstrapGame() {
  if (!window.gameApp) {
    window.gameApp = new GameApp();
    window.app = window.gameApp;
    console.log('🎮 Prodigy Math Adventure initialized!');
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootstrapGame);
} else {
  bootstrapGame();
}

