import { areaLevelReqs } from "../data/areas";
import { lootTable } from "../data/inventory";
import { uniqueMissions } from "../data/missions";
import { WeightedLootItem } from "../types/Guild";
import type { Area, Mission, MissionType } from "../types/Missions";

export const generateDefaultMission = (area: Area, type: MissionType, id?: string): Mission => ({
  id: id || `default-${area.toLowerCase()}-${type}`,
  name: `${type[0].toUpperCase() + type.slice(1)}: ${area}`,
  area,
  type,
  duration: 5, 
  goldReward: 25,
  guildXp: 25,
  characterXp: 20,
  unique: false
})

export const resolveMissionMeta = (areas: Area[], defaultTypes: MissionType[], id: string): Mission | null => {
  for (const area of areas) {
    for (const type of defaultTypes) {
      const defaultId = `default-${area.toLowerCase()}-${type}`
      if (id === defaultId) {
        return generateDefaultMission(area as Area, type, id)
      }
    }
  }
  return uniqueMissions.find(m => m.id === id) ?? null
}

export const getElapsed = (start: number) => Math.floor((Date.now() - start) / 1000);

export const getMissionRequirement = (mission: Mission) => {
  const requiredLevel = areaLevelReqs[mission.area];
  let requiredCount = 1;
  if (mission.duration >= 90) requiredCount = 3;
  else if (mission.duration >= 60) requiredCount = 2;
  if (mission.unique) requiredCount = Math.max(requiredCount, 2);
  return { requiredLevel, requiredCount };
};

export const pickRandomAdventurers = <T,>(pool: T[], count: number): T[] => {
  if (count <= 0) return [];
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

export function pickWeightedItem(): WeightedLootItem {
  const table = lootTable;
  const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
  const rand = Math.random() * totalWeight;

  let running = 0;
  for (const item of table) {
    running += item.weight;
    if (rand < running) return item;
  }

  return table[0]; // fallback
}
