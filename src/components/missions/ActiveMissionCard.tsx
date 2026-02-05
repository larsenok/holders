import { useEffect, useState } from 'react';
import type { Mission, MissionRun } from '../../types/Missions';
import { sizeStyles, getCardStyles } from './styles';
import { formatRemaining } from '../../utils/calculation';
import MissionResultsModal from './MissionResultsModal';

const ACTIVE_COLOR = '#ffa774';
const HOVER_ACTIVE_COLOR = '#d97706';

type Props = {
  mission: Mission;
  active: MissionRun;
  getElapsed: (start: number) => number;
  onClear: (id: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  effectTags?: string[];
  finalGoldReward?: number;
  finalGuildXp?: number;
};

export default function ActiveMissionCard({ mission, active, getElapsed, onClear, size = 'md', effectTags = [], finalGoldReward, finalGuildXp }: Props) {
  const [, setNow] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = getElapsed(active.startedAt);
  const remaining = Math.max(mission.duration - elapsed, 0);
  const isDone = remaining <= 0;

  return (
    <div
      style={getCardStyles(size, isDone, ACTIVE_COLOR)}
      className={`active-mission-card relative ${mission.unique && isDone ? 'animate-glow' : ''}`}
      onMouseOver={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.background = HOVER_ACTIVE_COLOR;
          e.currentTarget.style.boxShadow =
            '0 4px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 8px 2px rgba(234, 179, 8, 0.5)';
        }
      }}
      onMouseOut={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)';
          e.currentTarget.style.boxShadow =
            '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 8px 2px rgba(234, 179, 8, 0.5)';
        }
      }}
      onMouseDown={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.boxShadow =
            '0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 3px 4px rgba(0, 0, 0, 0.6), 0 0 8px 2px rgba(234, 179, 8, 0.5)';
          e.currentTarget.style.background = HOVER_ACTIVE_COLOR;
        }
      }}
      onMouseUp={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow =
            '0 6px 0 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 0 8px 2px rgba(234, 179, 8, 0.5)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #b45309, #78350f)';
        }
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
      <style>{`
        @keyframes glowCard {
          0% {
            box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 14px 6px rgba(255, 215, 0, 0.7);
          }
          100% {
            box-shadow: 0 0 8px 2px rgba(255, 215, 0, 0.3);
          }
        }

        .animate-glow {
          animation: glowCard 2s infinite;
        }
      `}</style>

      {mission.unique && (
        <div className="absolute top-1 right-1 z-10">
          <div className={`text-yellow-300 text-xl drop-shadow-md ${isDone ? 'animate-pulse' : ''}`}>
            ⭐
          </div>
        </div>
      )}

      <div style={{ fontSize: sizeStyles[size].textSize, color: isDone ? '#fef9c3' : '#78350f', fontWeight: 700 }}>
        {mission.name}
      </div>
      <div style={{ fontSize: sizeStyles[size].subTextSize, color: isDone ? '#d1d5db' : '#4b5563', fontWeight: 400 }}>
        {mission.area} • {mission.type}
      </div>

      {effectTags.length > 0 && (
        <div className="text-amber-200 text-xs font-mono">
          Effects locked: {effectTags.join(' ')}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: sizeStyles[size].subTextSize,
          color: isDone ? '#d1d5db' : '#4b5563',
        }}
      >
        <span>
          {isDone ? '✅ Complete' : `⏳ ${formatRemaining(remaining)} left`}
        </span>
      </div>
      {isDone && (
        <div className="mt-2 flex gap-2">
          <button
            className="px-2 py-1 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-xs font-mono"
            onClick={() => setShowResults(true)}
          >
            See Results
          </button>
          <button
            className="px-2 py-1 bg-green-700 hover:bg-green-800 rounded text-white text-xs font-mono"
            onClick={() => onClear(mission.id)}
          >
            Complete
          </button>
        </div>
      )}

      <div
        id={`mission-loot-${mission.id}`}
        className="mission-loot-feedback opacity-0 pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ fontFamily: 'monospace' }}
      >
        <div
          style={{
            backgroundColor: '#fef3c7',
            color: '#78350f',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: sizeStyles[size].subTextSize,
            fontWeight: 700,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.4)',
          }}
        >
          + {finalGoldReward ?? mission.goldReward} gold
        </div>
      </div>

      {showResults && (
        <MissionResultsModal
          mission={mission}
          finalGoldReward={finalGoldReward}
          finalGuildXp={finalGuildXp}
          effectTags={effectTags}
          onComplete={() => {
            setShowResults(false);
            onClear(mission.id);
          }}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
