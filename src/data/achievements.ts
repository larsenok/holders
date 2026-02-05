import type { InventoryItemType } from '../types/Guild';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockAfterSeconds?: number; // optional time-based unlock
  counterThreshold?: number; // optional counter
  rewardTokens?: number; // optional token reward
  rewardGold?: number; // optional gold reward
  rewardItem?: InventoryItemType; // optional item reward
  rewardItemQty?: number; // quantity for item rewards
};

export const achievements: Achievement[] = [
  {
    id: 'firstUniqueMission',
    title: 'First of Many',
    description: 'Complete your first unique mission.',
    unlocked: false,
  },
  {
    id: 'mission10',
    title: 'Getting the Hang of It',
    description: 'Complete 10 missions.',
    unlocked: false,
    counterThreshold: 10,
    rewardGold: 100,
  },
  {
    id: 'mission50',
    title: 'Seasoned Explorer',
    description: 'Complete 50 missions.',
    unlocked: false,
    counterThreshold: 50,
    rewardGold: 500,
  },
  {
    id: 'training5',
    title: 'Dedicated Student',
    description: 'Finish 5 training sessions.',
    unlocked: false,
    counterThreshold: 5,
    rewardItem: 'Potion',
    rewardItemQty: 2,
  },
  {
    id: 'training20',
    title: 'Master in the Making',
    description: 'Finish 20 training sessions.',
    unlocked: false,
    counterThreshold: 20,
    rewardTokens: 200,
  },
  { id: 'forest30', title: 'Forest Adept', description: 'Complete 30 Forest missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'forest100', title: 'Forest Legend', description: 'Complete 100 Forest missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'mountains30', title: 'Mountain Adept', description: 'Complete 30 Mountains missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'mountains100', title: 'Mountain Legend', description: 'Complete 100 Mountains missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'swamp30', title: 'Swamp Adept', description: 'Complete 30 Swamp missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'swamp100', title: 'Swamp Legend', description: 'Complete 100 Swamp missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'desert30', title: 'Desert Adept', description: 'Complete 30 Desert missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'desert100', title: 'Desert Legend', description: 'Complete 100 Desert missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'tundra30', title: 'Tundra Adept', description: 'Complete 30 Tundra missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'tundra100', title: 'Tundra Legend', description: 'Complete 100 Tundra missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'ruins30', title: 'Ruins Adept', description: 'Complete 30 Ruins missions.', unlocked: false, counterThreshold: 30, rewardGold: 150 },
  { id: 'ruins100', title: 'Ruins Legend', description: 'Complete 100 Ruins missions.', unlocked: false, counterThreshold: 100, rewardTokens: 100 },
  { id: 'heroLv10', title: 'Dedicated Trainee', description: 'Train an adventurer to level 10.', unlocked: false, rewardTokens: 25 },
  { id: 'heroLv25', title: 'Veteran Hero', description: 'Reach hero level 25.', unlocked: false, rewardTokens: 75 },
  { id: 'guildLv5', title: 'Guild Established', description: 'Reach guild rank 5.', unlocked: false, rewardTokens: 50 },
  { id: 'guildLv10', title: 'Guild Growing', description: 'Reach guild rank 10.', unlocked: false, rewardTokens: 100 },
];

