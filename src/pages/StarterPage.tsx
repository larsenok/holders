import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { starterMembers } from '../data/adventurer'
import { useGuild } from '../providers/GuildProvider'
import { Adventurer } from '../types/Guild'
import { generateGuildName } from '../utils/stringHandling'
import { useUnlocks } from '../hooks/useUnlocks'

const onboardingSteps = [
  {
    title: 'Choose a Hero',
    detail: 'Pick your first adventurer. Their base stats shape your early momentum.',
    emoji: '🛡️',
  },
  {
    title: 'Name the Guild',
    detail: 'Set a memorable guild name. This becomes your identity in every run.',
    emoji: '🏰',
  },
  {
    title: 'Start Building',
    detail: 'Complete tasks, gather materials, and grow your guild power.',
    emoji: '⚔️',
  },
]

export default function StarterPage() {
  const { addAdventurer, updateGuildStats } = useGuild()
  const navigate = useNavigate()

  const [guildName, setGuildName] = useState(generateGuildName())
  const [selectedAdventurer, setSelectedAdventurer] = useState<Adventurer | null>(null)
  const [error] = useState<string | null>(null)
  const { getEquipped } = useUnlocks()
  const mainBg = getEquipped()

  const handleStart = async () => {
    if (!selectedAdventurer || !guildName.trim()) return

    localStorage.setItem('guild_name', guildName.trim())

    updateGuildStats({
      name: guildName.trim(),
      gold: 1000,
      rank: 1,
    })

    addAdventurer(selectedAdventurer)
    localStorage.setItem('guild_initialized', 'true')

    navigate('/')
  }

  const gradient = 'bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950'

  return (
    <div
      className={`min-h-screen w-full text-slate-100 flex flex-col items-center px-4 py-5 sm:px-6 sm:py-8 ${mainBg ? '' : gradient}`}
      style={{ backgroundColor: mainBg || undefined }}
    >
      <div className="w-full max-w-5xl">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-indigo-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
            The Flame is Waiting
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-indigo-200/85">
            Your first choices matter. Start strong and shape your Guild&apos;s legacy.
          </p>
        </div>

        <section className="mb-4 sm:mb-6 rounded-2xl border border-indigo-300/25 bg-slate-900/55 backdrop-blur-sm p-3 sm:p-4 shadow-lg shadow-indigo-950/40">
          <h2 className="text-sm sm:text-base font-semibold text-cyan-200 mb-3">How this works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-cyan-300/20 bg-slate-950/55 p-3 min-h-[92px]"
              >
                <p className="text-[11px] uppercase tracking-wide text-cyan-300/80 font-semibold mb-1">
                  Step {index + 1}
                </p>
                <p className="text-sm font-bold text-slate-100 mb-1">
                  <span className="mr-1" aria-hidden="true">{step.emoji}</span>
                  {step.title}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-violet-300/25 bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4 shadow-xl shadow-violet-950/40">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm sm:text-base font-semibold text-violet-200">Pick your starter hero</h2>
            <span className="text-[10px] sm:text-xs text-slate-300">Tap a card to select</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {starterMembers.map((adv) => (
              <button
                key={adv.id}
                onClick={() => setSelectedAdventurer(adv)}
                className={`group rounded-xl p-3 text-left transition-all border shadow-sm w-full ${
                  selectedAdventurer?.id === adv.id
                    ? 'border-cyan-300 bg-cyan-500/12 shadow-cyan-900/40'
                    : 'border-slate-600/80 bg-slate-800/65 hover:border-violet-300/80 hover:bg-slate-800'
                }`}
              >
                <h3 className="text-base font-bold text-indigo-100 group-hover:text-cyan-200 mb-2">
                  {adv.name}
                </h3>
                <div className="text-xs text-slate-200/85 mb-2 space-y-0.5">
                  {Object.entries(adv.stats).map(([key, val]) => (
                    <div key={key} className="flex justify-between gap-2">
                      <span className="capitalize text-slate-300">{key}</span>
                      <span className="font-semibold text-slate-100">{val}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-300/90">Power Rank: {adv.power}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
            <div className="w-full text-sm">
              <label htmlFor="guild-name" className="block text-slate-300 mb-1 text-xs sm:text-sm">
                Guild Name
              </label>
              <input
                id="guild-name"
                type="text"
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800/85 text-slate-100 border border-slate-500/80 focus:outline-none focus:border-cyan-300"
              />
            </div>

            <button
              onClick={handleStart}
              className="h-[42px] px-5 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-sm rounded-lg disabled:opacity-45 disabled:cursor-not-allowed"
              disabled={!selectedAdventurer}
            >
              Start Adventure
            </button>
          </div>

          {error && <p className="text-xs text-rose-300 mt-3">{error}</p>}
        </section>

        <p className="mt-4 text-center text-[11px] sm:text-xs text-slate-300/75 italic">
          First hero choice is permanent. Your Guild remembers.
        </p>
      </div>
    </div>
  )
}
