type Props = {
  xp: number
  level: number
}

export default function CharacterXPBar({ xp, level }: Props) {
  const nextLevelXp = level * 100
  const progress = Math.min((xp / nextLevelXp) * 100, 100)

  return (
    <div className="w-full h-2 bg-gray-700 rounded mt-2 overflow-hidden">
      <div
        className="h-full bg-purple-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

