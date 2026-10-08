// MathModal.js - Pedagogical Math Gate Overlay Controller
import { eventBus } from '../core/EventBus.js';
import { QuestionGenerator } from '../math/QuestionGenerator.js';

export class MathModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('math-modal');
    this.spellTagEl = document.getElementById('math-spell-tag');
    this.topicEl = document.getElementById('math-topic');
    this.promptEl = document.getElementById('math-prompt');
    this.choicesContainer = document.getElementById('choices-container');
    this.feedbackEl = document.getElementById('math-feedback');
    this.visualContainer = document.getElementById('math-visual-container');
    this.submitBtn = document.getElementById('btn-submit-answer');
    this.closeBtn = document.getElementById('btn-close-math');

    this.currentQuestion = null;
    this.selectedAnswer = null;

    this.bindEvents();
    this.initAudioContext();
  }

  initAudioContext() {
    this.audioCtx = null;
    const unlock = () => {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
  }

  playChime(type) {
    if (!this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio autoplay blocked or unsupported
    }
  }

  bindEvents() {
    eventBus.on('REQUEST_MATH_QUESTION', ({ spell, grade, realm }) => {
      this.open(spell, grade, realm);
    });

    this.submitBtn.addEventListener('click', () => {
      this.submitAnswer();
    });

    this.closeBtn.addEventListener('click', () => {
      // Closing cancels spell selection and returns control to wizard turn
      this.close();
      eventBus.emit('MATH_QUESTION_CANCELLED');
    });
  }

  open(spell, grade, realm) {
    const effectiveGrade = grade || this.gameState?.grade || window.gameApp?.gameState?.grade || 1;
    const effectiveRealm = realm || this.gameState?.currentRealm || window.gameApp?.gameState?.currentRealm || 'firefly_forest';
    this.currentQuestion = QuestionGenerator.generate(effectiveGrade, effectiveRealm);
    this.selectedAnswer = null;

    const icon = spell?.icon || '✨';
    const name = spell?.name || '奧術魔法 (Arcane Spell)';
    this.spellTagEl.textContent = `${icon} ${name} 施法詠唱中...`;
    this.topicEl.textContent = this.currentQuestion.topic;
    this.promptEl.textContent = this.currentQuestion.prompt;

    // Render visual diagram if provided
    if (this.visualContainer) {
      if (this.currentQuestion.diagramHtml) {
        this.visualContainer.innerHTML = this.currentQuestion.diagramHtml;
        this.visualContainer.classList.remove('hidden');
      } else {
        this.visualContainer.innerHTML = '';
        this.visualContainer.classList.add('hidden');
      }
    }

    this.feedbackEl.className = 'incantation-feedback hidden';
    this.feedbackEl.textContent = '';
    this.submitBtn.disabled = true;

    // Render choice buttons as carved rune seals
    this.choicesContainer.innerHTML = '';
    this.currentQuestion.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'rune-seal-btn';
      btn.textContent = opt;
      btn.setAttribute('data-correct', String(opt).trim() === String(this.currentQuestion.correctAnswer).trim());
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rune-seal-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedAnswer = opt;
        this.submitBtn.disabled = false;
      });
      this.choicesContainer.appendChild(btn);
    });

    const banner = document.getElementById('battle-banner');
    if (banner) banner.classList.add('hidden');
    this.modalEl.classList.remove('hidden');
  }

  close() {
    this.modalEl.classList.add('hidden');
  }

  submitAnswer() {
    if (!this.selectedAnswer || !this.currentQuestion) return;

    this.submitBtn.disabled = true;
    const isCorrect = String(this.selectedAnswer).trim() === String(this.currentQuestion.correctAnswer).trim();

    this.feedbackEl.classList.remove('hidden');
    if (isCorrect) {
      this.playChime('correct');
      this.feedbackEl.className = 'incantation-feedback correct';
      this.feedbackEl.textContent = '🌟 答對了！強大的魔法能量成功凝聚！';
      setTimeout(() => {
        this.close();
        eventBus.emit('MATH_QUESTION_ANSWERED', { isCorrect: true });
      }, 700);
    } else {
      this.playChime('wrong');
      this.feedbackEl.className = 'incantation-feedback wrong';
      this.feedbackEl.textContent = `❌ 答案不正確！正確答案是 ${this.currentQuestion.correctAnswer}。魔法出現了失誤！`;
      setTimeout(() => {
        this.close();
        eventBus.emit('MATH_QUESTION_ANSWERED', { isCorrect: false });
      }, 1600);
    }
  }
}
