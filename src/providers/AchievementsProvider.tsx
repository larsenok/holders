import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { achievements as localAchievements } from '../data/achievements';
import type { Achievement } from '../data/achievements';
import { usePopup } from './PopupProvider';
import { useGuild } from './GuildProvider';
import { useUser } from './UserProvider';
import {
  getCurrentUserId,
  fetchAllAchievements,
  fetchUserAchievements,
  unlockAchievement,
} from '../api/achievements';

type Listener = (achievement: Achievement) => void;
const listeners: Listener[] = [];

const heroLevelMap: Record<number, string> = {
  10: 'heroLv10',
  25: 'heroLv25',
};

const guildLevelMap: Record<number, string> = {
  5: 'guildLv5',
  10: 'guildLv10',
};

// eslint-disable-next-line react-refresh/only-export-components
export function onAchievementUnlock(fn: Listener) {
  listeners.push(fn);
  console.log('[onAchievementUnlock] Listener registered.');
}

type AchievementsContextType = {
  achievements: Achievement[];
  unlock: (key: string) => Promise<void>;
};

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

// Allows external modules (like GuildProvider) to trigger achievements
// eslint-disable-next-line react-refresh/only-export-components
export let externalUnlock: (key: string) => Promise<void> = async () => {};

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const unlockedRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);
  const { showPopup } = usePopup();
  const { guildStats, adventurers, addInventoryItem, addGold } = useGuild();
  const { credits, setCredits } = useUser();

  const grantRewards = (ach: Achievement) => {
    if (ach.rewardTokens) {
      setCredits(credits + ach.rewardTokens);
    }
    if (ach.rewardGold) {
      addGold(ach.rewardGold);
    }
    if (ach.rewardItem) {
      addInventoryItem(ach.rewardItem, ach.rewardItemQty ?? 1);
    }
  };

  const unlock = async (key: string) => {
    if (unlockedRef.current.has(key)) return;

    const existing = achievements.find((a) => a.id === key && a.unlocked);
    if (existing) {
      unlockedRef.current.add(key); // ensure consistency
      return;
    }

    const userId = await getCurrentUserId();
    if (!userId) return;

    const success = await unlockAchievement(userId, key);
    if (!success) return;

    unlockedRef.current.add(key);

    setAchievements((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((a) => a.id === key);
      if (idx !== -1) {
        updated[idx] = { ...updated[idx], unlocked: true };
      } else {
        const local = localAchievements.find((a) => a.id === key);
        if (local) updated.push({ ...local, unlocked: true });
      }
      return updated;
    });

    const ach =
      localAchievements.find((a) => a.id === key) ||
      achievements.find((a) => a.id === key);

    if (ach) {
      listeners.forEach((fn) => fn({ ...ach, unlocked: true }));
      grantRewards(ach);
      showPopup({
        title: ach.title,
        description: ach.description,
        duration: 4000,
      });
    }
  };

  externalUnlock = unlock;


  useEffect(() => {
    isMountedRef.current = true;

    const syncFromSupabase = async () => {
      const userId = await getCurrentUserId();
      if (!userId) {
        console.warn('[AchievementsProvider] No user logged in');
        return;
      }

      const [supabaseAchievements, unlockedIds] = await Promise.all([
        fetchAllAchievements(),
        fetchUserAchievements(userId),
      ]);

      const enriched: Achievement[] = supabaseAchievements.map((dbAch) => {
        const local = localAchievements.find((a) => a.id === dbAch.key);
        return {
          id: dbAch.id,
          title: dbAch.title,
          description: dbAch.description,
          unlocked: unlockedIds.includes(dbAch.id),
          unlockAfterSeconds: local?.unlockAfterSeconds,
        };
      });

      setAchievements(enriched);
      unlockedRef.current = new Set(unlockedIds);

      enriched.forEach((achievement) => {
        const seconds = Number(achievement.unlockAfterSeconds);
        if (!achievement.unlocked && !isNaN(seconds) && seconds > 0) {
          console.log(`[Timer] Setting up '${achievement.title}' in ${seconds}s`);

          timers.current[achievement.id] = setTimeout(async () => {
            if (unlockedRef.current.has(achievement.id)) return;

            const success = await unlockAchievement(userId, achievement.id);
            if (!success || unlockedRef.current.has(achievement.id)) return;

            unlockedRef.current.add(achievement.id);

            // Safe update only if still mounted
            if (isMountedRef.current) {
              setAchievements((prev) => {
                const updated = [...prev];
                const targetIndex = updated.findIndex((a) => a.id === achievement.id);
                if (targetIndex !== -1) {
                  updated[targetIndex] = { ...updated[targetIndex], unlocked: true };
                }
                return updated;
              });

              listeners.forEach((fn) =>
                fn({ ...achievement, unlocked: true })
              );

              grantRewards(achievement);

              showPopup({
                title: achievement.title,
                description: achievement.description,
                duration: 4000,
              });

              console.log(`[Timer] Achievement unlocked: ${achievement.title}`);
            }
          }, seconds * 1000);
        }
      });
    };

    syncFromSupabase();

    return () => {
      isMountedRef.current = false;
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    };
  }, []);

  useEffect(() => {
    const maxLevel = Math.max(0, ...adventurers.map((a) => a.level));
    Object.entries(heroLevelMap).forEach(([lvl, id]) => {
      if (maxLevel >= Number(lvl)) unlock(id);
    });
  }, [adventurers]);

  useEffect(() => {
    Object.entries(guildLevelMap).forEach(([lvl, id]) => {
      if (guildStats.rank >= Number(lvl)) unlock(id);
    });
  }, [guildStats.rank]);

  return (
    <AchievementsContext.Provider value={{ achievements, unlock }}>
      {children}
    </AchievementsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (!context) throw new Error('useAchievements must be used within AchievementsProvider');
  return context;
}
