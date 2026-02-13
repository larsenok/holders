import { useGuild } from '../../providers/GuildProvider'
import { computeMissionBonuses } from '../../utils/bonusUtils'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Package, Clock, GraduationCap, Gift, Coins, ChevronDown, ChevronUp } from 'lucide-react'

export default function StatsStrip() {
  const { adventurers } = useGuild()
  const b = computeMissionBonuses(adventurers)
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const entries = [
    {
      icon: Package,
      lore: 'Stronger guild members can carry heavier hauls back from missions',
      label: 'Materials',
      value: b.materials,
      sign: '+',
    },
    {
      icon: Clock,
      lore: 'Agile members move faster, traverse obstacles more easily, and shorten mission routes',
      label: 'Time',
      value: b.duration,
      sign: '-',
    },
    {
      icon: GraduationCap,
      lore: 'Precise, skilled work earns recognition and training credit',
      label: 'Guild XP',
      value: b.guildXp,
      sign: '+',
    },
    {
      icon: Gift,
      lore: 'Attunement to the arcane reveals hidden loot others miss',
      label: 'Items',
      value: b.extraLootChance,
      sign: '+',
    },
    {
      icon: Coins,
      lore: 'Keen judgment and trade sense turns overlooked goods into gold',
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
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 px-2 pb-2">
          {entries.map(e => (
            <div key={e.label} className="flex items-center gap-1 text-xs" title={e.lore}>
              <e.icon size={14} />
              <span>
                {e.sign}
                {Math.round(e.value * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
