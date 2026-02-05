import { useEffect, useState } from 'react';
import { useGuild } from '../providers/GuildProvider';
import { useAchievements } from '../providers/AchievementsProvider';
import { computeMissionBonuses } from '../utils/bonusUtils';

const STORAGE_KEY = 'guild_theme_tier';

export function useGuildTheme() {
  const { guildStats, adventurers } = useGuild();
  const { achievements } = useAchievements();
  const [tier, setTier] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : 1;
  });

  useEffect(() => {
    const highestBonus = Math.max(
      ...Object.values(computeMissionBonuses(adventurers))
    );
    const unlocked = achievements.filter((a) => a.unlocked).length;

    let points = 0;
    if ((guildStats.missionsCompleted || 0) > 50) points++;
    if ((guildStats.lifetimeGold || 0) > 10000) points++;
    if ((guildStats.lifetimeTomes || 0) > 20) points++;
    if (unlocked > 10) points++;
    if (highestBonus > 0.2) points++;

    const nextTier = points >= 4 ? 4 : points >= 2 ? 3 : points >= 1 ? 2 : 1;

    setTier((prev) => {
      if (prev !== nextTier) {
        localStorage.setItem(STORAGE_KEY, String(nextTier));
      }
      return nextTier;
    });
  }, [guildStats, achievements, adventurers]);

  return tier;
}
