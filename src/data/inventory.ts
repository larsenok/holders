import type { GuildInventory, InventoryItemType, WeightedLootItem } from '../types/Guild'
import { TomeInfo } from '../types/Inventory'

export const inventoryIcons: Record<InventoryItemType, string> = {
  Bone: '/img/items/bone_0.png',
  Meat: '/img/items/meat_0.png',
  Potion: '/img/items/potion_0.png',
  Trash: '/img/items/trash_0.png',
  Bread: '/img/items/bread_0.png',
  Water: '/img/items/water_0.png',
  Silverware: '/img/items/silverware_0.png',
  Rune: '/img/items/rune_0.png',
  Cheese: '/img/items/cheese_0.png',
  Fruit: '/img/items/fruit_0.png',
  Jewellery: '/img/items/jewellery_0.png',
  Azurite: '/img/items/azurite_0.png',
  Copper: '/img/items/copper_0.png',
  Mushrooms: '/img/items/mushrooms_0.png',
  Vegetables: '/img/items/vegetables_0.png',
  Talisman: '/img/items/talisman_0.png',
  Relic: '/img/items/relic_0.png',
  Emerald: '/img/items/emerald_0.png',
  Ash: '/img/items/ash_0.png',
  Salt: '/img/items/salt_0.png',
  Hide: '/img/items/hide_0.png',
  Diamond: '/img/items/diamond_0.png',
  Tome: '/img/items/tome_0.png',
  Map: '/img/items/map_0.png',
  Purse: '/img/items/purse_0.png',
}

export const defaultInventory: GuildInventory = {
  Bone: 0,
  Meat: 0,
  Potion: 0,
  Trash: 0,
  Bread: 0,
  Water: 0,
  Silverware: 0,
  Rune: 0,
  Cheese: 0,
  Fruit: 0,
  Jewellery: 0,
  Azurite: 0,
  Copper: 0,
  Mushrooms: 0,
  Vegetables: 0,
  Talisman: 0,
  Relic: 0,
  Emerald: 0,
  Ash: 0,
  Salt: 0,
  Hide: 0,
  Diamond: 0,
  Tome: 0,
  Map: 0,
  Purse: 0,
}

export const itemValues: Record<InventoryItemType, number> = {
  Trash: 1,
  Ash: 1,
  Salt: 1,
  Bread: 2,
  Water: 2,
  Fruit: 2,
  Vegetables: 2,
  Mushrooms: 3,
  Meat: 3,
  Cheese: 4,
  Bone: 5,
  Hide: 5,
  Copper: 8,
  Rune: 10,
  Azurite: 12,
  Potion: 15,
  Talisman: 18,
  Silverware: 20,
  Tome: 20,
  Map: 20,
  Relic: 22,
  Jewellery: 25,
  Purse: 30,
  Emerald: 30,
  Diamond: 50,
}

export const lootTable: WeightedLootItem[] = [
  // Common staples
  { item: 'Bread', weight: 30, minQty: 2, maxQty: 5 },
  { item: 'Water', weight: 25, minQty: 2, maxQty: 4 },
  { item: 'Meat', weight: 15, minQty: 1, maxQty: 3 },

  // Common gatherables
  { item: 'Fruit', weight: 12, minQty: 1, maxQty: 3 },
  { item: 'Vegetables', weight: 12, minQty: 1, maxQty: 3 },
  { item: 'Mushrooms', weight: 10, minQty: 1, maxQty: 3 },

  // Basic crafted or useful
  { item: 'Potion', weight: 10, minQty: 1, maxQty: 1 },
  { item: 'Cheese', weight: 8, minQty: 1, maxQty: 2 },
  { item: 'Hide', weight: 7, minQty: 1, maxQty: 2 },
  { item: 'Salt', weight: 6, minQty: 1, maxQty: 2 },
  { item: 'Copper', weight: 6, minQty: 1, maxQty: 2 },

  // Mid-value trinkets and scraps
  { item: 'Silverware', weight: 5, minQty: 1, maxQty: 1 },
  { item: 'Ash', weight: 5, minQty: 1, maxQty: 1 },
  { item: 'Rune', weight: 5, minQty: 1, maxQty: 1 },
  { item: 'Bone', weight: 5, minQty: 1, maxQty: 1 },

  // Rarer valuables + trash
  { item: 'Jewellery', weight: 3, minQty: 1, maxQty: 1 },
  { item: 'Azurite', weight: 2, minQty: 1, maxQty: 1 },
  { item: 'Talisman', weight: 2, minQty: 1, maxQty: 1 },
  { item: 'Emerald', weight: 2, minQty: 1, maxQty: 1 },
  { item: 'Trash', weight: 2, minQty: 1, maxQty: 1 },

  // Very rare
  { item: 'Relic', weight: 1, minQty: 1, maxQty: 1 },
  { item: 'Diamond', weight: 1, minQty: 1, maxQty: 1 },
  { item: 'Tome', weight: 1, minQty: 1, maxQty: 1 },
  { item: 'Map', weight: 1, minQty: 1, maxQty: 1 },
  { item: 'Purse', weight: 1, minQty: 1, maxQty: 1 },
]

export const allTomes: Record<string, TomeInfo> = {
  tome_ember: {
    id: 'tome_ember',
    name: 'Tome of Ember',
    effects: [
      '+10% gold from missions',
      'Fire attacks have 10% chance to ignite foes',
    ],
    color: 'red',
  },
  tome_tide: {
    id: 'tome_tide',
    name: 'Tome of Tides',
    effects: [
      '+10% guild XP from missions',
      'Water skills deal +15% damage',
    ],
    color: 'blue',
  },
  tome_grove: {
    id: 'tome_grove',
    name: 'Tome of the Grove',
    effects: [
      '+15% resource yield on gathering missions',
      'Food heals 10% more health',
    ],
    color: 'green',
  },
  tome_void: {
    id: 'tome_void',
    name: 'Tome of the Void',
    effects: [
      '+8% chance to find rare items',
      'Adventurers gain 5% dodge chance',
    ],
    color: 'purple',
  },
}
