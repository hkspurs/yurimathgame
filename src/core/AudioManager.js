// AudioManager.js - Manages CC0 sound effects and music
import { eventBus } from './EventBus.js';

class AudioManager {
  constructor() {
    this.enabled = true;
    this.sounds = {
      coin: new Audio('./assets/cc0/audio/Audio/handleCoins.ogg'),
      book: new Audio('./assets/cc0/audio/Audio/bookOpen.ogg'),
      hit: new Audio('./assets/cc0/audio/Audio/knifeSlice.ogg'),
      click: new Audio('./assets/cc0/audio/Audio/metalClick.ogg'),
      step: new Audio('./assets/cc0/audio/Audio/footstep00.ogg')
    };

    // Preload & lower volume slightly
    Object.values(this.sounds).forEach(a => {
      a.volume = 0.45;
      a.preload = 'auto';
    });

    this.bindEvents();
  }

  play(name) {
    if (!this.enabled) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  bindEvents() {
    eventBus.on('REQUEST_MATH_QUESTION', () => this.play('book'));
    eventBus.on('BATTLE_DAMAGE_DEALT', () => this.play('hit'));
    eventBus.on('BATTLE_VICTORY', () => this.play('coin'));

    // Allow user to toggle sound
    eventBus.on('PLAYER_STATS_CHANGED', (stats) => {
      if (stats.soundEnabled !== undefined) {
        this.enabled = stats.soundEnabled;
      }
    });
  }
}

export const audioManager = new AudioManager();
