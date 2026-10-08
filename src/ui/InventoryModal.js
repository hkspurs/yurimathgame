// InventoryModal.js - Displays canonical Warden Keystones, Rescued Pets, and Gear
import { eventBus } from '../core/EventBus.js';

const KEYSTONE_DEFS = [
  { id: 'earth', name: '大地神石 (Earth Keystone)', icon: '🌱' },
  { id: 'water', name: '海洋神石 (Water Keystone)', icon: '💧' },
  { id: 'fire', name: '烈焰神石 (Fire Keystone)', icon: '🔥' },
  { id: 'ice', name: '冰霜神石 (Ice Keystone)', icon: '❄️' },
  { id: 'storm', name: '風暴神石 (Storm Keystone)', icon: '⚡' }
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
          <div class="keystone-chip ${has ? 'obtained' : 'missing'}">
            <span>${k.icon}</span>
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
        this.petsEl.innerHTML = snap.pets.map(p => {
          const isFollower = p.id === (snap.activePetId || snap.pets[0]?.id);
          return `
            <div class="pet-card ${isFollower ? 'active-follower' : ''}">
              <div style="width:44px; height:44px; display:flex; align-items:center; justify-content:center; margin: 0 auto 4px;">
                <img src="${p.sprite || './assets/sprites/hotpot.png'}" style="width:38px; height:38px; image-rendering:pixelated;" alt="${p.name}">
              </div>
              <div class="pet-name">${p.name}</div>
              <div class="pet-tag">Lv.${p.level} • ${p.element}</div>
              <button class="channel-magic-btn btn-set-follower" data-id="${p.id}" style="width:100%; min-height:32px; padding:4px 8px; font-size:11px; margin-top:6px; ${isFollower ? 'background:linear-gradient(180deg,#2ed573,#26af5f); border-color:#2ed573;' : ''}">
                ${isFollower ? '🐾 跟隨中 (Active)' : '召喚跟隨 (Follow)'}
              </button>
            </div>
          `;
        }).join('');

        // Bind follower switch buttons
        const followerBtns = this.petsEl.querySelectorAll('.btn-set-follower');
        followerBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const petId = e.currentTarget.dataset.id;
            this.gameState.setActivePet(petId);
            this.render();
          });
        });
      }
    }

    // 3. Equipment
    if (this.gearEl) {
      const gear = snap.equipment;
      const slots = [
        { icon: '🧙‍♂️', slot: '帽子 (Hat)', item: gear.hat?.name || '無' },
        { icon: '🥋', slot: '法袍 (Outfit)', item: gear.outfit?.name || '無' },
        { icon: '🪄', slot: '魔杖 (Wand)', item: gear.wand?.name || '無' },
        { icon: '👢', slot: '靴子 (Boots)', item: gear.boots?.name || '無' },
        { icon: '📿', slot: '遺物護符 (Relic)', item: gear.relic?.name || '無' }
      ];

      this.gearEl.innerHTML = slots.map(s => `
        <div class="gear-slot">
          <div class="gear-slot-icon">${s.icon}</div>
          <div>
            <div class="gear-slot-title">${s.slot}</div>
            <div class="gear-slot-val">${s.item}</div>
          </div>
        </div>
      `).join('');
    }
  }
}
