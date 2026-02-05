import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import unlockDefaults from '../data/unlocks';
import { storeItems } from '../data/storeItems';
import { UnlockContextType, UnlockItem, UnlockStatus } from '../types/Store';
import { useUser } from '../providers/UserProvider';
import { updateCredits } from '../api/credits';
import { useGuild } from '../providers/GuildProvider';

const STORAGE_KEY = 'unlockedStatuses';
const CREDITS_STORAGE_KEY = 'userCredits';

const UnlockContext = createContext<UnlockContextType | null>(null);

export const UnlockProvider = ({ children }: { children: ReactNode }) => {
  const [unlocks] = useState<UnlockItem>(unlockDefaults);
  const { user, credits, setCredits } = useUser();
  const { guildStats, updateGuildStats } = useGuild();

  const loadInitialStatuses = useCallback((): UnlockStatus[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UnlockStatus[];
        return storeItems.map(item => {
          const found = parsed.find(p => p.key === item.key);
          return found ?? { key: item.key, unlocked: false, equipped: false };
        });
      } catch {
        console.log("Failed to parse saved unlocks");
      }
    }

    return storeItems.map(item => ({
      key: item.key,
      unlocked: item.key.endsWith('_default'),
      equipped: false
    }));
  }, []);

  const [unlockedStatuses, setUnlockedStatuses] = useState<UnlockStatus[]>(loadInitialStatuses);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedStatuses));
  }, [unlockedStatuses]);

  useEffect(() => {
    localStorage.setItem(CREDITS_STORAGE_KEY, String(credits));
  }, [credits]);

  const isUnlocked = useCallback((key: string) => {
    const found = unlockedStatuses.find((entry) => entry.key === key);
    return found?.unlocked ?? false;
  }, [unlockedStatuses]);

  const setUnlocked = useCallback((key: string, cost: number, unlocked: boolean, type?: string): boolean => {
    if (type === "credits") {
      if (unlocked && credits < cost) {
        console.warn(`Not enough credits to unlock ${key}`);
        return false;
      }

      setUnlockedStatuses((prev) =>
        prev.map((entry) =>
          entry.key === key ? { ...entry, unlocked } : entry
        )
      );

      if (unlocked && user) {
        setCredits(credits - cost);
        updateCredits(user.id, user.email, credits - cost);
      }

      return true;
    }
    else {
      // Use guildStats.gold for gold-based unlocks
      const currentGold = guildStats.gold;

      if (unlocked && currentGold < cost) {
        console.warn(`Not enough gold to unlock ${key}`);
        return false;
      }

      setUnlockedStatuses((prev) =>
        prev.map((entry) =>
          entry.key === key ? { ...entry, unlocked } : entry
        )
      );

      if (unlocked) {
        // Remove gold using guild context
        const newGold = currentGold - cost;
        updateGuildStats({ gold: newGold });
      }
    }
    return false;
  }, [credits, user, guildStats.gold, setCredits, updateGuildStats]);

  const getEquipped = useCallback((accent: boolean = false): string => {
    const prefix = "main_colour_background";
    const equippedItem = unlockedStatuses.find(
      (entry) => entry.equipped && entry.key.startsWith(prefix)
    );
    if (!accent && !equippedItem) {
      return '';
    }

    const findValue = (obj: Record<string, unknown>): string | null => {
      for (const k in obj) {
        const val = obj[k];

        if (typeof val === 'object' && val !== null) {
          const maybeMatch = val as {
            key?: string;
            value?: string;
            default?: string;
            accent?: string;
          };

          if (maybeMatch.key === equippedItem?.key) {
            return accent && maybeMatch.accent
              ? maybeMatch.accent
              : maybeMatch.value ?? maybeMatch.default ?? null;
          }

          const nested = findValue(val as Record<string, unknown>);
          if (nested) return nested;
        }
      }
      return null;
    };

    return findValue(unlocks) ?? '';
  }, [unlockedStatuses, unlocks]);

  const setEquipped = useCallback((key: string) => {
    const parts = key.split('_');
    const endsWithDefault = parts[parts.length - 1] === 'default';
    const prefix = parts
      .slice(0, endsWithDefault ? -2 : -1)
      .join('_');

    setUnlockedStatuses((prev) =>
      prev.map((entry) => {
        const inGroup = entry.key.startsWith(prefix);
        return {
          ...entry,
          equipped: inGroup ? entry.key === key : entry.equipped
        };
      })
    );
  }, []);

  const contextValue = useMemo(() => ({
    unlocks,
    unlockedStatuses,
    isUnlocked,
    setUnlocked,
    getEquipped,
    setEquipped
  }), [unlocks, unlockedStatuses, isUnlocked, setUnlocked, getEquipped, setEquipped]);

  return (
    <UnlockContext.Provider value={contextValue}>
      {children}
    </UnlockContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUnlocks = () => {
  const context = useContext(UnlockContext);
  if (!context) throw new Error('useUnlocks must be used within UnlockProvider');
  return context;
};
