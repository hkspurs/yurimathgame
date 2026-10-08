// PetEvolutionModal.js - Authentic Prodigy Pet Evolution (精靈進化) Modal
import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

export class PetEvolutionModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('pet-evolution-modal');
    this.beforeSpriteEl = document.getElementById('evo-before-sprite');
    this.beforeNameEl = document.getElementById('evo-before-name');
    this.beforeElemEl = document.getElementById('evo-before-element');
    this.beforeHpEl = document.getElementById('evo-before-hp');
    this.beforeAtkEl = document.getElementById('evo-before-atk');

    this.afterSpriteEl = document.getElementById('evo-after-sprite');
    this.afterNameEl = document.getElementById('evo-after-name');
    this.afterElemEl = document.getElementById('evo-after-element');
    this.afterHpEl = document.getElementById('evo-after-hp');
    this.afterAtkEl = document.getElementById('evo-after-atk');

    this.newSkillNameEl = document.getElementById('evo-new-skill-name');
    this.btnConfirm = document.getElementById('btn-confirm-evolution');

    this.currentEvoData = null;
    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('TRIGGER_PET_EVOLUTION', ({ petId, onComplete }) => {
      this.showEvolution(petId, onComplete);
    });

    if (this.btnConfirm) {
      this.btnConfirm.addEventListener('click', () => {
        this.close();
        if (this.currentEvoData?.onComplete) {
          this.currentEvoData.onComplete();
        }
      });
    }
  }

  showEvolution(petId, onComplete = null) {
    const evoResult = this.gameState.evolvePet(petId);
    if (!evoResult || !evoResult.success) {
      if (onComplete) onComplete();
      return;
    }

    const { oldPet, evolvedPet, nextForm } = evoResult;
    this.currentEvoData = { oldPet, evolvedPet, nextForm, onComplete };

    // Fill Before Data
    if (this.beforeSpriteEl) this.beforeSpriteEl.src = oldPet.sprite;
    if (this.beforeNameEl) this.beforeNameEl.textContent = oldPet.name;
    if (this.beforeElemEl) this.beforeElemEl.textContent = this.formatElement(oldPet.element);
    if (this.beforeHpEl) this.beforeHpEl.textContent = `❤️ HP: ${oldPet.maxHp}`;
    if (this.beforeAtkEl) this.beforeAtkEl.textContent = `⚔️ ATK: ${oldPet.attack}`;

    // Fill After Data
    if (this.afterSpriteEl) this.afterSpriteEl.src = evolvedPet.sprite;
    if (this.afterNameEl) this.afterNameEl.textContent = evolvedPet.name;
    if (this.afterElemEl) this.afterElemEl.textContent = this.formatElement(evolvedPet.element);
    if (this.afterHpEl) this.afterHpEl.textContent = `❤️ HP: ${evolvedPet.maxHp} (+${nextForm.hpBonus || 50})`;
    if (this.afterAtkEl) this.afterAtkEl.textContent = `⚔️ ATK: ${evolvedPet.attack} (+${nextForm.atkBonus || 8})`;

    // New Skill
    if (this.newSkillNameEl) {
      this.newSkillNameEl.textContent = nextForm.newSkill ? `${nextForm.newSkill.name} (威力 +${nextForm.newSkill.power})` : '高階元素共鳴';
    }

    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }

    audioManager.play('fanfare');
    eventBus.emit('SHOW_TOAST', { message: `🌟 你的夥伴精靈已成功進化為 ${evolvedPet.name}！`, type: 'success' });
  }

  formatElement(elem) {
    const map = {
      fire: '🔥 烈焰系 (Fire)',
      water: '💧 水流系 (Water)',
      earth: '🌱 大地系 (Earth)',
      ice: '❄️ 冰霜系 (Ice)',
      storm: '⚡ 風暴系 (Storm)',
      astral: '✨ 奧術系 (Astral)'
    };
    return map[elem] || elem;
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }
}
