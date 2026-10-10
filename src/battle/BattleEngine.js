// BattleEngine.js - Faithful Canonical Prodigy Math Game Turn Coordinator
import { eventBus } from '../core/EventBus.js';
import { SPELLS, registerPetSpell } from './Spells.js';

export class BattleEngine {
  constructor(gameState, monsterDef) {
    this.gameState = gameState;
    this.monster = {
      ...monsterDef,
      hp: monsterDef.maxHp
    };
    this.isPlayerTurn = true;
    this.isBusy = false;
    this.turnInProgress = false;
    this.pendingAction = null; // { type: 'spell' | 'rescue', spell?: object, attacker?: 'player' | 'pet' }

    // Initialize battle energy
    this.gameState.energy = 1;

    // Active companion pets squad (Dual Pets)
    this.activePets = this.gameState.getActivePets ? this.gameState.getActivePets() : [this.gameState.getActivePet()].filter(Boolean);
    this.activePet = this.activePets[0] || null;
    this.activePetB = this.activePets[1] || null;

    this.activePets.forEach(pet => {
      if (!pet.maxHp) {
        pet.maxHp = 60 + ((pet.level || 1) - 1) * 15;
      }
      if (pet.hp === undefined || pet.hp <= 0) {
        pet.hp = pet.maxHp;
      }
      pet.isFainted = false;
      registerPetSpell(pet);
    });

    this.playerDamageTaken = 0;

    this.onMathCancelled = () => {
      this.isBusy = false;
      this.turnInProgress = false;
      this.pendingAction = null;
      this.isPlayerTurn = true;
      eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術或精靈招式)');
      eventBus.emit('BATTLE_PLAYER_TURN');
    };
    eventBus.on('MATH_QUESTION_CANCELLED', this.onMathCancelled);
  }

  destroy() {
    if (this.onMathCancelled) {
      eventBus.off('MATH_QUESTION_CANCELLED', this.onMathCancelled);
    }
  }

  start() {
    eventBus.emit('BATTLE_STARTED', {
      monster: this.monster,
      player: this.gameState.getSnapshot(),
      activePet: this.activePet
    });
    setTimeout(() => {
      eventBus.emit('BATTLE_PLAYER_TURN');
    }, 400);
  }

  canRescue() {
    // Canonical Prodigy rule: Realm Bosses guarding Warden Keystones cannot be captured / rescued
    if (this.monster.isBoss) return false;
    return this.monster.hp <= Math.floor(this.monster.maxHp * 0.45);
  }

  selectSpell(spellId) {
    if (!this.isPlayerTurn || this.isBusy || this.turnInProgress) return;
    const spell = SPELLS[spellId];
    if (!spell) return;

    // Check if pet spell but pet is fainted
    if (spell.isPetSpell) {
      if (!this.activePet || this.activePet.isFainted || this.activePet.hp <= 0) {
        eventBus.emit('BATTLE_LOG', '🐾 守護精靈已昏迷倒下，無法施放精靈技能！請使用巫師法術！');
        return;
      }
    }

    // Instant Health Potion Consumption (Bag item, no math gate needed)
    if (spell.id === 'potion') {
      if (this.gameState.hp >= this.gameState.maxHp && (!this.activePet || this.activePet.hp >= this.activePet.maxHp)) {
        eventBus.emit('BATTLE_LOG', '❤️ 全隊生命值已全滿，無需飲用生命藥水！');
        return;
      }
      if (this.gameState.potionsCount <= 0) {
        eventBus.emit('BATTLE_LOG', '🎒 背包中的生命藥水已經用盡！可前往燈火鎮布洛克商店購買。');
        return;
      }

      this.isBusy = true;
      this.turnInProgress = true;
      this.gameState.potionsCount = Math.max(0, this.gameState.potionsCount - 1);
      const healAmount = spell.healAmount || 40;
      this.gameState.heal(healAmount);
      if (this.activePet) {
        this.activePet.hp = Math.min(this.activePet.maxHp, this.activePet.hp + healAmount);
        this.activePet.isFainted = false;
      }
      eventBus.emit('BATTLE_LOG', `🧪 你飲用了【${spell.name}】，巫師與精靈恢復了 ${healAmount} 點生命值！剩餘藥水：${this.gameState.potionsCount} 瓶`);
      eventBus.emit('BATTLE_PLAYER_HEAL', { amount: healAmount, petHp: this.activePet?.hp });
      eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());

      setTimeout(() => {
        this.nextTurn();
      }, 1200);
      return;
    }

    if (spell.energyCost > 0 && this.gameState.energy < spell.energyCost) {
      eventBus.emit('BATTLE_LOG', `能量不足！【${spell.name}】需要 ${spell.energyCost} 點能量，請先使用基礎衝擊蓄力！`);
      return;
    }

    // Lock input immediately upon selecting offensive spell
    this.isBusy = true;
    this.pendingAction = {
      type: 'spell',
      spell,
      attacker: spell.isPetSpell ? 'pet' : 'player'
    };
    eventBus.emit('REQUEST_MATH_QUESTION', {
      spell,
      grade: this.gameState.grade || 1,
      realm: this.gameState.currentRealm || 'firefly_forest',
      level: this.gameState.level || 1
    });
  }

  attemptRescue() {
    if (!this.isPlayerTurn || this.isBusy || this.turnInProgress) return;
    if (this.monster.isBoss) {
      eventBus.emit('BATTLE_LOG', `⚠️ 區域首領怪獸受到暗影結界庇護，無法被淨化收服！必須擊敗它奪回神石！`);
      return;
    }
    if (!this.canRescue()) {
      eventBus.emit('BATTLE_LOG', `怪物體力充沛，無法淨化！需將體力削弱至 45% 以下！`);
      return;
    }

    this.isBusy = true;
    this.pendingAction = { type: 'rescue' };
    eventBus.emit('REQUEST_MATH_QUESTION', {
      spell: { name: '淨化拯救 (Rescue Spell)', icon: '💖' },
      grade: this.gameState.grade || 1,
      realm: this.gameState.currentRealm || 'firefly_forest',
      level: this.gameState.level || 1
    });
  }

  handleMathResult(isCorrect) {
    if (!this.pendingAction) return;
    this.isBusy = true;
    this.turnInProgress = true;

    if (this.pendingAction.type === 'rescue') {
      if (isCorrect) {
        this.handleRescueSuccess();
      } else {
        eventBus.emit('BATTLE_LOG', `回答錯誤！拯救法陣失控，未能成功淨化！`);
        setTimeout(() => this.nextTurn(), 1400);
      }
      return;
    }

    const spell = this.pendingAction.spell;
    const attacker = this.pendingAction.attacker || 'player';

    if (isCorrect) {
      this.gameState.progressBounty('math_correct', 1);
      // Award +1 Energy on correct answer (up to 5)
      this.gameState.energy = Math.min(this.gameState.maxEnergy, this.gameState.energy + 1 - (spell.energyCost || 0));
      eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
      this.executeSpellAttack(spell, attacker);
    } else {
      const missSubject = attacker === 'pet' ? `🐾 ${this.activePet?.name || '精靈'}` : '巫師';
      eventBus.emit('BATTLE_LOG', `回答錯誤！【Miss!】${missSubject}的 ${spell.name} 魔法未能命中！`);
      eventBus.emit('BATTLE_SPELL_FIZZLE', { spell });
      setTimeout(() => {
        this.nextTurn();
      }, 1500);
    }
  }

  executeSpellAttack(spell, attacker = 'player') {
    // Canonical Elemental calculation
    let mult = 1.0;
    if (spell.element === this.monster.weakness) {
      mult = 1.5;
    } else if (spell.element === this.monster.resistance) {
      mult = 0.75;
    }

    let baseDmg = 0;
    let logMsg = '';

    if (attacker === 'pet') {
      const castingPet = (spell.petId && this.activePets)
        ? (this.activePets.find(p => p.id === spell.petId) || this.activePet)
        : this.activePet;

      if (castingPet) {
        // Pet attack incorporates Pet Attack Stat + Spell Power
        const petAtk = castingPet.attack || 12;
        baseDmg = spell.power + Math.floor(petAtk * 0.95);
        const totalDmg = Math.round(baseDmg * mult);
        this.monster.hp = Math.max(0, this.monster.hp - totalDmg);

        logMsg = mult > 1.0
          ? `💥 屬性克制！🐾 守護精靈【${castingPet.name}】的【${spell.name}】命中弱點！造成 ${totalDmg} 點暴擊傷害！`
          : `🐾 守護精靈【${castingPet.name}】挺身而出！發動了【${spell.name}】，造成了 ${totalDmg} 點傷害！`;

        eventBus.emit('BATTLE_LOG', logMsg);
        if (mult > 1.0) {
          eventBus.emit('BATTLE_CRITICAL_HIT', { spell, damage: totalDmg });
        }
        eventBus.emit('BATTLE_DAMAGE_DEALT', {
          attacker: 'pet',
          target: 'monster',
          damage: totalDmg,
          isCrit: mult > 1.0,
          monsterHp: this.monster.hp,
          monsterMaxHp: this.monster.maxHp,
          petName: castingPet.name,
          petId: castingPet.id
        });
      }
    } else {
      let totalDmg = 0;
      if (spell.id === 'frogify') {
        this.monster.isFrogified = true;
        this.monster.frogifyTurns = 2;
        if (!this.monster.originalName) this.monster.originalName = this.monster.name;
        this.monster.name = `呱呱叫青蛙 (${this.monster.originalName})`;
        totalDmg = 12;
        this.monster.hp = Math.max(0, this.monster.hp - totalDmg);
        eventBus.emit('BATTLE_LOG', `🐸 惡作劇大成功！【${this.monster.originalName}】被變成了戴巫師帽的呱呱叫小青蛙！攻擊力驟降為 1 點！`);
        eventBus.emit('SHOW_TOAST', {
          icon: '🐸',
          title: '變身小青蛙！',
          text: `${this.monster.originalName} 變成青蛙呱呱叫！`
        });
        eventBus.emit('BATTLE_MONSTER_FROGIFIED', { turns: 2 });
      } else {
        baseDmg = spell.power + Math.floor(this.gameState.attack * 0.8);
        totalDmg = Math.round(baseDmg * mult);
        this.monster.hp = Math.max(0, this.monster.hp - totalDmg);

        logMsg = mult > 1.0
          ? `💥 屬性克制！【${spell.name}】命中弱點！造成 ${totalDmg} 點暴擊傷害！`
          : `✨ 【${spell.name}】命中！對 ${this.monster.name} 造成了 ${totalDmg} 點傷害！`;

        eventBus.emit('BATTLE_LOG', logMsg);
        if (mult > 1.0) {
          eventBus.emit('BATTLE_CRITICAL_HIT', { spell, damage: totalDmg });
        }
      }
      eventBus.emit('BATTLE_DAMAGE_DEALT', {
        attacker: 'player',
        target: 'monster',
        damage: totalDmg,
        isCrit: mult > 1.0,
        monsterHp: this.monster.hp,
        monsterMaxHp: this.monster.maxHp
      });
    }

    if (this.monster.isTutorialMentor) {
      setTimeout(() => {
        eventBus.emit('BATTLE_LOG', 'Theo Addiwise: "Fantastic spell casting! You are a natural wizard!"');
        this.handleVictory();
      }, 1200);
      return;
    }

    if (this.monster.hp <= 0) {
      setTimeout(() => this.handleVictory(), 1200);
    } else {
      setTimeout(() => this.nextTurn(), 1500);
    }
  }

  calculateXpMultipliers(baseXp, isRescue = false) {
    let multiplier = 1.0;
    let bonusReasons = [];

    // 1. Rescue Double XP Bonus (Encourages Pet Collection!)
    if (isRescue) {
      multiplier *= 2.0;
      bonusReasons.push('💖 成功拯救淨化 (XP x2.0)');
    }

    // 2. Win Streak Bonus (Up to +75% XP)
    const streak = this.gameState.winStreak || 0;
    if (streak > 0) {
      const streakBonus = Math.min(0.75, streak * 0.15);
      multiplier *= (1.0 + streakBonus);
      bonusReasons.push(`🔥 連勝 ${streak} 場 (+${Math.round(streakBonus * 100)}%)`);
    }

    // 3. XP Elixir Booster (from Town Shop)
    if (this.gameState.xpBoostBattles > 0) {
      multiplier *= 2.0;
      this.gameState.xpBoostBattles = Math.max(0, this.gameState.xpBoostBattles - 1);
      bonusReasons.push('🧪 雙倍經驗魔藥效果 (XP x2.0)');
    }

    // 4. Flawless Victory Bonus (No damage taken during this encounter)
    if ((this.playerDamageTaken || 0) === 0) {
      multiplier *= 1.25;
      bonusReasons.push('🛡️ 完美無傷通關 (+25%)');
    }

    // 5. Underdog Level Bonus (Higher monster level than player)
    const monsterLvl = this.monster?.level || 1;
    const playerLvl = this.gameState?.level || 1;
    if (monsterLvl > playerLvl) {
      const diff = Math.min(3, monsterLvl - playerLvl);
      const underdogBonus = diff * 0.15;
      multiplier *= (1.0 + underdogBonus);
      bonusReasons.push(`⚡ 越級挑戰 Lv.${monsterLvl} (+${Math.round(underdogBonus * 100)}%)`);
    }

    const finalXp = Math.round(baseXp * multiplier);
    return { finalXp, bonusReasons };
  }

  handleRescueSuccess() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.winStreak = (this.gameState.winStreak || 0) + 1;
    this.gameState.progressBounty('monster_rescue', 1);

    const isNewPet = !this.gameState.pets.some(p => p.id === this.monster.id);
    this.gameState.addPet(this.monster);

    const rawXp = (this.monster.rewards?.xp || 30) + 20;
    const { finalXp, bonusReasons } = this.calculateXpMultipliers(rawXp, true);
    const rescueGold = (this.monster.rewards?.gold || 20) + 25;

    this.gameState.addXp(finalXp);
    this.gameState.addGold(rescueGold);

    let petReward = null;
    if (this.activePets && this.activePets.length) {
      this.activePets.forEach(pet => {
        const r = this.gameState.addPetXp(pet.id, finalXp);
        pet.hp = pet.maxHp;
        pet.isFainted = false;
        if (!petReward || r?.leveledUp) petReward = r;
      });
    } else if (this.activePet) {
      petReward = this.gameState.addPetXp(this.activePet.id, finalXp);
      this.activePet.hp = this.activePet.maxHp;
      this.activePet.isFainted = false;
    }

    const bonusMsg = bonusReasons.length > 0 ? ` [${bonusReasons.join(', ')}]` : '';
    eventBus.emit('BATTLE_LOG', `🎉 成功拯救！暗影魔力被淨化，${this.monster.name} 加入了你的寵物隊伍！獲得 +${finalXp} XP${bonusMsg}！`);

    setTimeout(() => {
      eventBus.emit('BATTLE_RESCUE_VICTORY', {
        monster: this.monster,
        isNewPet,
        bonusReasons,
        rewards: {
          xp: finalXp,
          gold: rescueGold,
          petXp: finalXp,
          activePet: this.activePet,
          petLeveledUp: petReward?.leveledUp || false,
          canEvolve: petReward?.canEvolve || false
        }
      });
    }, 1000);
  }

  nextTurn() {
    this.isPlayerTurn = false;
    this.isBusy = true;
    this.turnInProgress = true;
    this.pendingAction = null;
    this.executeMonsterTurn();
  }

  executeMonsterTurn() {
    eventBus.emit('BATTLE_MONSTER_TURN', { monster: this.monster });
    eventBus.emit('BATTLE_LOG', `${this.monster.name} 正在積聚暗影法力...`);

    setTimeout(() => {
      // Frogified Prank Behavior
      if (this.monster.isFrogified) {
        this.monster.frogifyTurns--;
        const damage = 1;
        this.gameState.takeDamage(damage);
        eventBus.emit('BATTLE_LOG', `🐸 呱呱小青蛙跳了一下，吐出一朵小肥皂泡泡！(造成 1 點傷害！Ribbit~)`);
        eventBus.emit('BATTLE_DAMAGE_DEALT', {
          attacker: 'monster',
          target: 'player',
          damage,
          playerHp: this.gameState.hp,
          playerMaxHp: this.gameState.maxHp
        });

        if (this.monster.frogifyTurns <= 0) {
          this.monster.isFrogified = false;
          this.monster.name = this.monster.originalName || this.monster.name;
          eventBus.emit('BATTLE_LOG', `✨ 惡作劇魔法失效！小青蛙變回了兇猛的【${this.monster.name}】！`);
        }

        setTimeout(() => {
          this.isPlayerTurn = true;
          this.isBusy = false;
          this.turnInProgress = false;
          eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術或精靈招式)');
          eventBus.emit('BATTLE_PLAYER_TURN');
        }, 1300);
        return;
      }

      const skills = this.monster.skills || [{ name: '暗影撞擊', power: 12, text: '發動了猛烈衝擊！' }];
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const damage = skill.power + Math.floor(Math.random() * 4);

      // Monster targeting decision: 40% targets active pet (if not fainted), 60% targets wizard
      let target = 'player';
      if (this.activePet && !this.activePet.isFainted && this.activePet.hp > 0) {
        target = Math.random() < 0.40 ? 'pet' : 'player';
      }

      if (target === 'pet' && this.activePet) {
        // Monster attacks companion pet
        this.activePet.hp = Math.max(0, this.activePet.hp - damage);
        if (this.activePet.hp <= 0) {
          this.activePet.isFainted = true;
          eventBus.emit('BATTLE_LOG', `💥 ${skill.text} 造成了 ${damage} 點傷害！🐾 你的守護精靈 ${this.activePet.name} 體力不支倒下了！接下來怪獸將直接攻擊巫師！`);
        } else {
          eventBus.emit('BATTLE_LOG', `🛡️ 守護精靈 ${this.activePet.name} 挺身守護！承受了 ${damage} 點傷害！(精靈剩餘 HP: ${this.activePet.hp}/${this.activePet.maxHp})`);
        }

        eventBus.emit('BATTLE_DAMAGE_DEALT', {
          attacker: 'monster',
          target: 'pet',
          damage,
          petHp: this.activePet.hp,
          petMaxHp: this.activePet.maxHp,
          isFainted: this.activePet.isFainted
        });
        eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());

        setTimeout(() => {
          this.isPlayerTurn = true;
          this.isBusy = false;
          this.turnInProgress = false;
          eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術或精靈招式)');
          eventBus.emit('BATTLE_PLAYER_TURN');
        }, 1300);
      } else {
        // Monster attacks wizard
        this.playerDamageTaken = (this.playerDamageTaken || 0) + damage;
        this.gameState.takeDamage(damage);
        eventBus.emit('BATTLE_LOG', `${skill.text} 造成了 ${damage} 點傷害！`);
        eventBus.emit('BATTLE_DAMAGE_DEALT', {
          attacker: 'monster',
          target: 'player',
          damage,
          playerHp: this.gameState.hp,
          playerMaxHp: this.gameState.maxHp
        });

        if (this.gameState.hp <= 0) {
          setTimeout(() => this.handleDefeat(), 1400);
        } else {
          setTimeout(() => {
            this.isPlayerTurn = true;
            this.isBusy = false;
            this.turnInProgress = false;
            eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術或精靈招式)');
            eventBus.emit('BATTLE_PLAYER_TURN');
          }, 1200);
        }
      }
    }, 1200);
  }

  handleVictory() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.winStreak = (this.gameState.winStreak || 0) + 1;
    this.gameState.progressBounty('monster_defeat', 1);

    const rawRewards = this.monster.rewards || { xp: 40, gold: 25 };
    const { finalXp, bonusReasons } = this.calculateXpMultipliers(rawRewards.xp, false);
    
    this.gameState.addXp(finalXp);
    this.gameState.addGold(rawRewards.gold);

    let petReward = null;
    if (this.activePets && this.activePets.length) {
      this.activePets.forEach(pet => {
        const r = this.gameState.addPetXp(pet.id, finalXp);
        pet.hp = pet.maxHp;
        pet.isFainted = false;
        if (!petReward || r?.leveledUp) petReward = r;
      });
    } else if (this.activePet) {
      petReward = this.gameState.addPetXp(this.activePet.id, finalXp);
      this.activePet.hp = this.activePet.maxHp;
      this.activePet.isFainted = false;
    }

    eventBus.emit('BATTLE_VICTORY', {
      monster: this.monster,
      bonusReasons,
      rewards: {
        xp: finalXp,
        gold: rawRewards.gold,
        petXp: finalXp,
        activePet: this.activePet,
        petLeveledUp: petReward?.leveledUp || false,
        canEvolve: petReward?.canEvolve || false
      }
    });
  }

  handleDefeat() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.winStreak = 0; // Reset streak on loss
    this.gameState.revive();
    if (this.activePet) {
      this.activePet.hp = this.activePet.maxHp;
      this.activePet.isFainted = false;
    }
    eventBus.emit('BATTLE_DEFEAT');
  }

  flee() {
    if (!this.isPlayerTurn || this.isBusy) return;
    this.isBusy = true;
    eventBus.emit('BATTLE_LOG', '🏃 你迅速施展煙霧法術，成功脫離了戰鬥！');
    setTimeout(() => {
      eventBus.emit('RETURN_TO_WORLD');
    }, 600);
  }
}
