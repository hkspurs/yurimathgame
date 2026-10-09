// QuestionGenerator.js - Comprehensive Math Problem Generator aligned with HK P1 Syllabus
// Extracted from 《躍思 數學三步達標訓練(上)》 & 《小學數學新思維(新版) 1上AB作業》
// Features 100,000+ Combinatorial Patterns and Anti-Repetition LRU Memory System

export const STORY_CHARACTERS = [
  '小巫師', '星光精靈', '艾拉', '諾亞', '莉莉', '波波', '火花狐', 
  '雪絨兔', '泡泡蟹', '雷光鼠', '幼角龍', '冰晶幼熊', '森林松鼠', 
  '海豚精靈', '花仙子', '樹人衛兵', '藥劑師布洛克', '校長努特', 
  '貓頭鷹博士', '彩虹鹿', '頑皮猴', '螢火精靈', '淘氣貓', '潮汐水獺', 
  '子賢', '美兒', '家豪', '樂樂', '方太太'
];

export const STORY_ITEMS = [
  { name: '魔法星石', unit: '顆', icon: '⭐' },
  { name: '彩虹糖果', unit: '粒', icon: '🍬' },
  { name: '遠古金幣', unit: '枚', icon: '🪙' },
  { name: '冰霜寶石', unit: '顆', icon: '💎' },
  { name: '幻光珍珠', unit: '顆', icon: '🔮' },
  { name: '熾熱火花石', unit: '塊', icon: '🔥' },
  { name: '治癒藥水', unit: '瓶', icon: '🧪' },
  { name: '奇蹟種子', unit: '粒', icon: '🌱' },
  { name: '金黃蘋果', unit: '個', icon: '🍎' },
  { name: '甜甜圈', unit: '個', icon: '🍩' },
  { name: '彩色貝殼', unit: '隻', icon: '🐚' },
  { name: '森林蘑菇', unit: '朵', icon: '🍄' },
  { name: '甜美草莓', unit: '粒', icon: '🍓' },
  { name: '魔法卷軸', unit: '張', icon: '📜' },
  { name: '水晶花朵', unit: '朵', icon: '🌸' },
  { name: '能量胡蘿蔔', unit: '根', icon: '🥕' },
  { name: '酥脆曲奇', unit: '塊', icon: '🍪' },
  { name: '紫晶葡萄', unit: '串', icon: '🍇' },
  { name: '香甜牛角包', unit: '個', icon: '🥐' },
  { name: '洋娃娃', unit: '個', icon: '🧸' },
  { name: '果汁', unit: '盒', icon: '🧃' }
];

export const STORY_PLACES = [
  '螢火森林', '海難海岸', '篝火火山峰', '寒顫雪山', '浮空風暴城', 
  '燈火學院', '星光圖書館', '精靈樹屋', '水晶洞穴', '古代神殿', 
  '冒險者營地', '彩虹花園', '月光湖畔', '沙灘'
];

// Anti-Repetition Ring Buffer (Remembers last 80 questions to prevent repeating numbers/patterns across reloads)
class QuestionDeduplicator {
  constructor(capacity = 80) {
    this.capacity = capacity;
    this.history = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = window.sessionStorage.getItem('prodigy_question_history');
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  }

  saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem('prodigy_question_history', JSON.stringify(this.history));
      }
    } catch (e) {}
  }

  isDuplicate(sig, promptText) {
    const cleanPrompt = promptText.replace(/\s+/g, ' ').trim();
    if (this.history.includes(sig)) return true;
    if (this.history.includes(cleanPrompt)) return true;
    return false;
  }

  record(sig, promptText) {
    const cleanPrompt = promptText.replace(/\s+/g, ' ').trim();
    this.history.push(sig);
    this.history.push(cleanPrompt);
    while (this.history.length > this.capacity * 2) {
      this.history.shift();
    }
    this.saveToStorage();
  }

  clear() {
    this.history = [];
    this.saveToStorage();
  }
}

const deduplicator = new QuestionDeduplicator(80);

export class QuestionGenerator {
  static lastModuleIndex = -1;

  static generate(grade = 1, realm = 'firefly_forest') {
    const g = Number(grade) || 1;
    if (g !== 1) {
      return this.generateHigherGrades(g);
    }

    // Try up to 45 times to ensure complete uniqueness from recent memory
    for (let attempt = 0; attempt < 45; attempt++) {
      const q = this.generateGrade1Internal(realm);
      const cleanPrompt = q.prompt.replace(/\s+/g, ' ').trim();
      const sig = `${q.topic}::${q.correctAnswer}::${cleanPrompt.slice(0, 35)}`;
      if (!deduplicator.isDuplicate(sig, q.prompt)) {
        deduplicator.record(sig, q.prompt);
        return q;
      }
    }

    // Fallback if saturated
    const fallback = this.generateGrade1Internal(realm);
    deduplicator.record(`fallback::${fallback.correctAnswer}`, fallback.prompt);
    return fallback;
  }

  // Pick random element helper
  static pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- Visual SVG Builders ---

