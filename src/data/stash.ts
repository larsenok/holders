import type { GuildStash } from '../types/Guild'

export const defaultStash: GuildStash = {
  materials: {
    Iron: 0,
    Wood: 0,
    Stone: 0,
    Cloth: 0,
    Herbs: 0,
  },
  gear: [
    { id: crypto.randomUUID(), name: 'Rusty Helm', slot: 'head' },
    { id: crypto.randomUUID(), name: 'Torn Armor', slot: 'chest' },
    { id: crypto.randomUUID(), name: 'Worn Greaves', slot: 'legs' },
    { id: crypto.randomUUID(), name: 'Crude Sword', slot: 'weapon' },
  ],
  uniques: [],
}

export const STASH_LABELS: Record<keyof GuildStash['materials'], string> = {
  Iron: 'Metals: Can be forged for weapons, armor, and tools.',
  Wood: 'Wood: Common crafting material for construction and fuel.',
  Stone: 'Stone: Used in building, reinforcing, or heavy gear.',
  Cloth: 'Cloth: For garments, bandages, and light gear.',
  Herbs: 'Herbs: Ground for potions, poultices, or enchantments.',
}
