export const areas = ['Forest', 'Mountains', 'Swamp', 'Desert', 'Tundra', 'Ruins']
export type Area = (typeof areas)[number]
export const defaultTypes = ['explore', 'gathering', 'hunt']
export const areaImages: Record<string, string> = {
  Forest: '/img/areas/forest_0.png',
  Mountains: '/img/areas/mountains_0.png',
  Ruins: '/img/areas/ruins_0.png',
  Swamp: '/img/areas/swamp_1.png',
  Desert: '/img/areas/forest_1.png',
  Tundra: '/img/areas/ruins_1.png',
}

export const areaLevelReqs: Record<Area, number> = {
  Forest: 1,
  Mountains: 2,
  Swamp: 4,
  Desert: 6,
  Tundra: 8,
  Ruins: 10,
}
export const unlockableBonuses: string[] = [
  '+10% rare item drop rate',
  '-15% expedition time',
  '+20% gathering yield',
  '+5% stat XP from tasks in this area',
  '+1 bonus material per successful expedition',
  'Chance to find unique relics',
  'Reveal hidden expedition routes',
  '+10% success rate on dangerous expeditions',
  'Unlock night-time variant expeditions',
  'Expeditions here cost no supplies',
]
