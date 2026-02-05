import { motion } from 'framer-motion';
import { useAchievements } from '../providers/AchievementsProvider';
import { useUnlocks } from '../hooks/useUnlocks';
import { clearUserAchievements, getCurrentUserId, uploadAchievementsFromLocal } from '../api/achievements';
import { inventoryIcons } from '../data/inventory';
import { useGuild } from '../providers/GuildProvider';

export default function AchiPage() {
  const { achievements } = useAchievements();
  const { getEquipped } = useUnlocks();
  const { guildStats } = useGuild();
  const mainBg = getEquipped();

  const handleResetAchievements = async () => {
    console.log('[AchiPage] Clearing localStorage for feelos_achievements');
    localStorage.removeItem('feelos_achievements');
    localStorage.removeItem('unlocked_chatterStart');

    const userId = await getCurrentUserId();
    console.log(userId);
    if (userId) {
      await clearUserAchievements(userId);
      console.log('[AchiPage] Deleted all user_achievements for', userId);
    } else {
      console.warn('[AchiPage] No userId found. Skipped Supabase reset.');
    }

    window.location.reload(); // Reload to reset achievements to default
  };

  return (
    <div className="min-h-screen text-white px-6 py-8 space-y-8" style={{ backgroundColor: mainBg }}>
      <h1 className="text-4xl font-bold tracking-tight text-yellow-300">🏆 Achievements</h1>

    <button
      className="px-4 py-2 bg-green-600 text-white rounded"
      onClick={uploadAchievementsFromLocal}
    >
      Upload Achievements
    </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(ach => {
          const areaCounts = guildStats.missionsCompletedByArea || {};
          const counters: Record<string, number> = {
            mission10: guildStats.missionsCompleted || 0,
            mission50: guildStats.missionsCompleted || 0,
            training5: guildStats.trainingsCompleted || 0,
            training20: guildStats.trainingsCompleted || 0,
            forest30: areaCounts.Forest || 0,
            forest100: areaCounts.Forest || 0,
            mountains30: areaCounts.Mountains || 0,
            mountains100: areaCounts.Mountains || 0,
            swamp30: areaCounts.Swamp || 0,
            swamp100: areaCounts.Swamp || 0,
            desert30: areaCounts.Desert || 0,
            desert100: areaCounts.Desert || 0,
            tundra30: areaCounts.Tundra || 0,
            tundra100: areaCounts.Tundra || 0,
            ruins30: areaCounts.Ruins || 0,
            ruins100: areaCounts.Ruins || 0,
          };
          const progress = counters[ach.id] || 0;
          const pct = ach.counterThreshold ? Math.min(100, (progress / ach.counterThreshold) * 100) : 0;
          return (
          <motion.div
            key={ach.id}
            className={`p-4 rounded-lg transition-colors duration-150 border shadow-md ${
              ach.unlocked
                ? 'border-green-300 bg-green-800/40'
                : 'border-gray-600 bg-gray-700/40'
            }`}
            whileHover={{ scale: 1.015 }}
          >
            <h2 className="text-xl font-semibold text-white">{ach.title}</h2>
            {ach.unlocked && (
              <p className="text-sm text-gray-300 mb-2">{ach.description}</p>
            )}

            {(ach.rewardTokens || ach.rewardGold || ach.rewardItem) && (
              <div className="mt-2 flex items-center gap-3">
                {ach.rewardTokens && (
                  <span
                    className="text-pink-300 text-sm"
                    title={`Reward: ${ach.rewardTokens} Iron Tokens`}
                  >
                    🛡️ {ach.rewardTokens}
                  </span>
                )}
                {ach.rewardGold && (
                  <span
                    className="text-yellow-400 text-sm"
                    title={`Reward: ${ach.rewardGold} Gold`}
                  >
                    💰 {ach.rewardGold}
                  </span>
                )}
                {ach.rewardItem && (
                  <div
                    className="flex items-center gap-1"
                    title={`Reward: ${ach.rewardItemQty ?? 1} ${ach.rewardItem}`}
                  >
                    <img
                      src={inventoryIcons[ach.rewardItem]}
                      alt={ach.rewardItem}
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-yellow-300">
                      x{ach.rewardItemQty ?? 1}
                    </span>
                  </div>
                )}
              </div>
            )}

            {!ach.unlocked && ach.counterThreshold && (
              <div className="mt-2">
                <div className="w-full bg-gray-800 h-2 rounded">
                  <div
                    className="bg-yellow-500 h-2 rounded"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {progress}/{ach.counterThreshold}
                </div>
              </div>
            )}

            {ach.unlocked && (
              <div className="mt-2 text-green-300 font-mono text-sm">✅ Unlocked</div>
            )}
          </motion.div>
          )
        })}
      </div>
      <button
        className="px-4 py-1 text-sm bg-pink-500 hover:bg-pink-600 rounded text-white font-mono"
        onClick={handleResetAchievements}
      >
        Reset Achievements
      </button>
    </div>
  );
}