  static buildNumberBondSvg(total, partA, partB, unknown = 'partB') {
    const dispTotal = unknown === 'total' ? '?' : total;
    const dispPartA = unknown === 'partA' ? '?' : partA;
    const dispPartB = unknown === 'partB' ? '?' : partB;
    const isTotalUnk = unknown === 'total';
    const isPartAUnk = unknown === 'partA';
    const isPartBUnk = unknown === 'partB';

    return `
      <div class="math-diagram-bond-wrapper">
        <svg class="bond-svg" viewBox="0 0 160 84" width="170" height="72">
          <line x1="80" y1="24" x2="38" y2="58" stroke="#8c531b" stroke-width="2.5" stroke-linecap="round" />
          <line x1="80" y1="24" x2="122" y2="58" stroke="#8c531b" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="80" cy="20" r="16" fill="${isTotalUnk ? '#fff3cd' : '#ffffff'}" stroke="${isTotalUnk ? '#d35400' : '#8c531b'}" stroke-width="${isTotalUnk ? '3' : '2'}" />
          <text x="80" y="25" text-anchor="middle" font-size="14" font-weight="900" fill="${isTotalUnk ? '#d35400' : '#2c1a0e'}">${dispTotal}</text>
          <circle cx="38" cy="58" r="15" fill="${isPartAUnk ? '#fff3cd' : '#ffffff'}" stroke="${isPartAUnk ? '#d35400' : '#27ae60'}" stroke-width="${isPartAUnk ? '3' : '2'}" />
          <text x="38" y="63" text-anchor="middle" font-size="14" font-weight="900" fill="${isPartAUnk ? '#d35400' : '#2c1a0e'}">${dispPartA}</text>
          <circle cx="122" cy="58" r="15" fill="${isPartBUnk ? '#fff3cd' : '#ffffff'}" stroke="${isPartBUnk ? '#d35400' : '#2980b9'}" stroke-width="${isPartBUnk ? '3' : '2'}" />
          <text x="122" y="63" text-anchor="middle" font-size="14" font-weight="900" fill="${isPartBUnk ? '#d35400' : '#2c1a0e'}">${dispPartB}</text>
        </svg>
      </div>
    `;
  }

  static buildTenFrameHtml(count, icon = '❄️') {
    const renderGrid = (filledCount) => {
      let cells = '';
      for (let i = 0; i < 10; i++) {
        const isFilled = i < filledCount;
        cells += `<div class="ten-frame-cell">${isFilled ? icon : ''}</div>`;
      }
      return `<div class="ten-frame-grid">${cells}</div>`;
    };

    if (count <= 10) {
      return `<div class="visual-ten-frames">${renderGrid(count)}</div>`;
    } else {
      return `
        <div class="visual-ten-frames">
          ${renderGrid(10)}
          <span class="ten-frame-plus">+</span>
          ${renderGrid(count - 10)}
        </div>
      `;
    }
  }

  static buildComparisonHtml(countA, iconA, nameA, countB, iconB, nameB) {
    const iconsA = Array(countA).fill(iconA).join(' ');
    const iconsB = Array(countB).fill(iconB).join(' ');
    return `
      <div class="visual-comparison-box">
        <div class="visual-comparison-row">
          <span class="visual-comparison-label">${nameA}:</span>
          <span class="visual-comparison-icons">${iconsA}</span>
        </div>
        <div class="visual-comparison-row">
          <span class="visual-comparison-label">${nameB}:</span>
          <span class="visual-comparison-icons">${iconsB}</span>
          <span class="visual-diff-badge">相差 ？</span>
        </div>
      </div>
    `;
  }

  static buildGroupAdditionHtml(countA, iconA, countB, iconB) {
    const iconsA = Array(countA).fill(iconA).join(' ');
    const iconsB = Array(countB).fill(iconB).join(' ');
    return `
      <div class="visual-groups-box">
        <div class="visual-item-group">${iconsA} <span class="group-count">(${countA})</span></div>
        <span class="visual-group-op">+</span>
        <div class="visual-item-group">${iconsB} <span class="group-count">(${countB})</span></div>
        <span class="visual-group-op">=</span>
        <div class="visual-item-group target-group">?</div>
      </div>
    `;
  }

  static buildNumberTrackSvg(nums, missingIdx) {
    const boxW = 34;
    const boxH = 34;
    const gap = 8;
    const totalW = nums.length * boxW + (nums.length - 1) * gap + 20;

    const items = nums.map((val, idx) => {
      const isMissing = idx === missingIdx;
      const x = 10 + idx * (boxW + gap);
      return `
        <g transform="translate(${x}, 6)">
          <rect width="${boxW}" height="${boxH}" rx="7" fill="${isMissing ? '#fff3cd' : '#ffffff'}" stroke="${isMissing ? '#e67e22' : '#8c531b'}" stroke-width="${isMissing ? '2.5' : '1.8'}" />
          <text x="${boxW / 2}" y="22" text-anchor="middle" font-size="14" font-weight="900" fill="${isMissing ? '#e67e22' : '#2c1a0e'}">${isMissing ? '?' : val}</text>
        </g>
        ${idx < nums.length - 1 ? `<path d="M ${x + boxW + 2} 23 L ${x + boxW + gap - 2} 23" stroke="#bcaaa4" stroke-width="2" stroke-dasharray="2,1" />` : ''}
      `;
    }).join('');

    return `
      <div class="math-diagram-track-wrapper">
        <svg viewBox="0 0 ${totalW} 46" width="${Math.min(270, totalW)}" height="46">
          ${items}
        </svg>
      </div>
    `;
  }

