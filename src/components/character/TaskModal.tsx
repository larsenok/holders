import { taskOptions } from '../../data/tasks'
import { Adventurer } from '../../types/Guild'
import { useGuild } from '../../providers/GuildProvider'

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-blue-700 rounded-lg p-6 w-full max-w-md space-y-3" onClick={e => e.stopPropagation()}>
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
