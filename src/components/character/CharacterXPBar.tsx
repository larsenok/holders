type Props = {
  xp: number
  level: number
}

export default function CharacterXPBar({ xp, level }: Props) {
  const nextLevelXp = Math.max(level * 100, 1)
  const progress = Math.min((xp / nextLevelXp) * 100, 100)

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[10px] text-slate-300 mb-1">
        <span>XP</span>
        <span>{xp}/{nextLevelXp}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-700 rounded overflow-hidden border border-slate-600/70">
        <div
          className="h-full bg-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
