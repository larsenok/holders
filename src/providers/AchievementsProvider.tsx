import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { achievements as localAchievements } from '../data/achievements';
import type { Achievement } from '../data/achievements';
import { usePopup } from './PopupProvider';
import { useGuild } from './GuildProvider';
import { useUser } from './UserProvider';
import { getCurrentUserId, unlockAchievement } from '../api/achievements';

type Listener = (achievement: Achievement) => void;
const listeners: Listener[] = [];
const LOCAL_UNLOCKED_KEY = 'local_unlocked_achievements';

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
  const [achievements, setAchievements] = useState<Achievement[]>(localAchievements);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const unlockedRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);
  const { showPopup } = usePopup();
  const { guildStats, adventurers, addInventoryItem, addGold } = useGuild();
  const { credits, setCredits } = useUser();

  const persistUnlocked = (set: Set<string>) => {
    localStorage.setItem(LOCAL_UNLOCKED_KEY, JSON.stringify([...set]));
  };

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

    const ach = localAchievements.find((a) => a.id === key);
    if (!ach) return;

    unlockedRef.current.add(key);
    persistUnlocked(unlockedRef.current);

    setAchievements((prev) => prev.map((item) => (
      item.id === key ? { ...item, unlocked: true } : item
    )));

    listeners.forEach((fn) => fn({ ...ach, unlocked: true }));
    grantRewards(ach);
    showPopup({
      title: ach.title,
      description: ach.description,
      duration: 4000,
    });

    const userId = await getCurrentUserId();
    if (userId) {
      await unlockAchievement(userId, key);
    }
  };

  externalUnlock = unlock;

  useEffect(() => {
    isMountedRef.current = true;
    const stored = localStorage.getItem(LOCAL_UNLOCKED_KEY);
    const unlockedLocal = new Set<string>(stored ? JSON.parse(stored) : []);
    unlockedRef.current = unlockedLocal;

    setAchievements(
      localAchievements.map((achievement) => ({
        ...achievement,
        unlocked: unlockedLocal.has(achievement.id),
      })),
    );

    localAchievements.forEach((achievement) => {
      const seconds = Number(achievement.unlockAfterSeconds);
      if (!achievement.unlocked && !isNaN(seconds) && seconds > 0 && !unlockedLocal.has(achievement.id)) {
        timers.current[achievement.id] = setTimeout(async () => {
          if (unlockedRef.current.has(achievement.id) || !isMountedRef.current) return;
          await unlock(achievement.id);
        }, seconds * 1000);
      }
    });

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
