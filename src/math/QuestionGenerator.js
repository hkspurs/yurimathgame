// QuestionGenerator.js - Procedural pedagogical math problem generator strictly aligned with Grades 1-8
export class QuestionGenerator {
  static generate(grade = 1, realm = 'firefly_forest') {
    const g = Number(grade) || 1;
    switch (g) {
      case 1:
        return this.generateGrade1(realm);
      case 2:
        return this.generateGrade2();
      case 3:
        return this.generateGrade3();
      case 4:
        return this.generateGrade4();
      case 5:
        return this.generateGrade5();
      case 6:
        return this.generateGrade6();
      case 7:
        return this.generateGrade7();
      case 8:
        return this.generateGrade8();
      default:
        return this.generateGrade1(realm);
    }
  }

  // --- Visual SVG & HTML Diagram Builders for Grade 1 ---

  // 1. Number Bond Tree (數鍵分解樹)
  static buildNumberBondSvg(total, partA, partB, unknown = 'partB') {
    const dispTotal = unknown === 'total' ? '?' : total;
    const dispPartA = unknown === 'partA' ? '?' : partA;
    const dispPartB = unknown === 'partB' ? '?' : partB;
    const isTotalUnk = unknown === 'total';
    const isPartAUnk = unknown === 'partA';
    const isPartBUnk = unknown === 'partB';

    return `
      <div class="math-diagram-bond-wrapper">
        <svg class="bond-svg" viewBox="0 0 160 84" width="160" height="76">
          <line x1="80" y1="24" x2="38" y2="58" stroke="#8c531b" stroke-width="2.5" stroke-linecap="round" />
          <line x1="80" y1="24" x2="122" y2="58" stroke="#8c531b" stroke-width="2.5" stroke-linecap="round" />
          
          <!-- Top Node (Total) -->
          <circle cx="80" cy="20" r="16" fill="${isTotalUnk ? '#fff3cd' : '#ffffff'}" stroke="${isTotalUnk ? '#d35400' : '#8c531b'}" stroke-width="${isTotalUnk ? '3' : '2'}" />
          <text x="80" y="25" text-anchor="middle" font-size="14" font-weight="900" fill="${isTotalUnk ? '#d35400' : '#2c1a0e'}">${dispTotal}</text>
          
          <!-- Left Node (Part A) -->
          <circle cx="38" cy="58" r="15" fill="${isPartAUnk ? '#fff3cd' : '#ffffff'}" stroke="${isPartAUnk ? '#d35400' : '#27ae60'}" stroke-width="${isPartAUnk ? '3' : '2'}" />
          <text x="38" y="63" text-anchor="middle" font-size="14" font-weight="900" fill="${isPartAUnk ? '#d35400' : '#2c1a0e'}">${dispPartA}</text>
          
          <!-- Right Node (Part B) -->
          <circle cx="122" cy="58" r="15" fill="${isPartBUnk ? '#fff3cd' : '#ffffff'}" stroke="${isPartBUnk ? '#d35400' : '#2980b9'}" stroke-width="${isPartBUnk ? '3' : '2'}" />
          <text x="122" y="63" text-anchor="middle" font-size="14" font-weight="900" fill="${isPartBUnk ? '#d35400' : '#2c1a0e'}">${dispPartB}</text>
        </svg>
      </div>
    `;
  }

