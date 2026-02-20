import { taskOptions } from '../../data/tasks'
import { Adventurer } from '../../types/Guild'
import { useGuild } from '../../providers/GuildProvider'
import { modalHeaderCloseClass, modalOverlayClass, modalPanelClass } from '../ui/modalStyles'

type Props = {
  adventurer: Adventurer
  onClose: () => void
}

export default function TaskModal({ adventurer, onClose }: Props) {
  const { updateAdventurer } = useGuild()

  const chooseTask = (id: string) => {
    const task = taskOptions.find((t) => t.id === id)
    updateAdventurer(adventurer.id, {
      status: 'onTask',
      taskType: id,
      history: [
        ...adventurer.history,
        `Started task ${task?.name ?? id}`,
      ],
    })
    onClose()
  }

  return (
    <div className={modalOverlayClass} onClick={onClose}>
      <div className={`${modalPanelClass} max-w-md p-6 space-y-3`} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={modalHeaderCloseClass} aria-label="Close task modal">×</button>
        <h2 className="text-lg font-bold text-blue-300 mb-2">Assign Task: {adventurer.name}</h2>
        {taskOptions.map(t => (
          <button
            key={t.id}
            onClick={() => chooseTask(t.id)}
            className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-blue-800 text-sm mb-2"
          >
            <span className="font-semibold text-blue-200">{t.name}</span>
            <div className="text-xs text-gray-400">{t.description}</div>
          </button>
        ))}
        <button onClick={onClose} className="mt-2 text-xs text-gray-400 hover:text-white">Cancel</button>
      </div>
    </div>
  )
}
