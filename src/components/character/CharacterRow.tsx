import { useState, useEffect } from 'react'
import { Adventurer } from '../../types/Guild'
import { useGuild } from '../../providers/GuildProvider'
import { useAchievements } from '../../providers/AchievementsProvider'
import { X } from 'lucide-react'
import CharacterModal from './CharacterModal'
import TrainingModal from './TrainingModal'
import TaskModal from './TaskModal'
import { trainingSpots } from '../../data/training'
import { getPowerColor } from '../../utils/calculation'
import { STAT_LABELS, STAT_ORDER } from '../../data/adventurer'
import IdleAnimation from '../anim/IdleAnimation'
import { TaskActivity } from '../activities'
import type { TaskType } from '../activities/TaskActivity'
import CharacterXPBar from './CharacterXPBar'
import HeavyButton from '../ui/HeavyButton'
import ConfirmDialog from '../ui/ConfirmDialog'

type Props = {
  adventurer: Adventurer
  expanded: boolean
  toggleExpand: () => void
}

const STAT_SHORT: Record<keyof Adventurer['stats'], string> = {
  strength: 'STR',
  agility: 'AGI',
  defense: 'DEF',
  wisdom: 'WIS',
  magic: 'MAG',
  dexterity: 'DEX',
}

export default function CharacterRow({ adventurer, expanded, toggleExpand }: Props) {
  const { updateAdventurer, removeAdventurer, adventurers, incrementTrainingCount, guildStats, recordMilestone } = useGuild()
  const { unlock } = useAchievements()
  const [showStats, setShowStats] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const showDevControls = import.meta.env.VITE_SHOW_DEV_CONTROLS === 'true'

  const color = getPowerColor(adventurer.power)
  const equippedCount = Object.values(adventurer.gear).filter(Boolean).length
  const oneHour = 1000 * 60 * 60

  const isCooldownActive = !!(
    adventurer.lastTrainingAt &&
    Date.now() - adventurer.lastTrainingAt < oneHour
  )

  useEffect(() => {
    const tick = () => {
      if (
        adventurer.status === 'training' &&
        adventurer.trainingEndsAt &&
        Date.now() >= adventurer.trainingEndsAt
      ) {
        updateAdventurer(adventurer.id, {
          status: 'idle',
          readyToAssignStat: true,
          trainingEndsAt: undefined,
          history: [...adventurer.history, `Finished training ${adventurer.trainingType || ''}`.trim()],
        })
        incrementTrainingCount()
        const completed = (guildStats.trainingsCompleted || 0) + 1
        if (completed >= 5) unlock('training5')
        if (completed >= 20) unlock('training20')
      }

      if (adventurer.status === 'resting' && adventurer.restingEndsAt) {
        if (Date.now() >= adventurer.restingEndsAt) {
          updateAdventurer(adventurer.id, {
            status: 'idle',
            restingEndsAt: undefined,
          })
        }
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [adventurer, guildStats.trainingsCompleted, incrementTrainingCount, unlock])

  const assignStat = (stat: keyof Adventurer['stats']) => {
    updateAdventurer(adventurer.id, {
      stats: {
        ...adventurer.stats,
        [stat]: adventurer.stats[stat] + 1,
      },
      readyToAssignStat: false,
      trainingType: undefined,
      lastTrainingAt: Date.now(),
      history: [...adventurer.history, `Gained +1 ${stat}`],
    })

    const total = adventurers.reduce(
      (sum, a) => sum + (a.id === adventurer.id ? a.stats[stat] + 1 : a.stats[stat]),
      0,
    )
    const key = `history_stat_${stat}`
    const prev = JSON.parse(localStorage.getItem(key) || '[]')
    prev.push(total)
    localStorage.setItem(key, JSON.stringify(prev.slice(-100)))
    if (adventurer.stats[stat] + 1 >= 10) recordMilestone('first_max_stat')
  }

  const trainingOptions = trainingSpots.find(
    (s) => s.id === adventurer.trainingType
  )?.options

  const renderTaskActivity = () => {
    if (!adventurer.taskType) return null
    return <TaskActivity taskType={adventurer.taskType as TaskType} />
  }

  const stopTask = () => {
    const key = `${adventurer.taskType}Status`
    let updates: Partial<Adventurer> = { status: 'idle', taskType: undefined }

    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const { startTime, phase } = JSON.parse(raw) as { startTime: number; phase: 'work' | 'rest' }
        if (phase === 'rest') {
          const restEnd = startTime + 10_000
          if (restEnd > Date.now()) {
            updates = {
              status: 'resting',
              taskType: undefined,
              restingEndsAt: restEnd,
            }
          }
        }
      } catch {
        // ignore
      }
    }

    localStorage.removeItem(key)
    updateAdventurer(adventurer.id, {
      ...updates,
      history: [...adventurer.history, `Completed task ${adventurer.taskType}`],
    })
  }

  return (
    <>
      <div className="relative w-full text-left bg-gray-900 border border-pink-800 hover:border-pink-400 px-4 py-3 rounded mb-3 shadow-md transition-all duration-200 flex flex-col">
        <div className="flex flex-col md:flex-row gap-3 md:gap-0">
          <div className="w-full md:w-1/3 md:pr-2 flex flex-col justify-between">
            <div className="text-base text-white font-bold flex flex-wrap items-center gap-2">
              <span className="text-lg sm:text-xl">{adventurer.name}</span>

              <span className="text-lg text-yellow-300 font-extrabold">
                Lv {adventurer.level}
              </span>
              <span className="text-xs text-gray-500">Eq. ({equippedCount}/4)</span>

              {showDevControls && (
                <HeavyButton
                  onClick={() => {
                    updateAdventurer(adventurer.id, {
                      level: adventurer.level + 1,
                      xp: 0,
                    })
                  }}
                  size="sm"
                >
                  L+
                </HeavyButton>
              )}

              <HeavyButton
                onClick={() => setShowStats(true)}
                size="sm"
              >
                <img src="/img/actions/gear_0.png" alt="Inventory" className="w-4 h-4 sm:w-5 sm:h-5" />
              </HeavyButton>

              {adventurers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmRemoval(true)
                  }}
                  className="text-pink-400 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="text-lg text-pink-300 mb-1 capitalize flex items-center gap-2">
              {adventurer.status === 'idle' && (
                <img src="/img/tasks/resting_0.png" alt="Resting" className="w-12 h-12" />
              )}
              {adventurer.status === 'training' ? 'Training...' : adventurer.status}
            </div>

            <div className="grid grid-cols-6 gap-1.5 text-yellow-300 font-bold">
              {STAT_ORDER.map((key) => {
                const value = adventurer.stats[key]
                const pct = Math.min((value / 20) * 100, 100)
                return (
                  <div key={key} title={STAT_LABELS[key]} className="rounded-lg border border-slate-700/80 bg-slate-950/70 px-1 py-1">
                    <div className="relative h-14 rounded bg-slate-800/80 overflow-hidden flex items-end justify-center">
                      <div className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500" style={{ height: `${pct}%` }} />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-extrabold">{value}</span>
                    </div>
                    <div className="mt-1 text-[9px] tracking-[0.08em] text-center text-slate-300">{STAT_SHORT[key]}</div>
                  </div>
                )
              })}
            </div>

            {adventurer.readyToAssignStat && trainingOptions && (
              <div className="mt-2 flex gap-2">
                {trainingOptions.map((stat) => (
                  <HeavyButton
                    key={stat}
                    onClick={() => assignStat(stat)}
                    size="sm"
                  >
                    +1 {stat}
                  </HeavyButton>
                ))}
              </div>
            )}

            {adventurer.status === 'onTask' && (
              <div className="mt-1">{renderTaskActivity()}</div>
            )}
          </div>

          <div className="w-full md:w-1/3 flex items-center justify-start md:justify-center">
            <div
              className={`text-lg font-extrabold px-4 py-2 rounded bg-opacity-20 ${color}`}
              title="Power Level"
            >
              <span className={`${color}`}>{adventurer.power}</span>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col md:items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {adventurer.status === 'idle' && !adventurer.readyToAssignStat && !isCooldownActive && (
                <HeavyButton
                  onClick={() => setShowTraining(true)}
                  size="sm"
                >
                  Train
                </HeavyButton>
              )}

              {adventurer.status === 'idle' && (
                <HeavyButton
                  onClick={() => setShowTask(true)}
                  size="sm"
                >
                  Task
                </HeavyButton>
              )}

              {adventurer.status === 'onTask' && (
                <HeavyButton
                  onClick={() => stopTask()}
                  size="sm"
                >
                  Stop Task
                </HeavyButton>
              )}

              <HeavyButton
                onClick={toggleExpand}
                size="sm"
              >
                <img
                  src={`/img/actions/${expanded ? 'arrow_up_0' : 'arrow_down_0'}.png`}
                  alt="Toggle"
                  className="w-4 h-4"
                />
              </HeavyButton>
            </div>

            <div className="flex items-center min-w-[80px] self-end md:self-auto">
              <IdleAnimation
                animKey={adventurer.animKey || 'idle_0'}
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  transform: 'scale(1)',
                  transformOrigin: 'center',
                }}
              />
            </div>
          </div>
        </div>
        <CharacterXPBar xp={adventurer.xp || 0} level={adventurer.level} />
        {expanded && (
          <div className="mt-2 px-4 py-3 bg-black/40 rounded border border-gray-700 text-xs text-gray-200 space-y-2">
            <div className="font-bold text-white text-sm">Detailed Stats</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAT_ORDER.map((key) => (
                <div
                  key={key}
                  className="flex justify-between bg-gray-800/60 px-2 py-1 rounded"
                >
                  <span className="capitalize text-gray-300">
                    {STAT_LABELS[key].split(':')[0]}
                  </span>
                  <span className="text-yellow-300 font-mono">
                    {adventurer.stats[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showStats && (
        <CharacterModal adventurer={adventurer} onClose={() => setShowStats(false)} />
      )}

      {showTraining && (
        <TrainingModal adventurer={adventurer} onClose={() => setShowTraining(false)} />
      )}

      {showTask && (
        <TaskModal adventurer={adventurer} onClose={() => setShowTask(false)} />
      )}

      {confirmRemoval && (
        <ConfirmDialog
          message={`Remove ${adventurer.name} from the guild?`}
          onConfirm={() => {
            removeAdventurer(adventurer.id)
            setConfirmRemoval(false)
          }}
          onCancel={() => setConfirmRemoval(false)}
        />
      )}
    </>
  )
}
