// WorldMapModal.js - Multi-World and Stage Selection Overlay
import { eventBus } from '../core/EventBus.js';
import { WORLDS } from '../battle/Worlds.js';

export class WorldMapModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('world-map-modal');
    this.closeBtn = document.getElementById('btn-close-map');
    this.worldContainer = document.getElementById('world-cards-container');
    this.totalStarsBadge = document.getElementById('map-total-stars');

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_WORLD_MAP', () => this.open());
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
  }

  open() {
    this.render();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  render() {
    if (!this.worldContainer) return;
    this.worldContainer.innerHTML = '';

    const currentStars = Math.max(this.gameState.stars || 0, this.gameState.getTotalStars());
    if (this.totalStarsBadge) {
      this.totalStarsBadge.textContent = `⭐ 冒險星數：${currentStars}`;
    }

    WORLDS.forEach(world => {
      if (world.isHub) {
        const card = document.createElement('div');
        card.className = 'world-card hub-card';
        card.innerHTML = `
          <div class="world-card-header" style="border-left: 6px solid ${world.themeColor}">
            <div class="world-title-box">
              <span class="world-icon">${world.bannerIcon}</span>
              <div>
                <h3 class="world-name">${world.name}</h3>
                <div class="world-grade-tag">${world.gradeText}</div>
              </div>
            </div>
            <span class="element-badge" style="background:${world.themeColor}22; color:${world.themeColor}">
              ${world.elementName}
            </span>
          </div>
          <p class="world-desc">${world.desc}</p>
          <div style="margin-top: 10px;">
            <button id="btn-enter-town" class="stage-play-btn" style="width: 100%; padding: 12px; font-size: 15px; background: linear-gradient(135deg, #e056fd, #be2edd);">
              🏛️ 進入燈火主城（布洛克魔法商店 & 每日轉盤）
            </button>
          </div>
        `;
        card.querySelector('#btn-enter-town').addEventListener('click', () => {
          this.close();
          eventBus.emit('OPEN_TOWN_SHOP');
        });
        this.worldContainer.appendChild(card);
        return;
      }

      const isUnlocked = currentStars >= world.requiredStars;
      const card = document.createElement('div');
      card.className = `world-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      let stagesHtml = '';
      if (isUnlocked) {
        stagesHtml = world.stages.map((stg, idx) => {
          const stgInfo = this.gameState.stagesProgress[stg.id] || { stars: 0, cleared: false };
          const starsDisplay = '⭐'.repeat(stgInfo.stars) + '☆'.repeat(3 - stgInfo.stars);

          return `
            <div class="stage-item ${stgInfo.cleared ? 'cleared' : ''}">
              <div class="stage-info">
                <div class="stage-name">${stg.name}</div>
                <div class="stage-sub">${stg.desc}</div>
                <div class="stage-stars">${starsDisplay}</div>
              </div>
              <button class="stage-play-btn" data-world="${world.id}" data-stage="${stg.id}">
                ${stgInfo.cleared ? '再次挑戰 ⚔️' : '進入關卡 🚀'}
              </button>
            </div>
          `;
        }).join('');
      } else {
        stagesHtml = `
          <div class="lock-notice">
            <span class="lock-icon">🔒</span>
            <span>需要累積達到 <strong>${world.requiredStars} 顆 ⭐</strong> 解鎖此區域</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="world-card-header" style="border-left: 6px solid ${world.themeColor}">
          <div class="world-title-box">
            <span class="world-icon">${world.bannerIcon}</span>
            <div>
              <h3 class="world-name">${world.name}</h3>
              <div class="world-grade-tag">${world.gradeText}</div>
            </div>
          </div>
          <span class="element-badge" style="background:${world.themeColor}22; color:${world.themeColor}">
            ${world.elementName}
          </span>
        </div>
        <p class="world-desc">${world.desc}</p>
        ${isUnlocked ? `
          <div style="margin-bottom: 10px;">
            <button class="stage-play-btn realm-travel-btn" data-world="${world.id}" style="width: 100%; padding: 8px 12px; font-size: 13.5px; background: linear-gradient(135deg, ${world.themeColor}, #2f3542);">
              🌍 前往漫遊此王國 (${world.name})
            </button>
          </div>
        ` : ''}
        <div class="world-stages-list">
          ${stagesHtml}
        </div>
      `;

      this.worldContainer.appendChild(card);
    });

    // Bind realm travel click events
    this.worldContainer.querySelectorAll('.realm-travel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const worldId = e.currentTarget.dataset.world;
        this.gameState.setRealm(worldId);
        this.close();
      });
    });

    // Bind stage click events
    this.worldContainer.querySelectorAll('.stage-play-btn:not(.realm-travel-btn)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const worldId = e.currentTarget.dataset.world;
        const stageId = e.currentTarget.dataset.stage;
        this.close();
        eventBus.emit('LAUNCH_STAGE', { worldId, stageId });
      });
    });
  }
}
