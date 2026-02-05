import { useGuild } from '../providers/GuildProvider'
import { computeMissionBonuses } from '../utils/bonusUtils'
import { useUnlocks } from '../hooks/useUnlocks'
import { Package, Clock, GraduationCap, Gift, Coins } from 'lucide-react'
import { areas } from '../data/areas'
import { formatDistanceToNow } from 'date-fns'
import Sparkline from '../components/ui/Sparkline'
import { useNavigate } from 'react-router-dom'
import AreaProgressCard from '../components/missions/AreaProgressCard'
import type { Stats } from '../types/Guild'

export default function StatsPage() {
  const navigate = useNavigate()
  const { adventurers, guildStats } = useGuild()
  const { getEquipped } = useUnlocks()
  const bg = getEquipped()
  const accent = getEquipped(true)

  const bonuses = computeMissionBonuses(adventurers)

  const createdAt = Number(localStorage.getItem('guild_created_at') || Date.now())

  const goldHistory = JSON.parse(localStorage.getItem('history_gold') || '[]')
  const xpHistory = JSON.parse(localStorage.getItem('history_xp') || '[]')
  const missionsHistory = JSON.parse(localStorage.getItem('history_missions') || '[]')

  const statKeys: (keyof Stats)[] = ['strength', 'defense', 'wisdom', 'magic', 'dexterity', 'agility']
  const statHistories = statKeys.map(k => ({ key: k, data: JSON.parse(localStorage.getItem(`history_stat_${k}`) || '[]') }))

  const areaHistory = areas.map(a => {
    const h = guildStats.areaHistory?.[a] || { missions: 0, fastest: 0, totalGold: 0, totalMaterials: 0, totalXp: 0, totalItems: 0 }
    const avgGold = h.missions ? Math.round(h.totalGold / h.missions) : 0
    const avgMat = h.missions ? Math.round(h.totalMaterials / h.missions) : 0
    const avgXp = h.missions ? Math.round(h.totalXp / h.missions) : 0
    const avgItems = h.missions ? (h.totalItems / h.missions).toFixed(2) : '0'
    return { area: a, ...h, avgGold, avgMat, avgXp, avgItems }
  })

  const best = guildStats.bestMission || {
    gold: { amount: 0, date: 0, area: '' },
    materials: { amount: 0, date: 0, area: '' },
    xp: { amount: 0, date: 0, area: '' },
    items: { amount: 0, date: 0, area: '' },
  }
  const bestEntries = [
    { label: 'Gold', ...best.gold },
    { label: 'Materials', ...best.materials },
    { label: 'XP', ...best.xp },
    { label: 'Items', ...best.items },
  ]

  const timeline = [{ event: 'created', timestamp: createdAt }, ...(guildStats.milestoneTimeline || [])]
  const formatTimeline = (e: {event: string; timestamp: number; area?: string}) => {
    switch (e.event) {
      case 'created':
        return 'Guild created'
      case 'first_mission':
        return `First mission (${e.area})`
      case 'first_tome':
        return 'First tome found'
      case 'first_area_completion':
        return `First area completed (${e.area})`
      case 'first_max_stat':
        return 'First maxed stat'
      default:
        return e.event
    }
  }

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    return `${h}h ${m}m ${s}s`
  }

  const bonusEntries = [
    {
      icon: Package,
      lore: 'Stronger guild members can carry heavier hauls back from missions',
      label: 'Materials',
      value: bonuses.materials,
      sign: '+',
    },
    {
      icon: Clock,
      lore: 'Agile members move faster, traverse obstacles more easily, and shorten mission routes',
      label: 'Time',
      value: bonuses.duration,
      sign: '-',
    },
    {
      icon: GraduationCap,
      lore: 'Precise, skilled work earns recognition and training credit',
      label: 'Guild XP',
      value: bonuses.guildXp,
      sign: '+',
    },
    {
      icon: Gift,
      lore: 'Attunement to the arcane reveals hidden loot others miss',
      label: 'Items',
      value: bonuses.extraLootChance,
      sign: '+',
    },
    {
      icon: Coins,
      lore: 'Keen judgment and trade sense turns overlooked goods into gold',
      label: 'Gold',
      value: bonuses.gold,
      sign: '+',
    },
  ]

  return (
    <div
      className="w-screen h-screen overflow-auto text-white p-6 space-y-8"
      style={{ backgroundColor: bg, '--accent-color': accent } as React.CSSProperties}
    >
      <button className="underline mb-4" onClick={() => navigate(-1)}>
        Back
      </button>
      <h1 className="text-3xl font-bold mb-4">Guild Stats</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Current Bonuses</h2>
        <div className="flex flex-wrap gap-4">
          {bonusEntries.map(e => (
            <div
              key={e.label}
              className="flex items-center gap-2 bg-gray-800 rounded p-2"
              title={e.lore}
            >
              <e.icon size={20} />
              <div>
                <div className="text-gray-300 text-sm">{e.label}</div>
                <div className="font-bold text-lg">
                  {e.sign}
                  {Math.round(e.value * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Lifetime Totals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Gold Earned</div>
            <div className="font-bold text-lg">{guildStats.lifetimeGold}</div>
            <Sparkline data={goldHistory} />
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Guild XP Gained</div>
            <div className="font-bold text-lg">{guildStats.lifetimeXp}</div>
            <Sparkline data={xpHistory} />
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Materials Gathered</div>
            <div className="font-bold text-lg">{guildStats.lifetimeMaterials}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Items Found</div>
            <div className="font-bold text-lg">{guildStats.lifetimeItems}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Tomes Collected</div>
            <div className="font-bold text-lg">{guildStats.lifetimeTomes}</div>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-gray-300">Missions Completed</div>
            <div className="font-bold text-lg">{guildStats.missionsCompleted}</div>
            <Sparkline data={missionsHistory} />
          </div>
          <div className="bg-gray-800 p-2 rounded sm:col-span-2 lg:col-span-3">
            <div className="text-gray-300">Total Mission Time</div>
            <div className="font-bold text-lg">{formatDuration(guildStats.totalMissionTime || 0)}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Stat Progression</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {statHistories.map(s => (
            <div key={s.key as string} className="bg-gray-800 p-2 rounded">
              <div className="text-gray-300 capitalize">{s.key}</div>
              <Sparkline data={s.data} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Area Progress</h2>
        <AreaProgressCard />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Area History</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {areaHistory.map(a => (
            <div key={a.area} className="bg-gray-800 p-2 rounded space-y-1">
              <div className="text-gray-300">{a.area}</div>
              <div>Missions: {a.missions}</div>
              <div>Fastest: {a.fastest}s</div>
              <div>Avg Gold: {a.avgGold}</div>
              <div>Avg Materials: {a.avgMat}</div>
              <div>Avg XP: {a.avgXp}</div>
              <div>Avg Items: {a.avgItems}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Best Mission Payouts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          {bestEntries.map(b => (
            <div key={b.label} className="bg-gray-800 p-2 rounded">
              <div className="text-gray-300">{b.label}</div>
              <div className="font-bold text-lg">{b.amount}</div>
              {b.date ? <div className="text-xs text-gray-400">{new Date(b.date).toLocaleDateString()} {b.area}</div> : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Milestones</h2>
        <ul className="bg-gray-800 p-2 rounded text-sm space-y-1">
          {timeline
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(t => (
              <li key={t.timestamp}>
                {new Date(t.timestamp).toLocaleDateString()}: {formatTimeline(t)}
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Guild Age</h2>
        <div className="bg-gray-800 p-2 rounded w-fit">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>
      </section>

    </div>
  )
}
