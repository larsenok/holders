import { useMemo } from 'react'

export default function FlameSprite() {
  const eyeDelay = useMemo(() => `${-Math.random() * 8}s`, [])

  return (
    <svg viewBox="0 0 64 64" className="w-[48px] h-[48px]">
      <defs>
        <radialGradient id="sigilGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ef4444" />
        </radialGradient>
      </defs>
      <g
        style={{
          transformOrigin: '32px 32px',
          animation: 'sigilSpin 12s linear infinite',
        }}
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="url(#sigilGradient)"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r="18"
          stroke="url(#sigilGradient)"
          strokeWidth="2"
          fill="none"
        />
      </g>
      <circle
        cx="32"
        cy="32"
        r="6"
        fill="url(#sigilGradient)"
        style={{
          animation:
            'sigilPulse 3s ease-in-out infinite, sigilEye 8s ease-in-out infinite',
          animationDelay: `0s, ${eyeDelay}`,
        }}
      />
    </svg>
  )
}
