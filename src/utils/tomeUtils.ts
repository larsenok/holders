import type { TomeSnapshot } from '../types/Missions'

export function computeTomeSnapshot(ids: string[]): TomeSnapshot {
  const goldMult = ids.includes('tome_ember') ? 1.1 : 1
  const xpMult = ids.includes('tome_tide') ? 1.1 : 1
  return { ids, goldMult, xpMult }
}

export function getTomeEffectTags(ids: string[]): string[] {
  const tags: string[] = []
  if (ids.includes('tome_ember')) tags.push('+Gold 10%')
  if (ids.includes('tome_tide')) tags.push('+XP 10%')
  if (ids.includes('tome_grove')) tags.push('+Gather 15%')
  if (ids.includes('tome_void')) tags.push('+Rare Loot 8%')
  return tags
}
