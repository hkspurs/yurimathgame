// HUD.js - Manages the player HUD overlay (level, hp, xp, currency)
import { eventBus } from '../core/EventBus.js';

export class HUD {
  constructor(gameState) {
    this.gameState = gameState;

    this.levelEl = document.getElementById('hud-level');
    this.hpBarEl = document.getElementById('hud-hp-bar');
    this.hpTextEl = document.getElementById('hud-hp-text');
    this.xpBarEl = document.getElementById('hud-xp-bar');
    this.xpTextEl = document.getElementById('hud-xp-text');
    this.goldEl = document.getElementById('hud-gold');
    this.starsEl = document.getElementById('hud-stars');
    this.soundBtn = document.getElementById('btn-sound');
    this.modeBadgeEl = document.getElementById('hud-mode-badge');
    this.modeBadgeIconEl = document.getElementById('mode-badge-icon');
    this.modeBadgeTextEl = document.getElementById('mode-badge-text');

    this.update(gameState.getSnapshot());
    this.bindEvents();
  }

  update(stats) {
    if (this.levelEl) this.levelEl.textContent = `Lv.${stats.level}`;
    if (this.hpBarEl) {
      const hpPct = Math.max(0, Math.min(100, (stats.hp / stats.maxHp) * 100));
      this.hpBarEl.style.width = `${hpPct}%`;
    }
    if (this.hpTextEl) this.hpTextEl.textContent = `${stats.hp} / ${stats.maxHp}`;
    if (this.xpBarEl) {
      const xpPct = Math.max(0, Math.min(100, (stats.xp / stats.xpToNext) * 100));
      this.xpBarEl.style.width = `${xpPct}%`;
    }
    if (this.xpTextEl) this.xpTextEl.textContent = `XP ${stats.xp} / ${stats.xpToNext}`;
    if (this.goldEl) this.goldEl.textContent = stats.gold;
    if (this.starsEl) this.starsEl.textContent = stats.stars;

    // Mode Badge (School / Home & Grade)
    if (this.modeBadgeTextEl) {
      const gTag = stats.grade ? ` • G${stats.grade}` : ' • G1';
      if (stats.playLocation === 'school') {
        if (this.modeBadgeIconEl) this.modeBadgeIconEl.textContent = '🏫';
        this.modeBadgeTextEl.textContent = stats.classCode ? `學校 (${stats.classCode}${gTag})` : `在學校${gTag}`;
        if (this.modeBadgeEl) this.modeBadgeEl.className = 'hud-mode-badge mode-school';
      } else {
        if (this.modeBadgeIconEl) this.modeBadgeIconEl.textContent = '🏠';
        this.modeBadgeTextEl.textContent = `在家裡${gTag}`;
        if (this.modeBadgeEl) this.modeBadgeEl.className = 'hud-mode-badge mode-home';
      }
    }

    const avatarEl = document.getElementById('hud-avatar');
    if (avatarEl && stats.avatarSprite) {
      avatarEl.src = stats.avatarSprite;
    }
    const titleEl = document.querySelector('.crest-player-title');
    if (titleEl && stats.name) {
      titleEl.textContent = stats.name;
    }
    if (this.soundBtn && stats.soundEnabled !== undefined) {
      const span = this.soundBtn.querySelector('span');
      if (span) {
        span.textContent = stats.soundEnabled ? '🔊' : '🔇';
      } else {
        this.soundBtn.textContent = stats.soundEnabled ? '🔊' : '🔇';
      }
    }
  }

  bindEvents() {
    if (this.modeBadgeEl) {
      this.modeBadgeEl.addEventListener('click', () => {
        eventBus.emit('OPEN_WHERE_PLAYING');
      });
    }

    eventBus.on('PLAYER_STATS_CHANGED', (stats) => {
      this.update(stats);
    });

    eventBus.on('SHOW_TOAST', (payload) => {
      let msg = '';
      let type = 'info';
      if (typeof payload === 'string') {
        msg = payload;
      } else if (payload && typeof payload === 'object') {
        type = payload.type || 'info';
      }
      if (payload?.message) {
        msg = payload.message;
      } else if (payload && typeof payload === 'object') {
        const parts = [payload.icon, payload.title, payload.text].filter(Boolean);
        msg = parts.join(' ') || '';
      }
      if (msg) {
        this.showToast(msg, type);
      }
    });

    eventBus.on('BOUNTY_COMPLETED', ({ bounty }) => {
      this.showToast(`📜 懸賞達成！【${bounty.title}】可至燈火主城警長布告欄領取賞金！`, 'success');
    });

    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        const icon = this.gameState.soundEnabled ? '🔊' : '🔇';
        const span = this.soundBtn.querySelector('span');
        if (span) span.textContent = icon;
        else this.soundBtn.textContent = icon;
        eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
        this.showToast(this.gameState.soundEnabled ? '🔊 音樂與音效已開啟' : '🔇 遊戲已靜音', 'info');
      });
    }
  }

  showToast(message, type = 'info') {
    let toast = document.getElementById('adventure-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adventure-toast';
      toast.className = 'adventure-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `adventure-toast toast-${type} toast-show`;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 2800);
  }
}
