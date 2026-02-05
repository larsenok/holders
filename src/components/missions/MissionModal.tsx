import { useState } from 'react'
import { areaImages, areas, areaLevelReqs } from '../../data/areas'
import type { Area } from '../../data/areas'
import { uniqueMissions } from '../../data/missions'
import type { MissionRun, Mission } from '../../types/Missions'
import MissionCard from './MissionCard'
import { generateDefaultMission } from '../../utils/missionUtils'
import { defaultTypes } from '../../data/areas'
import { useGuild } from '../../providers/GuildProvider'
import { Lock } from 'lucide-react'
import { getTomeEffectTags } from '../../utils/tomeUtils'

type Props = {
  running: Record<string, MissionRun>
  startMission: (id: string) => void
  onClose: () => void
  completedUniques: Record<string, true>
  completedDefaults: Record<string, number>
  eventMissions?: Mission[]
}

export default function MissionModal({ running, startMission, onClose, completedUniques, eventMissions = [] }: Props) {
  const [selectedArea, setSelectedArea] = useState<Area>('Forest')
  const { guildStats, equippedTomeIds } = useGuild()

  const getElapsed = (start: number) => Math.floor((Date.now() - start) / 1000)

  const defaultMissions = defaultTypes.map(type =>
    generateDefaultMission(selectedArea, type)
  )

  const matchingUniqueMissions = [...uniqueMissions, ...eventMissions].filter(m => m.area === selectedArea)

  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#2b1f1a] border border-yellow-900 p-6 w-[48rem] max-h-[85vh] overflow-auto space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg text-yellow-100 font-bold font-mono tracking-wide">
          Mission Control
        </h2>

        {/* Area Selection */}
        <div>
          <div className="text-sm text-yellow-300 mb-1">Select Area</div>
          <div className="grid grid-cols-3 gap-[2px]">
            {areas.map(area => {
              const isActive = selectedArea === area
              const hasUncompletedUnique = uniqueMissions.some(
                m => m.area === area && !completedUniques[m.id]
              )
              const req = areaLevelReqs[area as Area]
              const locked = guildStats.rank < req

              return (
                <div
                  key={area}
                  onClick={() => !locked && setSelectedArea(area as Area)}
                  className={`relative cursor-pointer overflow-hidden border transition-all
                    ${isActive ? 'border-yellow-500 ring-2 ring-yellow-400' : 'border-yellow-900'}`}
                >
                  <img
                    src={areaImages[area]}
                    alt={area}
                    className={`w-full h-24 object-cover hover:brightness-110 hover:scale-[1.01] transition duration-150 ${locked ? 'grayscale opacity-60' : ''}`}
                  />
                  <div className="absolute bottom-1 left-1 text-md font-semibold text-white bg-black/40 px-1.5">
                    {area} {hasUncompletedUnique && <span className="text-yellow-300 ml-1">⭐</span>}
                  </div>
                  {locked && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-yellow-300 font-mono text-sm">
                      <Lock size={24} />
                      <div className="mt-1">lvl {req} req</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mission Columns */}
        <div className="flex gap-4">
          {/* Repeatable */}
          <div className="flex-1 space-y-4">
            <div className="text-sm text-yellow-400 font-mono mb-1">Repeatable</div>
          {defaultMissions.map(m => {
            const run = running[m.id]
            const bonusTags = run ? getTomeEffectTags(run.tomeSnapshot.ids) : getTomeEffectTags(equippedTomeIds)
            return (
              <MissionCard
                key={m.id}
                mission={m}
                active={run}
                getElapsed={getElapsed}
                startMission={startMission}
                bonusTags={bonusTags}
                locked={!!run}
              />
            )
          })}
          </div>

          {/* Unique */}
          <div className="flex-1 space-y-4">
            <div className="text-sm text-yellow-400 font-mono mb-1">Unique</div>
            {matchingUniqueMissions.map(m => (
              <div key={m.id} className="relative">
                <div className="absolute top-1 right-1 text-yellow-300 text-lg">⭐</div>
                <MissionCard
                  mission={m}
                  active={running[m.id]}
                  getElapsed={getElapsed}
                  startMission={startMission}
                  completed={completedUniques[m.id]}
                  bonusTags={running[m.id] ? getTomeEffectTags(running[m.id].tomeSnapshot.ids) : getTomeEffectTags(equippedTomeIds)}
                  locked={!!running[m.id]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-yellow-700 hover:bg-yellow-800 rounded text-white text-sm font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
