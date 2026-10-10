// InventoryModal.js - Displays canonical Warden Keystones, Rescued Pets, and Gear
import { eventBus } from '../core/EventBus.js';

const KEYSTONE_DEFS = [
  { id: 'earth', name: '大地神石 (Earth Keystone)', sprite: './assets/sprites/keystone_earth.png', icon: '🌱' },
  { id: 'water', name: '海洋神石 (Water Keystone)', sprite: './assets/sprites/keystone_water.png', icon: '💧' },
  { id: 'fire', name: '烈焰神石 (Fire Keystone)', sprite: './assets/sprites/keystone_fire.png', icon: '🔥' },
  { id: 'ice', name: '冰霜神石 (Ice Keystone)', sprite: './assets/sprites/keystone_ice.png', icon: '❄️' },
  { id: 'storm', name: '風暴神石 (Storm Keystone)', sprite: './assets/sprites/keystone_storm.png', icon: '⚡' }
];

export class InventoryModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('inventory-modal');
    this.closeBtn = document.getElementById('btn-close-inv');
    this.keystonesEl = document.getElementById('keystones-container');
    this.petsEl = document.getElementById('pets-container');
    this.gearEl = document.getElementById('gear-container');

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_INVENTORY', () => this.open());
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
    const snap = this.gameState.getSnapshot();

    // 1. Keystones
    if (this.keystonesEl) {
      this.keystonesEl.innerHTML = KEYSTONE_DEFS.map(k => {
        const has = snap.keystones.includes(k.id);
        return `
          <div class="keystone-chip ${has ? 'obtained' : 'missing'}" style="display:flex; align-items:center; gap:8px;">
            <img src="${k.sprite}" style="width:26px; height:26px; object-fit:contain; filter: ${has ? 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' : 'grayscale(100%) opacity(0.35)'};" alt="${k.name}" onerror="this.style.display='none'">
            <span>${k.name} ${has ? '✓' : '(未尋獲)'}</span>
          </div>
        `;
      }).join('');
    }

    // 2. Pets
    if (this.petsEl) {
      if (!snap.pets.length) {
        this.petsEl.innerHTML = `<p style="font-size:12px; color:#a4b0be; padding:6px;">尚未淨化拯救任何怪獸夥伴。在戰鬥中削弱怪獸體力即可使用【Rescue】法術！</p>`;
      } else {
        const activeIds = snap.activePetIds || [snap.activePetId].filter(Boolean);
        this.petsEl.innerHTML = snap.pets.map(p => {
          const isSlot1 = activeIds[0] === p.id;
          const isSlot2 = activeIds[1] === p.id;
          const isFollower = isSlot1 || isSlot2;
          const badgeText = isSlot1 ? '🐾 1號夥伴 (首發)' : (isSlot2 ? '🐾 2號夥伴 (同行)' : '召喚同行 (帶上)');

          return `
            <div class="pet-card ${isFollower ? 'active-follower' : ''}">
              <div style="width:44px; height:44px; display:flex; align-items:center; justify-content:center; margin: 0 auto 4px;">
                <img src="${p.sprite || './assets/sprites/hotpot.png'}" style="width:38px; height:38px; image-rendering:pixelated;" alt="${p.name}">
              </div>
              <div class="pet-name">${p.name}</div>
              <div class="pet-tag">Lv.${p.level} • ${p.element}</div>
              <button class="channel-magic-btn btn-set-follower" data-id="${p.id}" style="width:100%; min-height:32px; padding:4px 6px; font-size:10.5px; margin-top:6px; ${isFollower ? 'background:linear-gradient(180deg,#2ed573,#26af5f); border-color:#2ed573;' : ''}">
                ${badgeText}
              </button>
            </div>
          `;
        }).join('');

        // Bind follower switch buttons
        const followerBtns = this.petsEl.querySelectorAll('.btn-set-follower');
        followerBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const petId = e.currentTarget.dataset.id;
            if (this.gameState.toggleActivePet) {
              this.gameState.toggleActivePet(petId);
            } else {
              this.gameState.setActivePet(petId);
            }
            this.render();
          });
        });
      }
    }

    // 3. Equipment & Owned Gear
    if (this.gearEl) {
      const gear = snap.equipment;
      const slots = [
        { icon: '🧙‍♂️', slotKey: 'hat', slot: '帽子 (Hat)', item: gear.hat?.name || '無' },
        { icon: '🥋', slotKey: 'outfit', slot: '法袍 (Outfit)', item: gear.outfit?.name || '無' },
        { icon: '🪄', slotKey: 'wand', slot: '魔杖 (Wand)', item: gear.wand?.name || '無' },
        { icon: '👢', slotKey: 'boots', slot: '靴子 (Boots)', item: gear.boots?.name || '無' },
        { icon: '📿', slotKey: 'relic', slot: '遺物護符 (Relic)', item: gear.relic?.name || '無' }
      ];

      const equippedHtml = `
        <div style="margin-bottom: 12px;">
          <h4 style="font-size: 12.5px; color: #5d4037; margin: 0 0 8px 0; font-weight: bold;">🛡️ 當前全身穿戴 (Current Loadout)</h4>
          <div class="gear-pedestals">
            ${slots.map(s => `
              <div class="gear-slot">
                <div class="gear-slot-icon">${s.icon}</div>
                <div>
                  <div class="gear-slot-title">${s.slot}</div>
                  <div class="gear-slot-val">${s.item}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const ownedItems = snap.ownedEquipment || [];
      const ownedHtml = `
        <div style="margin-top: 14px;">
          <h4 style="font-size: 12.5px; color: #5d4037; margin: 0 0 8px 0; font-weight: bold;">📦 已擁有裝備行囊 (Owned Gear Storage - ${ownedItems.length} 件)</h4>
          <div class="owned-gear-grid">
            ${ownedItems.map(item => {
              const itemSlot = item.slot || (item.cat ? { wands: 'wand', hats: 'hat', outfits: 'outfit', boots: 'boots' }[item.cat] : null);
              const isEquipped = itemSlot && gear[itemSlot]?.name === item.name;
              const bonusText = item.power ? `⚡ 威力 +${item.power}` : (item.hearts ? `❤️ 生命 +${item.hearts}` : '');

              return `
                <div class="owned-gear-card ${isEquipped ? 'is-equipped' : ''}">
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong style="font-size: 12px; color: #2f3542;">${item.name}</strong>
                      ${isEquipped ? '<span style="font-size: 10px; background: #2ed573; color: #fff; padding: 1px 6px; border-radius: 8px; font-weight: bold;">穿戴中</span>' : ''}
                    </div>
                    ${bonusText ? `<div style="font-size: 11px; color: #e67e22; margin-top: 2px;">${bonusText}</div>` : ''}
                  </div>
                  <button class="btn-equip-gear" data-item-id="${item.id || item.name}" ${isEquipped ? 'disabled' : ''}>
                    ${isEquipped ? '✓ 已穿戴' : '換裝 🔄'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const THEMES = [
        { id: 'apprentice', name: '🌟 星光學徒', color: '#2e5cb8' },
        { id: 'pyro', name: '🔥 烈焰術士', color: '#c0392b' },
        { id: 'tidal', name: '💧 潮汐使者', color: '#0984e3' },
        { id: 'frost', name: '❄️ 極地冰皇', color: '#00cec9' },
        { id: 'scholar', name: '🌿 奧術學者', color: '#1b8a5a' },
        { id: 'storm', name: '⚡ 風暴領主', color: '#d4a017' },
        { id: 'shadow', name: '🔮 暗影魔導', color: '#6c3483' }
      ];

      const currentTheme = snap.wizardStyle || 'apprentice';

      const themeHtml = `
        <div style="margin-bottom: 12px; background: rgba(0, 0, 0, 0.03); padding: 8px 12px; border-radius: 12px; border: 1px solid #dcdde1;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <h4 style="font-size: 12.5px; color: #5d4037; margin: 0; font-weight: bold;">✨ 法師外觀套裝風格 (Wizard Theme Skin)</h4>
            <span style="font-size: 11px; color: #7f8c8d;">著裝自動切換 • 亦可手動點擊</span>
          </div>
          <div class="theme-chips-row" style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${THEMES.map(t => `
              <button class="theme-chip-btn ${t.id === currentTheme ? 'active' : ''}" data-theme="${t.id}" style="padding: 4px 10px; font-size: 11.5px; font-weight: 700; border-radius: 12px; border: 1.5px solid ${t.id === currentTheme ? t.color : '#bdc3c7'}; background: ${t.id === currentTheme ? t.color : '#ffffff'}; color: ${t.id === currentTheme ? '#ffffff' : '#2c3e50'}; cursor: pointer; transition: all 0.15s ease;">
                ${t.name} ${t.id === currentTheme ? '✓' : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      this.gearEl.innerHTML = themeHtml + equippedHtml + ownedHtml;

      // Bind theme buttons
      const themeBtns = this.gearEl.querySelectorAll('.theme-chip-btn');
      themeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const themeId = e.currentTarget.dataset.theme;
          this.gameState.setWizardStyle(themeId);
          this.render();
          const targetTheme = THEMES.find(t => t.id === themeId);
          eventBus.emit('SHOW_TOAST', {
            message: `✨ 已換裝為【${targetTheme?.name}】全身套裝！`,
            type: 'success'
          });
        });
      });

      // Bind equip buttons
      const equipBtns = this.gearEl.querySelectorAll('.btn-equip-gear:not([disabled])');
      equipBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.itemId;
          const targetItem = ownedItems.find(i => (i.id && i.id === id) || i.name === id);
          if (targetItem) {
            this.gameState.equipItem(targetItem);
            this.render();
          }
        });
      });
    }
  }
}
