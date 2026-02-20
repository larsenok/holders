import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expanded, setExpanded] = useState(false);

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

        <div className="mt-2 flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex-1 flex items-center justify-between rounded-md border border-slate-700/80 bg-slate-900/65 px-3 py-2 text-left hover:border-cyan-400/50 transition"
            onClick={() => setExpanded(prev => !prev)}
          >
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-cyan-100 truncate">
                Guild Overview · {guildStats.name}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[10px] sm:text-xs font-mono text-slate-200">
                <span>Rank <span className="text-white font-semibold">{guildStats.rank.toLocaleString()}</span></span>
                <span>•</span>
                <span>Gold <span className="text-yellow-300 font-semibold">{guildStats.gold.toLocaleString()}</span></span>
                <span>•</span>
                <span>Power <span className="text-emerald-300 font-semibold">{guildStats.power.toLocaleString()}</span></span>
              </div>
            </div>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showDevControls && <HeavyButton onClick={() => increaseXp(20)} size="sm">X+</HeavyButton>}
        </div>
      </div>

      {expanded && (
        <div className="bg-black/40 p-2.5 rounded-lg space-y-2 w-full">
          <div className="flex items-center gap-2 rounded-md border border-slate-700/80 bg-slate-950/60 px-2.5 py-2">
            <FlameSprite />
            <h1 className="text-sm sm:text-lg font-extrabold tracking-wide text-left text-slate-100">{guildStats.name}</h1>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(statMeta) as StatKey[]).map((key) => (
              <div key={key} className="rounded-md border border-slate-700/80 bg-slate-950/60 px-2.5 py-2">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-cyan-200">
                  <img src={statMeta[key].icon} className="w-3.5 h-3.5" alt={statMeta[key].label} />
                  {statMeta[key].label}
                  <span className={`text-sm font-semibold normal-case tracking-normal ${statMeta[key].valueClass}`}>
                    {guildStats[key].toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                  {details[key].map((item) => (
                    <div key={item.label} className="rounded bg-slate-900/70 px-2 py-1.5">
                      <div className="text-slate-400">{item.label}</div>
                      <div className="text-slate-100 font-semibold truncate" title={item.value}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
