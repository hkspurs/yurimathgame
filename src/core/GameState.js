// GameState.js - Player state, stats, inventory, and progression
import { eventBus } from './EventBus.js';
import { PET_EVOLUTIONS } from '../battle/CanonDatabase.js';
import { AvatarRenderer } from '../ui/AvatarRenderer.js';

export const DEFAULT_BOUNTIES = [
  { id: 'bounty_1', title: '螢火森林巡查', desc: '在螢火森林擊敗或淨化 1 隻野怪', target: 1, current: 0, rewardGold: 60, rewardStars: 1, completed: false, claimed: false },
  { id: 'bounty_2', title: '奧術心算特訓', desc: '在戰鬥中成功解開 3 道數學封印', target: 3, current: 0, rewardGold: 80, rewardStars: 1, completed: false, claimed: false },
  { id: 'bounty_3', title: '夥伴怪獸拯救', desc: '成功使用【💖 Rescue】淨化 1 隻怪獸', target: 1, current: 0, rewardGold: 100, rewardStars: 2, completed: false, claimed: false }
];

export class GameState {
  constructor(initialData = null) {
    this.playLocation = initialData?.playLocation || null; // 'school' | 'home'
    this.classCode = initialData?.classCode || '';
    this.name = initialData?.name || 'Alex Starweaver';
    this.wizardStyle = initialData?.wizardStyle || 'apprentice';
    this.hairStyle = initialData?.hairStyle || 1;
    this.hairColor = initialData?.hairColor || 'Light Brown';
    this.eyeColor = initialData?.eyeColor || 'Dark Brown';
    this.skinTone = initialData?.skinTone || 1;
    this.avatarSprite = initialData?.avatarSprite || './assets/sprites/wizard_apprentice.png';
    this.hasCreatedCharacter = initialData?.hasCreatedCharacter || false;
    this.hasCompletedTutorialDuel = initialData?.hasCompletedTutorialDuel || false;
    this.level = initialData?.level || 1;
    this.xp = initialData?.xp || 0;
    this.xpToNext = this.calculateXpRequired(this.level);
    this.maxHp = initialData?.maxHp || 100;
    this.hp = initialData?.hp || 100;
    this.attack = initialData?.attack || 15;
    this.gold = initialData?.gold || 150;
    this.stars = initialData?.stars || 3;
    this.energy = 0; // Spell energy pips (0 to 5)
    this.maxEnergy = 5;
    this.potionsCount = initialData?.potionsCount || 3;
    this.xpBoostBattles = initialData?.xpBoostBattles || 0;
    this.petTreatsCount = initialData?.petTreatsCount || 1;
    this.winStreak = initialData?.winStreak || 0;
    this.pets = initialData?.pets || [];
    // Support dual companion pet squad: activePetIds = [petId1, petId2]
    if (initialData?.activePetIds && Array.isArray(initialData.activePetIds)) {
      this.activePetIds = [...initialData.activePetIds].slice(0, 2);
    } else if (initialData?.activePetId) {
      this.activePetIds = [initialData.activePetId];
    } else {
      this.activePetIds = this.pets.slice(0, 2).map(p => p.id);
    }
    this.activePetId = this.activePetIds[0] || null;
    this.keystones = initialData?.keystones || []; // 5 Warden Keystones
    this.bounties = initialData?.bounties || JSON.parse(JSON.stringify(DEFAULT_BOUNTIES));
    this.equipment = initialData?.equipment || {
      hat: { id: 'hat_apprentice', name: 'Apprentice Hat (學徒帽)', hearts: 15, slot: 'hat' },
      outfit: { id: 'outfit_apprentice', name: 'Apprentice Robe (學徒法袍)', hearts: 20, slot: 'outfit' },
      wand: { id: 'wand_training', name: 'Training Wand (訓練魔杖)', power: 12, slot: 'wand' },
      boots: { id: 'boots_apprentice', name: 'Apprentice Boots (學徒皮靴)', hearts: 10, slot: 'boots' },
      relic: { id: 'relic_elemental', name: 'Elemental Relic (元素護符)', element: 'astral', slot: 'relic' }
    };
    this.ownedEquipment = initialData?.ownedEquipment || [
      this.equipment.hat,
      this.equipment.outfit,
      this.equipment.wand,
      this.equipment.boots,
      this.equipment.relic
    ].filter(Boolean);
    // Ensure all currently equipped items are present in ownedEquipment
    Object.values(this.equipment).forEach(item => {
      if (item && !this.ownedEquipment.some(i => (i.id && i.id === item.id) || i.name === item.name)) {
        this.ownedEquipment.push(item);
      }
    });
    this.stagesProgress = initialData?.stagesProgress || {
      'forest_1': { stars: 3, cleared: true }
    };
    this.unlockedSpells = initialData?.unlockedSpells || [
      'starbit', 'bop', 'arcane_blast', 'torrent', 'flame_orb', 'vine_whip', 'static_shock', 'star_dust', 'potion', 'frogify'
    ];
    // Mystery Pet Egg Incubator System
    this.egg = initialData?.egg || {
      hasEgg: true,
      name: '彩虹星斑蛋',
      icon: '🥚',
      pattern: 'rainbow',
      progress: 1, // 0 to 3
      target: 3
    };
    this.grade = initialData?.grade || 1;
    this.soundEnabled = initialData?.soundEnabled ?? true;
    this.hasSeenPrologue = initialData?.hasSeenPrologue || false;
    this.currentRealm = initialData?.currentRealm || 'firefly_forest';
    this.lastWheelSpinDate = initialData?.lastWheelSpinDate || null;
    this.openedChests = initialData?.openedChests || [];
    this.recalculateStats();

    // Initialize or refresh avatar sprite to ensure it reflects current archetype and hair/skin
    if (!initialData?.avatarSprite || initialData.avatarSprite.startsWith('./assets/')) {
      this.updateAvatarSprite();
    }
  }

