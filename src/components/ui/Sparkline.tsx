interface SparklineProps {
  data: number[]
}

export default function Sparkline({ data }: SparklineProps) {
  if (!data.length) return null
  const width = 100
  const height = 30
  const max = Math.max(...data)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - (v / max) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8">
      <polyline
        fill="none"
        stroke="var(--accent-color, #f0f)"
        strokeWidth="2"
        points={points}
      />
    </svg>
  )
}
