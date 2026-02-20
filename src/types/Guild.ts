export type Stats = {
  strength: number;
  defense: number;
  wisdom: number;
  magic: number;
  dexterity: number;
  agility: number;
};

export type GearSlot = 'head' | 'chest' | 'legs' | 'weapon'

export type GearSlots = Record<GearSlot, GearItem | null>

export type Adventurer = {
  id: string
  name: string
  status: 'idle' | 'resting' | 'onMission' | 'training' | 'onTask'
  stats: Stats
  level: number            // Range: 1–100
  xp: number               // Current XP toward next level
  power: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
  trainingType?: string;              // e.g. 'sparring'
  trainingEndsAt?: number;           // timestamp in ms
  readyToAssignStat?: boolean;
  lastTrainingAt?: number // UNIX timestamp in ms
  restingEndsAt?: number
  taskType?: string;
  gear: GearSlots;
  animKey?: string;
  history: string[];
}

export type GuildStats = {
  name: string;
  gold: number;
  rank: number;
  power: number;
  xp: number;
  nextRankXP: number;
  missionsCompleted?: number;
  trainingsCompleted?: number;
  missionsCompletedByArea?: Record<string, number>;
  areaMilestones?: Record<string, number[]>;
  // lifetime and historical tracking
  lifetimeGold?: number;
  lifetimeMaterials?: number;
  lifetimeItems?: number;
  lifetimeTomes?: number;
  lifetimeXp?: number;
  totalMissionTime?: number; // in seconds
  areaHistory?: Record<
    string,
    {
      missions: number;
      fastest: number; // seconds
      totalGold: number;
      totalMaterials: number;
      totalXp: number;
      totalItems: number;
    }
  >;
  bestMission?: {
    gold: { amount: number; date: number; area: string };
    materials: { amount: number; date: number; area: string };
    xp: { amount: number; date: number; area: string };
    items: { amount: number; date: number; area: string };
  };
  milestoneTimeline?: Array<{ event: string; timestamp: number; area?: string }>;
  hallUpgrades?: Record<string, number>;
  unlockedVisitors?: string[];
  passiveGoldBonus?: number;
  missionGoldMult?: number;
  missionGoldMultExpires?: number;
};

export type MaterialType = 'Wood' | 'Stone' | 'Iron' | 'Cloth'

export type GearItem = {
  id: string
  name: string
  slot: GearSlot
}

export type UniqueItem = {
  id: string
  name: string
  description: string
}

export type InventoryItemType =
  | 'Bone'
  | 'Meat'
  | 'Potion'
  | 'Trash'
  | 'Bread'
  | 'Water'
  | 'Silverware'
  | 'Rune'
  | 'Cheese'
  | 'Fruit'
  | 'Jewellery'
  | 'Azurite'
  | 'Copper'
  | 'Mushrooms'
  | 'Vegetables'
  | 'Talisman'
  | 'Relic'
  | 'Emerald'
  | 'Ash'
  | 'Salt'
  | 'Hide'
  | 'Diamond'
  | 'Tome'
  | 'Map'
  | 'Purse'

export const itemsWithWarning: InventoryItemType[] = [
  'Tome',
];

export type GuildInventory = Record<InventoryItemType, number>

export type GuildStash = {
  materials: Record<MaterialType, number>
  gear: GearItem[]
  uniques: UniqueItem[]
}

export type WeightedLootItem = {
  item: InventoryItemType;
  weight: number;
  minQty: number;
  maxQty: number;
};
