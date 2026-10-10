// PetBookModal.js - Official Canon Prodigy 5-Element Pet Book (精靈圖鑑)
import { eventBus } from '../core/EventBus.js';
import { CANON_MONSTERS } from '../battle/CanonDatabase.js';

export const MONSTER_HABITATS = {
  // Fire
  hotpot: '螢火蟲森林 (Firefly Forest)',
  magmay: '篝火火山峰 (Bonfire Spire)',
  pyropup: '篝火火山峰 • 黑曜石山道',
  sparkpudding: '篝火火山峰 • 熔火之巔 (Boss)',
  ember_fox: '螢火蟲森林 • 螢火古樹 (Boss)',
  charfoal: '篝火火山峰 • 熾熱峽谷',
  burnie: '篝火火山峰 • 火山口晚霞',
  cinderkat: '篝火火山峰 • 熔岩暖穴',

  // Water
  squiddle: '海難海岸 (Shipwreck Shore)',
  fishbol: '海難海岸 • 珊瑚暗礁',
  triptrop: '海難海岸 • 金色沙灘',
  diveosaur: '海難海岸 • 潮汐祭壇 (Boss)',
  aquafox: '海難海岸 • 潮間帶淺灘',
  crabbot: '海難海岸 • 古代沉船遺跡',
  starfin: '海難海岸 • 蔚藍海灣',

  // Earth
  peeko: '螢火蟲森林 (Firefly Forest)',
  floraflare: '螢火蟲森林 • 繁花古樹',
  sprout: '螢火蟲森林 • 綠意草甸',
  mossy: '螢火蟲森林 • 巨石青苔林',
  woodling: '螢火蟲森林 • 守護者森林神壇',

  // Ice
  snoot: '寒顫雪山 (Shiverchill Mountains)',
  chillwing: '寒顫雪山 • 冰雪懸崖',
  ice_elemental: '寒顫雪山 • 冰晶王座 (Boss)',
  frostfang: '寒顫雪山 • 極寒冰川谷',
  snowfluff: '寒顫雪山 • 霜凍松林',
  polarcub: '寒顫雪山 • 冰晶山洞',

  // Storm
  cloudling: '浮空風暴城 (Skywatch)',
  stormcloud: '浮空風暴城 • 雲端雷陣',
  galehound: '浮空風暴城 • 風暴殿堂 (Boss)',
  electromite: '浮空風暴城 • 浮空外圍',
  zapzap: '浮空風暴城 • 雷光雲海',
  windcherub: '浮空風暴城 • 天空聖殿',
  volts: '浮空風暴城 • 雷霆要塞'
};

