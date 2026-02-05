import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { starterMembers } from '../data/adventurer'
import { useGuild } from '../providers/GuildProvider'
import { Adventurer } from '../types/Guild'
import { generateGuildName } from '../utils/stringHandling'
import { useUnlocks } from '../hooks/useUnlocks'

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

    localStorage.setItem('guild_name', guildName.trim());

    // Update guild stats locally
    updateGuildStats({
      name: guildName.trim(),
      gold: 1000,
      rank: 1,
    })

    // Add the adventurer locally
    addAdventurer(selectedAdventurer)

    // Flag as locally initialized
    localStorage.setItem('guild_initialized', 'true')

    // Proceed to main app
    navigate('/')
  }

  const gradient = 'bg-gradient-to-br from-gray-900 via-black to-gray-950';
  return (
    <div
      className={`w-screen h-screen text-white flex flex-col items-center justify-center p-6 ${mainBg ? '' : gradient}`}
      style={{ backgroundColor: mainBg || undefined }}
    >
      <h1 className="text-3xl font-bold text-yellow-300 mb-2 tracking-wide drop-shadow">
        The Flame is Waiting
      </h1>
      <p className="mb-8 text-pink-300 text-sm italic">Choose one to begin your Guild’s legacy.</p>

      <div className="flex flex-wrap gap-6 justify-center">
        {starterMembers.map((adv) => (
          <button
            key={adv.id}
            onClick={() => setSelectedAdventurer(adv)}
            className={`group bg-gray-800 border rounded-xl p-4 w-56 text-left transition-all hover:scale-105 shadow-md ${
              selectedAdventurer?.id === adv.id
                ? 'border-yellow-400 shadow-yellow-500/20'
                : 'border-gray-600 hover:border-yellow-400'
            }`}
          >
            <h2 className="text-lg font-bold text-pink-200 group-hover:text-yellow-300 mb-1">
              {adv.name}
            </h2>
            <div className="text-xs text-gray-300 mb-2">
              {Object.entries(adv.stats).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-yellow-500 opacity-80">Power Rank: {adv.power}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 w-full max-w-sm text-sm">
        <label htmlFor="guild-name" className="block text-gray-400 mb-1">
          Guild Name
        </label>
        <input
          id="guild-name"
          type="text"
          value={guildName}
          onChange={(e) => setGuildName(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

      <button
        onClick={handleStart}
        className="mt-6 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-sm rounded disabled:opacity-50"
        disabled={!selectedAdventurer}
      >
        Start
      </button>

      <p className="mt-10 text-xs text-gray-500 italic">
        This choice is permanent. Your Guild remembers.
      </p>
    </div>
  )
}
