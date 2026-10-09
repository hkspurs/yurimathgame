// AudioManager.js - Manages CC0 sound effects and background music
import { eventBus } from './EventBus.js';

export const BGM_TRACKS = {
  flowerbed_fields: './assets/audio/bgm/flowerbed_fields.ogg', // Title / World / Lamplight Town (Zane Little Music)
  forest_theme: './assets/audio/bgm/forest_theme.ogg',         // Firefly Forest (Glizzy Elf Forest - Zane Little Music)
  underwater_theme: './assets/audio/bgm/underwater_theme.ogg', // Shipwreck Shore (Underwater Theme II - Cleyton Kauffman)
  fire_level: './assets/audio/bgm/fire_level.ogg',             // Bonfire Spire (Fire Level - Spring Spring)
  snow_theme: './assets/audio/bgm/snow_theme.ogg',             // Shiverchill Mountains (Snow Theme - Cleyton Kauffman)
  sky_trance: './assets/audio/bgm/sky_trance.ogg',             // Skywatch (Sky Trance - MintoDog)
  battle_wild: './assets/audio/bgm/battle_wild.ogg',           // Wild Monster Battle & Math (Fairy Battles - MintoDog)
  battle_boss: './assets/audio/bgm/battle_boss.ogg',           // Keystone Guardian Boss (Battle RPG Theme - Cleyton Kauffman)
  victory: './assets/audio/bgm/victory.ogg'                    // Pet Rescue / Battle Victory (8-Bit Victory Loop)
};

export const REALM_BGM_MAP = {
  lamplight_town: 'flowerbed_fields',
  firefly_forest: 'forest_theme',
  shipwreck_shore: 'underwater_theme',
  bonfire_spire: 'fire_level',
  shiverchill_mountains: 'snow_theme',
  skywatch: 'sky_trance'
};

class AudioManager {
  constructor() {
    this.enabled = true;
    this.currentRealmId = 'firefly_forest';
    this.currentBgmKey = null;
    this.pendingBgm = null;
    this.isVictoryPlaying = false;
    this.unlocked = false;

    // Dual audio channels for smooth crossfades
    this.channelA = new Audio();
    this.channelB = new Audio();
    this.channelA.preload = 'auto';
    this.channelB.preload = 'auto';
    this.activeChannel = 'A'; // 'A' or 'B'
    this.crossfadeTimer = null;

    // Sound effects
    this.sounds = {
      coin: new Audio('./assets/cc0/audio/Audio/handleCoins.ogg'),
      book: new Audio('./assets/cc0/audio/Audio/bookOpen.ogg'),
      hit: new Audio('./assets/cc0/audio/Audio/knifeSlice.ogg'),
      click: new Audio('./assets/cc0/audio/Audio/metalClick.ogg'),
      step: new Audio('./assets/cc0/audio/Audio/footstep00.ogg'),
      fanfare: new Audio('./assets/audio/bgm/victory.ogg')
    };

    Object.values(this.sounds).forEach(a => {
      a.volume = 0.45;
      a.preload = 'auto';
    });

    this.setupAutoplayUnlock();
    this.bindEvents();
  }

  init(gameState) {
    if (gameState) {
      this.enabled = gameState.soundEnabled ?? true;
      this.currentRealmId = gameState.currentRealm || 'firefly_forest';
      if (this.enabled) {
        this.playRealmBgm(this.currentRealmId);
      }
    }
  }

  setupAutoplayUnlock() {
    const unlockHandler = () => {
      if (this.unlocked) return;
      this.unlocked = true;

      // Unlock dummy audio playback for web browsers
      const silentAudio = this.channelA;
      if (silentAudio && silentAudio.paused) {
        silentAudio.play().then(() => {
          silentAudio.pause();
        }).catch(() => {});
      }

      // If there was a pending track requested before user interaction
      if (this.pendingBgm && this.enabled) {
        const { trackKey, options } = this.pendingBgm;
        this.pendingBgm = null;
        this.playBgm(trackKey, options);
      }

      ['pointerdown', 'keydown', 'touchstart', 'click'].forEach(evt => {
        window.removeEventListener(evt, unlockHandler, { capture: true });
      });
    };

    ['pointerdown', 'keydown', 'touchstart', 'click'].forEach(evt => {
      window.addEventListener(evt, unlockHandler, { capture: true, once: false });
    });
  }

  getActiveAudio() {
    return this.activeChannel === 'A' ? this.channelA : this.channelB;
  }

  getInactiveAudio() {
    return this.activeChannel === 'A' ? this.channelB : this.channelA;
  }

