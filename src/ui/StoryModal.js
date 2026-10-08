// StoryModal.js - Official Prodigy Math Game Opening Prologue, Mentor Dialogue, Starter Pet Selection & Puppet Master Crisis
import { eventBus } from '../core/EventBus.js';

export const STARTER_PETS = [
  {
    id: 'hotpot',
    name: 'Hotpot (火罐靈)',
    element: 'fire',
    elementLabel: '🔥 烈焰系 (Fire)',
    title: '熾熱活力小精靈',
    desc: '熱情勇敢的火之精靈，頭上燃燒著不滅的希望之火。擅長高爆發火焰法術！',
    sprite: './assets/sprites/hotpot.png',
    maxHp: 50,
    attack: 12,
    skillName: 'Spit Fire (吐火星)'
  },
  {
    id: 'squiddle',
    name: 'Squiddle (小章魚)',
    element: 'water',
    elementLabel: '💧 水流系 (Water)',
    title: '潮汐蔚藍小精靈',
    desc: '機敏聰慧的海中精靈，身具澄澈流水護佑。擅長清涼浪濤與水流衝擊！',
    sprite: './assets/sprites/squiddle.png',
    maxHp: 55,
    attack: 10,
    skillName: 'Ink Spray (墨汁噴射)'
  },
  {
    id: 'peeko',
    name: 'Peeko (葉雀靈)',
    element: 'earth',
    elementLabel: '🌱 大地系 (Earth)',
    title: '生機古林小精靈',
    desc: '親切純真的自然之靈，身披翡翠羽翼。擅長生機藤蔓與飛葉守護！',
    sprite: './assets/sprites/peeko.png',
    maxHp: 60,
    attack: 9,
    skillName: 'Peck (啄擊)'
  },
  {
    id: 'snoot',
    name: 'Snoot (雪鼻獸)',
    element: 'ice',
    elementLabel: '❄️ 冰霜系 (Ice)',
    title: '極地玄冰小精靈',
    desc: '堅韌沉靜的雪原之靈，身裹厚實絨雪。擅長重裝雪球與冰霜凝結！',
    sprite: './assets/sprites/snoot.png',
    maxHp: 58,
    attack: 11,
    skillName: 'Snowball (重裝雪球)'
  },
  {
    id: 'cloudling',
    name: 'Cloudling (雷雲獸)',
    element: 'storm',
    elementLabel: '⚡ 風暴系 (Storm)',
    title: '浮空迅捷小精靈',
    desc: '靈動活潑的雷雲之靈，周身環繞閃耀電芒。擅長迅捷電弧與雷霆震撼！',
    sprite: './assets/sprites/cloudling.png',
    maxHp: 52,
    attack: 13,
    skillName: 'Thunder Shock (雷電擊)'
  }
];

