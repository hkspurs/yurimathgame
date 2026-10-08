// SaveManager.js - LocalStorage Persistence
const SAVE_KEY = 'prodigy_math_save_v1';

export class SaveManager {
  static load() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not load save data:', e);
    }
    return null;
  }

  static save(stateSnapshot) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateSnapshot));
    } catch (e) {
      console.error('Failed to save game state:', e);
    }
  }

  static clear() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  }
}
