import { useState } from 'react'
import { STASH_LABELS } from '../../data/stash'
import { useGuild } from '../../providers/GuildProvider'
import { MaterialType } from '../../types/Guild'
import HeavyButton from '../ui/HeavyButton'
import GuildInventoryModal from '../inventory/GuildInventoryModal'

const materialIcons: Record<MaterialType, string> = {
  Wood: '/img/materials/log_0.png',
  Stone: '/img/materials/stone_0.png',
  Iron: '/img/materials/metals_0.png',
  Herbs: '/img/materials/herbs_0.png',
  Cloth: '/img/materials/cloth_0.png',
}

export default function GuildMaterials() {
  const { guildStash } = useGuild()
  const [showInventory, setShowInventory] = useState(false)

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex items-center justify-between gap-4 text-sm text-white">
      {(Object.entries(guildStash.materials) as [MaterialType, number][]).map(
        ([type, quantity]) => (
          <div
            key={type}
            className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded shadow hover:bg-gray-700 transition hover:text-white transition cursor-help"
            title={STASH_LABELS[type]}
          >
            <img
              src={materialIcons[type]}
              alt={type}
              className="w-6 h-6"
            />
            <span className="text-white font-semibold">{quantity}</span>
          </div>
        )
        
      )}
      <HeavyButton size="sm" onClick={() => setShowInventory(true)}>
        <div className="flex flex-row gap-2">
          <img
            src="/img/icon/chest_0.png"
            className="w-5 h-5"
            alt="Level"
          />
          Inventory
        </div>
      </HeavyButton>
      {showInventory && (
        <GuildInventoryModal onClose={() => setShowInventory(false)} />
      )}
    </div>
    
  )
}
