import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchAllGuilds, Guild, fetchGuild } from '../api/guilds';
import { useUnlocks } from '../hooks/useUnlocks';
import { events } from '../data/events';
import { useUser } from '../providers/UserProvider';

const CACHE_KEY_TIME = 'leaderboard_cache_time';
const CACHE_KEY_DATA = 'leaderboard_cache_data';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const EVENT_KEY = 'leaderboard_event_id';

export default function LeaderboardPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [ready, setReady] = useState(false);
  const [playerGuild, setPlayerGuild] = useState<Guild | null>(null);
  const { getEquipped } = useUnlocks();
  const { user } = useUser();
  const mainBg = getEquipped();
  const now = Date.now();
  const activeEvent = events.find(
    (e) => now >= Date.parse(e.start) && now <= Date.parse(e.end)
  );
  const seasonTitle = activeEvent ? `${activeEvent.name} Rankings` : 'Leaderboard';

  useEffect(() => {
    const cachedTime = localStorage.getItem(CACHE_KEY_TIME);
    const cachedData = localStorage.getItem(CACHE_KEY_DATA);
    const storedEvent = localStorage.getItem(EVENT_KEY);
    const currentEventId = activeEvent?.id || 'offseason';

    if (storedEvent && storedEvent !== currentEventId) {
      const archiveKey = `leaderboard_archive_${storedEvent}`;
      const prevData = localStorage.getItem(CACHE_KEY_DATA);
      if (prevData) localStorage.setItem(archiveKey, prevData);
      localStorage.removeItem(CACHE_KEY_DATA);
      localStorage.removeItem(CACHE_KEY_TIME);
    }
    localStorage.setItem(EVENT_KEY, currentEventId);

    if (cachedData) {
      try {
        const parsed: Guild[] = JSON.parse(cachedData);
        setGuilds(parsed);
        setReady(true);
      } catch {
        console.warn('[Leaderboard] Failed to parse cached guild data');
        setReady(true);
      }
    } else {
      setReady(true); // ensure we don't get stuck
    }

    const shouldRefetch = !cachedTime || now - parseInt(cachedTime) > CACHE_DURATION_MS;

    if (shouldRefetch) {
      fetchAllGuilds(100).then(data => {
        if (JSON.stringify(data) !== JSON.stringify(guilds)) {
          setGuilds(data);
        }
        localStorage.setItem(CACHE_KEY_DATA, JSON.stringify(data));
        localStorage.setItem(CACHE_KEY_TIME, now.toString());
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchGuild(user.id).then((g) => setPlayerGuild(g));
    }
  }, [user]);

  function resetCache() {
    localStorage.removeItem(CACHE_KEY_TIME);
    localStorage.removeItem(CACHE_KEY_DATA);
    location.reload();
  }

  return (
    <div className="min-h-screen text-white px-6 py-8 space-y-8" style={{ backgroundColor: mainBg }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-yellow-300">🏆 {seasonTitle}</h1>
        <button
          onClick={resetCache}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Reset Cache
        </button>
      </div>

      {ready && guilds.length > 0 && (
        <div className="w-[80%] mx-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-pink-300 text-sm border-b border-gray-700">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Guild</th>
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4 text-right">Gold</th>
                <th className="py-2 pr-4 text-right">Power</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const displayGuilds = [...guilds];
                if (playerGuild && !guilds.some(g => g.id === playerGuild.id)) {
                  displayGuilds.push(playerGuild);
                }
                return displayGuilds.map((guild, index) => {
                  const baseIndex = guilds.findIndex(g => g.id === guild.id);
                  const position = baseIndex !== -1 ? baseIndex + 1 : guild.rank;
                  const highlight = playerGuild && guild.id === playerGuild.id;
                  return (
                    <motion.tr
                      key={guild.id}
                      className={`${highlight ? 'bg-yellow-900/40' : 'hover:bg-zinc-800/60'} transition`}
                      transition={{ delay: index * 0.03 }}
                    >
                      <td className="py-2 pr-4 text-yellow-200 font-mono">{position}</td>
                      <td className="py-2 pr-4 font-semibold text-white">{guild.name}</td>
                      <td className="py-2 pr-4 text-pink-300">{guild.rank}</td>
                      <td className="py-2 pr-4 text-yellow-300 text-right font-mono">{guild.gold}</td>
                      <td className="py-2 pr-4 text-green-300 text-right font-mono">{guild.power}</td>
                    </motion.tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
