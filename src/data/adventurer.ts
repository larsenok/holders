import { Adventurer } from '../types/Guild'
import { spriteAnimations } from './spriteAnimation'

export const spots = [
  { left: '8%', bottom: '16%' },    // left base
  { left: '28%', bottom: '44%' },   // left peak
  { left: '50%', bottom: '24%' },   // center dip
  { left: '72%', bottom: '48%' },   // right peak
  { left: '85%', bottom: '6%' },    // right base
]

// Starter Options
export const starterMembers: Adventurer[] = [
  {
    id: crypto.randomUUID(),
    name: 'Raiya Morghadi',
    status: 'idle',
    stats: {
      strength: 6,
      defense: 4,
      dexterity: 3,
      agility: 2,
      wisdom: 2,
      magic: 1,
    },
    level: 1,
    xp: 0,
    power: 'C',
    gear: {
      head: null,
      chest: null,
      legs: null,
      weapon: null,
    },
    animKey: "hero_crusader_idle_0",
    history: [],
  },
  {
    id: crypto.randomUUID(),
    name: 'Karn Bordor',
    status: 'idle',
    stats: {
      strength: 3,
      defense: 3,
      dexterity: 6,
      agility: 5,
      wisdom: 2,
      magic: 1,
    },
    level: 1,
    xp: 0,
    power: 'C',
    gear: {
      head: null,
      chest: null,
      legs: null,
      weapon: null,
    },
    animKey: "hero_warrior_0",
    history: [],
  },
  {
    id: crypto.randomUUID(),
    name: 'Alo Hais',
    status: 'idle',
    stats: {
      strength: 1,
      defense: 2,
      dexterity: 3,
      agility: 2,
      wisdom: 6,
      magic: 5,
    },
    level: 1,
    xp: 0,
    power: 'C',
    gear: {
      head: null,
      chest: null,
      legs: null,
      weapon: null,
    },
    animKey: "hero_samurai_idle_0",
    history: [],
  },
]

export const STAT_ORDER: (keyof Adventurer['stats'])[] = [
  'strength',
  'defense',
  'wisdom',
  'magic',
  'dexterity',
  'agility',
]

export const STAT_LABELS: Record<keyof Adventurer['stats'], string> = {
  strength: 'Strength: Physical power and brawn.',
  defense: 'Defense: Resilience and endurance.',
  wisdom: 'Wisdom: Knowledge and intuition.',
  magic: 'Magic: Arcane ability and attunement.',
  dexterity: 'Dexterity: Precision and fine control.',
  agility: 'Agility: Speed and reflexes.',
}

const firstNames = [
  'Arin', 'Bryn', 'Cael', 'Doran', 'Eira', 'Fenn', 'Galen', 'Hild',
  'Ivar', 'Jora', 'Kael', 'Lira', 'Mira', 'Nox', 'Orin', 'Perrin'
]

const lastNames = [
  'Stone', 'Ash', 'Gale', 'Rivers', 'Thorn', 'Vale', 'Dusk', 'Frost',
  'Ember', 'Hollow', 'Storm', 'Drift', 'Shade', 'Moss', 'Bluff', 'Wraith'
]

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

function getPowerRating(override?: 'S' | 'A' | 'B' | 'C' | 'D' | 'E'): 'S' | 'A' | 'B' | 'C' | 'D' | 'E' {
  if (override) return override

  const roll = Math.random()

  if (roll < 0.02) return 'S'
  if (roll < 0.08) return 'A'
  if (roll < 0.2) return 'B'
  if (roll < 0.45) return 'C'
  if (roll < 0.8) return 'D'
  return 'E'
}

const randIdleHero = (): string => {
  const heroAnimations = spriteAnimations.filter(anim =>
    anim.key.startsWith('hero_')
  )

  if (heroAnimations.length === 0) return 'hero_idle_0' // fallback

  const index = Math.floor(Math.random() * heroAnimations.length)
  return heroAnimations[index].key
}

export function generateRandomAdventurer(powerOverride?:  'S' | 'A' | 'B' | 'C' | 'D' | 'E'): Adventurer {
  const name = `${firstNames[rand(0, firstNames.length - 1)]} ${lastNames[rand(0, lastNames.length - 1)]}`

  return {
    id: crypto.randomUUID(),
    name,
    status: 'idle',
    stats: {
      strength: rand(1, 10),
      defense: rand(1, 10),
      dexterity: rand(1, 10),
      agility: rand(1, 10),
      wisdom: rand(1, 10),
      magic: rand(1, 10)
    },
    level: 1,
    xp: 0,
    power: getPowerRating(powerOverride),
    gear: {
      head: null,
      chest: null,
      legs: null,
      weapon: null
    },
    animKey: randIdleHero(),
    history: [],
  }
}

