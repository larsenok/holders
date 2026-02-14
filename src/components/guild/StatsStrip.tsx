import { useGuild } from '../../providers/GuildProvider'
import { computeMissionBonuses } from '../../utils/bonusUtils'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Package, Clock, GraduationCap, Gift, Coins, ChevronDown, ChevronUp, Info } from 'lucide-react'

export default function StatsStrip() {
  const { adventurers } = useGuild()
  const b = computeMissionBonuses(adventurers)
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [openInfo, setOpenInfo] = useState<string | null>(null)

  const entries = [
    {
      icon: Package,
      lore: 'Stronger guild members can carry heavier hauls back from missions.',
      label: 'Materials',
      value: b.materials,
      sign: '+',
    },
    {
      icon: Clock,
      lore: 'Agile members move faster, traverse obstacles more easily, and shorten mission routes.',
      label: 'Time',
      value: b.duration,
      sign: '-',
    },
    {
      icon: GraduationCap,
      lore: 'Precise, skilled work earns recognition and training credit for the guild.',
      label: 'Guild XP',
      value: b.guildXp,
      sign: '+',
    },
    {
      icon: Gift,
      lore: 'Attunement to the arcane reveals hidden loot that less prepared crews miss.',
      label: 'Items',
      value: b.extraLootChance,
      sign: '+',
    },
    {
      icon: Coins,
      lore: 'Keen judgment and trade sense turns overlooked goods into extra gold.',
      label: 'Gold',
      value: b.gold,
      sign: '+',
    },
  ]

  return (
    <div className="bg-gray-800 rounded-md mb-2 select-none">
      <div className="flex items-center justify-between gap-2 p-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-slate-200 font-semibold"
          onClick={() => setExpanded(prev => !prev)}
        >
          Stat Bonuses
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          type="button"
          className="text-xs underline text-slate-300"
          onClick={() => navigate('/stats')}
        >
          View stats
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2 pb-2">
          {entries.map(e => {
            const infoOpen = openInfo === e.label
            return (
              <div key={e.label} className="rounded border border-slate-700/70 bg-slate-900/50 p-2 text-xs">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <e.icon size={14} />
                    <span className="font-semibold">{e.label}</span>
                    <span>
                      {e.sign}
                      {Math.round(e.value * 100)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-cyan-300"
                    aria-label={`Toggle ${e.label} bonus info`}
                    onClick={() => setOpenInfo(prev => prev === e.label ? null : e.label)}
                  >
                    <Info size={12} />
                  </button>
                </div>
                {infoOpen && <p className="mt-1.5 text-slate-300 leading-snug">{e.lore}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
