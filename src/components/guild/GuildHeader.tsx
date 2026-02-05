import { useGuild } from '../../providers/GuildProvider';
import FlameSprite from '../ui/effects/FlameSprite';
import HeavyButton from '../ui/HeavyButton';
import GuildXPBar from './GuildXPBar';

export default function GuildHeader() {
  const { guildStats, increaseXp } = useGuild();

  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center mb-4">

      <div className="flex flex-row items-start">
        <div className="flex justify-center items-center">
          <FlameSprite />
        </div>

        {/* Name + XP Button wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:ml-4 mt-4 sm:mt-0 gap-4">
          <h1 className="text-2xl font-bold tracking-wide text-left whitespace-nowrap">
            {guildStats.name}
          </h1>
          <HeavyButton onClick={() => increaseXp(20)} size="sm">X+</HeavyButton>
        </div>
      </div>

      <GuildXPBar size="lg" />

      {/* Stats in thirds */}
      <div className="bg-black/40 p-4 rounded-lg grid grid-cols-3 gap-4 text-sm text-center w-full sm:w-auto mx-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img
              src="/img/materials/star_0.png"
              className="w-5 h-5"
              alt="Level"
            />
            <span className="text-white text-lg font-semibold">{guildStats.rank}</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img
              src="/img/materials/gold_0.png"
              className="w-5 h-5"
              alt="Gold"
            />
            <span className="text-yellow-400 text-lg font-semibold">
              {guildStats.gold}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <img
              src="/img/materials/power_0.png"
              className="w-5 h-5"
              alt="Power"
            />
            <span className="text-green-400 text-lg font-semibold">
              {guildStats.power}
            </span>
          </div>
        </div>
        
   
      </div>
    </div>
  );
}
