// components/character/CharacterList.tsx
import { useState } from 'react'
import { useGuild } from '../../providers/GuildProvider'
import CharacterRow from './CharacterRow'

export default function CharacterList() {
  const { adventurers } = useGuild()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-full">
      {adventurers.map((adv) => (
        <CharacterRow
          key={adv.id}
          adventurer={adv}
          expanded={expandedId === adv.id}
          toggleExpand={() =>
            setExpandedId(expandedId === adv.id ? null : adv.id)
          }
        />
      ))}
    </div>
  )
}
