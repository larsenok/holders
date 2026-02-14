import type { Mission, MissionRun } from '../../types/Missions'
import { useGuild } from '../../providers/GuildProvider'
import { applyMissionBonuses, computeMissionBonuses } from '../../utils/bonusUtils'
import { getMissionRequirement } from '../../utils/missionUtils'

type Props = {
  mission: Mission
  active?: MissionRun
  getElapsed: (start: number) => number
  startMission: (id: string) => void
  completed?: boolean
  bonusTags?: string[]
  locked?: boolean
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m > 0 ? `${m}m ` : ''}${s}s`
}

const areaColor = (area: string) => {
  switch (area) {
    case 'Forest': return 'text-green-400'
    case 'Desert': return 'text-yellow-300'
    case 'Mountains': return 'text-gray-300'
    case 'Swamp': return 'text-lime-300'
    case 'Ruins': return 'text-red-400'
    case 'Tundra': return 'text-blue-200'
    default: return 'text-white'
  }
}

export default function MissionCard({ mission, active, getElapsed, startMission, completed, bonusTags = [], locked = false }: Props) {
  const { adventurers } = useGuild()
  const bonuses = computeMissionBonuses(adventurers)
  const m = applyMissionBonuses(mission, bonuses)
  const { requiredLevel, requiredCount } = getMissionRequirement(mission)
  const eligibleCount = adventurers.filter(
    (adv) => adv.status === 'idle' && adv.level >= requiredLevel
  ).length
  const canStart = !locked && eligibleCount >= requiredCount

  const elapsed = active ? getElapsed(active.startedAt) : 0
  const remaining = Math.max(m.duration - elapsed, 0)
  const isDone = remaining <= 0

  const materials = Math.max(1, Math.floor(1 * (1 + bonuses.materials)))
  const extraChance = Math.round(bonuses.extraLootChance * 100)

  return (
    <div
      className={`rounded-lg p-3 text-sm text-slate-100 font-sans flex flex-col gap-2 border ${
        isDone ? 'border-emerald-500/50 bg-slate-950/70' : 'border-slate-700/80 bg-slate-950/50'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-slate-100 text-sm sm:text-base font-semibold tracking-wide">{mission.name}</div>
        {mission.unique && <div className="text-amber-200 text-[11px] font-mono">⭐ Unique</div>}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
        <span className={`rounded bg-slate-900/70 px-1.5 py-0.5 ${areaColor(mission.area)}`}>{mission.area}</span>
        <span className="rounded bg-slate-900/70 px-1.5 py-0.5 text-slate-300">{mission.type}</span>
        <span className="rounded bg-slate-900/70 px-1.5 py-0.5 text-slate-300">⏱ {formatDuration(m.duration)}</span>
        <span className={`rounded px-1.5 py-0.5 ${canStart ? 'bg-emerald-900/40 text-emerald-200' : 'bg-amber-900/30 text-amber-200'}`}>
          {eligibleCount}/{requiredCount} ready • lvl {requiredLevel}+
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px] font-mono">
        <div className="rounded bg-slate-900/60 px-1.5 py-1 text-slate-200">💰 {m.goldReward}</div>
        <div className="rounded bg-slate-900/60 px-1.5 py-1 text-slate-200">🧭 {m.guildXp} xp</div>
        <div className="rounded bg-slate-900/60 px-1.5 py-1 text-slate-200">🎖 {m.characterXp} xp</div>
        <div className="rounded bg-slate-900/60 px-1.5 py-1 text-slate-200">📦 {materials}</div>
        <div className="rounded bg-slate-900/60 px-1.5 py-1 text-slate-200">✨ +{extraChance}%</div>
      </div>

      {bonusTags.length > 0 && (
        <div className="text-[11px] text-amber-200/90 font-mono truncate" title={bonusTags.join(' ')}>
          {locked ? 'Effects locked: ' : ''}{bonusTags.join(' ')}
        </div>
      )}

      {active ? (
        <div className="text-xs text-slate-400 font-mono">
          {isDone ? <span className="text-emerald-300 font-semibold">✅ Complete</span> : <>⏳ {formatDuration(remaining)} left</>}
        </div>
      ) : (
        <div className="mt-1 flex items-center gap-2">
          {completed && <span className="text-emerald-400 text-xs font-mono">Completed</span>}
          <button
            onClick={() => startMission(mission.id)}
            disabled={!canStart}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              canStart
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            ▶ Start
          </button>
        </div>
      )}
    </div>
  )
}
