import type { Mission, MissionRun } from '../../types/Missions'
import { useGuild } from '../../providers/GuildProvider'
import { applyMissionBonuses, computeMissionBonuses } from '../../utils/bonusUtils'

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

const durationLabel = (seconds: number) => {
  if (seconds <= 45) return 'brief'
  if (seconds <= 90) return 'steady'
  if (seconds <= 150) return 'long'
  return 'extended'
}

const rewardTier = (value: number, thresholds: [number, number, number], labels: [string, string, string, string]) => {
  if (value <= thresholds[0]) return labels[0]
  if (value <= thresholds[1]) return labels[1]
  if (value <= thresholds[2]) return labels[2]
  return labels[3]
}

const lootOddsLabel = (chance: number) => {
  if (chance < 0.08) return 'rare'
  if (chance < 0.18) return 'possible'
  if (chance < 0.35) return 'likely'
  return 'common'
}

const rumorBlurb = (area: string, type: string) => {
  const areaFlavors: Record<string, string> = {
    Forest: 'a trail that refuses to stay mapped',
    Desert: 'voices carried on hot wind',
    Mountains: 'something heavy shifting above the tree line',
    Swamp: 'lanterns bobbing where none should be',
    Ruins: 'a door that only opens at dusk',
    Tundra: 'tracks that freeze over too quickly',
  }
  const typeFlavors: Record<string, string> = {
    hunt: 'the quarry might be cleverer than the stories',
    explore: 'the path back is never the same twice',
    gathering: 'locals argue over what is safe to touch',
    escort: 'not everyone agrees on the destination',
    deal: 'every handshake has a second price',
    rescue: 'someone wants them found, someone does not',
  }

  const areaFlavor = areaFlavors[area] ?? 'a rumor that refuses to settle'
  const typeFlavor = typeFlavors[type] ?? 'the details feel deliberately thin'
  return `Rumor: ${areaFlavor}; ${typeFlavor}.`
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

  const elapsed = active ? getElapsed(active.startedAt) : 0
  const remaining = Math.max(m.duration - elapsed, 0)
  const isDone = remaining <= 0

  const materials = Math.max(1, Math.floor(1 * (1 + bonuses.materials)))
  const extraChance = bonuses.extraLootChance

  const goldBand = rewardTier(m.goldReward, [40, 80, 120], ['meager', 'modest', 'generous', 'lavish'])
  const guildXpBand = rewardTier(m.guildXp, [30, 60, 90], ['low', 'steady', 'notable', 'legendary'])
  const charXpBand = rewardTier(m.characterXp, [20, 40, 70], ['slow', 'steady', 'fast', 'breakthrough'])
  const materialBand = rewardTier(materials, [1, 2, 3], ['sparse', 'steady', 'plentiful', 'overflowing'])

  return (
    <div
      className={`rounded p-4 bg-[#1e1a18] text-sm text-white font-sans flex justify-between gap-4 ${
        isDone ? 'border border-[#d97706]' : 'border border-red-800'
      }`}
    >
      {/* LEFT SIDE */}
      <div className="flex-1 space-y-1">
        {/* Title + Unique */}
        <div className="flex justify-between items-center">
          <div className="text-red-400 text-lg font-bold tracking-wide">
            {mission.name}
          </div>
          {mission.unique && (
            <div className="text-yellow-300 text-xs font-mono">⭐ Unique</div>
          )}
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-300 font-mono">
          Area: <span className={`${areaColor(mission.area)} font-semibold`}>{mission.area}</span>
        </div>
        <div className="text-xs text-gray-300 font-mono">
          Type: <span className="text-white">{mission.type}</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          ⏱ Pace: <span className="text-white">{durationLabel(m.duration)}</span>
          <span className="text-gray-500"> ({formatDuration(m.duration)})</span>
        </div>
        <div className="text-xs text-amber-100 font-mono">
          {rumorBlurb(mission.area, mission.type)}
        </div>

        {bonusTags.length > 0 && (
          <div className="text-xs text-amber-200 font-mono">
            {locked ? 'Effects locked: ' : ''}{bonusTags.join(' ')}
          </div>
        )}

        {/* Action */}
        {active ? (
          <div className="text-xs text-gray-400 font-mono pt-1">
            {isDone ? (
              <span className="text-green-300 font-semibold">✅ Complete</span>
            ) : (
              <>⏳ {formatDuration(remaining)} left</>
            )}
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            {completed && <span className="text-green-400 font-mono">Completed</span>}
            <button
              onClick={() => startMission(mission.id)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs font-mono"
            >
              ▶ Commit Party
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-32 flex flex-col justify-center items-end text-xs text-yellow-200 font-mono space-y-1">
        <div>💰 <span className="text-white">{goldBand}</span></div>
        <div>🧭 <span className="text-white">{guildXpBand}</span></div>
        <div>🎖 <span className="text-white">{charXpBand}</span></div>
        <div>📦 <span className="text-white">{materialBand}</span></div>
        <div>✨ <span className="text-white">{lootOddsLabel(extraChance)}</span></div>
      </div>
    </div>
  )
}
