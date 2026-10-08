// TapToLoginModal.js - Official Prodigy Game "TapToLoginScreen" Entry Gate
// Exact strings and flow extracted verbatim from Prodigy APK (Hermes v96 bundle):
// - "Login with yout student credentials to start playing !!" (line 2967)
// - "Click here to login." (line 6530)
// - "Get on with your math skills !!" (line 2962)
// - "Play on and with your math skills !!" (line 2987)

import { eventBus } from '../core/EventBus.js';

export class TapToLoginModal {
  constructor(gameState) {
    this.gameState = gameState;
    this.modalEl = document.getElementById('tap-to-login-modal');
    this.btnLoginSubmit = document.getElementById('btn-student-login-submit');
    this.btnGuestPlay = document.getElementById('btn-guest-play');
    this.btnShowLoginForm = document.getElementById('btn-show-login-form');
    this.loginFormContainer = document.getElementById('student-login-form-container');
    this.usernameInput = document.getElementById('login-student-username');
    this.passwordInput = document.getElementById('login-student-password');
    this.quickDemoLoginBtn = document.getElementById('btn-quick-demo-login');

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('OPEN_TAP_TO_LOGIN', () => this.open());

    if (this.btnShowLoginForm) {
      this.btnShowLoginForm.addEventListener('click', () => {
        if (this.loginFormContainer) {
          this.loginFormContainer.classList.toggle('hidden');
          if (!this.loginFormContainer.classList.contains('hidden')) {
            this.usernameInput?.focus();
          }
        }
      });
    }

    if (this.btnLoginSubmit) {
      this.btnLoginSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const username = this.usernameInput?.value?.trim() || 'StarMage';
        this.gameState.playerName = username;
        this.close();
        eventBus.emit('STUDENT_LOGGED_IN', { username });
      });
    }

    if (this.quickDemoLoginBtn) {
      this.quickDemoLoginBtn.addEventListener('click', () => {
        if (this.usernameInput) this.usernameInput.value = 'ProdigyWizard';
        if (this.passwordInput) this.passwordInput.value = '••••••••';
        this.gameState.playerName = 'ProdigyWizard';
        this.close();
        eventBus.emit('STUDENT_LOGGED_IN', { username: 'ProdigyWizard' });
      });
    }

    if (this.btnGuestPlay) {
      this.btnGuestPlay.addEventListener('click', () => {
        this.close();
        eventBus.emit('PLAY_AS_GUEST');
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