  determineThemeFromGear() {
    const wand = this.equipment?.wand;
    const hat = this.equipment?.hat;
    const outfit = this.equipment?.outfit;

    if (hat?.id === 'hat_pyro' || wand?.id === 'wand_ember' || wand?.element === 'fire') {
      return 'pyro';
    }
    if (hat?.id === 'hat_frost' || wand?.element === 'ice') {
      return 'frost';
    }
    if (wand?.id === 'wand_tidal' || wand?.element === 'water') {
      return 'tidal';
    }
    if (wand?.id === 'wand_storm' || wand?.element === 'storm') {
      return 'storm';
    }
    if (hat?.id === 'hat_scholar' || outfit?.id === 'outfit_traveler') {
      return 'scholar';
    }
    if (outfit?.id === 'outfit_guardian' || wand?.id === 'wand_titanium') {
      return 'shadow';
    }
    return this.wizardStyle || 'apprentice';
  }

  updateAvatarSprite() {
    try {
      const svgStr = AvatarRenderer.renderSvg({
        hairStyle: this.hairStyle || 1,
        hairColor: this.hairColor || 'Light Brown',
        eyeColor: this.eyeColor || 'Dark Brown',
        skinTone: this.skinTone || 1,
        archetype: this.wizardStyle || 'apprentice',
        size: 160
      });
      this.avatarSprite = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    } catch (e) {
      console.warn('Avatar update fallback:', e);
    }
  }

  setWizardStyle(themeId) {
    if (themeId) {
      this.wizardStyle = themeId;
      this.updateAvatarSprite();
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    }
  }

  recalculateStats() {
    const baseMaxHp = 100 + (this.level - 1) * 20;
    const baseAttack = 15 + (this.level - 1) * 5;

    let gearHpBonus = 0;
    let gearAtkBonus = 0;

    if (this.equipment) {
      if (this.equipment.hat) gearHpBonus += (this.equipment.hat.hearts || this.equipment.hat.heartsBonus || 0);
      if (this.equipment.outfit) gearHpBonus += (this.equipment.outfit.hearts || this.equipment.outfit.heartsBonus || 0);
      if (this.equipment.boots) gearHpBonus += (this.equipment.boots.hearts || this.equipment.boots.heartsBonus || 0);
      if (this.equipment.wand) gearAtkBonus += (this.equipment.wand.power || this.equipment.wand.powerBonus || 0);
    }

    this.maxHp = baseMaxHp + gearHpBonus;
    this.attack = baseAttack + gearAtkBonus;
    if (this.hp > this.maxHp) this.hp = this.maxHp;
    if (!this.hp || this.hp <= 0) this.hp = this.maxHp;
  }

