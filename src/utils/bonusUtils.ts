import type { Adventurer } from '../types/Guild';
import type { Mission } from '../types/Missions';

export type MissionBonuses = {
  materials: number; // as fraction e.g., 0.15 for +15%
  duration: number;  // fraction, reduces duration
  guildXp: number;   // fraction
  extraLootChance: number; // fraction chance for extra item
  gold: number;      // fraction
};

const BONUS_CONSTANT = 50; // controls diminishing returns

const calcBonus = (total: number) => total / (total + BONUS_CONSTANT);

export function computeMissionBonuses(adventurers: Adventurer[]): MissionBonuses {
  const totals = adventurers.reduce(
    (acc, a) => {
      acc.strength += a.stats.strength;
      acc.agility += a.stats.agility;
      acc.dexterity += a.stats.dexterity;
      acc.magic += a.stats.magic;
      acc.wisdom += a.stats.wisdom;
      return acc;
    },
    { strength: 0, agility: 0, dexterity: 0, magic: 0, wisdom: 0 }
  );

  return {
    materials: calcBonus(totals.strength),
    duration: calcBonus(totals.agility),
    guildXp: calcBonus(totals.dexterity),
    extraLootChance: calcBonus(totals.magic),
    gold: calcBonus(totals.wisdom),
  };
}

export function applyMissionBonuses(mission: Mission, b: MissionBonuses): Mission {
  return {
    ...mission,
    duration: Math.ceil(mission.duration * (1 - b.duration)),
    goldReward: Math.floor(mission.goldReward * (1 + b.gold)),
    guildXp: Math.floor(mission.guildXp * (1 + b.guildXp)),
  };
}
