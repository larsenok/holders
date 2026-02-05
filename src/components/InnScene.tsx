import { spots } from '../data/adventurer'
import { useGuild } from '../providers/GuildProvider'
import { shuffle } from '../utils/calculation'
import IdleAnimation from './anim/IdleAnimation'

export default function InnScene() {
  const { adventurers } = useGuild()
  const idle = adventurers.filter((a) => a.status === 'idle')
  const placed = shuffle(idle).slice(0, 5)

  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 border border-pink-900 rounded-xl p-4 overflow-hidden">
      {placed.map((a, i) => (
      <div
        key={a.id}
        className="absolute w-20 h-32"
        style={{
        left: spots[i].left,
        bottom: spots[i].bottom,
      transform: i >= 3 ? 'scaleX(-1)' : 'none',
        }}
        >
            <IdleAnimation animKey="idle_0"
            style={{
                animationDelay: `-${(Math.random() * 0.8).toFixed(2)}s`, // up to full cycle length
            }}
            />
        </div>
    ))}
    </div>
  )
}
