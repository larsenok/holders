// components/MissionsPanel.tsx
import { useEffect, useState, useMemo } from 'react';
import type { MissionRun, Mission } from '../../types/Missions';
import MissionModal from './MissionModal';
import ActiveMissionCard from './ActiveMissionCard';
import { areaImages, areas, defaultTypes } from '../../data/areas';
import { resolveMissionMeta, getElapsed, pickWeightedItem } from '../../utils/missionUtils';
import { computeMissionBonuses, applyMissionBonuses } from '../../utils/bonusUtils';
import { events } from '../../data/events';
import { useUnlocks } from '../../hooks/useUnlocks';
import { usePreloadImages } from '../../hooks/usePreloadImages';
import { useGuild } from '../../providers/GuildProvider';
import type { MaterialType } from '../../types/Guild';
import { panelStyles, sizeStyles } from './styles';
import { useAchievements } from '../../providers/AchievementsProvider';
import { computeTomeSnapshot, getTomeEffectTags } from '../../utils/tomeUtils';

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export default function MissionsPanel({ size = 'md' }: Props) {
  const { increaseXp, addGold, addInventoryItem, addCharacterXp, guildStats, incrementMissionCount, equippedTomeIds, adventurers, guildStash, updateGuildStash, updateGuildStats, recordMilestone, maybeSpawnVisitor } = useGuild();
  const { unlock } = useAchievements();
  const { setUnlocked } = useUnlocks();
  const [open, setOpen] = useState(false);

  const [running, setRunning] = useState<Record<string, MissionRun>>(() => {
    try {
      return JSON.parse(localStorage.getItem('runningMissions') || '{}');
    } catch {
      return {};
    }
  });

  const [completedUniques, setCompletedUniques] = useState<Record<string, true>>(() => {
    try {
      return JSON.parse(localStorage.getItem('completedUniques') || '{}');
    } catch {
      return {};
    }
  });

  const [completedDefaults, setCompletedDefaults] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('completedDefaults') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('runningMissions', JSON.stringify(running));
  }, [running]);

  useEffect(() => {
    localStorage.setItem('completedUniques', JSON.stringify(completedUniques));
  }, [completedUniques]);

  useEffect(() => {
    localStorage.setItem('completedDefaults', JSON.stringify(completedDefaults));
  }, [completedDefaults]);

  usePreloadImages(Object.values(areaImages));

  const now = Date.now();
  const activeEvent = events.find(
    (e) => now >= Date.parse(e.start) && now <= Date.parse(e.end)
  );
  const eventMissions = activeEvent?.missions ?? [];
  const bonuses = useMemo(() => computeMissionBonuses(adventurers), [adventurers]);

  const startMission = (id: string) => {
    const snapshot = computeTomeSnapshot(equippedTomeIds)
    setRunning(prev => ({
      ...prev,
      [id]: { id, startedAt: Date.now(), tomeSnapshot: snapshot },
    }));
  };

  const clearMission = (id: string) => {
    const mission = activeMissions.find((m) => m.id === id);
    if (mission) {
      const run = running[id];
      const snap = run?.tomeSnapshot;
      const goldMult = guildStats.missionGoldMult && Date.now() < (guildStats.missionGoldMultExpires || 0) ? guildStats.missionGoldMult : 1;
      const passiveGold = guildStats.passiveGoldBonus || 0;
      const gold = Math.floor(mission.goldReward * (snap?.goldMult ?? 1) * goldMult) + passiveGold;
      const xp = Math.floor(mission.guildXp * (snap?.xpMult ?? 1));
      const charXp = Math.floor(mission.characterXp * (snap?.xpMult ?? 1));
      if ((guildStats.missionsCompleted || 0) === 0) recordMilestone('first_mission', mission.area);
      increaseXp(xp);
      addGold(gold);
      addCharacterXp(charXp);
      incrementMissionCount(mission.area);

      const completed = (guildStats.missionsCompleted || 0) + 1;
      if (completed >= 10) unlock('mission10');
      if (completed >= 50) unlock('mission50');

      const isUnique = mission.unique === true || mission.id.startsWith('uniq:');
      if (isUnique) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('guild:uniqueMission'));
        }
        const firstTime = !completedUniques[mission.id];
        setCompletedUniques(prev => ({ ...prev, [mission.id]: true }));
        if (firstTime) {
          unlock('firstUniqueMission');
          if (activeEvent && eventMissions.some((m) => m.id === mission.id)) {
            unlock(activeEvent.reward.badge);
            if (activeEvent.reward.cosmetic) {
              setUnlocked(activeEvent.reward.cosmetic, 0, true);
            }
          }
          const unlockMap: Record<string, () => void> = {
            'caravan-escort': () => updateGuildStats({ unlockedVisitors: Array.from(new Set([...(guildStats.unlockedVisitors || []), 'Trader'])) }),
            'ruined-temple': () => updateGuildStats({ hallUpgrades: { ...(guildStats.hallUpgrades || {}), meditationCircle: 1 } }),
            'thieves-guild-deal': () => updateGuildStats({ hallUpgrades: { ...(guildStats.hallUpgrades || {}), missionBoardMedals: 1 } }),
          };
          const fn = unlockMap[mission.id];
          if (fn) fn();
        }
      }

      // Strength: materials bonus
      const mats: MaterialType[] = ['Wood', 'Stone', 'Iron', 'Herbs', 'Cloth'];
      const mat = mats[Math.floor(Math.random() * mats.length)];
      const matQty = Math.max(1, Math.floor(1 * (1 + bonuses.materials)));
      updateGuildStash({
        materials: {
          ...guildStash.materials,
          [mat]: guildStash.materials[mat] + matQty,
        },
      });
      let itemsGained = 0;
      if (!isUnique) {
        setCompletedDefaults(prev => ({
          ...prev,
          [mission.id]: (prev[mission.id] || 0) + 1,
        }));

        // Determine loot
        const loot = pickWeightedItem();
        const qty = Math.floor(Math.random() * (loot.maxQty - loot.minQty + 1)) + loot.minQty;
        addInventoryItem(loot.item, qty);
        itemsGained += qty;

        // Magic: chance for extra loot
        if (Math.random() < bonuses.extraLootChance) {
          const extra = pickWeightedItem();
          const extraQty = Math.floor(Math.random() * (extra.maxQty - extra.minQty + 1)) + extra.minQty;
          addInventoryItem(extra.item, extraQty);
          itemsGained += extraQty;
        }
      }

      const areaHist = guildStats.areaHistory || {};
      const prevArea = areaHist[mission.area] || {
        missions: 0,
        fastest: 0,
        totalGold: 0,
        totalMaterials: 0,
        totalXp: 0,
        totalItems: 0,
      };
      const newAreaHist = {
        ...areaHist,
        [mission.area]: {
          missions: prevArea.missions + 1,
          fastest: prevArea.fastest ? Math.min(prevArea.fastest, mission.duration) : mission.duration,
          totalGold: prevArea.totalGold + gold,
          totalMaterials: prevArea.totalMaterials + matQty,
          totalXp: prevArea.totalXp + xp,
          totalItems: prevArea.totalItems + itemsGained,
        },
      };

      const currentBest = guildStats.bestMission || {
        gold: { amount: 0, date: 0, area: '' },
        materials: { amount: 0, date: 0, area: '' },
        xp: { amount: 0, date: 0, area: '' },
        items: { amount: 0, date: 0, area: '' },
      };
      const best = { ...currentBest };
      if (gold > currentBest.gold.amount) best.gold = { amount: gold, date: Date.now(), area: mission.area };
      if (matQty > currentBest.materials.amount) best.materials = { amount: matQty, date: Date.now(), area: mission.area };
      if (xp > currentBest.xp.amount) best.xp = { amount: xp, date: Date.now(), area: mission.area };
      if (itemsGained > currentBest.items.amount) best.items = { amount: itemsGained, date: Date.now(), area: mission.area };

      updateGuildStats({
        lifetimeMaterials: (guildStats.lifetimeMaterials || 0) + matQty,
        totalMissionTime: (guildStats.totalMissionTime || 0) + mission.duration,
        areaHistory: newAreaHist,
        bestMission: best,
      });

      maybeSpawnVisitor();
    }

    const lootEl = document.getElementById(`mission-loot-${id}`);
    const repeat = mission && !(mission.unique === true || mission.id.startsWith('uniq:'));
    const startAgain = () => {
      if (repeat) startMission(id);
    };

    if (lootEl) {
      lootEl.classList.add('animate-loot-burst');
      setTimeout(() => {
        setRunning(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        startAgain();
      }, 600);
    } else {
      setRunning(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      startAgain();
    }
  };

  const activeMissions = Object.values(running)
    .map((run) => {
      const meta =
        resolveMissionMeta(areas, defaultTypes, run.id) ||
        eventMissions.find((m) => m.id === run.id);
      return meta
        ? {
            ...applyMissionBonuses(meta, bonuses),
            startedAt: run.startedAt,
            tomeSnapshot: run.tomeSnapshot || computeTomeSnapshot([]),
          }
        : null;
    })
    .filter(Boolean) as (Mission & { startedAt: number; tomeSnapshot: ReturnType<typeof computeTomeSnapshot> })[];

  useEffect(() => {
    activeMissions.forEach(m => {
      const simulatedNow = m.startedAt;
      if (simulatedNow >= m.startedAt + m.duration * 1000) {
        clearMission(m.id);
      }
    });
  }, [activeMissions]);

  return (
    <>
      <div
        style={panelStyles("md")}
        className="missions-panel"
        onClick={() => setOpen(true)}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #92400e)';
          e.currentTarget.style.boxShadow = '0 4px 0 0 rgba(0, 0, 0, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)';
          e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.boxShadow = '0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 3px 4px rgba(0, 0, 0, 0.6)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #854d0e, #713f12)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)';
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.border = '4px solid #451a03';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
          e.currentTarget.style.border = '4px solid #451a03';
        }}
      >
        <div style={{ fontSize: sizeStyles[size].subTextSize, color: '#fef3c7', marginBottom: '4px' }}>
          missions
        </div>
        <div
          style={{
            fontSize: sizeStyles[size].textSize,
            maxHeight: size === 'sm' ? '48px' : '64px',
            overflowY: 'auto',
          }}
        >
          {activeMissions.length > 0 ? activeMissions.map((m) => m.name).join(', ') : 'All idle'}
        </div>
        <div
          style={{
            marginTop: "2rem",
            bottom: size === 'sm' ? '4px' : '8px',
            left: sizeStyles[size].padding.split(' ')[1],
            fontSize: sizeStyles[size].subTextSize,
            color: '#fef3c7',
          }}
        >
          tap to manage assignments
        </div>
      </div>

      {activeMissions.length > 0 && (
        <div className="mt-4 space-y-3">
          {activeMissions.map((m) => {
            const goldMult = guildStats.missionGoldMult && Date.now() < (guildStats.missionGoldMultExpires || 0) ? guildStats.missionGoldMult : 1;
            const finalGold = Math.floor(m.goldReward * (m.tomeSnapshot?.goldMult ?? 1) * goldMult) + (guildStats.passiveGoldBonus || 0);
            const finalXp = Math.floor(m.guildXp * (m.tomeSnapshot?.xpMult ?? 1));
            return (
              <ActiveMissionCard
                key={m.id}
                mission={m}
                active={{ id: m.id, startedAt: m.startedAt, tomeSnapshot: m.tomeSnapshot }}
                getElapsed={getElapsed}
                onClear={clearMission}
                effectTags={getTomeEffectTags(m.tomeSnapshot.ids)}
                finalGoldReward={finalGold}
                finalGuildXp={finalXp}
              />
            );
          })}
        </div>
      )}

      {open && (
        <MissionModal
          running={running}
          startMission={startMission}
          onClose={() => setOpen(false)}
          completedUniques={completedUniques}
          completedDefaults={completedDefaults}
          eventMissions={eventMissions}
        />
      )}
    </>
  );
}

