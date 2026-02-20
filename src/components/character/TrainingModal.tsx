import { useGuild } from '../../providers/GuildProvider'
import { trainingSpots } from '../../data/training'
import { Adventurer } from '../../types/Guild'
import { modalHeaderCloseClass, modalOverlayClass, modalPanelClass } from '../ui/modalStyles'

type Props = {
  adventurer: Adventurer
  onClose: () => void
}

export default function TrainingModal({ adventurer, onClose }: Props) {
  const { updateAdventurer } = useGuild()

  const handleChooseSpot = (id: string) => {
    const now = Date.now()
    const duration = 60 + (adventurer.level - 1) * 10
    const endsAt = now + duration * 1000

    const spot = trainingSpots.find((s) => s.id === id)

    updateAdventurer(adventurer.id, {
      status: 'training',
      trainingType: id,
      trainingEndsAt: endsAt,
      readyToAssignStat: false,
      history: [
        ...adventurer.history,
        `Started training at ${spot?.name ?? id}`,
      ],
    })

    onClose()
  }

  return (
    <div className={modalOverlayClass} onClick={onClose}>
      <div className={`${modalPanelClass} max-w-md p-6 border-pink-500`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={modalHeaderCloseClass} aria-label="Close training modal">×</button>
        <h2 className="text-xl font-bold text-pink-300 mb-4">
          Begin Training: {adventurer.name}
        </h2>
        <p className="text-sm text-gray-300 mb-2">Choose a training ground:</p>

        <div className="flex flex-col gap-2">
          {trainingSpots.map((s) => (
            <button
              key={s.id}
              onClick={() => handleChooseSpot(s.id)}
              className="px-4 py-2 bg-gray-800 hover:bg-pink-800 rounded text-left"
            >
              <span className="font-bold text-yellow-200">{s.name}</span>
              <div className="text-xs text-gray-400">{s.description}</div>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 text-xs text-gray-400 hover:text-white">
          Cancel
        </button>
      </div>
    </div>
  )
}
