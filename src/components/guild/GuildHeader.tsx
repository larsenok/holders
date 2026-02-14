import { useMemo, useState } from 'react';
import { useGuild } from '../../providers/GuildProvider';
import FlameSprite from '../ui/effects/FlameSprite';
import HeavyButton from '../ui/HeavyButton';
import GuildXPBar from './GuildXPBar';

type StatKey = 'rank' | 'gold' | 'power';

const statMeta: Record<StatKey, { label: string; icon: string; valueClass: string }> = {
  rank: { label: 'Rank', icon: '/img/materials/star_0.png', valueClass: 'text-white' },
  gold: { label: 'Gold', icon: '/img/materials/gold_0.png', valueClass: 'text-yellow-400' },
  power: { label: 'Power', icon: '/img/materials/power_0.png', valueClass: 'text-green-400' },
};

const formatDate = (value?: number) => {
  if (!value) return 'Unknown';
  return new Date(value).toLocaleDateString();
};

export default function GuildHeader() {
  const { guildStats, increaseXp, adventurers } = useGuild();
  const showDevControls = import.meta.env.VITE_SHOW_DEV_CONTROLS === 'true';
  const [selected, setSelected] = useState<StatKey>('gold');

  const details = useMemo(() => {
    const createdAt = Number(localStorage.getItem('guild_created_at') || 0);
    const firstHero = adventurers[0]?.name || 'None recruited yet';
    const missionsCompleted = guildStats.missionsCompleted || 0;
    const trainingsCompleted = guildStats.trainingsCompleted || 0;

    return {
      rank: [
        { label: 'Guild founded', value: formatDate(createdAt) },
        { label: 'First hero', value: firstHero },
        { label: 'Missions done', value: missionsCompleted.toLocaleString() },
      ],
      gold: [
        { label: 'Treasury', value: guildStats.gold.toLocaleString() },
        { label: 'Lifetime gold', value: (guildStats.lifetimeGold || 0).toLocaleString() },
        { label: 'Items found', value: (guildStats.lifetimeItems || 0).toLocaleString() },
      ],
      power: [
        { label: 'Power score', value: guildStats.power.toLocaleString() },
        { label: 'Guild XP', value: guildStats.xp.toLocaleString() },
        { label: 'Trainings done', value: trainingsCompleted.toLocaleString() },
      ],
    };
  }, [adventurers, guildStats]);

  return (
    <div className="w-full flex flex-col gap-3 mb-2">
      <div className="sticky top-0 z-20 -mx-3 sm:mx-0 px-3 sm:px-0 pt-1 pb-2 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 rounded-b-xl sm:rounded-none">
        <div className="relative">
          <GuildXPBar size="lg" />
          <div className="absolute -top-2 right-0 rounded-md border border-cyan-300/50 bg-slate-900/90 px-2 py-1 text-[10px] sm:text-xs font-black tracking-[0.18em] text-cyan-200">
            LVL {guildStats.rank}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlameSprite />
            <h1 className="text-base sm:text-xl font-extrabold tracking-wide text-left">
              {guildStats.name}
            </h1>
          </div>
          {showDevControls && <HeavyButton onClick={() => increaseXp(20)} size="sm">X+</HeavyButton>}
        </div>
      </div>

      <div className="bg-black/40 p-2.5 rounded-lg space-y-2 w-full">
        <div className="grid grid-cols-3 gap-2 text-center w-full">
          {(Object.keys(statMeta) as StatKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`flex flex-col items-center rounded py-1.5 border transition ${selected === key ? 'bg-slate-900/80 border-cyan-400/50' : 'bg-slate-900/50 border-transparent hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <img src={statMeta[key].icon} className="w-4 h-4" alt={statMeta[key].label} />
                <span className={`text-base font-semibold ${statMeta[key].valueClass}`}>{guildStats[key].toLocaleString()}</span>
              </div>
              <span className="text-[10px] tracking-[0.15em] text-slate-300 uppercase">{statMeta[key].label}</span>
            </button>
          ))}
        </div>

        <div className="rounded-md border border-slate-700/80 bg-slate-950/60 px-2.5 py-2">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-cyan-200">
            <img src={statMeta[selected].icon} className="w-3.5 h-3.5" alt={statMeta[selected].label} />
            {statMeta[selected].label} details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
            {details[selected].map((item) => (
              <div key={item.label} className="rounded bg-slate-900/70 px-2 py-1.5">
                <div className="text-slate-400">{item.label}</div>
                <div className="text-slate-100 font-semibold truncate" title={item.value}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
