import { useEffect, useState } from 'react'
import { Adventurer } from '../../types/Guild'
import { generateRandomAdventurer } from '../../data/adventurer'
import { useGuild } from '../../providers/GuildProvider'
import { modalHeaderCloseClass, modalOverlayClass, modalPanelClass } from '../ui/modalStyles'

export default function RecruitModal({ onClose }: { onClose: () => void }) {
  const { addAdventurer } = useGuild()
  const [candidates, setCandidates] = useState<Adventurer[]>([])

  useEffect(() => {
    setCandidates([generateRandomAdventurer(), generateRandomAdventurer(), generateRandomAdventurer()])
  }, [])

  const choose = (adv: Adventurer) => {
    addAdventurer(adv)
    onClose()
  }

  return (
    <div className={modalOverlayClass} onClick={onClose}>
      <div className={`${modalPanelClass} max-w-md p-6 space-y-4`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={modalHeaderCloseClass} aria-label="Close recruit modal">×</button>
        <h2 className="text-lg font-bold text-yellow-300">Recruit New Adventurer</h2>
        <div className="flex flex-col gap-3">
          {candidates.map(c => (
            <button
              key={c.id}
              onClick={() => choose(c)}
              className="text-left bg-gray-800 hover:bg-yellow-800 px-3 py-2 rounded"
            >
              <div className="font-semibold text-yellow-200">{c.name}</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-300 mt-1">
                {Object.entries(c.stats).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-1">Power: {c.power}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-2 text-xs text-gray-400 hover:text-white">Cancel</button>
      </div>
    </div>
  )
}