export class StoryModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('story-modal');
    this.titleEl = document.getElementById('story-modal-title');
    this.dialogueBodyEl = document.getElementById('story-dialogue-body');
    this.starterSelectBodyEl = document.getElementById('starter-select-body');
    this.starterCardsGridEl = document.getElementById('starter-cards-grid');

    // Headmaster Dialogue UI
    this.speakerAvatarEl = document.getElementById('story-speaker-avatar');
    this.speakerNameEl = document.getElementById('story-speaker-name');
    this.speakerTitleEl = document.getElementById('story-speaker-title');
    this.dialogueTextEl = document.getElementById('story-dialogue-text');
    this.stepDotsEl = document.getElementById('story-step-dots');
    this.btnNext = document.getElementById('btn-story-next');
    this.btnSkip = document.getElementById('btn-story-skip');

    // Training Wand Obtained Modal (Theo Addiwise Gift)
    this.wandModalEl = document.getElementById('training-wand-modal');
    this.btnWearWand = document.getElementById('btn-wear-wand');
    this.btnNotNowWand = document.getElementById('btn-not-now-wand');

    // Puppet Master Crisis Cutscene UI
    this.puppetBodyEl = document.getElementById('puppet-master-body');
    this.puppetAvatarEl = document.getElementById('puppet-speaker-avatar');
    this.puppetSpeakerNameEl = document.getElementById('puppet-speaker-name');
    this.puppetSpeakerTitleEl = document.getElementById('puppet-speaker-title');
    this.puppetDialogueTextEl = document.getElementById('puppet-dialogue-text');
    this.puppetScatterEl = document.getElementById('puppet-keystones-scatter');
    this.puppetStepDotsEl = document.getElementById('puppet-step-dots');
    this.btnPuppetNext = document.getElementById('btn-puppet-next');

    this.currentStepIndex = 0;
    this.puppetStepIndex = 0;
    this.chosenPet = null;

    // Authentic 8-step opening sequence from math.prodigygame.com
    this.storyScript = [
      {
        speaker: 'Noot (努特校長)',
        title: '燈火魔法學院引導者',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'Hi! My name is Noot.\n(你好！我是努特。)',
        btnLabel: '繼續聆聽 ▶'
      },
      {
        speaker: 'Noot (努特校長)',
        title: '燈火魔法學院引導者',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'I help bring new students to the Wizard Academy!\n(我負責指引新入學的學生前往魔法學院！)',
        btnLabel: '出發吧！ ⛵'
      },
      {
        speaker: 'Noot (努特校長)',
        title: '燈火魔法學院引導者',
        avatar: './assets/sprites/headmaster_noot.png',
        text: "Let's head there now!\n(我們現在就出發前往學院大門吧！)",
        btnLabel: '前往學院 🏛️'
      },
      {
        speaker: 'Noot (努特校長)',
        title: '燈火魔法學院引導者',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'We made it! Welcome to the Wizard Academy!\n(我們到了！歡迎來到魔法學院大門！)',
        btnLabel: '走進大門 🏰'
      },
      {
        speaker: 'Theo Addiwise (學院導師)',
        title: '奧術決鬥導師',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'Magic battles are the most fun way to learn!\n(魔法決鬥是學習中最有趣的方式！)',
        btnLabel: '聆聽導師建議 ▶'
      },
      {
        speaker: 'Theo Addiwise (學院導師)',
        title: '奧術決鬥導師',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'Take my old one.\n(拿去吧，這是我以前用的初階魔杖，送給你！)',
        triggerWand: true,
        btnLabel: '接過魔杖 🪄'
      },
      {
        speaker: 'Noot (努特校長)',
        title: '燈火魔法學院引導者',
        avatar: './assets/sprites/headmaster_noot.png',
        text: 'Wow! Your first wand!\n(哇！這是你的第一把魔杖！)',
        btnLabel: '繼續 ▶'
      },
      {
        speaker: 'Theo Addiwise (學院導師)',
        title: '奧術決鬥導師',
        avatar: './assets/sprites/headmaster_noot.png',
        text: "Let's try it out! Let's have a magic battle!\n(讓我們來試試魔杖的威力吧！來一場教學魔法決鬥！)",
        startDuel: true,
        btnLabel: '發起魔法決鬥！⚔️'
      }
    ];

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('INTERACT_NPC_HEADMASTER', () => {
      // If player still has no pets, prompt starter selection directly
      if (this.gameState.pets.length === 0) {
        this.openStarterSelection();
      } else {
        this.openHeadmasterQuestDialogue();
      }
    });

    eventBus.on('TRIGGER_OPENING_PROLOGUE', () => {
      this.openStory(true);
    });

    eventBus.on('TRIGGER_STARTER_SELECTION', () => {
      this.openStarterSelection();
    });

    eventBus.on('TUTORIAL_DUEL_WON', () => {
      this.openStarterSelection();
    });

    if (this.btnWearWand) {
      this.btnWearWand.addEventListener('click', () => {
        this.gameState.equipment.wand = { id: 'wand_training', name: '訓練魔杖 (Training Wand)', powerBonus: 12 };
        if (!this.gameState.unlockedSpells.includes('starbit')) {
          this.gameState.unlockedSpells.push('starbit');
        }
        if (!this.gameState.unlockedSpells.includes('bop')) {
          this.gameState.unlockedSpells.push('bop');
        }
        eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
        eventBus.emit('SHOW_TOAST', {
          icon: '🪄',
          title: '已裝備 Training Wand',
          text: '已解鎖 Starbit 與 Bop 基礎星光法術！'
        });
        this.closeWandModal();
        this.advanceAfterWand();
      });
    }

    if (this.btnNotNowWand) {
      this.btnNotNowWand.addEventListener('click', () => {
        this.closeWandModal();
        this.advanceAfterWand();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => this.nextStep());
    }

    if (this.btnSkip) {
      this.btnSkip.addEventListener('click', () => {
        if (this.isQuestDialogue) {
          this.finishStory();
          this.isQuestDialogue = false;
        } else if (this.gameState.pets.length === 0) {
          this.openStarterSelection();
        } else {
          this.finishStory();
        }
      });
    }

    if (this.btnPuppetNext) {
      this.btnPuppetNext.addEventListener('click', () => this.nextPuppetStep());
    }
  }

  openWandModal() {
    if (this.modalEl) this.modalEl.classList.add('hidden');
    if (this.wandModalEl) this.wandModalEl.classList.remove('hidden');
  }

  closeWandModal() {
    if (this.wandModalEl) this.wandModalEl.classList.add('hidden');
    if (this.modalEl) this.modalEl.classList.remove('hidden');
  }

  advanceAfterWand() {
    this.currentStepIndex = 6; // Move to Noot: "Wow! Your first wand!"
    this.renderStep();
  }

  openHeadmasterQuestDialogue() {
    this.isQuestDialogue = true;
    this.currentStepIndex = 0;
    const stonesCount = this.gameState.keystones ? this.gameState.keystones.length : 0;

    if (stonesCount === 0) {
      this.questScript = [
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: '年輕的巫師，暗影傀儡大師（Puppet Master）奪走了學院的 5 塊守護神石！各大王國正陷入混亂！'
        },
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: '請啟程前往螢火森林、海難海岸、寒顫雪山、篝火火山峰與浮空風暴城，淨化暗影怪獸，奪回神石以拯救學院！'
        }
      ];
    } else if (stonesCount < 5) {
      this.questScript = [
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: `太出色了！你已經成功尋回了 ${stonesCount}/5 塊守護神石！學院的防禦結界正在逐漸復甦！`
        },
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: '請繼續前往剩餘的王國，集齊最後的神石，我們定能徹底粉碎暗影傀儡大師的陰謀！'
        }
      ];
    } else {
      this.questScript = [
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: '難以置信！你找齊了全部 5 塊守護神石（大地、海洋、烈焰、冰霜、風暴）！五大元素的光芒再次照耀整個世界！'
        },
        {
          speaker: '努特校長 (Headmaster Noot)',
          title: '燈火魔法學院院長',
          avatar: './assets/sprites/headmaster_noot.png',
          text: '暗影傀儡大師被徹底封印，燈火學院永保太平！你無愧是學院最傳奇的奧術大魔法師！'
        }
      ];
    }

    if (this.dialogueBodyEl) this.dialogueBodyEl.classList.remove('hidden');
    if (this.starterSelectBodyEl) this.starterSelectBodyEl.classList.add('hidden');
    if (this.puppetBodyEl) this.puppetBodyEl.classList.add('hidden');
    if (this.titleEl) this.titleEl.textContent = '🌟 院長任務指南 • 守護神石現況';
    if (this.btnSkip) this.btnSkip.style.display = 'block';

    this.renderQuestStep();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  renderQuestStep() {
    const step = this.questScript[this.currentStepIndex];
    if (!step) return;

    if (this.speakerNameEl) this.speakerNameEl.textContent = step.speaker;
    if (this.speakerTitleEl) this.speakerTitleEl.textContent = step.title;
    if (this.speakerAvatarEl) this.speakerAvatarEl.src = step.avatar;
    if (this.dialogueTextEl) this.dialogueTextEl.textContent = step.text;

    if (this.stepDotsEl) {
      this.stepDotsEl.innerHTML = '';
      for (let i = 0; i < this.questScript.length; i++) {
        const dot = document.createElement('div');
        dot.className = `step-dot ${i === this.currentStepIndex ? 'active' : ''}`;
        this.stepDotsEl.appendChild(dot);
      }
    }

    if (this.btnNext) {
      const isLast = this.currentStepIndex === this.questScript.length - 1;
      this.btnNext.textContent = isLast ? '領命啟程！ ✨' : '繼續聆聽 📜';
    }
  }

  openStory(isOpening = false) {
    this.isQuestDialogue = false;
    this.currentStepIndex = 0;
    this.isOpening = isOpening;

    // Reset views
    if (this.dialogueBodyEl) this.dialogueBodyEl.classList.remove('hidden');
    if (this.starterSelectBodyEl) this.starterSelectBodyEl.classList.add('hidden');
    if (this.puppetBodyEl) this.puppetBodyEl.classList.add('hidden');
    if (this.titleEl) this.titleEl.textContent = '燈火學院編年史 • 院長訓示';
    if (this.btnSkip) this.btnSkip.style.display = 'block';

    this.renderStep();
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  nextStep() {
    if (this.isQuestDialogue) {
      this.currentStepIndex++;
      if (this.currentStepIndex >= this.questScript.length) {
        this.finishStory();
        this.isQuestDialogue = false;
      } else {
        this.renderQuestStep();
      }
      return;
    }

    const currentStep = this.storyScript[this.currentStepIndex];
    if (currentStep?.triggerWand) {
      this.openWandModal();
      return;
    }

    if (currentStep?.startDuel) {
      if (this.modalEl) this.modalEl.classList.add('hidden');
      eventBus.emit('START_TUTORIAL_DUEL');
      return;
    }

    this.currentStepIndex++;
    if (this.currentStepIndex >= this.storyScript.length) {
      if (this.gameState.pets.length === 0) {
        this.openStarterSelection();
      } else {
        this.finishStory();
      }
    } else {
      this.renderStep();
    }
  }

  openStarterSelection() {
    if (this.dialogueBodyEl) this.dialogueBodyEl.classList.add('hidden');
    if (this.puppetBodyEl) this.puppetBodyEl.classList.add('hidden');
    if (this.starterSelectBodyEl) this.starterSelectBodyEl.classList.remove('hidden');
    if (this.titleEl) this.titleEl.textContent = '🐾 學院入學儀式 • 選擇初始精靈';
    if (this.btnSkip) this.btnSkip.style.display = 'none';

    this.renderStarterCards();

    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  renderStarterCards() {
    if (!this.starterCardsGridEl) return;
    this.starterCardsGridEl.innerHTML = '';

    STARTER_PETS.forEach(pet => {
      const card = document.createElement('div');
      card.className = `starter-card element-${pet.element}`;
      card.innerHTML = `
        <div class="starter-card-glow"></div>
        <div class="starter-avatar-wrap">
          <img src="${pet.sprite}" alt="${pet.name}" class="starter-sprite-img">
        </div>
        <div class="starter-badge-pill">${pet.elementLabel}</div>
        <h4 class="starter-pet-name">${pet.name}</h4>
        <div class="starter-pet-title">${pet.title}</div>
        <p class="starter-pet-desc">${pet.desc}</p>
        <div class="starter-stats-row">
          <span>❤️ 生命: ${pet.maxHp}</span>
          <span>⚡ 攻擊: ${pet.attack}</span>
        </div>
        <button class="channel-magic-btn starter-pick-btn" data-id="${pet.id}">
          <span>選擇 ${pet.name.split(' ')[0]} 契約 ✨</span>
        </button>
      `;

      const btn = card.querySelector('.starter-pick-btn');
      btn.addEventListener('click', () => {
        this.chooseStarterPet(pet);
      });

      this.starterCardsGridEl.appendChild(card);
    });
  }

  chooseStarterPet(pet) {
    this.chosenPet = pet;

    // Add pet to player's roster and set as active follower
    this.gameState.addPet({
      id: pet.id,
      name: pet.name,
      element: pet.element,
      level: 1,
      sprite: pet.sprite,
      maxHp: pet.maxHp,
      attack: pet.attack
    });
    this.gameState.setActivePet(pet.id);

    eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
    eventBus.emit('STARTER_PET_CHOSEN', { pet });

    // Directly trigger the official Puppet Master Crisis Cutscene!
    this.openPuppetMasterCrisis();
  }

  openPuppetMasterCrisis() {
    if (this.dialogueBodyEl) this.dialogueBodyEl.classList.add('hidden');
    if (this.starterSelectBodyEl) this.starterSelectBodyEl.classList.add('hidden');
    if (this.puppetBodyEl) this.puppetBodyEl.classList.remove('hidden');
    if (this.titleEl) this.titleEl.textContent = '⚡ 暗影突襲 • 傀儡大師掠奪神石！';
    if (this.btnSkip) this.btnSkip.style.display = 'none';

    this.puppetStepIndex = 0;
    this.renderPuppetStep();
  }

  renderPuppetStep() {
    const petName = this.chosenPet ? this.chosenPet.name.split(' ')[0] : '守護精靈';

    const puppetScript = [
      {
        speaker: '傀儡大師 (The Puppet Master)',
        title: '秩序影響結社首領',
        avatar: './assets/sprites/puppet_master.png',
        text: '「桀桀桀……！愚蠢的學院學徒！五大區域守護神石（Warden Keystones）的魔力已落入我傀儡大師手中！這座大陸將被暗影徹底操縱！」',
        showScatter: false,
        btnLabel: '繼續面對暗影 ▶'
      },
      {
        speaker: '傀儡大師 (The Puppet Master)',
        title: '秩序影響結社首領',
        avatar: './assets/sprites/puppet_master.png',
        text: '「【暗影衝擊 (Shadow Blast)】！！破壞封印，散落去吧！——大地、海洋、烈焰、冰霜與風暴神石，將成為散落五大王國的詛咒源頭，野生動物都將黑化為我效命！」',
        showScatter: true,
        btnLabel: '聆聽校長指令 ▶'
      },
      {
        speaker: '努特校長 (Headmaster Noot)',
        title: '燈火魔法學院院長',
        avatar: './assets/sprites/headmaster_noot.png',
        text: `「年輕的法師，不要害怕！握緊你的魔杖與【${petName}】！我已將古代秘法【💖 淨化拯救 (Rescue Spell)】傳授給你！在戰鬥中削弱怪物至 45% 以下，便能以數學算術解開暗影束縛，淨化牠們成為夥伴，並奪回散落的守護神石！出發吧！」`,
        showScatter: false,
        btnLabel: '領命出征！奪回守護神石！🌟'
      }
    ];

    const cur = puppetScript[this.puppetStepIndex];
    if (!cur) return;

    if (this.puppetSpeakerNameEl) this.puppetSpeakerNameEl.textContent = cur.speaker;
    if (this.puppetSpeakerTitleEl) this.puppetSpeakerTitleEl.textContent = cur.title;
    if (this.puppetAvatarEl) this.puppetAvatarEl.src = cur.avatar;
    if (this.puppetDialogueTextEl) this.puppetDialogueTextEl.textContent = cur.text;

    if (this.puppetScatterEl) {
      if (cur.showScatter) {
        this.puppetScatterEl.classList.remove('hidden');
      } else {
        this.puppetScatterEl.classList.add('hidden');
      }
    }

    if (this.btnPuppetNext) {
      this.btnPuppetNext.innerHTML = `<span>${cur.btnLabel}</span>`;
    }

    if (this.puppetStepDotsEl) {
      this.puppetStepDotsEl.innerHTML = '';
      puppetScript.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `story-dot ${idx === this.puppetStepIndex ? 'active' : ''}`;
        this.puppetStepDotsEl.appendChild(dot);
      });
    }
  }

  nextPuppetStep() {
    this.puppetStepIndex++;
    if (this.puppetStepIndex >= 3) {
      this.finishStory();
    } else {
      this.renderPuppetStep();
    }
  }

  finishStory() {
    const wasQuest = this.isQuestDialogue;
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
    this.gameState.hasSeenPrologue = true;
    this.isQuestDialogue = false;
    eventBus.emit('PLAYER_STATS_CHANGED', this.gameState.getSnapshot());
    eventBus.emit('STORY_FINISHED');

    if (!wasQuest) {
      eventBus.emit('RETURN_TO_WORLD');
    }
  }

  renderStep() {
    const step = this.storyScript[this.currentStepIndex];
    if (!step) return;

    if (this.speakerNameEl) this.speakerNameEl.textContent = step.speaker;
    if (this.speakerTitleEl) this.speakerTitleEl.textContent = step.title;
    if (this.dialogueTextEl) this.dialogueTextEl.textContent = step.text;
    if (this.speakerAvatarEl) this.speakerAvatarEl.src = step.avatar;

    if (this.btnNext) {
      const label = step.btnLabel || (this.currentStepIndex === this.storyScript.length - 1 ? '挑選初始守護精靈！🐾' : '繼續聆聽 ▶');
      this.btnNext.innerHTML = `<span>${label}</span>`;
    }

    // Render step dots
    if (this.stepDotsEl) {
      this.stepDotsEl.innerHTML = '';
      this.storyScript.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `story-dot ${idx === this.currentStepIndex ? 'active' : ''}`;
        this.stepDotsEl.appendChild(dot);
      });
    }
  }
}
