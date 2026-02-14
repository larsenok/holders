import { useEffect, useState } from 'react'
import { allTomes } from '../../data/inventory'
import { useGuild } from '../../providers/GuildProvider'
import HeavyButton from '../ui/HeavyButton'
import TomeRack from '../TomeRack'

export default function TomeDiscoveryPanel() {
  const { guildInventory, removeInventoryItem } = useGuild()
  const [discovered, setDiscovered] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('discoveredTomes')
    if (saved) setDiscovered(JSON.parse(saved))
  }, [])

  const undiscovered = Object.keys(allTomes).filter(id => !discovered.includes(id))

  const handleDiscover = () => {
    if (undiscovered.length === 0 || guildInventory.Tome < 1) return
    const next = undiscovered[0]
    const updated = [...discovered, next]
    setDiscovered(updated)
    localStorage.setItem('discoveredTomes', JSON.stringify(updated))
    removeInventoryItem('Tome', 1)
  }

  const handleRemoveAll = () => {
    setDiscovered([])
    localStorage.removeItem('discoveredTomes')
  }

  return (
    <div className="w-full lg:w-80 lg:max-h-[28rem] overflow-y-visible lg:overflow-y-auto lg:border-l border-yellow-700 lg:pl-4 flex flex-col justify-between">
      <div>
        <h2 className="text-yellow-300 text-lg font-semibold mb-3">Tome Rack</h2>
        <TomeRack discovered={discovered} />

        {guildInventory.Tome > 0 && undiscovered.length > 0 && (
          <div className="mb-4">
            <HeavyButton onClick={handleDiscover}>Discover New Tome</HeavyButton>
          </div>
        )}

        {discovered.length === 0 && (
          <p className="text-sm text-yellow-200 italic">No tomes discovered yet.</p>
        )}

        {discovered.map(id => {
          const tome = allTomes[id]
          return (
            <div
              key={id}
              className="flex items-center gap-3 mb-3 bg-gray-900 p-2 rounded border border-yellow-600"
            >
              <img
                src={`/img/items/tomes/read_${tome.color}_0.png`}
                alt={tome.name}
                className="w-12 h-10"
              />
              <div>
                <div className="text-yellow-200 font-bold">{tome.name}</div>
                <div className="text-sm text-yellow-100">
                  {tome.effects.map((effect, i) => (
                    <div key={i}>➤ {effect}</div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {discovered.length > 0 && (
        <div className="flex justify-end mt-1">
          <button
            onClick={handleRemoveAll}
            className="text-yellow-400 text-xs hover:text-yellow-200"
          >
            × Remove
          </button>
        </div>
      )}
    </div>
  )
}
