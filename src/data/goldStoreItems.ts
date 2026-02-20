export type GoldStoreEffect =
  | { type: 'gold'; amount: number }
  | { type: 'xp'; amount: number }
  | { type: 'power'; amount: number }
  | { type: 'passiveGoldBonus'; amount: number }
  | { type: 'unlock' };

export type GoldStoreItem = {
  key: string;
  name: string;
  description: string;
  cost: number;
  effect: GoldStoreEffect;
  repeatable: boolean;
};

export const goldStoreItems: GoldStoreItem[] = [
  {
    key: 'gold_boost_1',
    name: 'Gold Pouch',
    description: 'Instantly gain 100 gold.',
    cost: 90,
    effect: { type: 'gold', amount: 100 },
    repeatable: true,
  },
  {
    key: 'guild_xp_pack',
    name: 'Guild Chronicle',
    description: 'Gain 35 Guild XP instantly.',
    cost: 120,
    effect: { type: 'xp', amount: 35 },
    repeatable: true,
  },
  {
    key: 'power_tonic',
    name: 'Power Tonic',
    description: 'Gain +1 Guild Power.',
    cost: 200,
    effect: { type: 'power', amount: 1 },
    repeatable: true,
  },
  {
    key: 'vault_booster',
    name: 'Vault Booster',
    description: 'Permanently increase passive mission gold bonus by +2.',
    cost: 250,
    effect: { type: 'passiveGoldBonus', amount: 2 },
    repeatable: true,
  },
  {
    key: 'gold_skin_1',
    name: 'Golden Trim Outfit',
    description: 'Shiny armor with no real benefit. Looks cool.',
    cost: 300,
    effect: { type: 'unlock' },
    repeatable: false,
  },
];
