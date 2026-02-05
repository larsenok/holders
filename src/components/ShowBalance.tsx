import { useUser } from '../providers/UserProvider';
import { useGuild } from '../providers/GuildProvider';

export default function ShowBalance() {
  const { user, credits } = useUser();
  const { guildStats } = useGuild();

  if (!guildStats) return null;

  return (
    <div className="w-full border border-yellow-500/30 rounded-xl py-2 px-4 flex flex-col sm:flex-row justify-center items-center gap-6 text-lg font-mono text-white bg-black/10">
      <div className="flex items-center gap-2 text-yellow-300">
        <span>💰 Gold:</span>
        <span>{guildStats.gold}</span>
      </div>
      <div className="flex items-center gap-2 text-pink-300">
        <span>🛡️ Iron Tokens:</span>
        <span>
          {credits ?? 0}
          {!user && <span className="text-gray-400 text-sm"> (login to get tokens)</span>}
        </span>
      </div>
    </div>
  );
}
