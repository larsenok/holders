import React from 'react'
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

  const sizeStyles = {
    sm: { barHeight: '16px', width: '275px', fontSize: '12px' },
    md: { barHeight: '20px', width: '350px', fontSize: '14px' },
    lg: { barHeight: '24px', width: '425px', fontSize: '16px' },
    xl: { barHeight: '28px', width: '500px', fontSize: '18px' },
  }

  const xpBarStyles: React.CSSProperties = {
    width: sizeStyles[size].width,
    height: sizeStyles[size].barHeight,
    background: 'linear-gradient(135deg, #2d2d2d, #1a1a1a)', // empty = dark grey
    border: '2px solid #1a1a1a',
    borderRadius: '6px',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: 'monospace',
    boxShadow: isNearLevelUp
      ? '0 0 8px 2px rgba(192, 132, 252, 0.6)' // glow on near level
      : 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 4px 0 rgba(0, 0, 0, 0.4)',
  }

  const xpFillStyles: React.CSSProperties = {
    width: `${progress}%`,
    height: '100%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)', // purple-pink
    transition: 'width 0.5s ease-in-out',
    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.25)',
  }

  const textContainerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  }

  const textStyles: React.CSSProperties = {
    fontSize: sizeStyles[size].fontSize,
    color: '#e5e7eb',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textShadow: progress < 40
      ? '0 1px 1px rgba(0, 0, 0, 0.6)' // for light-on-dark
      : '0 1px 1px rgba(255, 255, 255, 0.5)', // for dark-on-light
  }

  return (
    <div style={xpBarStyles}>
      <div style={xpFillStyles} />
      <div style={textContainerStyles}>
        <span style={textStyles}>
          {xp} XP {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}
