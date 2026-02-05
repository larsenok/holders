import unlockDefaults from '../data/unlocks';

export type UnlockItem = typeof unlockDefaults;

export type UnlockContextType = {
  unlocks: UnlockItem;
  unlockedStatuses: UnlockStatus[];
  isUnlocked: (key: keyof UnlockItem | string) => boolean;
  setUnlocked: (key: string, cost: number, unlocked: boolean, type?: string) => boolean;
  getEquipped: (accent?: boolean) => string;
  setEquipped: (key: string) => void;
};

export type UnlockStatus = {
  key: string;
  unlocked: boolean;
  equipped: boolean;
}

export type StoreItem = {
  key: string;
  name: string;
  description: string;
  cost: number;
};