  play(name) {
    if (!this.enabled) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  playBgm(trackKey, options = {}) {
    const {
      loop = true,
      volume = 0.25,
      fadeDuration = 600,
      forceRestart = false
    } = options;

    if (!BGM_TRACKS[trackKey]) {
      console.warn(`[AudioManager] Track not found: ${trackKey}`);
      return;
    }

    // If disabled, just update currentBgmKey so it resumes when unmuted
    if (!this.enabled) {
      this.currentBgmKey = trackKey;
      return;
    }

    // If already playing this track smoothly and not forced to restart
    const active = this.getActiveAudio();
    if (!forceRestart && this.currentBgmKey === trackKey && !active.paused && active.src.includes(trackKey)) {
      active.volume = volume;
      return;
    }

    // If user hasn't interacted with document yet, queue pending BGM
    if (!this.unlocked) {
      this.pendingBgm = { trackKey, options };
      this.currentBgmKey = trackKey;
      return;
    }

    this.currentBgmKey = trackKey;
    const incoming = this.getInactiveAudio();
    const outgoing = this.getActiveAudio();
    this.activeChannel = (this.activeChannel === 'A' ? 'B' : 'A');

    if (this.crossfadeTimer) {
      clearInterval(this.crossfadeTimer);
      this.crossfadeTimer = null;
    }

    incoming.src = BGM_TRACKS[trackKey];
    incoming.loop = loop;
    incoming.volume = 0;

    const playPromise = incoming.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        const steps = 15;
        const intervalMs = Math.max(20, Math.floor(fadeDuration / steps));
        const outInitialVol = outgoing.paused ? 0 : outgoing.volume;
        let step = 0;

        this.crossfadeTimer = setInterval(() => {
          step++;
          const progress = Math.min(1, step / steps);
          if (outgoing && !outgoing.paused) {
            outgoing.volume = Math.max(0, outInitialVol * (1 - progress));
          }
          if (incoming) {
            incoming.volume = Math.min(volume, volume * progress);
          }

          if (progress >= 1) {
            clearInterval(this.crossfadeTimer);
            this.crossfadeTimer = null;
            if (outgoing) {
              outgoing.pause();
              outgoing.currentTime = 0;
            }
          }
        }, intervalMs);
      }).catch(() => {
        // In case autoplay is still blocked
        this.pendingBgm = { trackKey, options };
      });
    }
  }

  playRealmBgm(realmId) {
    this.currentRealmId = realmId || this.currentRealmId || 'firefly_forest';
    this.isVictoryPlaying = false;
    const trackKey = REALM_BGM_MAP[this.currentRealmId] || 'flowerbed_fields';
    this.playBgm(trackKey, { loop: true, volume: 0.25, fadeDuration: 650 });
  }

  playBattleBgm(isBoss = false) {
    this.isVictoryPlaying = false;
    const trackKey = isBoss ? 'battle_boss' : 'battle_wild';
    const volume = isBoss ? 0.30 : 0.28;
    this.playBgm(trackKey, { loop: true, volume, fadeDuration: 500 });
  }

  playVictoryFanfare(onComplete) {
    this.isVictoryPlaying = true;
    this.playBgm('victory', { loop: false, volume: 0.35, fadeDuration: 300, forceRestart: true });

    const active = this.getActiveAudio();
    if (active) {
      const handleEnded = () => {
        active.removeEventListener('ended', handleEnded);
        if (this.isVictoryPlaying) {
          this.isVictoryPlaying = false;
          if (typeof onComplete === 'function') {
            onComplete();
          } else {
            this.playRealmBgm(this.currentRealmId);
          }
        }
      };
      active.addEventListener('ended', handleEnded, { once: true });
    }
  }

  stopBgm(fadeDuration = 400) {
    const active = this.getActiveAudio();
    if (this.crossfadeTimer) {
      clearInterval(this.crossfadeTimer);
      this.crossfadeTimer = null;
    }
    if (!active || active.paused) {
      this.currentBgmKey = null;
      return;
    }

    const initialVol = active.volume;
    const steps = 10;
    const intervalMs = Math.floor(fadeDuration / steps);
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(1, step / steps);
      active.volume = Math.max(0, initialVol * (1 - progress));
      if (progress >= 1) {
        clearInterval(timer);
        active.pause();
        active.currentTime = 0;
        this.currentBgmKey = null;
      }
    }, intervalMs);
  }

  get isMuted() {
    return !this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    if (!this.enabled) {
      if (this.crossfadeTimer) {
        clearInterval(this.crossfadeTimer);
        this.crossfadeTimer = null;
      }
      this.channelA.pause();
      this.channelB.pause();
    } else {
      // Resume current or realm BGM
      const trackToPlay = this.currentBgmKey || REALM_BGM_MAP[this.currentRealmId] || 'flowerbed_fields';
      this.playBgm(trackToPlay, { loop: true, volume: 0.25, fadeDuration: 400 });
    }
  }

  toggleSound() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  bindEvents() {
    // Sound effects on game events
    eventBus.on('REQUEST_MATH_QUESTION', () => this.play('book'));
    eventBus.on('BATTLE_DAMAGE_DEALT', () => this.play('hit'));
    eventBus.on('BATTLE_CRITICAL_HIT', () => this.play('hit'));

    // Exploration Realm change
    eventBus.on('REALM_CHANGED', ({ realmId }) => {
      if (realmId) {
        this.playRealmBgm(realmId);
      }
    });

    // Battle start trigger
    eventBus.on('BATTLE_STARTED', ({ monster }) => {
      const isBoss = !!(monster?.isBoss || (monster && monster.id && monster.id.includes('boss')));
      this.playBattleBgm(isBoss);
    });

    // Battle victory and rescue
    eventBus.on('BATTLE_VICTORY', () => {
      this.playVictoryFanfare();
    });

    eventBus.on('BATTLE_RESCUE_VICTORY', () => {
      this.playVictoryFanfare();
    });

    eventBus.on('BATTLE_DEFEAT', () => {
      this.stopBgm(300);
    });

    // Return to World Overworld
    eventBus.on('RETURN_TO_WORLD', () => {
      this.playRealmBgm(this.currentRealmId);
    });

    // Allow user to toggle sound via player stats
    eventBus.on('PLAYER_STATS_CHANGED', (stats) => {
      if (stats.soundEnabled !== undefined && stats.soundEnabled !== this.enabled) {
        this.setEnabled(stats.soundEnabled);
      }
      if (stats.currentRealm && stats.currentRealm !== this.currentRealmId) {
        this.currentRealmId = stats.currentRealm;
      }
    });
  }
}

export const audioManager = new AudioManager();
