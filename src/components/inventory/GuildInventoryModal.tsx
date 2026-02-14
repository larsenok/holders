import { inventoryIcons, itemValues, lootTable } from '../../data/inventory'
import { useGuild } from '../../providers/GuildProvider'
import { itemsWithWarning, type InventoryItemType } from '../../types/Guild'
import { useState } from 'react'
import HeavyButton from '../ui/HeavyButton'
import { ItemSplash } from '../ui/effects/ItemSplash'
import ConfirmDialog from '../ui/ConfirmDialog'
import TomeDiscoveryPanel from './TomeDiscoveryPanel'

export default function GuildInventoryModal({ onClose }: { onClose: () => void }) {
  const { guildInventory, guildStats, sellInventoryItem, addInventoryItem } = useGuild()
  const showDevControls = import.meta.env.VITE_SHOW_DEV_CONTROLS === 'true'

  const weightMap = Object.fromEntries(lootTable.map(entry => [entry.item, entry.weight]));
  const itemKeys = (Object.keys(guildInventory) as InventoryItemType[]).sort(
    (a, b) => (weightMap[b] || 0) - (weightMap[a] || 0))

  const [triggerSplash, setTriggerSplash] = useState(false)
  const [confirmData, setConfirmData] = useState<null | { message: string, onConfirm: () => void }>(null)

  const items = itemKeys.map(key => [key, guildInventory[key]] as [InventoryItemType, number])
  const slots = Array.from({ length: 25 }, (_, i) => items[i] || null)

  const handleSale = () => {
    setTriggerSplash(true)
    setTimeout(() => setTriggerSplash(false), 750)
  }

  const confirm = (message: string, onConfirm: () => void) => {
    setConfirmData({ message, onConfirm })
  }

  const handleSellItem = (item: InventoryItemType, qty: number) => {
    if (itemsWithWarning.includes(item)) {
      confirm(`Are you sure you want to sell ${item}?`, () => {
        sellInventoryItem(item, qty)
        handleSale()
      })
    } else {
      sellInventoryItem(item, qty)
      handleSale()
    }
  }

  const handleSellAll = () => {
    const warned = itemKeys.filter(k => itemsWithWarning.includes(k) && guildInventory[k] > 0)
    if (warned.length > 0) {
      confirm(`You're about to sell ${warned.join(', ')} - continue?`, () => {
        itemKeys.forEach(key => {
          const qty = guildInventory[key]
          if (qty > 0) sellInventoryItem(key, qty)
        })
        handleSale()
      })
      return
    }

    itemKeys.forEach(key => {
      const qty = guildInventory[key]
      if (qty > 0) sellInventoryItem(key, qty)
    })
    handleSale()
  }

  const totalSellValue = itemKeys.reduce((sum, key) => {
    const qty = guildInventory[key]
    const value = itemValues[key] || 0
    return sum + qty * value
  }, 0)

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => { if (!confirmData) onClose() }}>
      <div className="relative w-full max-w-6xl max-h-[calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem)] overflow-y-auto bg-gray-800 border border-yellow-700 p-3 sm:p-4 rounded shadow-xl text-yellow-100 flex flex-col gap-3 sm:gap-4" onClick={e => e.stopPropagation()}>
        {triggerSplash && <ItemSplash src="/img/materials/gold_0.png" />}

        {/* Header */}
        <div className="sticky top-0 z-10 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-gray-800/95 border-b border-yellow-900/70 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src="/img/materials/gold_0.png" className="w-5 h-5" alt="Gold" />
            <span className="text-yellow-300 text-lg font-semibold">{guildStats.gold}</span>
            {showDevControls && (
              <>
                <HeavyButton onClick={handleSale}>G</HeavyButton>
                <HeavyButton onClick={() => lootTable.forEach(entry => {
                  addInventoryItem(entry.item, 1)
                })}>
                  I+
                </HeavyButton>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-yellow-300 hover:text-yellow-100 text-2xl leading-none font-bold min-w-10 min-h-10 flex items-center justify-center"
            aria-label="Close inventory"
          >
            ×
          </button>
        </div>

        {/* Two Columns */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Inventory Left */}
          <div className="w-full lg:w-[28rem] lg:flex-shrink-0">
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 mb-4">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className="w-full h-24 sm:h-24 bg-gray-900 rounded flex flex-col items-center justify-center text-center relative border border-gray-700 group"
                >
                  {slot && slot[1] > 0 && (
                    <>
                      <img src={inventoryIcons[slot[0]]} alt={slot[0]} className="w-12 h-12" />
                      <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-sm font-bold px-1 py-0.5 rounded shadow">
                        x{slot[1]}
                      </div>
                      <button
                        onClick={() => handleSellItem(slot[0], slot[1])}
                        className="mt-1 px-1.5 py-0.5 bg-yellow-600 hover:bg-yellow-700 rounded text-black font-bold whitespace-nowrap text-[11px] sm:text-[13px]"
                      >
                        <span className="text-[80%]">Sell</span> ({itemValues[slot[0]] * slot[1]}g)
                      </button>
                      <span className="absolute bottom-full mb-1 px-2 py-0.5 rounded bg-black text-white text-xs font-medium opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                        {slot[0]}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-2 sm:mt-4">
              <button
                onClick={handleSellAll}
                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded text-black text-base sm:text-lg font-extrabold"
              >
                <span className="text-[80%]">Sell All</span> ({totalSellValue}g)
              </button>
            </div>
          </div>

          {/* Tome Panel Right */}
          <TomeDiscoveryPanel />
        </div>

        {confirmData && (
          <ConfirmDialog
            message={confirmData.message}
            onConfirm={() => {
              confirmData.onConfirm()
              setConfirmData(null)
            }}
            onCancel={() => setConfirmData(null)}
          />
        )}
      </div>
    </div>
  )
}
