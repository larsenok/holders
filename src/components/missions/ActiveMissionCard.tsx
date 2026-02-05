import { useEffect, useState } from 'react';
import type { Mission, MissionRun } from '../../types/Missions';
import { sizeStyles, getCardStyles } from './styles';
import { formatRemaining } from '../../utils/calculation';
import MissionResultsModal from './MissionResultsModal';

const ACTIVE_COLOR = '#1f2937';
const HOVER_ACTIVE_COLOR = '#374151';

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
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsed = getElapsed(active.startedAt);
  const remaining = Math.max(mission.duration - elapsed, 0);
  const isDone = remaining <= 0;
  const progress = Math.min((elapsed / mission.duration) * 100, 100);

  return (
    <div
      style={getCardStyles(size, isDone, ACTIVE_COLOR)}
      className={`active-mission-card relative ${isDone ? 'mission-settle' : 'mission-active'}`}
      onMouseOver={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.background = HOVER_ACTIVE_COLOR;
          e.currentTarget.style.boxShadow =
            '0 3px 0 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.08)';
        }
      }}
      onMouseOut={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1f2937, #111827)';
          e.currentTarget.style.boxShadow =
            '0 4px 0 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.08)';
        }
      }}
      onMouseDown={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.transform = 'translateY(2px)';
          e.currentTarget.style.boxShadow =
            '0 2px 0 0 rgba(0, 0, 0, 0.35), inset 0 3px 4px rgba(0, 0, 0, 0.5)';
          e.currentTarget.style.background = HOVER_ACTIVE_COLOR;
        }
      }}
      onMouseUp={(e) => {
        if (isDone && e.target === e.currentTarget) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow =
            '0 4px 0 0 rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #1f2937, #111827)';
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
        @keyframes settleCard {
          0% {
            box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
          }
          100% {
            box-shadow: none;
          }
        }

        @keyframes activePulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .mission-settle {
          animation: settleCard 0.8s ease-out 1;
        }

        .mission-active .mission-progress-glow {
          animation: activePulse 1.6s ease-in-out infinite;
        }
      `}</style>

      {mission.unique && (
        <div className="absolute top-1 right-1 z-10">
          <div className="text-amber-200 text-xl drop-shadow-sm">
            ⭐
          </div>
        </div>
      )}

      <div style={{ fontSize: sizeStyles[size].textSize, color: '#e2e8f0', fontWeight: 600 }}>
        {mission.name}
      </div>
      <div style={{ fontSize: sizeStyles[size].subTextSize, color: '#94a3b8', fontWeight: 400 }}>
        {mission.area} • {mission.type}
      </div>

      {effectTags.length > 0 && (
        <div className="text-amber-200/80 text-xs font-mono">
          Effects locked: {effectTags.join(' ')}
        </div>
      )}

      <div className="mt-3">
        <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/70">
          <div
            className="h-full rounded-full bg-emerald-400/60 transition-[width] duration-500 mission-progress-glow"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: sizeStyles[size].subTextSize,
          color: '#94a3b8',
        }}
      >
        <span>
          {isDone ? '✅ Complete' : `⏳ ${formatRemaining(remaining)} left`}
        </span>
      </div>
      {isDone && (
        <div className="mt-2 flex gap-2">
          <button
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-white text-xs font-mono"
            onClick={() => setShowResults(true)}
          >
            See Results
          </button>
          <button
            className={`px-2 py-1 rounded text-xs font-mono ${
              completing ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
            disabled={completing}
            onClick={() => {
              setCompleting(true);
              onClear(mission.id);
            }}
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
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: sizeStyles[size].subTextSize,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.4)',
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
            setCompleting(true);
            onClear(mission.id);
          }}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
