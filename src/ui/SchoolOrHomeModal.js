// SchoolOrHomeModal.js - Authentic Prodigy 3-Step Onboarding Gate:
// 1. Where are you playing? (Home vs School)
// 2. What is your class code? (with "I don't have a class code" skip button)
// 3. What grade are you in? (Grade 1 to Grade 8 selector)

import { eventBus } from '../core/EventBus.js';

export class SchoolOrHomeModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('where-playing-modal');

    // Step containers
    this.stepModeEl = document.getElementById('where-step-mode');
    this.stepCodeEl = document.getElementById('where-step-code');
    this.stepGradeEl = document.getElementById('where-step-grade');

    // Step 1 controls
    this.btnSchool = document.getElementById('btn-select-school');
    this.btnHome = document.getElementById('btn-select-home');

    // Step 2 controls
    this.inputStepCode = document.getElementById('input-step-class-code');
    this.btnSubmitCode = document.getElementById('btn-submit-class-code');
    this.btnNoClassCode = document.getElementById('btn-no-class-code');

    // Step 3 controls
    this.gradeGridEl = document.getElementById('grade-selection-grid');
    this.btnConfirmGrade = document.getElementById('btn-confirm-grade');

    this.chosenLocation = 'home';
    this.chosenClassCode = '';
    this.chosenGrade = this.gameState.grade || 1;

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_WHERE_PLAYING', () => this.open());

    // Step 1: Select Home
    if (this.btnHome) {
      this.btnHome.addEventListener('click', () => {
        this.chosenLocation = 'home';
        this.chosenClassCode = '';
        this.showStep('code');
      });
    }

    // Step 1: Select School
    if (this.btnSchool) {
      this.btnSchool.addEventListener('click', () => {
        this.chosenLocation = 'school';
        this.showStep('code');
      });
    }

    // Step 2: Submit Class Code
    if (this.btnSubmitCode) {
      this.btnSubmitCode.addEventListener('click', () => {
        const val = this.inputStepCode ? this.inputStepCode.value.trim().toUpperCase() : '';
        this.chosenClassCode = val || (this.chosenLocation === 'school' ? 'CLASS88' : '');
        this.showStep('grade');
      });
    }

    // Step 2: Skip / I don't have a class code
    if (this.btnNoClassCode) {
      this.btnNoClassCode.addEventListener('click', () => {
        this.chosenClassCode = '';
        this.showStep('grade');
      });
    }

    // Step 3: Grade Selection
    if (this.gradeGridEl) {
      const gradeBtns = this.gradeGridEl.querySelectorAll('.grade-card-btn');
      gradeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          gradeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.chosenGrade = parseInt(btn.getAttribute('data-grade'), 10) || 3;
        });
      });
    }

    // Step 3: Confirm Grade & Proceed to Wizard Customization
    if (this.btnConfirmGrade) {
      this.btnConfirmGrade.addEventListener('click', () => {
        this.gameState.setGrade(this.chosenGrade);
        this.gameState.setPlayLocation(this.chosenLocation, this.chosenClassCode);
        this.close();

        const modeMsg = this.chosenLocation === 'school' 
          ? `🏫 學校模式 (班級代碼: ${this.chosenClassCode || '已跳過'}) • 年級: Grade ${this.chosenGrade}`
          : `🏠 家庭自由冒險模式 • 年級: Grade ${this.chosenGrade}`;

        eventBus.emit('SHOW_TOAST', { message: modeMsg, type: 'success' });
        eventBus.emit('PLAY_LOCATION_CHOSEN', {
          location: this.chosenLocation,
          classCode: this.chosenClassCode,
          grade: this.chosenGrade
        });
      });
    }
  }

  showStep(step) {
    if (this.stepModeEl) this.stepModeEl.classList.add('hidden');
    if (this.stepCodeEl) this.stepCodeEl.classList.add('hidden');
    if (this.stepGradeEl) this.stepGradeEl.classList.add('hidden');

    if (step === 'mode' && this.stepModeEl) {
      this.stepModeEl.classList.remove('hidden');
    } else if (step === 'code' && this.stepCodeEl) {
      this.stepCodeEl.classList.remove('hidden');
      if (this.inputStepCode) {
        this.inputStepCode.value = this.gameState.classCode || '';
        this.inputStepCode.focus();
      }
    } else if (step === 'grade' && this.stepGradeEl) {
      this.stepGradeEl.classList.remove('hidden');
      // Highlight current grade
      if (this.gradeGridEl) {
        const gradeBtns = this.gradeGridEl.querySelectorAll('.grade-card-btn');
        gradeBtns.forEach(b => {
          const g = parseInt(b.getAttribute('data-grade'), 10);
          if (g === this.chosenGrade) b.classList.add('active');
          else b.classList.remove('active');
        });
      }
    }
  }

  open() {
    if (!this.modalEl) return;
    this.chosenGrade = this.gameState.grade || 1;
    this.showStep('mode');
    this.modalEl.classList.remove('hidden');
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }
}
