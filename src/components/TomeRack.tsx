import { useState } from 'react'
import { allTomes } from '../data/inventory'
import { useGuild } from '../providers/GuildProvider'
import { getTomeEffectTags } from '../utils/tomeUtils'

type Props = {
  discovered?: string[]
}

export default function TomeRack({ discovered }: Props) {
  const { equippedTomeIds, setEquippedTomeIds } = useGuild()
  const [selectingSlot, setSelectingSlot] = useState<number | null>(null)

  const discoveredIds =
    discovered ??
    (() => {
      try {
        return JSON.parse(localStorage.getItem('discoveredTomes') || '[]') as string[]
      } catch {
        return [] as string[]
      }
    })()

  const available = discoveredIds.filter(id => !equippedTomeIds.includes(id))

  const handleEquip = (slot: number, id: string) => {
    setEquippedTomeIds(prev => {
      const next = [...prev]
      next[slot] = id
      return next.slice(0, 2)
    })
    setSelectingSlot(null)
  }

  const handleUnslot = (slot: number) => {
    setEquippedTomeIds(prev => prev.filter((_, i) => i !== slot))
    setSelectingSlot(null)
  }

  return (
    <div className="relative mb-3 px-3 py-3 border border-yellow-700 rounded flex gap-3 items-center bg-[url('/img/ui/shelf_bg.png')] bg-cover">
      {Array.from({ length: 2 }).map((_, i) => {
        const id = equippedTomeIds[i]
        const tome = id ? allTomes[id] : null
        const tags = id ? getTomeEffectTags([id]) : []
        return (
          <button
            key={i}
            onClick={() => setSelectingSlot(i)}
            className="w-32 h-20 bg-black/40 rounded flex flex-col items-center justify-center text-yellow-200 border border-yellow-700"
          >
            {tome ? (
              <>
                <div className="text-sm font-bold text-center px-1">{tome.name}</div>
                <div className="text-[10px] text-amber-200">{tags.join(' ')}</div>
              </>
            ) : (
              <span className="text-yellow-400 text-2xl">+</span>
            )}
          </button>
        )
      })}

      {selectingSlot !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setSelectingSlot(null)}>
          <div
            className="bg-gray-800 border border-yellow-700 p-4 rounded flex flex-col gap-2"
            onClick={e => e.stopPropagation()}
          >
            {equippedTomeIds[selectingSlot] && (
              <button
                className="text-left text-red-300 hover:text-red-200"
                onClick={() => handleUnslot(selectingSlot)}
              >
                Unslot
              </button>
            )}
            {available.map(id => (
              <button
                key={id}
                className="text-left text-yellow-200 hover:text-yellow-100"
                onClick={() => handleEquip(selectingSlot, id)}
              >
                {allTomes[id].name}
              </button>
            ))}
            {available.length === 0 && !equippedTomeIds[selectingSlot] && (
              <div className="text-sm text-yellow-200">No tomes available</div>
            )}
            <button
              className="mt-2 text-left text-gray-300 hover:text-gray-100"
              onClick={() => setSelectingSlot(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
