// CharacterCreatorModal.js - Official Prodigy "What does your wizard look like?" Stylist
import { eventBus } from '../core/EventBus.js';
import { AvatarRenderer } from './AvatarRenderer.js';

export const WIZARD_STYLES = [
  {
    id: 'apprentice',
    name: '奧術學徒 (Arcane Apprentice)',
    sprite: './assets/sprites/wizard_apprentice.png',
    badge: '經典蔚藍',
    theme: '#3867d6',
    desc: '標準魔法學院蔚藍法袍，引導純粹的奧術星辰魔力。'
  },
  {
    id: 'pyro',
    name: '烈焰術士 (Pyromancer)',
    sprite: './assets/sprites/wizard_pyro.png',
    badge: '熾熱赤紅',
    theme: '#eb3b5a',
    desc: '火山旅者編織的熾熱法袍，體內燃燒著澎湃烈火之魂。'
  },
  {
    id: 'scholar',
    name: '翡翠賢者 (Emerald Sage)',
    sprite: './assets/sprites/wizard_scholar.png',
    badge: '生機森綠',
    theme: '#20bf6b',
    desc: '親和自然草木的學者長袍，受到森林古樹與藤蔓庇護。'
  },
  {
    id: 'storm',
    name: '風暴使者 (Storm Weaver)',
    sprite: './assets/sprites/wizard_storm.png',
    badge: '金曜雷霆',
    theme: '#f7b731',
    desc: '採集浮空雲端雷電精華的長袍，行動如疾風閃電。'
  },
  {
    id: 'shadow',
    name: '暗影漫步者 (Shadow Walker)',
    sprite: './assets/sprites/wizard_shadow.png',
    badge: '幽邃暗紫',
    theme: '#8854d0',
    desc: '隱匿於夜色之中的神秘斗篷，對古代禁忌魔法了若指掌。'
  }
];

export const CANON_FIRST_NAMES = [
  'Alex', 'Daniel', 'Luke', 'Tyler', 'Leo', 'Emma', 'Chloe', 'Sophia', 'Luna', 'Maya'
];

export const CANON_SURNAMES = [
  'Starweaver (星織者)', 'Firebringer (烈焰使)', 'Stormrider (風暴騎手)',
  'Earthshaker (撼地者)', 'Lightseeker (逐光者)', 'Moonwhisper (月語者)',
  'Frostblade (霜刃)', 'Shadowbreaker (破影者)'
];

