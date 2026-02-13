import { useState } from 'react';
import { useGuild } from '../providers/GuildProvider';
import { computeMissionBonuses } from '../utils/bonusUtils';
import HeavyButton from './ui/HeavyButton';

export default function GuildBonuses() {
  const { adventurers } = useGuild();
  const [open, setOpen] = useState(false);
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
  ];

  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-950/60 p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-300 font-mono">Guild Stats</div>
        <HeavyButton size="sm" onClick={() => setOpen((v) => !v)}>
          <img src="/img/materials/star_0.png" className="w-4 h-4" alt="Guild stats" />
        </HeavyButton>
      </div>
      {open && (
        <div className="mt-2 space-y-2">
          {entries.map((e) => (
            <div key={e.label} className="rounded-lg bg-slate-900/70 border border-slate-700/60 px-2.5 py-2">
              <div className="italic text-[11px] text-yellow-200 leading-tight">{e.lore}</div>
              <div className="font-bold text-sm mt-1">
                {e.label} {e.sign}{Math.round(e.value * 100)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
