import { useEffect, useState } from 'react'
import { useGuild } from '../providers/GuildProvider'

type Phase = 'work' | 'rest'

export function useActivityCycle(
  storageKey: string,
  onReward: () => void,
  work = 30,
  rest = 10,
  onWorkComplete?: () => void
) {
  const { adventurers } = useGuild()
  const [phase, setPhase] = useState<Phase>('work')
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [secondsLeft, setSecondsLeft] = useState<number>(0)

  const workDuration = work * 1000;
  const restDuration = rest * 1000;

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const { startTime, phase }: { startTime: number; phase: Phase } = JSON.parse(saved)
        const now = Date.now()
        const duration = phase === 'work' ? workDuration : restDuration
        const elapsed = now - startTime

        if (elapsed >= duration) {
          const newPhase: Phase = phase === 'work' ? 'rest' : 'work'
          if (phase === 'work') {
            onReward()
            if (onWorkComplete) onWorkComplete()
          }
          setPhase(newPhase)
          setStartTime(now)
          setSecondsLeft(Math.ceil(((newPhase === 'work' ? workDuration : restDuration)) / 1000))
        } else {
          setStartTime(startTime)
          setPhase(phase)
          setSecondsLeft(Math.ceil((duration - elapsed) / 1000))
        }
      } catch {
        // ignore
      }
    }
  }, [storageKey, workDuration, restDuration])

  // Persist
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ startTime, phase }))
  }, [storageKey, startTime, phase])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now()
      const elapsed = now - startTime
      const duration = phase === 'work' ? workDuration : restDuration
      const left = Math.max(0, duration - elapsed)
      setSecondsLeft(Math.ceil(left / 1000))

      if (elapsed >= duration) {
        const newPhase: Phase = phase === 'work' ? 'rest' : 'work'

        if (phase === 'work') {
          onReward()
          if (onWorkComplete) {
            onWorkComplete()
          }
        }
        setPhase(newPhase)
        setStartTime(now)
      }
    }, 1000)
    return () => clearInterval(intervalId)
  }, [startTime, phase, workDuration, restDuration, onReward, onWorkComplete])

  const worker = adventurers[0]
  return { phase, secondsLeft, worker }
}
