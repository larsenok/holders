import { Adventurer, GearSlot } from '../../types/Guild'
import { useGuild } from '../../providers/GuildProvider'

const SLOT_LABELS: Record<GearSlot, string> = {
  head: 'Head',
  chest: 'Chest',
  legs: 'Legs',
  weapon: 'Weapon'
}

const ORDER: GearSlot[] = ['head', 'chest', 'legs', 'weapon']

export default function GearGrid({ adventurer }: { adventurer: Adventurer }) {
  const { guildStash, equipGear } = useGuild()

  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {ORDER.map((slot) => {
        const equipped = adventurer.gear[slot]
        const options = guildStash.gear.filter((g) => g.slot === slot)
        return (
          <div key={slot} className="flex flex-col">
            <div className="text-gray-400 mb-1">{SLOT_LABELS[slot]}</div>
            <div className="bg-gray-800 rounded p-2 flex flex-col gap-1">
              {equipped ? (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-yellow-200">{equipped.name}</span>
                  <button
                    onClick={() => equipGear(adventurer.id, slot, null)}
                    className="text-xs text-red-300 hover:text-red-500"
                  >
                    Unequip
                  </button>
                </div>
              ) : (
                <div className="text-gray-500 text-xs mb-1">None equipped</div>
              )}
              {options.map((item) => (
                <button
                  key={item.id}
                  onClick={() => equipGear(adventurer.id, slot, item.id)}
                  className="text-left px-2 py-1 rounded hover:bg-gray-700"
                >
                  {item.name}
                </button>
              ))}
              {options.length === 0 && (
                <div className="text-gray-500 text-xs">No items</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
