import { useGuild } from '../providers/GuildProvider';
import { computeMissionBonuses } from '../utils/bonusUtils';

export default function GuildBonuses() {
  const { adventurers } = useGuild();
  const b = computeMissionBonuses(adventurers);

  const entries = [
    {
      lore: 'Stronger guild members can carry heavier hauls back from missions',
      label: 'Materials',
      value: b.materials,
      sign: '+',
    },
    {
      lore: 'Agile members move faster, traverse obstacles more easily, and shorten mission routes',
      label: 'Duration',
      value: b.duration,
      sign: '-',
    },
    {
      lore: 'Precise, skilled work earns recognition and training credit',
      label: 'Guild XP',
      value: b.guildXp,
      sign: '+',
    },
    {
      lore: 'Attunement to the arcane reveals hidden loot others miss',
      label: 'Extra Loot',
      value: b.extraLootChance,
      sign: '+',
    },
    {
      lore: 'Keen judgment and trade sense turns overlooked goods into gold',
      label: 'Gold',
      value: b.gold,
      sign: '+',
    },
  ];

  return (
    <div className="space-y-1 mb-3">
      {entries.map((e) => (
        <div key={e.label}>
          <div className="italic text-xs text-yellow-200">{e.lore}</div>
          <div className="font-bold text-sm">
            {e.label} {e.sign}{Math.round(e.value * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}