export class PetBookModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('pet-book-modal');
    this.gridEl = document.getElementById('pet-book-grid');
    this.counterEl = document.getElementById('pet-book-counter');
    this.tabsBarEl = document.getElementById('pet-book-tabs');
    this.closeBtn = document.getElementById('btn-close-pet-book');

    this.currentFilter = 'all';

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_PET_BOOK', () => this.open());

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.tabsBarEl) {
      this.tabsBarEl.addEventListener('click', (e) => {
        const tab = e.target.closest('.pet-book-tab');
        if (!tab) return;
        this.currentFilter = tab.dataset.element || 'all';

        this.tabsBarEl.querySelectorAll('.pet-book-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.renderGrid();
      });
    }

    eventBus.on('PLAYER_STATS_CHANGED', () => {
      if (this.modalEl && !this.modalEl.classList.contains('hidden')) {
        this.renderGrid();
      }
    });
  }

  open() {
    this.renderGrid();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  renderGrid() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    const snap = this.gameState.getSnapshot();
    const ownedPetIds = new Set(snap.pets.map(p => p.id));
    const allMonsters = Object.values(CANON_MONSTERS).filter(m => !m.isTutorialMentor);

    // Update counter
    if (this.counterEl) {
      this.counterEl.textContent = `🐾 已收服精靈：${ownedPetIds.size} / ${allMonsters.length}`;
    }

    // Filter by element
    const filtered = allMonsters.filter(m => {
      if (this.currentFilter === 'all') return true;
      return m.element === this.currentFilter;
    });

    filtered.forEach(monster => {
      const isOwned = ownedPetIds.has(monster.id);
      const habitat = MONSTER_HABITATS[monster.id] || monster.habitat || '神秘荒野';
      const familyBadge = monster.familyName ? ` • ${monster.familyName}` : '';
      const card = document.createElement('div');
      card.className = `pet-dex-card dex-card ${isOwned ? 'unlocked' : 'locked'}`;

      if (isOwned) {
        const activeIds = snap.activePetIds || [snap.activePetId].filter(Boolean);
        const isSlot1 = activeIds[0] === monster.id;
        const isSlot2 = activeIds[1] === monster.id;
        const isFollower = isSlot1 || isSlot2;
        const followLabel = isSlot1 ? '🐾 1號夥伴' : (isSlot2 ? '🐾 2號夥伴' : '召喚同行');

        card.innerHTML = `
          <div class="dex-avatar-wrap">
            <img src="${monster.sprite}" alt="${monster.name}" class="dex-sprite-img" loading="lazy">
          </div>
          <div class="dex-badge element-badge-${monster.element}">${this.getElementLabel(monster.element)}${familyBadge}</div>
          <h4 class="dex-pet-name">${monster.name}</h4>
          <div class="dex-stats-row">
            <span>❤️ 生命: ${monster.maxHp}</span>
            <span>⚡ 攻擊: ${monster.attack}</span>
          </div>
          <div class="dex-affinity-row">
            <span class="affinity-pill weak">弱點: ${this.getElementLabel(monster.weakness)}</span>
            <span class="affinity-pill res">抵抗: ${this.getElementLabel(monster.resistance)}</span>
          </div>
          <div class="dex-actions-row" style="display: flex; gap: 4px; margin-top: 6px;">
            <button class="channel-magic-btn btn-dex-follow ${isFollower ? 'active' : ''}" data-id="${monster.id}" style="flex: 1; padding: 4px 6px; font-size: 11px;">
              ${followLabel}
            </button>
            ${this.gameState.canEvolvePet(monster.id) ? `
              <button class="channel-magic-btn btn-dex-evolve" data-id="${monster.id}" style="background: linear-gradient(135deg, #e67e22, #f39c12); border-color: #d35400; flex: 1; padding: 4px 6px; font-size: 11px;">
                ✨ 進化
              </button>
            ` : ''}
          </div>
        `;

        const btnFollow = card.querySelector('.btn-dex-follow');
        if (btnFollow) {
          btnFollow.addEventListener('click', () => {
            if (this.gameState.toggleActivePet) {
              this.gameState.toggleActivePet(monster.id);
            } else {
              this.gameState.setActivePet(monster.id);
            }
            this.renderGrid();
          });
        }

        const btnEvolve = card.querySelector('.btn-dex-evolve');
        if (btnEvolve) {
          btnEvolve.addEventListener('click', () => {
            eventBus.emit('TRIGGER_PET_EVOLUTION', {
              petId: monster.id,
              onComplete: () => this.renderGrid()
            });
          });
        }
      } else {
        // Locked Silhouette
        card.innerHTML = `
          <div class="dex-avatar-wrap silhouette">
            <img src="${monster.sprite}" alt="???" class="dex-sprite-img silhouette-img" loading="lazy">
          </div>
          <div class="dex-badge locked-badge">🔒 未解鎖${familyBadge}</div>
          <h4 class="dex-pet-name locked-name">??? (暗影未淨化)</h4>
          <p class="dex-clue-text">📍 出沒地帶：<br><strong>${habitat}</strong></p>
          <div class="dex-hint-tag">在冒險戰鬥中將體力削弱至45%後使用【💖 Rescue】淨化</div>
        `;
      }

      this.gridEl.appendChild(card);
    });
  }

  getElementLabel(elem) {
    const map = {
      fire: '🔥 烈焰',
      water: '💧 水流',
      earth: '🌱 大地',
      ice: '❄️ 冰霜',
      storm: '⚡ 風暴',
      astral: '✨ 奧術'
    };
    return map[elem] || elem;
  }
}
