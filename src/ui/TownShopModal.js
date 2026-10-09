// TownShopModal.js - Lamplight Town Shop, Wheel of Wonder, and Sheriff Broadbark's Bounty Board
import { eventBus } from '../core/EventBus.js';
import { CANON_ITEMS } from '../battle/CanonDatabase.js';

export class TownShopModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('town-shop-modal');
    this.closeBtn = document.getElementById('btn-close-shop');
    this.shopItemsContainer = document.getElementById('shop-items-grid');
    this.bountyItemsContainer = document.getElementById('bounty-items-grid');
    this.wheelResultEl = document.getElementById('wheel-result');
    this.btnSpinWheel = document.getElementById('btn-spin-wheel');

    this.wheelChamber = document.getElementById('chamber-wheel');
    this.shopChamber = document.getElementById('chamber-shop');
    this.bountyChamber = document.getElementById('chamber-bounty');

    this.currentTab = 'wheel';

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_TOWN_SHOP', () => this.open());
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.btnSpinWheel) {
      this.btnSpinWheel.addEventListener('click', () => this.spinWheel());
    }

    // Tab buttons
    const tabs = this.modalEl?.querySelectorAll('.town-tab');
    if (tabs) {
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          const tabId = e.currentTarget.dataset.tab;
          this.switchTab(tabId);
        });
      });
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    const tabs = this.modalEl?.querySelectorAll('.town-tab');
    tabs?.forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabId);
    });

    if (this.wheelChamber) this.wheelChamber.classList.toggle('hidden', tabId !== 'wheel');
    if (this.shopChamber) this.shopChamber.classList.toggle('hidden', tabId !== 'shop');
    if (this.bountyChamber) this.bountyChamber.classList.toggle('hidden', tabId !== 'bounty');

    if (tabId === 'wheel') this.renderWheel();
    if (tabId === 'shop') this.renderShop();
    if (tabId === 'bounty') this.renderBounties();
  }

  renderWheel() {
    if (!this.btnSpinWheel || !this.wheelResultEl) return;
    const hasSpun = this.gameState.hasSpunDailyWheel();
    if (hasSpun) {
      this.btnSpinWheel.disabled = true;
      this.btnSpinWheel.textContent = '⏳ 今日已轉動 (明日00:00重置)';
      this.btnSpinWheel.style.opacity = '0.6';
      this.btnSpinWheel.style.cursor = 'not-allowed';
      this.wheelResultEl.textContent = '🎡 每日奇蹟大轉盤：每日限免費轉動 1 次，明日再來吧！';
    } else {
      this.btnSpinWheel.disabled = false;
      this.btnSpinWheel.textContent = '🎯 轉動奇蹟之輪 (今日免費 1 次)';
      this.btnSpinWheel.style.opacity = '1';
      this.btnSpinWheel.style.cursor = 'pointer';
      this.wheelResultEl.textContent = '✨ 每天登入免費轉動 1 次，抽取長老金幣、星數與魔藥！';
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

  spinWheel() {
    if (this.gameState.hasSpunDailyWheel()) {
      this.renderWheel();
      return;
    }

    this.btnSpinWheel.disabled = true;
    const prizes = [
      { text: '🪙 50 金幣！', reward: () => this.gameState.addGold(50) },
      { text: '🪙 100 大袋金幣！', reward: () => this.gameState.addGold(100) },
      { text: '⭐ 1 顆冒險之星！', reward: () => { this.gameState.stars += 1; eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot()); } },
      { text: '🧪 2 瓶生命紅藥水！', reward: () => { this.gameState.potionsCount += 2; eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot()); } }
    ];

    const chosen = prizes[Math.floor(Math.random() * prizes.length)];
    this.wheelResultEl.textContent = '轉盤飛速旋轉中... 🎡';

    setTimeout(() => {
      chosen.reward();
      this.gameState.recordDailyWheelSpin();
      this.wheelResultEl.textContent = `🎉 恭喜轉中：${chosen.text}`;
      this.btnSpinWheel.disabled = true;
      this.btnSpinWheel.textContent = '⏳ 今日已轉動 (明日00:00重置)';
      this.btnSpinWheel.style.opacity = '0.6';
      this.btnSpinWheel.style.cursor = 'not-allowed';
    }, 1200);
  }

  showNotice(msg) {
    let noticeEl = this.modalEl?.querySelector('.shop-notice-toast');
    if (!noticeEl) {
      noticeEl = document.createElement('div');
      noticeEl.className = 'shop-notice-toast';
      this.modalEl?.querySelector('.ancient-grimoire')?.appendChild(noticeEl);
    }
    noticeEl.textContent = msg;
    noticeEl.classList.remove('hidden');
    clearTimeout(this.noticeTimer);
    this.noticeTimer = setTimeout(() => {
      noticeEl?.classList.add('hidden');
    }, 2500);
  }

  buyItem(category, item) {
    if (category === 'potions') {
      if (this.gameState.gold < item.price) {
        const msg = `🪙 金幣不足！需要 ${item.price} 金幣，當前僅有 ${this.gameState.gold} 金幣！`;
        this.showNotice(msg);
        eventBus.emit('SHOW_TOAST', { message: msg, type: 'warning' });
        return;
      }

      this.gameState.gold -= item.price;
      if (item.id === 'potion_xp') {
        this.gameState.xpBoostBattles = (this.gameState.xpBoostBattles || 0) + 3;
        eventBus.emit('SHOW_TOAST', {
          message: `✨ 購買並飲用【${item.name}】！接下來 3 場戰鬥經驗值翻倍 (XP x2.0)！`,
          type: 'success'
        });
      } else if (item.id === 'pet_treat') {
        this.gameState.petTreatsCount = (this.gameState.petTreatsCount || 0) + 1;
        eventBus.emit('SHOW_TOAST', {
          message: `🍎 購買成功！獲得 1 份【${item.name}】！可在戰鬥中安撫野怪！`,
          type: 'success'
        });
      } else {
        this.gameState.potionsCount += 1;
        eventBus.emit('SHOW_TOAST', {
          message: `🧪 購買成功！獲得 1 瓶【${item.name}】！`,
          type: 'success'
        });
      }
      eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
      this.renderShop();
      return;
    }

    const slotMap = { wands: 'wand', hats: 'hat', outfits: 'outfit', boots: 'boots' };
    const slot = slotMap[category];
    const gearItem = { ...item, slot };

    // If already owned, switch equipment for free without spending gold!
    if (this.gameState.hasOwnedItem(item.id || item.name)) {
      this.gameState.equipItem(gearItem);
      this.showNotice(`🔄 已免費切換裝備為【${item.name}】！`);
      eventBus.emit('SHOW_TOAST', {
        message: `🔄 已免費切換裝備為【${item.name}】！`,
        type: 'success'
      });
      this.renderShop();
      return;
    }

    // Otherwise must purchase with gold
    if (this.gameState.gold < item.price) {
      const msg = `🪙 金幣不足！需要 ${item.price} 金幣，當前僅有 ${this.gameState.gold} 金幣！`;
      this.showNotice(msg);
      eventBus.emit('SHOW_TOAST', { message: msg, type: 'warning' });
      return;
    }

    this.gameState.gold -= item.price;
    this.gameState.addOwnedItem(gearItem);
    this.gameState.equipItem(gearItem);

    eventBus.emit('SHOW_TOAST', {
      message: `✨ 購買成功並已裝備【${item.name}】！已永久存入法師行囊！`,
      type: 'success'
    });
    this.renderShop();
  }

  render() {
    this.switchTab(this.currentTab);
  }

  renderShop() {
    if (!this.shopItemsContainer) return;
    this.shopItemsContainer.innerHTML = '';

    const allShopItems = [
      ...CANON_ITEMS.wands.filter(i => i.price > 0).map(i => ({ ...i, cat: 'wands', icon: '🪄' })),
      ...CANON_ITEMS.hats.filter(i => i.price > 0).map(i => ({ ...i, cat: 'hats', icon: '🧙‍♂️' })),
      ...CANON_ITEMS.outfits.filter(i => i.price > 0).map(i => ({ ...i, cat: 'outfits', icon: '🥋' })),
      ...CANON_ITEMS.boots.filter(i => i.price > 0).map(i => ({ ...i, cat: 'boots', icon: '👢' })),
      ...CANON_ITEMS.potions.map(i => ({ ...i, cat: 'potions', icon: '🧪' }))
    ];

    allShopItems.forEach(item => {
      const isEquipped = Object.values(this.gameState.equipment).some(e => e?.name === item.name || (e?.id && e.id === item.id));
      const isOwned = item.cat !== 'potions' && this.gameState.hasOwnedItem(item.id || item.name);

      let btnHtml = '';
      if (isEquipped) {
        btnHtml = `<button class="ware-buy-btn" disabled>已裝備 ✓</button>`;
      } else if (isOwned) {
        btnHtml = `<button class="ware-buy-btn ware-equip-btn" style="background:#2980b9;">換裝 🔄 (已擁有)</button>`;
      } else {
        btnHtml = `<button class="ware-buy-btn">購買 🛍️</button>`;
      }

      const card = document.createElement('div');
      card.className = 'ware-card';
      card.innerHTML = `
        <div class="ware-icon">${item.icon}</div>
        <div class="ware-info">
          <div class="ware-name">${item.name}</div>
          <div class="ware-desc">${item.desc}</div>
          <div class="ware-price">${isOwned ? '<span style="color:#27ae60; font-weight:bold;">已永久擁有</span>' : `🪙 ${item.price} 金幣`}</div>
        </div>
        ${btnHtml}
      `;

      card.querySelector('.ware-buy-btn').addEventListener('click', () => {
        this.buyItem(item.cat, item);
      });

      this.shopItemsContainer.appendChild(card);
    });
  }

  renderBounties() {
    if (!this.bountyItemsContainer) return;
    this.bountyItemsContainer.innerHTML = '';

    const bounties = this.gameState.bounties || [];

    bounties.forEach(b => {
      const card = document.createElement('div');
      card.className = `bounty-card ${b.completed ? 'completed' : ''} ${b.claimed ? 'claimed' : ''}`;
      
      const pct = Math.min(100, Math.floor((b.current / b.target) * 100));
      card.innerHTML = `
        <div class="bounty-card-header">
          <div class="bounty-badge-title">📜 ${b.title}</div>
          <div class="bounty-reward-pill">🪙 +${b.rewardGold}  ⭐ +${b.rewardStars}</div>
        </div>
        <p class="bounty-desc">${b.desc}</p>
        <div class="bounty-progress-row">
          <div class="bounty-progress-track">
            <div class="bounty-progress-fill" style="width: ${pct}%"></div>
          </div>
          <span class="bounty-progress-text">${b.current} / ${b.target}</span>
        </div>
        <button class="channel-magic-btn bounty-claim-btn" ${(!b.completed || b.claimed) ? 'disabled' : ''}>
          <span>${b.claimed ? '已領取賞金 ✓' : (b.completed ? '領取懸賞賞金 🎁' : '任務進行中 ⚔️')}</span>
        </button>
      `;

      const claimBtn = card.querySelector('.bounty-claim-btn');
      if (claimBtn && b.completed && !b.claimed) {
        claimBtn.addEventListener('click', () => {
          this.gameState.claimBounty(b.id);
          eventBus.emit('SHOW_TOAST', {
            message: `🎉 成功領取【${b.title}】懸賞！獲得 +${b.rewardGold} 金幣、+${b.rewardStars} 星石！`,
            type: 'success'
          });
          this.renderBounties();
        });
      }

      this.bountyItemsContainer.appendChild(card);
    });
  }
}
