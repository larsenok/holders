import { useState } from 'react'
import { useGuild } from '../../providers/GuildProvider'
import { useActivityCycle } from '../../hooks/useActivityCycle'
import type { MaterialType } from '../../types/Guild'
import { ItemSplash } from '../ui/effects/ItemSplash'

const materials: MaterialType[] = ['Wood', 'Stone', 'Iron', 'Cloth']

export type TaskType = 'guard' | 'research' | 'scout' | 'forage' | 'mentor'

const labelMap: Record<TaskType, string> = {
  guard: 'Camp Guard',
  research: 'Research',
  scout: 'Scouting',
  forage: 'Foraging',
  mentor: 'Mentor',
}

const workingMap: Record<TaskType, string> = {
  guard: 'Guarding',
  research: 'Studying',
  scout: 'Scouting',
  forage: 'Foraging',
  mentor: 'Mentoring',
}

const iconMap: Record<TaskType, string> = {
  guard: '🛡️',
  research: '📚',
  scout: '🔭',
  forage: '🌿',
  mentor: '🎓',
}

type Props = {
  taskType: TaskType
}

export default function TaskActivity({ taskType }: Props) {
  const {
    addGold,
    increaseXp,
    increasePower,
    guildStash,
    updateGuildStash,
  } = useGuild()

  const [triggerSplash, setTriggerSplash] = useState(false)

  const reward = () => {
    switch (taskType) {
      case 'guard':
        addGold(10)
        break
      case 'research':
        increaseXp(8)
        break
      case 'scout':
        increaseXp(5)
        break
      case 'mentor':
        increasePower()
        break
      case 'forage': {
        const mat = materials[Math.floor(Math.random() * materials.length)]
        updateGuildStash({
          materials: {
            ...guildStash.materials,
            [mat]: guildStash.materials[mat] + 2,
          },
        })
        break
      }
    }
  }

  const handleWorkComplete = () => {
    if (taskType === 'forage') {
      setTriggerSplash(true)
      setTimeout(() => setTriggerSplash(false), 1200)
    }
  }

  const { phase, secondsLeft, worker } = useActivityCycle(
    `${taskType}Status`,
    reward,
     taskType === "forage" ? 3 : 30,
    10,
    taskType === 'forage' ? handleWorkComplete : undefined,
  )

  if (!worker) return null

  return (
    <div className="relative flex flex-row mt-4 p-4 border border-yellow-500 rounded text-yellow-300 font-mono text-sm space-y-2 overflow-hidden">
      {taskType === 'forage' && triggerSplash && <ItemSplash src="/img/materials/leaf_0.png"/>}
      <div className="text-pink-400">
        {iconMap[taskType]} {labelMap[taskType]}: {worker.name}
      </div>
      <div>
        Current Phase:{' '}
        <span className="text-white">
          {phase === 'work' ? workingMap[taskType] : 'Resting'}
        </span>
      </div>
      <div>⏳ {secondsLeft}s left</div>
    </div>
  )
}