  // --- Grade 1 Authentic Curriculum Modules ---

  static generateGrade1Internal(realm) {
    // 12 Authentic Units from 躍思 & 新思維
    const modules = [
      () => this.genUnitCounting20(),       // 1. 20以內的數與數數
      () => this.genUnitSequences(),        // 2. 順數與倒數規律 (9大題型)
      () => this.genUnitParity(),           // 3. 奇數與偶數
      () => this.genUnitComparison(),       // 4. 比較數量與相差
      () => this.genUnitOrdinal(),          // 5. 排次序 (序數)
      () => this.genUnitNumberBonds(),      // 6. 數的分解與合成 (2至18)
      () => this.genUnitAdditionBasic(),    // 7. 基本加法
      () => this.genUnitAdditionApplied(),  // 8. 加法的應用 (湊十法/交換律/情境)
      () => this.genUnitSubtractionBasic(), // 9. 基本減法
      () => this.genUnitSubtractionApplied(),// 10. 減法的應用 (還剩下/還有/連減)
      () => this.genUnitZeroConcepts(),     // 11. 0的認識與加減運算
      () => this.genUnit3DShapes()          // 12. 立體圖形性質 (滾動/堆疊)
    ];

    // Ensure module rotation so no unit repeats consecutively
    let moduleIdx;
    let attempts = 0;
    do {
      moduleIdx = Math.floor(Math.random() * modules.length);
      attempts++;
    } while (moduleIdx === this.lastModuleIndex && attempts < 10);
    this.lastModuleIndex = moduleIdx;

    return modules[moduleIdx].call(this);
  }

  // Unit 1: 20以內的數與數數 (新思維 P2, 躍思 P2)
  static genUnitCounting20() {
    const topic = '一年級 • 20以內的數與數數';
    const item = this.pick(STORY_ITEMS);
    const count = Math.floor(Math.random() * 15) + 5; // 5..19
    const diagram = this.buildTenFrameHtml(count, item.icon);
    const prompt = `數一數十格陣中的 ${item.name}，共有多少${item.unit}？`;
    return this.formatQuestion(topic, prompt, count, 1, diagram);
  }