  // 2. Ten-Frame (十格陣)
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
      return `
        <div class="visual-ten-frames">
          ${renderGrid(count)}
        </div>
      `;
    } else {
      const full = 10;
      const extra = count - 10;
      return `
        <div class="visual-ten-frames">
          ${renderGrid(full)}
          <span class="ten-frame-plus">+</span>
          ${renderGrid(extra)}
        </div>
      `;
    }
  }

  // 3. Comparison Rows (比較數量與相差圖)
  static buildComparisonHtml(countA, iconA, nameA, countB, iconB, nameB) {
    const iconsA = Array(countA).fill(iconA).join(' ');
    const iconsB = Array(countB).fill(iconB).join(' ');
    const diff = Math.abs(countA - countB);
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

  // 4. Group Addition (物品分組加法圖)
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

  // 5. Place Value Blocks (個位與十位積木棒)
  static buildPlaceValueHtml(tens, ones) {
    const tensRods = Array(tens).fill(`
      <div class="visual-ten-rod" title="1個十 (10)">
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
        <div class="visual-ten-segment"></div>
      </div>
    `).join('');

    const unitCubes = Array(ones).fill(`<div class="visual-unit-cube" title="1個一"></div>`).join('');

    return `
      <div class="visual-place-value">
        <div class="visual-tens-container">
          ${tensRods}
          <span class="pv-label">${tens}個十</span>
        </div>
        <span class="pv-separator">和</span>
        <div class="visual-units-container">
          <div class="visual-units-cluster">${unitCubes}</div>
          <span class="pv-label">${ones}個一</span>
        </div>
      </div>
    `;
  }

  // --- Grade 1: Strictly Hong Kong Primary 1 Syllabus (Randomized Across All Topics) ---

  static generateGrade1() {
    const modules = [
      () => this.generateGrade1NumberBonds(),
      () => this.generateGrade1ComparisonAndSubtraction(),
      () => this.generateGrade1TenFramesAndParity(),
      () => this.generateGrade1Addition(),
      () => this.generateGrade1PlaceValueAndReverse()
    ];
    const pick = modules[Math.floor(Math.random() * modules.length)];
    return pick.call(this);
  }

  // Module 1: 數的分解與合成 (2至18)
  static generateGrade1NumberBonds() {
    const type = Math.floor(Math.random() * 5);
    const topic = '一年級 • 數的分解與合成 (Number Bonds)';

    if (type === 0) {
      // 數鍵分解樹求合數
      const partA = Math.floor(Math.random() * 7) + 2; // 2..8
      const partB = Math.floor(Math.random() * 7) + 2; // 2..8
      const total = partA + partB;
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'total');
      const prompt = `看數鍵分解樹，${partA} 和 ${partB} 合成為多少？`;
      return this.formatQuestion(topic, prompt, total, 1, diagram);
    } else if (type === 1) {
      // 數鍵分解樹求分部數
      const total = Math.floor(Math.random() * 10) + 5; // 5..14
      const partA = Math.floor(Math.random() * (total - 2)) + 1;
      const partB = total - partA;
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'partB');
      const prompt = `看數鍵分解樹，${total} 分解為 ${partA} 和幾？`;
      return this.formatQuestion(topic, prompt, partB, 1, diagram);
    } else if (type === 2) {
      // 香港考卷字眼：_____ 和 B 合成為 Total
      const total = Math.floor(Math.random() * 10) + 5; // 5..14
      const partB = Math.floor(Math.random() * (total - 2)) + 1;
      const partA = total - partB;
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'partA');
      const prompt = `在橫線上填上答案： _____ 和 ${partB} 合成為 ${total}。`;
      return this.formatQuestion(topic, prompt, partA, 1, diagram);
    } else if (type === 3) {
      // 香港考卷字眼：Total 分解為 A 和 _____
      const total = Math.floor(Math.random() * 10) + 6; // 6..15
      const partA = Math.floor(Math.random() * (total - 2)) + 1;
      const partB = total - partA;
      const diagram = this.buildNumberBondSvg(total, partA, partB, 'partB');
      const prompt = `在橫線上填上答案： ${total} 分解為 ${partA} 和 _____。`;
      return this.formatQuestion(topic, prompt, partB, 1, diagram);
    } else {
      // 新思維 P13 互逆運算
      const total = Math.floor(Math.random() * 9) + 4; // 4..12
      const a = Math.floor(Math.random() * (total - 2)) + 1;
      const b = total - a;
      const diagram = this.buildNumberBondSvg(total, a, b, 'partB');
      const prompt = `已知 ${a} + ${b} = ${total}，那麼 ${total} 分解為 ${a} 和 _____？`;
      return this.formatQuestion(topic, prompt, b, 1, diagram);
    }
  }

  // Module 2: 比較數量與減法應用題
  static generateGrade1ComparisonAndSubtraction() {
    const type = Math.floor(Math.random() * 5);
    const topic = '一年級 • 比較數量與減法應用題';

    if (type === 0) {
      // 兩種顏色物品相差多少 (躍思 P36)
      const a = Math.floor(Math.random() * 6) + 6; // 6..11
      const b = Math.floor(Math.random() * (a - 2)) + 2; // 2..a-1
      const diff = a - b;
      const diagram = this.buildComparisonHtml(a, '🐚', '金色貝殼', b, '🌊', '藍色海螺');
      const prompt = `看圖比較：兩種海邊物品的數量相差多少？`;
      return this.formatQuestion(topic, prompt, diff, 1, diagram);
    } else if (type === 1) {
      // 比...少 / 比...多 (躍思 P38)
      const a = Math.floor(Math.random() * 6) + 6; // 6..11
      const b = Math.floor(Math.random() * (a - 2)) + 2;
      const diff = a - b;
      const diagram = this.buildComparisonHtml(a, '🐢', '海龜獸', b, '🦀', '彩角蟹');
      const prompt = `海龜獸有 ${a} 隻，彩角蟹有 ${b} 隻，彩角蟹比海龜獸少 _____ 隻。`;
      return this.formatQuestion(topic, prompt, diff, 1, diagram);
    } else if (type === 2) {
      // 減法應用題「還剩下」 (躍思 P38)
      const total = Math.floor(Math.random() * 8) + 8; // 8..15
      const gone = Math.floor(Math.random() * (total - 3)) + 2;
      const left = total - gone;
      const diagram = this.buildTenFrameHtml(total, '⭐');
      const prompt = `沙灘上原有海星 ${total} 隻，被浪花沖走了 ${gone} 隻，還剩下海星 _____ 隻。`;
      return this.formatQuestion(topic, prompt, left, 1, diagram);
    } else if (type === 3) {
      // 減法應用題「還有」 (躍思 P34)
      const total = Math.floor(Math.random() * 7) + 9; // 9..15
      const used = Math.floor(Math.random() * (total - 3)) + 2;
      const left = total - used;
      const prompt = `小章魚原有珍珠 ${total} 顆，送給朋友 ${used} 顆，牠還有珍珠 _____ 顆。`;
      return this.formatQuestion(topic, prompt, left, 1);
    } else {
      // 20以內標準減法運算
      const a = Math.floor(Math.random() * 9) + 7; // 7..15
      const b = Math.floor(Math.random() * (a - 2)) + 2;
      const ans = a - b;
      const prompt = `計算減法運算： ${a} - ${b} = ?`;
      return this.formatQuestion(topic, prompt, ans, 1);
    }
  }

  // Module 3: 十格陣數數與奇數偶數
  static generateGrade1TenFramesAndParity() {
    const type = Math.floor(Math.random() * 5);
    const topic = '一年級 • 十格陣數數與奇數偶數';

    if (type === 0) {
      // 十格陣湊十計數 (滿十 + 個位) (新思維 P5-7)
      const units = Math.floor(Math.random() * 9) + 1; // 1..9
      const total = 10 + units;
      const diagram = this.buildTenFrameHtml(total, '❄️');
      const prompt = `看十格陣，左邊滿十，右邊有 ${units}，合起來是多少？`;
      return this.formatQuestion(topic, prompt, total, 1, diagram);
    } else if (type === 1) {
      // 奇數/偶數判定 (單雙數) (新思維 P6)
      const n = Math.floor(Math.random() * 15) + 3; // 3..17
      const isEven = n % 2 === 0;
      const ans = isEven ? '偶數 (雙數)' : '奇數 (單數)';
      const diagram = this.buildTenFrameHtml(n, '💎');
      const prompt = `數一數十格陣中的冰晶有 ${n} 顆，這個數是奇數（單數）還是偶數（雙數）？`;
      return this.formatQuestion(topic, prompt, ans, 1, diagram, ['奇數 (單數)', '偶數 (雙數)']);
    } else if (type === 2) {
      // 選出偶數 (雙數)
      const even = (Math.floor(Math.random() * 8) + 2) * 2; // 4, 6, ..., 18
      const odds = new Set();
      while (odds.size < 3) {
        const o = (Math.floor(Math.random() * 8) + 1) * 2 + 1; // 3..17
        if (o !== even) odds.add(o);
      }
      const opts = [even, ...Array.from(odds)];
      opts.sort(() => Math.random() - 0.5);
      const prompt = `下列哪一個數字是偶數（雙數）？`;
      return this.formatQuestion(topic, prompt, even, 1, null, opts.map(String));
    } else if (type === 3) {
      // 選出奇數 (單數)
      const odd = (Math.floor(Math.random() * 8) + 1) * 2 + 1; // 3..17
      const evens = new Set();
      while (evens.size < 3) {
        const e = (Math.floor(Math.random() * 8) + 2) * 2; // 4..18
        if (e !== odd) evens.add(e);
      }
      const opts = [odd, ...Array.from(evens)];
      opts.sort(() => Math.random() - 0.5);
      const prompt = `下列哪一個數字是奇數（單數）？`;
      return this.formatQuestion(topic, prompt, odd, 1, null, opts.map(String));
    } else {
      // 順數與倒數規律 (躍思 P8)
      const isAsc = Math.random() > 0.5;
      const start = Math.floor(Math.random() * 8) + 8; // 8..15
      if (isAsc) {
        const target = start + 2;
        const prompt = `依順數規律在橫線上填上答案： ${start}, ${start + 1}, _____, ${start + 3}, ${start + 4}`;
        return this.formatQuestion(topic, prompt, target, 1);
      } else {
        const target = start - 2;
        const prompt = `依倒數規律在橫線上填上答案： ${start}, ${start - 1}, _____, ${start - 3}, ${start - 4}`;
        return this.formatQuestion(topic, prompt, target, 1);
      }
    }
  }

  // Module 4: 基本加法、加法應用題與加法交換律
  static generateGrade1Addition() {
    const type = Math.floor(Math.random() * 5);
    const topic = '一年級 • 加法運算與加法交換律';

    if (type === 0) {
      // 地上共有多少個 (躍思 P34)
      const a = Math.floor(Math.random() * 6) + 3; // 3..8
      const b = Math.floor(Math.random() * 6) + 2; // 2..7
      const sum = a + b;
      const diagram = this.buildGroupAdditionHtml(a, '🔥', b, '🔥');
      const prompt = `地上有火花石 ${a} 塊和 ${b} 塊，地上共有火花石 _____ 塊。`;
      return this.formatQuestion(topic, prompt, sum, 1, diagram);
    } else if (type === 1) {
      // 加法應用題「多買 / 又收集」 (躍思 P34)
      const a = Math.floor(Math.random() * 5) + 4; // 4..8
      const b = Math.floor(Math.random() * 5) + 3; // 3..7
      const sum = a + b;
      const prompt = `熔岩洞原有赤焰水晶 ${a} 顆，小巫師多採集了 ${b} 顆，現在共有水晶 _____ 顆。`;
      return this.formatQuestion(topic, prompt, sum, 1);
    } else if (type === 2) {
      // 加法交換律 (躍思 P32)
      const a = Math.floor(Math.random() * 6) + 3; // 3..8
      const b = Math.floor(Math.random() * 6) + 4; // 4..9
      const sum = a + b;
      const prompt = `根據加法交換律填空： ${a} + ${b} = ${b} + _____ = ${sum}`;
      return this.formatQuestion(topic, prompt, a, 1);
    } else if (type === 3) {
      // 湊十法思維填空 (新思維 P17)
      const b = Math.floor(Math.random() * 6) + 3; // 3..8
      const part = b - 1;
      const sum = 9 + b;
      const prompt = `利用湊十法計算： 9 + ${b} = 9 + 1 + _____ = ${sum}`;
      return this.formatQuestion(topic, prompt, part, 1);
    } else {
      // 20以內進位加法
      const a = Math.floor(Math.random() * 6) + 6; // 6..11
      const b = Math.floor(Math.random() * (19 - a)) + 2;
      const sum = a + b;
      const prompt = `計算加法運算： ${a} + ${b} = ?`;
      return this.formatQuestion(topic, prompt, sum, 1);
    }
  }

  // Module 5: 綜合高階思維、個位十位與逆向運算
  static generateGrade1PlaceValueAndReverse() {
    const type = Math.floor(Math.random() * 5);
    const topic = '一年級 • 綜合思維與逆向運算';

    if (type === 0) {
      // 個位與十位位值 (新思維 P21)
      const ones = Math.floor(Math.random() * 8) + 1; // 1..8
      const total = 10 + ones;
      const diagram = this.buildPlaceValueHtml(1, ones);
      const prompt = `看圖填空： 1 個十和 ${ones} 個一是 _____。`;
      return this.formatQuestion(topic, prompt, total, 1, diagram);
    } else if (type === 1) {
      // 逆向加法填空 (新思維 P13)
      const total = Math.floor(Math.random() * 8) + 8; // 8..15
      const a = Math.floor(Math.random() * (total - 2)) + 1;
      const b = total - a;
      const prompt = `在空格中填入正確數字： □ + ${a} = ${total}`;
      return this.formatQuestion(topic, prompt, b, 1);
    } else if (type === 2) {
      // 逆向減法填空
      const total = Math.floor(Math.random() * 8) + 9; // 9..16
      const diff = Math.floor(Math.random() * (total - 3)) + 2;
      const sub = total - diff;
      const prompt = `在空格中填入正確數字： ${total} - □ = ${diff}`;
      return this.formatQuestion(topic, prompt, sub, 1);
    } else if (type === 3) {
      // 連減情境題 (躍思 P38)
      const total = Math.floor(Math.random() * 6) + 13; // 13..18
      const a = Math.floor(Math.random() * 4) + 2; // 2..5
      const b = Math.floor(Math.random() * 3) + 2; // 2..4
      const left = total - a - b;
      const prompt = `神殿寶箱裏有雷電晶石 ${total} 顆，第一隊拿走 ${a} 顆，第二隊拿走 ${b} 顆，還剩下 _____ 顆。`;
      return this.formatQuestion(topic, prompt, left, 1);
    } else {
      // 位值概念解析
      const ones = Math.floor(Math.random() * 8) + 1;
      const num = 10 + ones;
      const askTens = Math.random() > 0.5;
      if (askTens) {
        const prompt = `在數字 ${num} 中，十位上的數字代表幾？ (1 代表 10)`;
        return this.formatQuestion(topic, prompt, 10, 1, null, ['10', '1', String(ones), '20']);
      } else {
        const prompt = `在數字 ${num} 中，個位上的數字是多少？`;
        return this.formatQuestion(topic, prompt, ones, 1);
      }
    }
  }

  // Realm 6: 燈火主城 / 教學決鬥 (入門加減法)
  static generateGrade1Town() {
    const isAdd = Math.random() > 0.5;
    const topic = '一年級 • 燈火學院 • 10以內基礎加減入門';
    if (isAdd) {
      const a = Math.floor(Math.random() * 5) + 1; // 1..5
      const b = Math.floor(Math.random() * (10 - a)) + 1;
      const sum = a + b;
      const diagram = this.buildGroupAdditionHtml(a, '⭐', b, '⭐');
      const prompt = `導師練習題： ${a} + ${b} = ?`;
      return this.formatQuestion(topic, prompt, sum, 1, diagram);
    } else {
      const a = Math.floor(Math.random() * 6) + 4; // 4..9
      const b = Math.floor(Math.random() * (a - 1)) + 1;
      const diff = a - b;
      const diagram = this.buildTenFrameHtml(a, '⭐');
      const prompt = `導師練習題： ${a} - ${b} = ?`;
      return this.formatQuestion(topic, prompt, diff, 1, diagram);
    }
  }

  // Grade 2: Two-digit operations & 2, 5, 10 multiplication
  static generateGrade2() {
    const type = Math.floor(Math.random() * 3);
    let prompt, answer;
    if (type === 0) {
      const a = Math.floor(Math.random() * 40) + 15;
      const b = Math.floor(Math.random() * 40) + 10;
      answer = a + b;
      prompt = `計算兩位數加法： ${a} + ${b} = ?`;
    } else if (type === 1) {
      const b = Math.floor(Math.random() * 30) + 10;
      const ans = Math.floor(Math.random() * 30) + 10;
      const a = ans + b;
      answer = ans;
      prompt = `計算兩位數減法： ${a} - ${b} = ?`;
    } else {
      const a = [2, 5, 10][Math.floor(Math.random() * 3)];
      const b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      prompt = `計算乘法： ${a} × ${b} = ?`;
    }
    return this.formatQuestion('二年級 • 雙位數加減與基礎乘法', prompt, answer, 2);
  }

  // Grade 3: Full Multiplication facts (up to 12x12) & division within 100
  static generateGrade3() {
    const isMult = Math.random() > 0.4;
    let prompt, answer;
    if (isMult) {
      const a = Math.floor(Math.random() * 10) + 3;
      const b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      prompt = `計算乘法九九乘法： ${a} × ${b} = ?`;
    } else {
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = Math.floor(Math.random() * 9) + 2;
      const a = b * ans;
      answer = ans;
      prompt = `計算除法運算： ${a} ÷ ${b} = ?`;
    }
    return this.formatQuestion('三年級 • 乘除法九九乘法挑戰', prompt, answer, 3);
  }

  // Grade 4: Multi-digit operations, word problems, same-denominator fractions
  static generateGrade4() {
    const type = Math.floor(Math.random() * 3);
    let prompt, answer;
    if (type === 0) {
      const a = Math.floor(Math.random() * 30) + 12;
      const b = Math.floor(Math.random() * 8) + 3;
      answer = a * b;
      prompt = `魔法學院圖書館有 ${a} 個書架，每個書架放有 ${b} 本書，總共有幾本書？ (${a} × ${b})`;
    } else if (type === 1) {
      const b = Math.floor(Math.random() * 6) + 4;
      const ans = Math.floor(Math.random() * 15) + 10;
      const a = b * ans;
      answer = ans;
      prompt = `計算多位數除法： ${a} ÷ ${b} = ?`;
    } else {
      const a = Math.floor(Math.random() * 50) + 25;
      const b = Math.floor(Math.random() * 40) + 15;
      const c = Math.floor(Math.random() * 30) + 10;
      answer = a + b - c;
      prompt = `計算連加連減： ${a} + ${b} - ${c} = ?`;
    }
    return this.formatQuestion('四年級 • 多位數運算與應用題', prompt, answer, 4);
  }

  // Grade 5: Order of Operations (PEMDAS) & basic decimals/fractions
  static generateGrade5() {
    const isDecimal = Math.random() > 0.5;
    if (isDecimal) {
      const a = (Math.floor(Math.random() * 50) + 10) / 10; // 1.0..5.9
      const b = (Math.floor(Math.random() * 40) + 10) / 10; // 1.0..4.9
      const answer = Math.round((a + b) * 10) / 10;
      return this.formatQuestion('五年級 • 小數加法運算', `計算小數加法： ${a} + ${b} = ?`, answer, 5);
    } else {
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 6) + 3;
      const c = Math.floor(Math.random() * 15) + 5;
      const answer = a * b + c;
      return this.formatQuestion('五年級 • 四則混合運算', `計算四則運算： ${a} × ${b} + ${c} = ?`, answer, 5);
    }
  }

  // Grade 6: Early Algebra & One-step Equations
  static generateGrade6() {
    const isMult = Math.random() > 0.5;
    let prompt, answer;
    if (isMult) {
      const a = Math.floor(Math.random() * 8) + 3;
      answer = Math.floor(Math.random() * 9) + 2;
      const b = a * answer;
      prompt = `求解未知數 x ： ${a}x = ${b} ，則 x = ?`;
    } else {
      const a = Math.floor(Math.random() * 25) + 10;
      answer = Math.floor(Math.random() * 30) + 15;
      const b = a + answer;
      prompt = `求解未知數 x ： x + ${a} = ${b} ，則 x = ?`;
    }
    return this.formatQuestion('六年級 • 代數方程式與未知數求解', prompt, answer, 6);
  }

  // Grade 7: Two-step Linear Equations & Negative Integers
  static generateGrade7() {
    const isEquation = Math.random() > 0.5;
    if (isEquation) {
      // 2x + b = c
      const a = Math.floor(Math.random() * 4) + 2; // 2..5
      const answer = Math.floor(Math.random() * 8) + 2; // 2..9
      const b = Math.floor(Math.random() * 9) + 1; // 1..9
      const c = a * answer + b;
      const prompt = `求解兩步方程式： ${a}x + ${b} = ${c} ，則 x = ?`;
      return this.formatQuestion('七年級 • 兩步方程式運算', prompt, answer, 7);
    } else {
      // Negative numbers operations
      const a = -(Math.floor(Math.random() * 10) + 3);
      const b = Math.floor(Math.random() * 15) + 5;
      const answer = a + b;
      const prompt = `計算正負數加法： (${a}) + ${b} = ?`;
      return this.formatQuestion('七年級 • 正負整數四則運算', prompt, answer, 7);
    }
  }

  // Grade 8: Exponents, Square Roots & Linear Expressions
  static generateGrade8() {
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      // Square roots
      const root = Math.floor(Math.random() * 10) + 2; // 2..11
      const sq = root * root;
      return this.formatQuestion('八年級 • 開平方根運算', `計算平方根： √${sq} = ?`, root, 8);
    } else if (type === 1) {
      // Exponents
      const base = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
      const exp = base === 2 ? 4 : (base === 3 ? 3 : 2);
      const answer = Math.pow(base, exp);
      return this.formatQuestion('八年級 • 指數與冪次運算', `計算指數冪： ${base}^${exp} = ?`, answer, 8);
    } else {
      // Linear equation with terms: 3x - 5 = x + 7
      const a = 3;
      const x = Math.floor(Math.random() * 6) + 2; // 2..7
      const diff = 2 * x;
      const c = Math.floor(Math.random() * 8) + 1;
      const b = diff + c;
      // 3x - c = x + b - 2x = x + diff - c... let's simplify to: 2x - 4 = 10
      const coeff = Math.floor(Math.random() * 3) + 2; // 2..4
      const ans = Math.floor(Math.random() * 7) + 2;
      const sub = Math.floor(Math.random() * 6) + 2;
      const rhs = coeff * ans - sub;
      return this.formatQuestion('八年級 • 一元一次方程求解', `求解未知數 x ： ${coeff}x - ${sub} = ${rhs} ，則 x = ?`, ans, 8);
    }
  }

  static formatQuestion(topic, prompt, answer, grade = 1, diagramHtml = null, customOptions = null) {
    let options;
    if (customOptions && Array.isArray(customOptions) && customOptions.length >= 2) {
      options = [...customOptions];
      // If answer not in customOptions, append it
      if (!options.some(opt => String(opt).trim() === String(answer).trim())) {
        options.push(String(answer));
      }
      // Shuffle custom options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
    } else {
      const distractors = new Set();
      const isDecimal = String(answer).includes('.');

      while (distractors.size < 3) {
        let wrong;
        if (isDecimal) {
          const offset = ((Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1)) / 10;
          wrong = Math.round((Number(answer) + offset) * 10) / 10;
        } else {
          const maxOffset = grade === 1 ? 4 : (grade <= 3 ? 6 : 10);
          const offset = (Math.floor(Math.random() * maxOffset) + 1) * (Math.random() > 0.5 ? 1 : -1);
          wrong = Number(answer) + offset;
        }

        if (wrong >= 0 && wrong !== Number(answer)) {
          // For Grade 1, never generate distractors > 20
          if (grade === 1 && wrong > 20) {
            wrong = Math.max(0, Number(answer) - (Math.floor(Math.random() * 3) + 1));
          }
          if (wrong !== Number(answer)) {
            distractors.add(wrong);
          }
        }
      }

      options = Array.from(distractors);
      options.push(answer);

      // Shuffle options
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
