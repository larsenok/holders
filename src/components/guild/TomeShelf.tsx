import { useEffect, useMemo, useState } from 'react'
import { allTomes } from '../../data/inventory'
import { usePreloadImages } from '../../hooks/usePreloadImages'

export default function TomeShelf() {
  const [discovered, setDiscovered] = useState<string[]>([])

  const tomePaths = Object.values(allTomes).map(
    tome => `/img/items/tomes/tome_${tome.color}_0.png`
  )
  usePreloadImages(tomePaths)

  useEffect(() => {
    const saved = localStorage.getItem('discoveredTomes')
    if (saved) setDiscovered(JSON.parse(saved))
  }, [])

  const discoveredTomes = useMemo(
    () => discovered
      .map(id => ({ id, tome: allTomes[id] }))
      .filter((entry) => Boolean(entry.tome)),
    [discovered],
  )

  if (discoveredTomes.length === 0) {
    return null
  }

  return (
    <div className="mb-3 px-3 py-3 border border-yellow-700 rounded flex flex-row gap-3 items-center bg-[url('/img/ui/shelf_bg.png')] bg-cover">
      {discoveredTomes.map(({ id, tome }) => (
        <img
          key={id}
          src={`/img/items/tomes/tome_${tome.color}_0.png`}
          title={tome.name}
          className="w-10 h-10"
        />
      ))}
    </div>
  )
}
