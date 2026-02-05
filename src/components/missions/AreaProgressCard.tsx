import { areas } from '../../data/areas';
import { useGuild } from '../../providers/GuildProvider';
import { pickWeightedItem } from '../../utils/missionUtils';
import type { MaterialType } from '../../types/Guild';

const milestones = [5, 15, 30, 60, 100];

export default function AreaProgressCard() {
  const { guildStats, addGold, updateGuildStash, addInventoryItem, guildStash, updateGuildStats } = useGuild();
  const counts = guildStats.missionsCompletedByArea || {};
  const claimed = guildStats.areaMilestones || {};

  const claim = (area: string, m: number) => {
    const areaClaimed = claimed[area] || [];
    if (areaClaimed.includes(m)) return;
    if ((counts[area] || 0) < m) return;

    switch (m) {
      case 5:
        addGold(100);
        break;
      case 15: {
        const mats: MaterialType[] = ['Wood', 'Stone', 'Iron', 'Herbs', 'Cloth'];
        const materials = { ...guildStash.materials };
        mats.forEach(mat => {
          materials[mat] = guildStash.materials[mat] + 5;
        });
        updateGuildStash({ materials });
        break;
      }
      case 30: {
        const loot = pickWeightedItem();
        addInventoryItem(loot.item, 1);
        break;
      }
      case 60:
        addGold(300);
        break;
      case 100:
        addInventoryItem('Tome', 1);
        break;
    }

    updateGuildStats({
      areaMilestones: {
        ...claimed,
        [area]: [...areaClaimed, m],
      },
    });
  };

  return (
    <div className="space-y-4">
      {areas.map(area => {
        const count = counts[area] || 0;
        return (
          <div key={area} className="text-yellow-100">
            <div className="text-sm mb-1">{area} ({count}/100)</div>
            <div className="relative h-3 bg-gray-700 rounded">
              <div
                className="absolute h-3 bg-yellow-500 rounded"
                style={{ width: `${Math.min(count, 100)}%` }}
              />
              {milestones.map(m => {
                const isClaimed = (claimed[area] || []).includes(m);
                const reached = count >= m;
                return (
                  <div
                    key={m}
                    onClick={() => reached && !isClaimed && claim(area, m)}
                    className={`absolute top-0 w-2 h-2 rounded-full -mt-1 ${
                      isClaimed
                        ? 'bg-green-500'
                        : reached
                        ? 'bg-yellow-200 cursor-pointer'
                        : 'bg-gray-500'
                    }`}
                    style={{ left: `calc(${m}% - 4px)` }}
                    title={`${m} missions`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
