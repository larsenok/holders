import type { Mission } from '../../types/Missions';
import { modalHeaderCloseClass, modalOverlayClass, modalPanelClass } from '../ui/modalStyles';

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
      className={modalOverlayClass}
      onClick={onClose}
    >
      <div
        className={`${modalPanelClass} max-w-96 border-yellow-900 bg-[#2b1f1a] p-6 text-yellow-100 space-y-3`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={modalHeaderCloseClass} aria-label="Close mission results">×</button>
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
