// LeaveProdigyModal.js - Official "Leave Prodigy?" Exit Confirmation Dialog
// Verbatim from Prodigy APK string: "Leave Prodigy?" (Hermes bundle line 8284)

import { eventBus } from '../core/EventBus.js';

export class LeaveProdigyModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('leave-prodigy-modal');
    this.btnStay = document.getElementById('btn-leave-prodigy-stay');
    this.btnConfirmLeave = document.getElementById('btn-leave-prodigy-confirm');
    this.btnClose = document.getElementById('btn-close-leave-prodigy');

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_LEAVE_PRODIGY', () => this.open());

    if (this.btnStay) {
      this.btnStay.addEventListener('click', () => this.close());
    }

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    if (this.btnConfirmLeave) {
      this.btnConfirmLeave.addEventListener('click', () => {
        this.close();
        eventBus.emit('SHOW_TOAST', {
          icon: '👋',
          title: '已儲存冒險進度',
          text: '你的巫師檔案已妥善儲存！隨時歡迎返回燈火學院！'
        });
        setTimeout(() => {
          eventBus.emit('OPEN_TAP_TO_LOGIN');
        }, 600);
      });
    }
  }

  open() {
    if (this.modalEl) {
      this.modalEl.classList.remove('hidden');
    }
  }

  close() {
    if (this.modalEl) {
      this.modalEl.classList.add('hidden');
    }
  }
}
