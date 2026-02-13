import { useGuild } from '../../providers/GuildProvider'

type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function GuildXPBar({ size = 'md' }: Props) {
  const { guildStats } = useGuild()

  const xp = guildStats.xp || 0
  const nextRankXP = guildStats.nextRankXP || guildStats.rank * 1000
  const progress = Math.min((xp / nextRankXP) * 100, 100)
  const isNearLevelUp = progress >= 80

  const heightBySize = {
    sm: 'h-3.5',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-full border border-violet-300/40 bg-slate-950/80 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
        <div
          className={`${heightBySize[size]} transition-all duration-500 bg-gradient-to-r from-fuchsia-600 via-violet-500 to-cyan-400 ${
            isNearLevelUp ? 'shadow-[0_0_14px_rgba(192,132,252,0.9)]' : ''
          }`}
          style={{ width: `${progress}%` }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-[10px] sm:text-xs font-bold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
          {xp}/{nextRankXP} XP
        </div>
      </div>
    </div>
  )
}
