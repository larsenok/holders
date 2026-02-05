import { useGuild } from '../../providers/GuildProvider'
import { computeMissionBonuses } from '../../utils/bonusUtils'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, GraduationCap, Gift, Coins } from 'lucide-react'

export default function StatsStrip() {
  const { adventurers } = useGuild()
  const b = computeMissionBonuses(adventurers)
  const navigate = useNavigate()

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
    <div
      className="flex justify-around items-center bg-gray-800 rounded-md p-2 mb-2 cursor-pointer select-none"
      onClick={() => navigate('/stats')}
    >
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
  )
}
