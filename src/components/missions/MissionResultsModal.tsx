import type { Mission } from '../../types/Missions';

interface Props {
  mission: Mission;
  finalGoldReward?: number;
  finalGuildXp?: number;
  effectTags?: string[];
  onComplete: () => void;
  onClose: () => void;
}

export default function MissionResultsModal({ mission, finalGoldReward, finalGuildXp, effectTags = [], onComplete, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#2b1f1a] border border-yellow-900 p-6 w-96 text-yellow-100 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold font-mono">{mission.name}</h2>
        <div className="text-sm text-yellow-300">
          {mission.area} • {mission.type}
        </div>
        {effectTags.length > 0 && (
          <div className="text-sm text-amber-200 font-mono">
            Effects locked: {effectTags.join(' ')}
          </div>
        )}
        <div className="mt-2 space-y-1 text-sm">
          <div>Gold: {finalGoldReward ?? mission.goldReward}</div>
          <div>Guild XP: {finalGuildXp ?? mission.guildXp}</div>
          <div>Character XP: {mission.characterXp}</div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onComplete}
            className="px-3 py-1 bg-green-700 hover:bg-green-800 rounded text-white text-sm font-mono"
          >
            Complete
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-sm font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
