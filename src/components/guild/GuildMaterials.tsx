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
    <div className="bg-slate-950/70 border-2 border-slate-700/80 rounded-xl p-4 text-sm text-white space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-300 font-mono">Inventory</div>
        <HeavyButton size="sm" onClick={() => setShowInventory(true)}>
          <div className="flex flex-row gap-2">
            <img
              src="/img/icon/chest_0.png"
              className="w-5 h-5"
              alt="Level"
            />
            Open Stores
          </div>
        </HeavyButton>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(Object.entries(guildStash.materials) as [MaterialType, number][]).map(
          ([type, quantity]) => (
            <div
              key={type}
              className="flex items-center gap-2 bg-slate-900/70 border border-slate-700/70 px-3 py-2 rounded-lg text-slate-100"
              title={STASH_LABELS[type]}
            >
              <img
                src={materialIcons[type]}
                alt={type}
                className="w-6 h-6"
              />
              <span className="font-semibold">{quantity}</span>
            </div>
          )
        )}
      </div>
      {showInventory && (
        <GuildInventoryModal onClose={() => setShowInventory(false)} />
      )}
    </div>
  )
}