  // Unit 2: 順數與倒數規律 (躍思 P4, 新思維 P4, P10) - 9大題型
  static genUnitSequences() {
    const topic = '一年級 • 順數和倒數規律';
    const type = Math.floor(Math.random() * 9);

    if (type === 0) {
      // 1. 1個一數順數填空 (長度 4~5，起始 0..15，隨機空缺位置，多樣題幹)
      const len = Math.random() > 0.5 ? 5 : 4;
      const start = Math.floor(Math.random() * (20 - len)) + 1;
      const missingIdx = Math.floor(Math.random() * (len - 1)) + 1;
      const originalNums = Array.from({ length: len }, (_, i) => start + i);
      const ans = originalNums[missingIdx];
      const displayNums = [...originalNums];
      displayNums[missingIdx] = '_____';

      const promptTemplates = [
        `依順數規律填上答案： ${displayNums.join(', ')}`,
        `按由小至大的順序數下去，空格中應填入哪個數字？\n${displayNums.join(', ')}`,
        `觀察數列規律，在橫線上填上正確數字：\n${displayNums.join(', ')}`
      ];
      const prompt = this.pick(promptTemplates);
      const diagram = this.buildNumberTrackSvg(originalNums, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 1) {
      // 2. 2個一數順數（雙數數列 2, 4, 6...）
      const evens = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      const len = 4;
      const maxStartIdx = evens.length - len;
      const startIdx = Math.floor(Math.random() * (maxStartIdx + 1));
      const sub = evens.slice(startIdx, startIdx + len);
      const missingIdx = Math.floor(Math.random() * (len - 1)) + 1;
      const ans = sub[missingIdx];
      const displayNums = [...sub];
      displayNums[missingIdx] = '_____';

      const prompt = `2個一數由小至大數下去： ${displayNums.join(', ')} ，橫線上應填入哪個數字？`;
      const diagram = this.buildNumberTrackSvg(sub, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 2) {
      // 3. 2個一數順數（單數數列 1, 3, 5...）
      const odds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
      const len = 4;
      const maxStartIdx = odds.length - len;
      const startIdx = Math.floor(Math.random() * (maxStartIdx + 1));
      const sub = odds.slice(startIdx, startIdx + len);
      const missingIdx = Math.floor(Math.random() * (len - 1)) + 1;
      const ans = sub[missingIdx];
      const displayNums = [...sub];
      displayNums[missingIdx] = '_____';

      const prompt = `2個一數順數： ${displayNums.join(', ')} ，橫線上應填入哪個數字？`;
      const diagram = this.buildNumberTrackSvg(sub, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 3) {
      // 4. 5個一數順數 (0, 5, 10, 15, 20)
      const fives = [0, 5, 10, 15, 20];
      const missingIdx = Math.floor(Math.random() * 4) + 1;
      const ans = fives[missingIdx];
      const displayNums = [...fives];
      displayNums[missingIdx] = '_____';

      const prompt = `5個一數由小至大數下去： ${displayNums.join(', ')} ，橫線上應填入哪個數字？`;
      const diagram = this.buildNumberTrackSvg(fives, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 4) {
      // 5. 1個一數倒數填空 (由大至小 20, 19, 18...)
      const len = Math.random() > 0.5 ? 5 : 4;
      const start = Math.floor(Math.random() * (20 - len)) + len;
      const missingIdx = Math.floor(Math.random() * (len - 1)) + 1;
      const originalNums = Array.from({ length: len }, (_, i) => start - i);
      const ans = originalNums[missingIdx];
      const displayNums = [...originalNums];
      displayNums[missingIdx] = '_____';

      const prompt = `依倒數規律（由大至小）填上答案： ${displayNums.join(', ')}`;
      const diagram = this.buildNumberTrackSvg(originalNums, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 5) {
      // 6. 2個一數倒數 (20, 18, 16... 或 10, 8, 6...)
      const evensRev = [20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
      const len = 4;
      const startIdx = Math.floor(Math.random() * (evensRev.length - len + 1));
      const sub = evensRev.slice(startIdx, startIdx + len);
      const missingIdx = Math.floor(Math.random() * (len - 1)) + 1;
      const ans = sub[missingIdx];
      const displayNums = [...sub];
      displayNums[missingIdx] = '_____';

      const prompt = `2個一數倒數（由大至小）： ${displayNums.join(', ')} ，橫線上應填入哪個數字？`;
      const diagram = this.buildNumberTrackSvg(sub, missingIdx);
      return this.formatQuestion(topic, prompt, ans, 1, diagram);
    } else if (type === 6) {
      // 7. 前後相鄰數關係 (躍思 P4, 新思維 P10)
      const subVariant = Math.floor(Math.random() * 4);
      if (subVariant === 0) {
        // 後面一個數
        const n = Math.floor(Math.random() * 18) + 1; // 1..18
        const prompt = `在數線上，數字 ${n} 的「後面一個數」是 _____。`;
        return this.formatQuestion(topic, prompt, n + 1, 1);
      } else if (subVariant === 1) {
        // 前面一個數
        const n = Math.floor(Math.random() * 19) + 2; // 2..20
        const prompt = `在數線上，數字 ${n} 的「前面一個數」是 _____。`;
        return this.formatQuestion(topic, prompt, n - 1, 1);
      } else if (subVariant === 2) {
        // 兩數之間
        const n = Math.floor(Math.random() * 17) + 1; // 1..17
        const prompt = `在數字 ${n} 和 ${n + 2} 之間的數是 _____。`;
        return this.formatQuestion(topic, prompt, n + 1, 1);
      } else {
        // 比某數大1 / 小1
        const isBigger = Math.random() > 0.5;
        const n = Math.floor(Math.random() * 17) + 2;
        if (isBigger) {
          const prompt = `比 ${n} 大 1 的數是 _____。`;
          return this.formatQuestion(topic, prompt, n + 1, 1);
        } else {
          const prompt = `比 ${n} 小 1 的數是 _____。`;
          return this.formatQuestion(topic, prompt, n - 1, 1);
        }
      }
    } else if (type === 7) {
      // 8. 魔法火車車廂 / 精靈階梯情境題
      const isTrain = Math.random() > 0.5;
      if (isTrain) {
        const start = Math.floor(Math.random() * 13) + 2;
        const missingIdx = 2; // 中間車廂
        const nums = [start, start + 1, start + 2, start + 3, start + 4];
        const ans = nums[missingIdx];
        const displayNums = [...nums];
        displayNums[missingIdx] = '?';
        const prompt = `🚂 魔法火車的車廂號碼是： [${displayNums[0]}] ➔ [${displayNums[1]}] ➔ [ ? ] ➔ [${displayNums[3]}] ➔ [${displayNums[4]}] ，問號車廂的號碼是幾號？`;
        const diagram = this.buildNumberTrackSvg(nums, missingIdx);
        return this.formatQuestion(topic, prompt, ans, 1, diagram);
      } else {
        const n = Math.floor(Math.random() * 14) + 3;
        const prompt = `🐾 守護精靈正在第 ${n} 級魔法階梯，向前跳 1 級會到達第 _____ 級階梯。`;
        return this.formatQuestion(topic, prompt, n + 1, 1);
      }
    } else {
      // 9. 判斷順數還是倒數 (新思維 P4)
      const isAsc = Math.random() > 0.5;
      const start = isAsc ? Math.floor(Math.random() * 12) + 1 : Math.floor(Math.random() * 12) + 7;
      const nums = isAsc 
        ? [start, start + 1, start + 2, start + 3]
        : [start, start - 1, start - 2, start - 3];
      const ans = isAsc ? '順數' : '倒數';
      const prompt = `數列： ${nums.join(', ')} ，這是順數還是倒數？`;
      return this.formatQuestion(topic, prompt, ans, 1, null, ['順數', '倒數']);
    }
  }

  // Unit 3: 奇數和偶數 (躍思 P6, 新思維 P4)
  static genUnitParity() {
    const topic = '一年級 • 奇數 (單數) 與 偶數 (雙數)';
    const type = Math.floor(Math.random() * 3);

    if (type === 0) {
      // 判斷奇偶 (單雙)
      const n = Math.floor(Math.random() * 18) + 2; // 2..19
      const isEven = n % 2 === 0;
      const ans = isEven ? '偶數 (雙數)' : '奇數 (單數)';
      const item = this.pick(STORY_ITEMS);
      const diagram = this.buildTenFrameHtml(n, item.icon);
      const prompt = `十格陣中有 ${n} ${item.unit}${item.name}，這個數是奇數（單數）還是偶數（雙數）？`;
      return this.formatQuestion(topic, prompt, ans, 1, diagram, ['奇數 (單數)', '偶數 (雙數)']);
    } else if (type === 1) {
      // 4選1挑出偶數
      const even = (Math.floor(Math.random() * 9) + 1) * 2; // 2..18
      const odds = new Set();
      while (odds.size < 3) {
        const o = (Math.floor(Math.random() * 9) + 1) * 2 - 1; // 1..17
        if (o !== even) odds.add(o);
      }
      const opts = [even, ...Array.from(odds)];
      opts.sort(() => Math.random() - 0.5);
      const prompt = `下列哪一個數字是偶數（雙數）？`;
      return this.formatQuestion(topic, prompt, even, 1, null, opts.map(String));
    } else {
      // 4選1挑出奇數
      const odd = (Math.floor(Math.random() * 9) + 1) * 2 - 1; // 1..17
      const evens = new Set();
      while (evens.size < 3) {
        const e = (Math.floor(Math.random() * 9) + 1) * 2; // 2..18
        if (e !== odd) evens.add(e);
      }
      const opts = [odd, ...Array.from(evens)];
      opts.sort(() => Math.random() - 0.5);
      const prompt = `下列哪一個數字是奇數（單數）？`;
      return this.formatQuestion(topic, prompt, odd, 1, null, opts.map(String));
    }
  }

  // Unit 4: 比較數量與相差 (躍思 P8, 新思維 P6)
  static genUnitComparison() {
    const topic = '一年級 • 比較數量與相差應用題';
    const type = Math.floor(Math.random() * 4);
    const charA = this.pick(STORY_CHARACTERS);
    let charB = this.pick(STORY_CHARACTERS);
    while (charB === charA) charB = this.pick(STORY_CHARACTERS);
    const item = this.pick(STORY_ITEMS);

    const a = Math.floor(Math.random() * 11) + 8; // 8..18
    const b = Math.floor(Math.random() * (a - 3)) + 2; // 2..a-1
    const diff = a - b;

    if (type === 0) {
      // 看圖比較兩種物品相差多少
      let itemB = this.pick(STORY_ITEMS);
      while (itemB.name === item.name) itemB = this.pick(STORY_ITEMS);
      const diagram = this.buildComparisonHtml(a, item.icon, item.name, b, itemB.icon, itemB.name);
      const prompt = `看圖比較：${item.name} 與 ${itemB.name} 的數量相差多少？`;
      return this.formatQuestion(topic, prompt, diff, 1, diagram);
    } else if (type === 1) {
      // A 比 B 少多少
      const prompt = `${charA}有 ${item.name} ${a} ${item.unit}，${charB}有 ${b} ${item.unit}，${charB}比${charA}少 _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, diff, 1);
    } else if (type === 2) {
      // A 比 B 多多少
      const prompt = `${charA}有 ${item.name} ${a} ${item.unit}，${charB}有 ${b} ${item.unit}，${charA}比${charB}多 _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, diff, 1);
    } else {
      // 躍思 P8 / 新思維 P6: 還要多收集幾隻才和對方一樣多 (拔尖高階思維)
      const prompt = `${charA}有 ${item.name} ${a} ${item.unit}，${charB}只有 ${b} ${item.unit}。${charB}還要多收集 _____ ${item.unit}，才和${charA}一樣多？`;
      return this.formatQuestion(topic, prompt, diff, 1);
    }
  }

  // Unit 5: 排次序 (序數) (躍思 P10, 新思維 P8)
  static genUnitOrdinal() {
    const topic = '一年級 • 排次序與序數';
    const queue = ['小狗 🐶', '小貓 🐱', '小兔 🐰', '小熊 🐻', '小鹿 🦌', '小狐 🦊'];
    const idx = Math.floor(Math.random() * queue.length); // 0..5
    const fromLeft = Math.random() > 0.5;

    if (fromLeft) {
      const pos = idx + 1;
      const target = queue[idx].split(' ')[0];
      const prompt = `隊列從左至右排著： ${queue.join(', ')}。從左起數，第 ${pos} 隻動物是誰？`;
      return this.formatQuestion(topic, prompt, target, 1, null, queue.map(q => q.split(' ')[0]));
    } else {
      const pos = (queue.length - idx);
      const target = queue[idx].split(' ')[0];
      const prompt = `隊列從左至右排著： ${queue.join(', ')}。從右起數，第 ${pos} 隻動物是誰？`;
      return this.formatQuestion(topic, prompt, target, 1, null, queue.map(q => q.split(' ')[0]));
    }
  }

  // Unit 6: 數的分解與合成 (躍思 P16-22, 新思維 P12-16)
  static genUnitNumberBonds() {
    const topic = '一年級 • 數的分解與合成 (Number Bonds)';
    const type = Math.floor(Math.random() * 5);
    const total = Math.floor(Math.random() * 15) + 4; // 4..18
    const partA = Math.floor(Math.random() * (total - 2)) + 1; // 1..total-1
    const partB = total - partA;

    if (type === 0) {
      // 數鍵樹求合數
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'total');
      const prompt = `看數鍵分解樹，${partA} 和 ${partB} 合成為多少？`;
      return this.formatQuestion(topic, prompt, total, 1, diagram);
    } else if (type === 1) {
      // 數鍵樹求右部分
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'partB');
      const prompt = `看數鍵分解樹，${total} 分解為 ${partA} 和幾？`;
      return this.formatQuestion(topic, prompt, partB, 1, diagram);
    } else if (type === 2) {
      // 考卷字眼：_____ 和 B 合成為 Total (躍思 P18)
      const prompt = `在橫線上填上答案： _____ 和 ${partB} 合成為 ${total}。`;
      return this.formatQuestion(topic, prompt, partA, 1);
    } else if (type === 3) {
      // 考卷字眼：Total 分解為 A 和 _____ (躍思 P18)
      const prompt = `在橫線上填上答案： ${total} 分解為 ${partA} 和 _____。`;
      return this.formatQuestion(topic, prompt, partB, 1);
    } else {
      // 躍思 P18 實物分堆
      const char = this.pick(STORY_CHARACTERS);
      const item = this.pick(STORY_ITEMS);
      const prompt = `${char}把 ${total} ${item.unit}${item.name}分成兩份，一份有 ${partA} ${item.unit}，另一份有 _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, partB, 1);
    }
  }

  // Unit 7: 基本加法 (躍思 P32, 新思維 P26)
  static genUnitAdditionBasic() {
    const topic = '一年級 • 基本加法運算';
    const type = Math.floor(Math.random() * 3);
    const a = Math.floor(Math.random() * 9) + 1; // 1..9
    const b = Math.floor(Math.random() * (19 - a)) + 1; // sum <= 20
    const sum = a + b;

    if (type === 0) {
      // 標準加法
      const prompt = `計算下列加法運算： ${a} + ${b} = ?`;
      return this.formatQuestion(topic, prompt, sum, 1);
    } else if (type === 1) {
      // 逆向加法填空 (□ + a = sum / a + □ = sum)
      const prompt = `在空格中填入正確數字： □ + ${b} = ${sum}`;
      return this.formatQuestion(topic, prompt, a, 1);
    } else {
      // 圖案分組加法
      const item = this.pick(STORY_ITEMS);
      const diagram = this.buildGroupAdditionHtml(a, item.icon, b, item.icon);
      const prompt = `看圖計算物品總數： ${a} + ${b} = ?`;
      return this.formatQuestion(topic, prompt, sum, 1, diagram);
    }
  }

  // Unit 8: 加法的應用 (躍思 P34, 新思維 P26)
  static genUnitAdditionApplied() {
    const topic = '一年級 • 加法的應用情境題';
    const type = Math.floor(Math.random() * 4);
    const char = this.pick(STORY_CHARACTERS);
    const item = this.pick(STORY_ITEMS);
    const a = Math.floor(Math.random() * 8) + 2; // 2..9
    const b = Math.floor(Math.random() * (18 - a)) + 2;
    const sum = a + b;

    if (type === 0) {
      // 躍思 P34 原有 + 又多買
      const prompt = `家裏原有 ${item.name} ${a} ${item.unit}，${char}多買了 ${b} ${item.unit}，現在共有 ${item.name} _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, sum, 1);
    } else if (type === 1) {
      // 地上有洋娃娃 3 個和 4 個，地上共有洋娃娃 _____ 個 (躍思 P34)
      const prompt = `地上有 ${item.name} ${a} ${item.unit} 和 ${b} ${item.unit}，地上共有 ${item.name} _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, sum, 1);
    } else if (type === 2) {
      // 加法交換律 (躍思 P32)
      const prompt = `根據加法交換律填空： ${a} + ${b} = ${b} + _____ = ${sum}`;
      return this.formatQuestion(topic, prompt, a, 1);
    } else {
      // 湊十法分解思維 (新思維 P26)
      const base = 9;
      const bVal = Math.floor(Math.random() * 6) + 3; // 3..8
      const split = bVal - 1;
      const total = base + bVal;
      const prompt = `利用湊十法計算： 9 + ${bVal} = 9 + 1 + _____ = ${total}`;
      return this.formatQuestion(topic, prompt, split, 1);
    }
  }

  // Unit 9: 基本減法 (躍思 P36, 新思維 P28)
  static genUnitSubtractionBasic() {
    const topic = '一年級 • 基本減法運算';
    const type = Math.floor(Math.random() * 3);
    const a = Math.floor(Math.random() * 14) + 6; // 6..19
    const b = Math.floor(Math.random() * (a - 2)) + 1; // 1..a-1
    const diff = a - b;

    if (type === 0) {
      // 標準減法
      const prompt = `計算下列減法運算： ${a} - ${b} = ?`;
      return this.formatQuestion(topic, prompt, diff, 1);
    } else if (type === 1) {
      // 逆向減法填空 (a - □ = diff)
      const prompt = `在空格中填入正確數字： ${a} - □ = ${diff}`;
      return this.formatQuestion(topic, prompt, b, 1);
    } else {
      // 逆向減法求被減數 (□ - b = diff)
      const prompt = `在空格中填入正確數字： □ - ${b} = ${diff}`;
      return this.formatQuestion(topic, prompt, a, 1);
    }
  }

  // Unit 10: 減法的應用 (躍思 P38, 新思維 P28)
  static genUnitSubtractionApplied() {
    const topic = '一年級 • 減法的應用情境題';
    const type = Math.floor(Math.random() * 3);
    const char = this.pick(STORY_CHARACTERS);
    const item = this.pick(STORY_ITEMS);
    const place = this.pick(STORY_PLACES);

    const a = Math.floor(Math.random() * 12) + 7; // 7..18
    const b = Math.floor(Math.random() * (a - 3)) + 2; // 2..a-1
    const rem = a - b;

    if (type === 0) {
      // 躍思 P38「還剩下」：海星原有 15 隻，被浪花沖走 6 隻，還剩下...
      const prompt = `在${place}原有 ${item.name} ${a} ${item.unit}，被拿走了 ${b} ${item.unit}，還剩下 ${item.name} _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, rem, 1);
    } else if (type === 1) {
      // 躍思 P34「還有」：小章魚原有珍珠 12 顆，送給朋友 5 顆，牠還有...
      const prompt = `${char}原有 ${item.name} ${a} ${item.unit}，送給朋友 ${b} ${item.unit}，${char}還有 ${item.name} _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, rem, 1);
    } else {
      // 躍思 P38 連減應用題：原有 18 塊水晶，第一次拿走 5 塊，第二次拿走 3 塊，還剩下...
      const total = Math.floor(Math.random() * 7) + 12; // 12..18
      const sub1 = Math.floor(Math.random() * 4) + 2; // 2..5
      const sub2 = Math.floor(Math.random() * 3) + 2; // 2..4
      const left = total - sub1 - sub2;
      const prompt = `神殿寶箱裏原有 ${item.name} ${total} ${item.unit}，第一次拿走 ${sub1} ${item.unit}，第二次拿走 ${sub2} ${item.unit}，還剩下 _____ ${item.unit}。`;
      return this.formatQuestion(topic, prompt, left, 1);
    }
  }

  // Unit 11: 0的認識與加減法 (躍思 P40, 新思維 P30)
  static genUnitZeroConcepts() {
    const topic = '一年級 • 0的認識與加減運算';
    const type = Math.floor(Math.random() * 4);
    const n = Math.floor(Math.random() * 15) + 3; // 3..17

    if (type === 0) {
      // N - N = 0 (全拿走/全飛走)
      const prompt = `鳥巢裏原有小鳥 ${n} 隻，全都飛走了，巢裏還有小鳥 _____ 隻。`;
      return this.formatQuestion(topic, prompt, 0, 1);
    } else if (type === 1) {
      // 0 與其他數的大小比較
      const prompt = `數字大小比較： 0 比 ${n} （大 / 小）？`;
      return this.formatQuestion(topic, prompt, '小', 1, null, ['大', '小']);
    } else if (type === 2) {
      // 0 + N = N 或 N + 0 = N
      const prompt = `計算算式： ${n} + 0 = ?`;
      return this.formatQuestion(topic, prompt, n, 1);
    } else {
      // N - 0 = N
      const prompt = `計算算式： ${n} - 0 = ?`;
      return this.formatQuestion(topic, prompt, n, 1);
    }
  }

  // Unit 12: 立體圖形性質 (躍思 P24-26, 新思維 P20-24)
  static genUnit3DShapes() {
    const topic = '一年級 • 立體圖形與性質';
    const type = Math.floor(Math.random() * 3);

    if (type === 0) {
      // 滾動特性 (球體、圓柱體、圓錐)
      const prompt = `下列哪一個立體圖形「能夠滾動」？`;
      const correct = '球體';
      const wrong = ['正方體', '長方體', '角柱'];
      return this.formatQuestion(topic, prompt, correct, 1, null, [correct, ...wrong]);
    } else if (type === 1) {
      // 堆疊特性 (正方體、長方體)
      const prompt = `下列哪一個立體圖形「最容易疊穩」？`;
      const correct = '正方體';
      const wrong = ['球體', '圓錐', '角錐'];
      return this.formatQuestion(topic, prompt, correct, 1, null, [correct, ...wrong]);
    } else {
      // 新思維 P24 實物形狀
      const prompt = `把兩盒長方體紙包果汁疊起來，它的形狀最像哪種立體圖形？`;
      const correct = '長方體';
      const wrong = ['球體', '圓錐', '圓柱體'];
      return this.formatQuestion(topic, prompt, correct, 1, null, [correct, ...wrong]);
    }
  }

  // Grades 2 to 8 Support
  static generateHigherGrades(grade) {
    const g = Number(grade);
    switch (g) {
      case 2:
        return this.genGrade2();
      case 3:
        return this.genGrade3();
      case 4:
        return this.genGrade4();
      case 5:
        return this.genGrade5();
      case 6:
        return this.genGrade6();
      case 7:
        return this.genGrade7();
      case 8:
      default:
        return this.genGrade8();
    }
  }

  static genGrade2() {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      const a = Math.floor(Math.random() * 40) + 15;
      const b = Math.floor(Math.random() * 40) + 10;
      return this.formatQuestion('二年級 • 兩位數加法', `計算兩位數加法： ${a} + ${b} = ?`, a + b, 2);
    } else if (type === 1) {
      const b = Math.floor(Math.random() * 30) + 10;
      const ans = Math.floor(Math.random() * 30) + 10;
      return this.formatQuestion('二年級 • 兩位數減法', `計算兩位數減法： ${ans + b} - ${b} = ?`, ans, 2);
    } else {
      const a = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
      const b = Math.floor(Math.random() * 9) + 2;
      return this.formatQuestion('二年級 • 基礎乘法表', `計算乘法： ${a} × ${b} = ?`, a * b, 2);
    }
  }

  static genGrade3() {
    const isMult = Math.random() > 0.4;
    if (isMult) {
      const a = Math.floor(Math.random() * 10) + 3;
      const b = Math.floor(Math.random() * 9) + 2;
      return this.formatQuestion('三年級 • 九九乘法表挑戰', `計算乘法九九乘法： ${a} × ${b} = ?`, a * b, 3);
    } else {
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = Math.floor(Math.random() * 9) + 2;
      return this.formatQuestion('三年級 • 基礎除法運算', `計算除法運算： ${b * ans} ÷ ${b} = ?`, ans, 3);
    }
  }

  static genGrade4() {
    const a = Math.floor(Math.random() * 30) + 12;
    const b = Math.floor(Math.random() * 8) + 3;
    return this.formatQuestion('四年級 • 多位數運算與應用題', `圖書館有 ${a} 個書架，每個書架放 ${b} 本魔法書，共有多少本？`, a * b, 4);
  }

  static genGrade5() {
    const a = Math.floor(Math.random() * 6) + 2;
    const b = Math.floor(Math.random() * 6) + 3;
    const c = Math.floor(Math.random() * 15) + 5;
    return this.formatQuestion('五年級 • 四則混合運算', `計算四則運算： ${a} × ${b} + ${c} = ?`, a * b + c, 5);
  }

  static genGrade6() {
    const a = Math.floor(Math.random() * 8) + 3;
    const ans = Math.floor(Math.random() * 9) + 2;
    return this.formatQuestion('六年級 • 代數方程式求解', `求解未知數 x ： ${a}x = ${a * ans} ，則 x = ?`, ans, 6);
  }

  static genGrade7() {
    const a = Math.floor(Math.random() * 4) + 2;
    const ans = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    return this.formatQuestion('七年級 • 兩步方程式運算', `求解兩步方程式： ${a}x + ${b} = ${a * ans + b} ，則 x = ?`, ans, 7);
  }

  static genGrade8() {
    const root = Math.floor(Math.random() * 10) + 2;
    return this.formatQuestion('八年級 • 開平方根運算', `計算平方根： √${root * root} = ?`, root, 8);
  }

  // Option formatter
  static formatQuestion(topic, prompt, answer, grade = 1, diagramHtml = null, customOptions = null) {
    let options;
    if (customOptions && Array.isArray(customOptions) && customOptions.length >= 2) {
      options = [...customOptions];
      if (!options.some(opt => String(opt).trim() === String(answer).trim())) {
        options.push(String(answer));
      }
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
    } else {
      const distractors = new Set();
      const numAns = Number(answer);
      const isNum = !isNaN(numAns);

      while (distractors.size < 3) {
        let wrong;
        if (isNum) {
          const maxOffset = grade === 1 ? 4 : (grade <= 3 ? 6 : 10);
          const offset = (Math.floor(Math.random() * maxOffset) + 1) * (Math.random() > 0.5 ? 1 : -1);
          wrong = numAns + offset;
          if (wrong >= 0 && wrong !== numAns) {
            if (grade === 1 && wrong > 20) {
              wrong = Math.max(0, numAns - (Math.floor(Math.random() * 3) + 1));
            }
            if (wrong !== numAns) distractors.add(wrong);
          }
        } else {
          distractors.add('0');
        }
      }

      options = Array.from(distractors);
      options.push(answer);
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
    }

    return {
      topic,
      prompt,
      correctAnswer: answer,
      options: options.map(String),
      diagramHtml: diagramHtml || null
    };
  }
}
