// BattleEngine.js - Faithful Canonical Prodigy Math Game Turn Coordinator
import { eventBus } from '../core/EventBus.js';
import { SPELLS } from './Spells.js';

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
    this.pendingAction = null; // { type: 'spell' | 'rescue', spell?: object }
    // Initialize battle energy
    this.gameState.energy = 1;

    this.onMathCancelled = () => {
      this.isBusy = false;
      this.turnInProgress = false;
      this.pendingAction = null;
      this.isPlayerTurn = true;
      eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術)');
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
      player: this.gameState.getSnapshot()
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

    // Instant Health Potion Consumption (Bag item, no math gate needed)
    if (spell.id === 'potion') {
      if (this.gameState.hp >= this.gameState.maxHp) {
        eventBus.emit('BATTLE_LOG', '❤️ 生命值已全滿，無需飲用生命藥水！');
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
      eventBus.emit('BATTLE_LOG', `🧪 你飲用了【${spell.name}】，恢復了 ${healAmount} 點生命值！剩餘藥水：${this.gameState.potionsCount} 瓶`);
      eventBus.emit('BATTLE_PLAYER_HEAL', { amount: healAmount });
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
    this.pendingAction = { type: 'spell', spell };
    eventBus.emit('REQUEST_MATH_QUESTION', {
      spell,
      grade: this.gameState.grade || 1,
      realm: this.gameState.currentRealm || 'firefly_forest'
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
      realm: this.gameState.currentRealm || 'firefly_forest'
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
    if (isCorrect) {
      this.gameState.progressBounty('math_correct', 1);
      // Award +1 Energy on correct answer (up to 5)
      this.gameState.energy = Math.min(this.gameState.maxEnergy, this.gameState.energy + 1 - (spell.energyCost || 0));
      eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
      this.executePlayerSpell(spell);
    } else {
      eventBus.emit('BATTLE_LOG', `回答錯誤！【Miss!】${spell.name} 魔法未能命中！`);
      eventBus.emit('BATTLE_SPELL_FIZZLE', { spell });
      setTimeout(() => {
        this.nextTurn();
      }, 1500);
    }
  }

  executePlayerSpell(spell) {
    if (spell.healAmount) {
      if (this.gameState.potionsCount <= 0) {
        eventBus.emit('BATTLE_LOG', '🎒 背包中的生命藥水已經用盡！');
        this.isBusy = false;
        this.turnInProgress = false;
        return;
      }
      this.gameState.potionsCount = Math.max(0, this.gameState.potionsCount - 1);
      this.gameState.heal(spell.healAmount);
      eventBus.emit('BATTLE_LOG', `你飲用了【${spell.name}】，恢復了 ${spell.healAmount} 點生命值（Hearts）！剩餘藥水：${this.gameState.potionsCount} 瓶`);
      eventBus.emit('BATTLE_PLAYER_HEAL', { amount: spell.healAmount });
      eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
      setTimeout(() => this.nextTurn(), 1200);
      return;
    }

    // Canonical Elemental calculation
    let mult = 1.0;
    if (spell.element === this.monster.weakness) {
      mult = 1.5;
    } else if (spell.element === this.monster.resistance) {
      mult = 0.75;
    }

    const baseDmg = spell.power + Math.floor(this.gameState.attack * 0.8);
    const totalDmg = Math.round(baseDmg * mult);
    this.monster.hp = Math.max(0, this.monster.hp - totalDmg);

    const logMsg = mult > 1.0 
      ? `💥 屬性克制！【${spell.name}】命中弱點！造成 ${totalDmg} 點暴擊傷害！`
      : `✨ 【${spell.name}】命中！對 ${this.monster.name} 造成了 ${totalDmg} 點傷害！`;

    eventBus.emit('BATTLE_LOG', logMsg);
    if (mult > 1.0) {
      eventBus.emit('BATTLE_CRITICAL_HIT', { spell, damage: totalDmg });
    }
    eventBus.emit('BATTLE_DAMAGE_DEALT', {
      target: 'monster',
      damage: totalDmg,
      isCrit: mult > 1.0,
      monsterHp: this.monster.hp,
      monsterMaxHp: this.monster.maxHp
    });

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

  handleRescueSuccess() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.progressBounty('monster_rescue', 1);
    this.gameState.addPet(this.monster);
    const rescueRewards = {
      xp: (this.monster.rewards?.xp || 30) + 20,
      gold: (this.monster.rewards?.gold || 20) + 15
    };
    this.gameState.addXp(rescueRewards.xp);
    this.gameState.addGold(rescueRewards.gold);

    let petReward = null;
    const activePet = this.gameState.getActivePet();
    if (activePet) {
      petReward = this.gameState.addPetXp(activePet.id, rescueRewards.xp);
    }

    eventBus.emit('BATTLE_LOG', `🎉 成功拯救！暗影魔力被淨化，${this.monster.name} 加入了你的寵物隊伍！`);
    setTimeout(() => {
      eventBus.emit('BATTLE_RESCUE_VICTORY', {
        monster: this.monster,
        rewards: {
          ...rescueRewards,
          petXp: rescueRewards.xp,
          activePet: activePet,
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
      const skills = this.monster.skills || [{ name: '暗影撞擊', power: 12, text: '發動了猛烈衝擊！' }];
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const damage = skill.power + Math.floor(Math.random() * 4);

      this.gameState.takeDamage(damage);
      eventBus.emit('BATTLE_LOG', `${skill.text} 造成了 ${damage} 點傷害！`);
      eventBus.emit('BATTLE_DAMAGE_DEALT', {
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
          eventBus.emit('BATTLE_LOG', 'Choose a spell to cast. (請選擇你要施放的法術)');
          eventBus.emit('BATTLE_PLAYER_TURN');
        }, 1200);
      }
    }, 1200);
  }

  handleVictory() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.progressBounty('monster_defeat', 1);
    const rewards = this.monster.rewards || { xp: 40, gold: 25 };
    this.gameState.addXp(rewards.xp);
    this.gameState.addGold(rewards.gold);

    let petReward = null;
    const activePet = this.gameState.getActivePet();
    if (activePet) {
      petReward = this.gameState.addPetXp(activePet.id, rewards.xp);
    }

    eventBus.emit('BATTLE_VICTORY', {
      monster: this.monster,
      rewards: {
        ...rewards,
        petXp: rewards.xp,
        activePet: activePet,
        petLeveledUp: petReward?.leveledUp || false,
        canEvolve: petReward?.canEvolve || false
      }
    });
  }

  handleDefeat() {
    this.isBusy = false;
    this.turnInProgress = false;
    this.gameState.revive();
    eventBus.emit('BATTLE_DEFEAT');
  }
}
