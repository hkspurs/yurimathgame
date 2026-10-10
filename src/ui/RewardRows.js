// RewardRows.js - Pure helpers for per-companion reward rows (Dual Pets visibility).
// Kept DOM-free so the logic is unit-testable under node.

// Normalize a battle reward payload into one display row per XP recipient.
// New payloads carry rewards.petRewards (per-recipient entries). The array is
// the authority whenever the contract is present — including an explicit
// empty list (zero recipients); legacy scalar fallback only applies when the
// array contract is absent (older payloads).
export function resolvePetRewardRows(rewards) {
  if (!rewards) return [];
  if (Array.isArray(rewards.petRewards)) {
    return rewards.petRewards;
  }
  if (rewards.activePet) {
    return [{
      petId: rewards.activePet.id,
      petName: rewards.activePet.name,
      sprite: rewards.activePet.sprite,
      element: rewards.activePet.element,
      prevLevel: null,
      gainedXp: rewards.petXp ?? rewards.xp ?? 0,
      level: rewards.activePet.level,
      leveledUp: !!rewards.petLeveledUp,
      canEvolve: !!rewards.canEvolve
    }];
  }
  return [];
}

// Levels gained this encounter. Literal (level - prevLevel) when the payload
// carries both; legacy rows without prevLevel fall back to the level-up flag.
export function levelGain(row) {
  if (!row) return 0;
  if (typeof row.prevLevel === 'number' && typeof row.level === 'number') {
    return Math.max(0, row.level - row.prevLevel);
  }
  return row.leveledUp ? 1 : 0;
}

// Level-up banner copy. Single level keeps the incumbent stat wording; multi-level
// shows the scaled totals and the literal final level (never a single "+15/+3").
export function levelUpBannerText(row) {
  const gain = levelGain(row);
  const stats = gain > 1 ? `(Max HP +${15 * gain}, 攻擊 +${3 * gain})` : '(Max HP +15, 攻擊 +3)';
  return `🎉 守護精靈 ${row.petName} 升級至 LV. ${row.level}！${stats}`;
}

// Banner + notice decision for the reward modal. The level-up banner follows
// the first actually-leveled recipient; the new-companion notice is driven by
// the event's top-level isNewPet flag and coexists with level-up info (they
// are separate elements). Absent flag -> null, so every reward render clears
// any stale notice (normal victories never set it).
export function rewardNoticeState({ rows = [], isNewPet, monsterName }) {
  const leveled = rows.find(r => r.leveledUp);
  return {
    levelBannerText: leveled ? levelUpBannerText(leveled) : null,
    newPetNoticeText: (isNewPet && monsterName)
      ? `🌟 【新夥伴入隊】${monsterName} 已成功解鎖登錄至精靈圖鑑！`
      : null
  };
}
