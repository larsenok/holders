import { Adventurer } from '../../types/Guild'
import GearGrid from './GearGrid'
import { getPowerColor } from '../../utils/calculation'
import IdleAnimation from '../anim/IdleAnimation'
import { STAT_LABELS } from '../../data/adventurer'

type Props = {
  adventurer: Adventurer
  onClose: () => void
}

export default function CharacterModal({ adventurer, onClose }: Props) {
  const color = getPowerColor(adventurer.power)

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 border border-pink-600 rounded-xl p-6 w-[32rem] max-h-[85vh] overflow-auto shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-pink-300 hover:text-white text-xl font-bold"
          aria-label="Close character inventory"
        >
          ×
        </button>

        <div className="flex justify-between items-start pr-8">
          <h2 className="text-2xl font-bold text-yellow-300">
            {adventurer.name}
            <span className="text-sm text-gray-400 ml-2 align-middle">Lv {adventurer.level}</span>
          </h2>
          <span className={`text-2xl font-bold ${color}`} title="Power Level">{adventurer.power}</span>
        </div>

        <div className="flex justify-center">
          <IdleAnimation
            animKey={adventurer.animKey || 'idle_0'}
            style={{ transform: 'scale(2)', transformOrigin: 'center' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs text-pink-400 uppercase mb-2">Stats</div>
            <ul className="space-y-2">
              {Object.entries(adventurer.stats).map(([key, value]) => (
                <li key={key} className="bg-gray-800 rounded p-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-300">{key}</span>
                    <span className="text-yellow-300 font-mono">{value}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{STAT_LABELS[key as keyof typeof STAT_LABELS]}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs text-pink-400 uppercase mb-2">Gear</div>
            <GearGrid adventurer={adventurer} />
          </div>
        </div>

        <div>
          <div className="text-xs text-pink-400 uppercase mb-2">Activity Log</div>
          <ul className="max-h-32 overflow-y-auto space-y-1 text-xs text-gray-300">
            {adventurer.history.length ? (
              [...adventurer.history].reverse().map((entry, idx) => (
                <li key={idx}>• {entry}</li>
              ))
            ) : (
              <li className="text-gray-500">No activities yet.</li>
            )}
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 transition rounded text-white text-sm font-semibold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