  equipItem(item) {
    if (!item) return;
    const slotMap = {
      wands: 'wand', wand: 'wand',
      hats: 'hat', hat: 'hat',
      outfits: 'outfit', outfit: 'outfit',
      boots: 'boots',
      relics: 'relic', relic: 'relic'
    };
    const slot = item.slot || slotMap[item.cat] || slotMap[item.category];
    if (!slot) return;

    const normalizedItem = { ...item, slot };
    this.equipment[slot] = normalizedItem;
    if (!this.hasOwnedItem(normalizedItem.id || normalizedItem.name)) {
      this.ownedEquipment.push(normalizedItem);
    }

    // Auto-harmonize wizard outfit skin to match equipped elemental gear
    const derivedTheme = this.determineThemeFromGear();
    if (derivedTheme) {
      this.wizardStyle = derivedTheme;
    }
    this.updateAvatarSprite();

    this.recalculateStats();
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  hasOwnedItem(idOrName) {
    if (!idOrName) return false;
    return this.ownedEquipment.some(i => (i.id && i.id === idOrName) || i.name === idOrName);
  }

  addOwnedItem(item) {
    if (!item) return;
    if (!this.hasOwnedItem(item.id || item.name)) {
      this.ownedEquipment.push(item);
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    }
  }

  setGrade(grade) {
    this.grade = Number(grade) || 1;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  setPlayLocation(location, classCode = '') {
    this.playLocation = location;
    this.classCode = classCode;
    eventBus.emit('PLAY_LOCATION_CHANGED', { location, classCode });
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  isChestOpened(chestId) {
    return this.openedChests.includes(chestId);
  }

  openChest(chestId, rewards = { gold: 35, xp: 25, stars: 1 }) {
    if (this.isChestOpened(chestId)) return null;
    this.openedChests.push(chestId);
    if (rewards.gold) this.addGold(rewards.gold);
    if (rewards.xp) this.addXp(rewards.xp);
    if (rewards.stars) this.addStars(rewards.stars);
    if (rewards.potions) this.potionsCount += rewards.potions;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    return rewards;
  }

  addPet(monster) {
    if (!this.pets.find(p => p.id === monster.id)) {
      const petLvl = monster.level || 1;
      const baseHp = monster.maxHp || (60 + (petLvl - 1) * 15);
      const baseAtk = monster.attack || (10 + (petLvl - 1) * 3);
      this.pets.push({
        id: monster.id,
        name: monster.name,
        element: monster.element,
        level: petLvl,
        sprite: monster.sprite,
        stage: 1,
        xp: 0,
        xpToNext: Math.floor(60 * Math.pow(petLvl, 1.3)),
        maxHp: baseHp,
        hp: monster.hp || baseHp,
        attack: baseAtk
      });
      if (!this.activePetIds || !this.activePetIds.length) {
        this.activePetIds = [monster.id];
        this.activePetId = monster.id;
      } else if (this.activePetIds.length < 2 && !this.activePetIds.includes(monster.id)) {
        this.activePetIds.push(monster.id);
      }
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    }
  }

  getActivePet() {
    return this.pets.find(p => p.id === this.activePetId) || this.pets[0] || null;
  }

  getActivePets() {
    if (!this.activePetIds || !this.activePetIds.length) {
      const fallback = this.getActivePet();
      return fallback ? [fallback] : [];
    }
    const list = this.activePetIds.map(id => this.pets.find(p => p.id === id)).filter(Boolean);
    return list.length ? list : (this.pets[0] ? [this.pets[0]] : []);
  }

  toggleActivePet(petId) {
    if (!this.activePetIds) this.activePetIds = [];
    const idx = this.activePetIds.indexOf(petId);
    if (idx !== -1) {
      // If already active and have more than 1, can deselect
      if (this.activePetIds.length > 1) {
        this.activePetIds.splice(idx, 1);
      }
    } else {
      if (this.activePetIds.length >= 2) {
        // Replace second pet if already 2
        this.activePetIds[1] = petId;
      } else {
        this.activePetIds.push(petId);
      }
    }
    this.activePetId = this.activePetIds[0] || null;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  canEvolvePet(petId) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return false;
    const evo = PET_EVOLUTIONS[pet.id];
    if (!evo) return false;
    return (pet.level >= evo.evolutionLevel) || (this.stars >= evo.starCost);
  }

  evolvePet(petId) {
    const petIdx = this.pets.findIndex(p => p.id === petId);
    if (petIdx === -1) return { success: false, reason: 'Pet not found' };
    const pet = this.pets[petIdx];
    const evo = PET_EVOLUTIONS[pet.id];
    if (!evo) return { success: false, reason: 'No evolution path' };

    const oldPet = { ...pet };
    const nextForm = evo.nextForm;

    pet.id = nextForm.id;
    pet.name = nextForm.name;
    pet.element = nextForm.element;
    pet.sprite = nextForm.sprite;
    pet.maxHp += (nextForm.hpBonus || 50);
    pet.hp = pet.maxHp;
    pet.attack += (nextForm.atkBonus || 8);
    pet.stage = (pet.stage || 1) + 1;
    pet.skills = [nextForm.newSkill];

    if (this.activePetId === oldPet.id) {
      this.activePetId = pet.id;
    }

    eventBus.emit('PET_EVOLVED', { pet, oldPet, nextForm });
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    return { success: true, oldPet, evolvedPet: pet, nextForm };
  }

  addPetXp(petId, amount) {
    const pet = this.pets.find(p => p.id === petId);
    if (!pet) return null;
    if (pet.xp === undefined) pet.xp = 0;
    if (!pet.level) pet.level = 1;
    if (!pet.xpToNext) pet.xpToNext = Math.floor(60 * Math.pow(pet.level, 1.3));
    if (!pet.maxHp) pet.maxHp = 60 + (pet.level - 1) * 15;
    if (!pet.attack) pet.attack = 10 + (pet.level - 1) * 3;

    pet.xp += amount;
    let leveledUp = false;
    while (pet.xp >= pet.xpToNext) {
      pet.xp -= pet.xpToNext;
      pet.level += 1;
      pet.maxHp += 15;
      pet.attack += 3;
      pet.xpToNext = Math.floor(60 * Math.pow(pet.level, 1.3));
      leveledUp = true;
    }

    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    let canEvolve = false;
    if (leveledUp) {
      eventBus.emit('PET_LEVEL_UP', { pet, level: pet.level, maxHp: pet.maxHp, attack: pet.attack });
      const evo = PET_EVOLUTIONS[pet.id];
      if (evo && pet.level >= evo.evolutionLevel) {
        canEvolve = true;
        eventBus.emit('PET_READY_FOR_EVOLUTION', { petId: pet.id, pet, evo });
      }
    }
    return { pet, leveledUp, gainedXp: amount, canEvolve };
  }

  setActivePet(petId) {
    this.activePetId = petId;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  addKeystone(keystoneId) {
    if (!this.keystones.includes(keystoneId)) {
      this.keystones.push(keystoneId);
      eventBus.emit('KEYSTONE_OBTAINED', { keystoneId });
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    }
  }

  recordStageClear(stageId, earnedStars = 3) {
    if (!this.stagesProgress[stageId] || this.stagesProgress[stageId].stars < earnedStars) {
      const oldStars = this.stagesProgress[stageId]?.stars || 0;
      this.stagesProgress[stageId] = {
        cleared: true,
        stars: earnedStars
      };
      this.stars += (earnedStars - oldStars);
    }
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  getTotalStars() {
    return Object.values(this.stagesProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  }

  isStageCleared(stageId) {
    return !!this.stagesProgress[stageId]?.cleared;
  }

  calculateXpRequired(lvl) {
    return Math.floor(100 * Math.pow(lvl, 1.4));
  }

  addXp(amount) {
    this.xp += amount;
    let leveledUp = false;

    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.level += 1;
      this.maxHp += 20;
      this.hp = this.maxHp;
      this.attack += 5;
      this.xpToNext = this.calculateXpRequired(this.level);
      leveledUp = true;
    }

    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    if (leveledUp) {
      eventBus.emit('PLAYER_LEVEL_UP', { level: this.level, maxHp: this.maxHp });
    }
  }

  addGold(amount) {
    this.gold += amount;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  addStars(amount) {
    this.stars += amount;
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    if (this.hp === 0) {
      eventBus.emit('PLAYER_DEFEATED');
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  revive() {
    this.hp = Math.floor(this.maxHp * 0.5);
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  progressBounty(type, amount = 1) {
    let changed = false;
    this.bounties.forEach(b => {
      if (b.claimed) return;
      if (
        (type === 'monster_defeat' && b.id === 'bounty_1') ||
        (type === 'math_correct' && b.id === 'bounty_2') ||
        (type === 'monster_rescue' && b.id === 'bounty_3')
      ) {
        b.current = Math.min(b.target, b.current + amount);
        if (b.current >= b.target && !b.completed) {
          b.completed = true;
          eventBus.emit('BOUNTY_COMPLETED', { bounty: b });
        }
        changed = true;
      }
    });
    if (changed) {
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
    }
  }

  claimBounty(bountyId) {
    const bounty = this.bounties.find(b => b.id === bountyId);
    if (bounty && bounty.completed && !bounty.claimed) {
      bounty.claimed = true;
      this.addGold(bounty.rewardGold);
      this.stars += bounty.rewardStars;
      eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
      return true;
    }
    return false;
  }

  setRealm(realmId) {
    this.currentRealm = realmId;
    eventBus.emit('REALM_CHANGED', { realmId });
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  hasSpunDailyWheel() {
    const today = new Date().toISOString().slice(0, 10);
    return this.lastWheelSpinDate === today;
  }

  recordDailyWheelSpin() {
    this.lastWheelSpinDate = new Date().toISOString().slice(0, 10);
    eventBus.emit('PLAYER_STATS_CHANGED', this.getSnapshot());
  }

  getSnapshot() {
    return {
      name: this.name,
      wizardStyle: this.wizardStyle,
      hairStyle: this.hairStyle,
      hairColor: this.hairColor,
      eyeColor: this.eyeColor,
      skinTone: this.skinTone,
      avatarSprite: this.avatarSprite,
      hasCreatedCharacter: this.hasCreatedCharacter,
      hasCompletedTutorialDuel: this.hasCompletedTutorialDuel,
      level: this.level,
      xp: this.xp,
      xpToNext: this.xpToNext,
      hp: this.hp,
      maxHp: this.maxHp,
      attack: this.attack,
      gold: this.gold,
      stars: this.stars,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      potionsCount: this.potionsCount,
      xpBoostBattles: this.xpBoostBattles,
      petTreatsCount: this.petTreatsCount,
      winStreak: this.winStreak,
      pets: [...this.pets],
      activePetId: this.activePetId,
      activePetIds: [...(this.activePetIds || [this.activePetId].filter(Boolean))],
      keystones: [...this.keystones],
      bounties: JSON.parse(JSON.stringify(this.bounties)),
      equipment: { ...this.equipment },
      ownedEquipment: [...this.ownedEquipment],
      stagesProgress: { ...this.stagesProgress },
      unlockedSpells: [...this.unlockedSpells],
      egg: this.egg ? { ...this.egg } : null,
      grade: this.grade,
      soundEnabled: this.soundEnabled,
      hasSeenPrologue: this.hasSeenPrologue,
      currentRealm: this.currentRealm,
      lastWheelSpinDate: this.lastWheelSpinDate,
      openedChests: [...this.openedChests],
      playLocation: this.playLocation,
      classCode: this.classCode
    };
  }

  progressEgg(amount = 1) {
    if (!this.egg || !this.egg.hasEgg) return null;
    this.egg.progress = Math.min(this.egg.target, this.egg.progress + amount);
    return {
      readyToHatch: this.egg.progress >= this.egg.target,
      egg: this.egg
    };
  }
}
