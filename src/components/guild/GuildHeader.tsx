import { useGuild } from '../../providers/GuildProvider';
import FlameSprite from '../ui/effects/FlameSprite';
import HeavyButton from '../ui/HeavyButton';
import GuildXPBar from './GuildXPBar';

export default function GuildHeader() {
  const { guildStats, increaseXp } = useGuild();
  const showDevControls = import.meta.env.VITE_SHOW_DEV_CONTROLS === 'true';

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

      <div className="bg-black/40 p-3 rounded-lg grid grid-cols-3 gap-2 text-sm text-center w-full">
        <div className="flex flex-col items-center rounded bg-slate-900/50 py-1.5">
          <div className="flex items-center gap-2">
            <img src="/img/materials/star_0.png" className="w-4 h-4" alt="Level" />
            <span className="text-white text-base font-semibold">{guildStats.rank}</span>
          </div>
          <span className="text-[10px] tracking-[0.15em] text-slate-300">RANK</span>
        </div>
        <div className="flex flex-col items-center rounded bg-slate-900/50 py-1.5">
          <div className="flex items-center gap-2">
            <img src="/img/materials/gold_0.png" className="w-4 h-4" alt="Gold" />
            <span className="text-yellow-400 text-base font-semibold">{guildStats.gold}</span>
          </div>
          <span className="text-[10px] tracking-[0.15em] text-slate-300">GOLD</span>
        </div>
        <div className="flex flex-col items-center rounded bg-slate-900/50 py-1.5">
          <div className="flex items-center gap-2">
            <img src="/img/materials/power_0.png" className="w-4 h-4" alt="Power" />
            <span className="text-green-400 text-base font-semibold">{guildStats.power}</span>
          </div>
          <span className="text-[10px] tracking-[0.15em] text-slate-300">POWER</span>
        </div>
      </div>
    </div>
  );
}