export class CharacterCreatorModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('character-modal');
    this.firstNameSelect = document.getElementById('char-first-name');
    this.surnameSelect = document.getElementById('char-surname');
    this.randomNameBtn = document.getElementById('btn-random-name');
    this.styleGridEl = document.getElementById('char-style-grid');
    this.previewImg = document.getElementById('char-preview-img');
    this.previewNameEl = document.getElementById('char-preview-name');
    this.previewStyleEl = document.getElementById('char-preview-style');
    this.previewAttrsEl = document.getElementById('char-preview-attributes');
    this.confirmBtn = document.getElementById('btn-confirm-char');
    this.closeBtn = document.getElementById('btn-close-char');

    // Canonical Customizer elements
    this.hairStylesContainer = document.getElementById('char-hair-styles');
    this.hairColorsContainer = document.getElementById('char-hair-colors');
    this.eyeColorsContainer = document.getElementById('char-eye-colors');
    this.skinTonesContainer = document.getElementById('char-skin-tones');

    this.selectedStyleId = this.gameState.wizardStyle || 'apprentice';
    this.selectedHairStyle = this.gameState.hairStyle || 1;
    this.selectedHairColor = this.gameState.hairColor || 'Light Brown';
    this.selectedEyeColor = this.gameState.eyeColor || 'Dark Brown';
    this.selectedSkinTone = this.gameState.skinTone || 1;

    this.initOptions();
    this.bindEvents();
  }

  initOptions() {
    if (this.firstNameSelect) {
      this.firstNameSelect.innerHTML = CANON_FIRST_NAMES.map(fn => `<option value="${fn}">${fn}</option>`).join('');
    }
    if (this.surnameSelect) {
      this.surnameSelect.innerHTML = CANON_SURNAMES.map(sn => `<option value="${sn}">${sn}</option>`).join('');
    }

    this.renderStyleCards();
    this.setupCustomizerChips();
    this.updatePreview();
  }

  setupCustomizerChips() {
    const bindGroup = (container, attrName, currentVal, onSelect) => {
      if (!container) return;
      const btns = container.querySelectorAll('.char-chip-btn');
      btns.forEach(btn => {
        const val = btn.getAttribute(`data-${attrName}`);
        if (String(val) === String(currentVal)) btn.classList.add('active');
        else btn.classList.remove('active');

        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          onSelect(val);
          this.updatePreview();
        });
      });
    };

    bindGroup(this.hairStylesContainer, 'hair-style', this.selectedHairStyle, (v) => this.selectedHairStyle = parseInt(v, 10));
    bindGroup(this.hairColorsContainer, 'hair-color', this.selectedHairColor, (v) => this.selectedHairColor = v);
    bindGroup(this.eyeColorsContainer, 'eye-color', this.selectedEyeColor, (v) => this.selectedEyeColor = v);
    bindGroup(this.skinTonesContainer, 'skin-tone', this.selectedSkinTone, (v) => this.selectedSkinTone = parseInt(v, 10));
  }

  bindEvents() {
    eventBus.on('OPEN_CHARACTER_CREATOR', () => {
      this.open();
    });

    if (this.firstNameSelect) {
      this.firstNameSelect.addEventListener('change', () => this.updatePreview());
    }
    if (this.surnameSelect) {
      this.surnameSelect.addEventListener('change', () => this.updatePreview());
    }

    if (this.randomNameBtn) {
      this.randomNameBtn.addEventListener('click', () => {
        this.rollRandomName();
      });
    }

    if (this.confirmBtn) {
      this.confirmBtn.addEventListener('click', () => {
        this.saveCharacter();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.close();
      });
    }
  }

  rollRandomName() {
    const fn = CANON_FIRST_NAMES[Math.floor(Math.random() * CANON_FIRST_NAMES.length)];
    const sn = CANON_SURNAMES[Math.floor(Math.random() * CANON_SURNAMES.length)];
    if (this.firstNameSelect) this.firstNameSelect.value = fn;
    if (this.surnameSelect) this.surnameSelect.value = sn;
    this.updatePreview();
  }

  renderStyleCards() {
    if (!this.styleGridEl) return;
    this.styleGridEl.innerHTML = '';

    WIZARD_STYLES.forEach(style => {
      const card = document.createElement('div');
      card.className = `wizard-style-card ${style.id === this.selectedStyleId ? 'active' : ''}`;
      card.dataset.archetype = style.id;
      card.setAttribute('data-archetype', style.id);
      card.innerHTML = `
        <div class="style-avatar-wrap">
          <img src="${style.sprite}" alt="${style.name}" class="style-thumb-img">
        </div>
        <div class="style-badge" style="background: ${style.theme};">${style.badge}</div>
        <div class="style-title">${style.name.split(' ')[0]}</div>
      `;

      card.addEventListener('click', () => {
        this.selectedStyleId = style.id;
        document.querySelectorAll('.wizard-style-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.updatePreview();
      });

      this.styleGridEl.appendChild(card);
    });
  }

  getFullName() {
    const fn = this.firstNameSelect?.value || 'Alex';
    const sn = this.surnameSelect?.value?.split(' ')[0] || 'Starweaver';
    return `${fn} ${sn}`;
  }

  updatePreview() {
    const style = WIZARD_STYLES.find(s => s.id === this.selectedStyleId) || WIZARD_STYLES[0];
    const fullName = this.getFullName();

    // Dynamically render live wizard doll matching chosen hairstyle, hair color, eye color, skin tone & archetype
    const svgStr = AvatarRenderer.renderSvg({
      hairStyle: this.selectedHairStyle,
      hairColor: this.selectedHairColor,
      eyeColor: this.selectedEyeColor,
      skinTone: this.selectedSkinTone,
      archetype: this.selectedStyleId,
      size: 160
    });

    const platform = document.querySelector('.char-avatar-platform');
    if (platform) {
      platform.innerHTML = svgStr;
    } else if (this.previewImg) {
      this.previewImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    }

    if (this.previewNameEl) this.previewNameEl.textContent = fullName;
    if (this.previewStyleEl) this.previewStyleEl.textContent = style.name;
    if (this.previewAttrsEl) {
      this.previewAttrsEl.textContent = `髮型 ${this.selectedHairStyle} • ${this.selectedHairColor} • ${this.selectedEyeColor} • 膚色 ${this.selectedSkinTone}`;
    }
  }

  open() {
    this.updatePreview();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }

  saveCharacter() {
    const style = WIZARD_STYLES.find(s => s.id === this.selectedStyleId) || WIZARD_STYLES[0];
    const fullName = this.getFullName();

    // Generate permanent customized avatar sprite for player crest & overworld
    const svgStr = AvatarRenderer.renderSvg({
      hairStyle: this.selectedHairStyle,
      hairColor: this.selectedHairColor,
      eyeColor: this.selectedEyeColor,
      skinTone: this.selectedSkinTone,
      archetype: this.selectedStyleId,
      size: 128
    });
    const customDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

    this.gameState.name = fullName;
    this.gameState.wizardStyle = style.id;
    this.gameState.hairStyle = this.selectedHairStyle;
    this.gameState.hairColor = this.selectedHairColor;
    this.gameState.eyeColor = this.selectedEyeColor;
    this.gameState.skinTone = this.selectedSkinTone;
    this.gameState.avatarSprite = customDataUrl;
    this.gameState.avatarSvg = svgStr;
    this.gameState.hasCreatedCharacter = true;

    eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
    eventBus.emit('CHARACTER_CREATED', { name: fullName, style });

    this.close();

    // If new player, proceed to authentic Noot prologue & Theo duel
    if (!this.gameState.hasSeenPrologue) {
      setTimeout(() => {
        eventBus.emit('TRIGGER_OPENING_PROLOGUE');
      }, 300);
    }
  }
}
